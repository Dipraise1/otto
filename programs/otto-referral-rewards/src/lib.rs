use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Mint, Token, TokenAccount, Transfer},
};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod otto_referral_rewards {
    use super::*;

    /// Initialize the referral program
    pub fn initialize(
        ctx: Context<Initialize>,
        rewards_percentage: u16, // Basis points (e.g., 200 = 2%)
        min_purchase_amount: u64,
        min_holdings_for_referral: u64, // Minimum $OTTO to become referrer
        base_reward_rate: u16, // Base reward percentage in basis points
    ) -> Result<()> {
        let program_state = &mut ctx.accounts.program_state;
        program_state.authority = ctx.accounts.authority.key();
        program_state.otto_token_mint = ctx.accounts.otto_token_mint.key();
        program_state.rewards_pool = ctx.accounts.rewards_pool.key();
        program_state.rewards_percentage = rewards_percentage;
        program_state.min_purchase_amount = min_purchase_amount;
        program_state.min_holdings_for_referral = min_holdings_for_referral;
        program_state.base_reward_rate = base_reward_rate;
        program_state.total_referrals = 0;
        program_state.total_rewards_distributed = 0;
        program_state.bronze_threshold = 1_000_000; // 0.1% of total supply
        program_state.silver_threshold = 5_000_000; // 0.5% of total supply
        program_state.gold_threshold = 10_000_000; // 1% of total supply
        program_state.bump = ctx.bumps.program_state;

        emit!(ProgramInitialized {
            authority: program_state.authority,
            otto_token_mint: program_state.otto_token_mint,
            rewards_percentage,
            min_purchase_amount,
            min_holdings_for_referral,
        });

        Ok(())
    }

    /// Register a new referrer - requires minimum $OTTO holdings
    pub fn register_referrer(
        ctx: Context<RegisterReferrer>, 
        referral_code: String
    ) -> Result<()> {
        require!(referral_code.len() <= 32, ErrorCode::ReferralCodeTooLong);
        require!(referral_code.len() >= 4, ErrorCode::ReferralCodeTooShort);

        let program_state = &ctx.accounts.program_state;
        let token_account = &ctx.accounts.token_account;

        // Verify minimum holdings requirement
        require!(
            token_account.amount >= program_state.min_holdings_for_referral,
            ErrorCode::InsufficientHoldingsForReferral
        );

        let referrer_account = &mut ctx.accounts.referrer_account;
        referrer_account.authority = ctx.accounts.authority.key();
        referrer_account.referral_code = referral_code.clone();
        referrer_account.total_referrals = 0;
        referrer_account.total_rewards_earned = 0;
        referrer_account.initial_holdings = token_account.amount;
        referrer_account.current_holdings = token_account.amount;
        referrer_account.tier = Tier::None;
        referrer_account.last_activity = Clock::get()?.unix_timestamp;
        referrer_account.is_active = true;
        referrer_account.holding_ratio = 10000; // Start at 100% (basis points)
        referrer_account.bump = ctx.bumps.referrer_account;

        emit!(ReferrerRegistered {
            authority: referrer_account.authority,
            referral_code,
            initial_holdings: token_account.amount,
            timestamp: referrer_account.last_activity,
        });

        Ok(())
    }

    /// Update referrer holdings ratio (called when tokens are sold)
    pub fn update_holdings_ratio(ctx: Context<UpdateHoldingsRatio>) -> Result<()> {
        let referrer_account = &mut ctx.accounts.referrer_account;
        let token_account = &ctx.accounts.token_account;
        
        // Store previous holdings before updating
        let previous_holdings = referrer_account.current_holdings;
        let new_holdings = token_account.amount;
        
        // Update current holdings
        referrer_account.current_holdings = new_holdings;
        
        // Calculate new holding ratio (affects reward rates)
        if referrer_account.initial_holdings > 0 {
            referrer_account.holding_ratio = ((new_holdings as u128 * 10000) / referrer_account.initial_holdings as u128) as u16;
            // Cap at 100% if they've accumulated more tokens
            if referrer_account.holding_ratio > 10000 {
                referrer_account.holding_ratio = 10000;
            }
        }
        
        referrer_account.last_activity = Clock::get()?.unix_timestamp;

        emit!(HoldingsRatioUpdated {
            authority: referrer_account.authority,
            previous_holdings,
            new_holdings,
            holding_ratio: referrer_account.holding_ratio,
            timestamp: referrer_account.last_activity,
        });

        Ok(())
    }

    /// Process a purchase with dynamic referral rewards
    pub fn process_purchase(
        ctx: Context<ProcessPurchase>,
        purchase_amount: u64,
        referral_code: Option<String>,
    ) -> Result<()> {
        let program_state = &ctx.accounts.program_state;
        
        // Check minimum purchase amount
        require!(
            purchase_amount >= program_state.min_purchase_amount,
            ErrorCode::PurchaseAmountTooLow
        );

        let buyer = &ctx.accounts.buyer;
        let current_time = Clock::get()?.unix_timestamp;

        // Process purchase
        let purchase_account = &mut ctx.accounts.purchase_account;
        purchase_account.buyer = buyer.key();
        purchase_account.amount = purchase_amount;
        purchase_account.timestamp = current_time;
        purchase_account.referral_code = referral_code.clone();
        purchase_account.rewards_claimed = false;
        purchase_account.bump = ctx.bumps.purchase_account;

        // Process referral if provided
        if let Some(ref_code) = referral_code {
            if let Some(referrer_account) = ctx.accounts.referrer_account.as_mut() {
                // Anti-abuse: Prevent self-referral
                require!(
                    referrer_account.authority != buyer.key(),
                    ErrorCode::SelfReferralNotAllowed
                );

                // Calculate dynamic reward based on:
                // 1. Referrer's holding ratio (penalized if they sold tokens)
                // 2. Referrer's current holdings (more holdings = higher multiplier)
                // 3. Purchase volume
                let dynamic_reward = calculate_dynamic_reward(
                    program_state.base_reward_rate,
                    referrer_account.holding_ratio,
                    referrer_account.current_holdings,
                    purchase_amount,
                    program_state.min_holdings_for_referral,
                );

                // Update referrer stats
                referrer_account.total_referrals += 1;
                referrer_account.total_rewards_earned += dynamic_reward;
                referrer_account.last_activity = current_time;

                // Transfer dynamic rewards to referrer
                if dynamic_reward > 0 && ctx.accounts.referrer_token_account.is_some() {
                    let cpi_accounts = Transfer {
                        from: ctx.accounts.rewards_pool.to_account_info(),
                        to: ctx.accounts.referrer_token_account.as_ref().unwrap().to_account_info(),
                        authority: ctx.accounts.program_state.to_account_info(),
                    };
                    let seeds = &[
                        b"program_state".as_ref(),
                        &[program_state.bump],
                    ];
                    let signer = &[&seeds[..]];
                    let cpi_program = ctx.accounts.token_program.to_account_info();
                    let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
                    token::transfer(cpi_ctx, dynamic_reward)?;
                }

                emit!(DynamicReferralProcessed {
                    buyer: buyer.key(),
                    referrer: referrer_account.authority,
                    referral_code: ref_code,
                    purchase_amount,
                    dynamic_reward,
                    holding_ratio: referrer_account.holding_ratio,
                    referrer_holdings: referrer_account.current_holdings,
                    timestamp: current_time,
                });
            }
        }

        emit!(PurchaseProcessed {
            buyer: buyer.key(),
            amount: purchase_amount,
            timestamp: current_time,
        });

        Ok(())
    }



    /// Update user tier based on token holdings
    pub fn update_tier(ctx: Context<UpdateTier>) -> Result<()> {
        let program_state = &ctx.accounts.program_state;
        let referrer_account = &mut ctx.accounts.referrer_account;
        let token_account = &ctx.accounts.token_account;

        // Get current token balance
        let balance = token_account.amount;

        // Determine tier based on holdings
        let new_tier = if balance >= program_state.gold_threshold {
            Tier::Gold
        } else if balance >= program_state.silver_threshold {
            Tier::Silver
        } else if balance >= program_state.bronze_threshold {
            Tier::Bronze
        } else {
            Tier::None
        };

        let old_tier = referrer_account.tier;
        referrer_account.tier = new_tier;
        referrer_account.last_activity = Clock::get()?.unix_timestamp;

        emit!(TierUpdated {
            authority: referrer_account.authority,
            old_tier,
            new_tier,
            balance,
            timestamp: referrer_account.last_activity,
        });

        Ok(())
    }

    /// Claim pending rewards
    pub fn claim_rewards(ctx: Context<ClaimRewards>) -> Result<()> {
        let purchase_account = &mut ctx.accounts.purchase_account;
        let program_state = &ctx.accounts.program_state;

        require!(!purchase_account.rewards_claimed, ErrorCode::RewardsAlreadyClaimed);
        require!(
            purchase_account.buyer == ctx.accounts.buyer.key(),
            ErrorCode::UnauthorizedClaim
        );

        // Calculate rewards
        let rewards_amount = (purchase_account.amount as u128 * program_state.rewards_percentage as u128 / 10_000) as u64;

        // Mark as claimed
        purchase_account.rewards_claimed = true;

        // Transfer rewards
        if rewards_amount > 0 {
            let cpi_accounts = Transfer {
                from: ctx.accounts.rewards_pool.to_account_info(),
                to: ctx.accounts.buyer_token_account.to_account_info(),
                authority: ctx.accounts.program_state.to_account_info(),
            };
            let seeds = &[
                b"program_state".as_ref(),
                &[program_state.bump],
            ];
            let signer = &[&seeds[..]];
            let cpi_program = ctx.accounts.token_program.to_account_info();
            let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
            token::transfer(cpi_ctx, rewards_amount)?;
        }

        emit!(RewardsClaimed {
            buyer: purchase_account.buyer,
            amount: rewards_amount,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    /// Admin function to update program parameters
    pub fn update_program_params(
        ctx: Context<UpdateProgramParams>,
        rewards_percentage: Option<u16>,
        min_purchase_amount: Option<u64>,
        tier_thresholds: Option<[u64; 3]>, // [bronze, silver, gold]
    ) -> Result<()> {
        let program_state = &mut ctx.accounts.program_state;

        if let Some(percentage) = rewards_percentage {
            require!(percentage <= 1000, ErrorCode::InvalidRewardsPercentage); // Max 10%
            program_state.rewards_percentage = percentage;
        }

        if let Some(amount) = min_purchase_amount {
            program_state.min_purchase_amount = amount;
        }

        if let Some(thresholds) = tier_thresholds {
            program_state.bronze_threshold = thresholds[0];
            program_state.silver_threshold = thresholds[1];
            program_state.gold_threshold = thresholds[2];
        }

        emit!(ProgramParamsUpdated {
            authority: ctx.accounts.authority.key(),
            rewards_percentage: program_state.rewards_percentage,
            min_purchase_amount: program_state.min_purchase_amount,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }
}

/// Calculate dynamic reward based on holdings and purchase volume
pub fn calculate_dynamic_reward(
    base_rate: u16,
    holding_ratio: u16,
    referrer_holdings: u64,
    purchase_amount: u64,
    min_holdings: u64,
) -> u64 {
    // Base reward calculation
    let base_reward = (purchase_amount as u128 * base_rate as u128 / 10_000) as u64;
    
    // Apply holding ratio penalty (if user sold tokens)
    let holding_adjusted_reward = (base_reward as u128 * holding_ratio as u128 / 10_000) as u64;
    
    // Apply holdings multiplier (more holdings = higher rewards)
    let holdings_multiplier = if referrer_holdings >= min_holdings * 10 {
        15000 // 1.5x for 10x minimum holdings
    } else if referrer_holdings >= min_holdings * 5 {
        12500 // 1.25x for 5x minimum holdings
    } else if referrer_holdings >= min_holdings * 2 {
        11000 // 1.1x for 2x minimum holdings
    } else {
        10000 // 1x for minimum holdings
    };
    
    (holding_adjusted_reward as u128 * holdings_multiplier / 10_000) as u64
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + ProgramState::INIT_SPACE,
        seeds = [b"program_state"],
        bump
    )]
    pub program_state: Account<'info, ProgramState>,

    #[account(
        init,
        payer = authority,
        associated_token::mint = otto_token_mint,
        associated_token::authority = program_state,
    )]
    pub rewards_pool: Account<'info, TokenAccount>,

    pub otto_token_mint: Account<'info, Mint>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

#[derive(Accounts)]
#[instruction(referral_code: String)]
pub struct RegisterReferrer<'info> {
    #[account(
        seeds = [b"program_state"],
        bump = program_state.bump
    )]
    pub program_state: Account<'info, ProgramState>,

    #[account(
        init,
        payer = authority,
        space = 8 + ReferrerAccount::INIT_SPACE,
        seeds = [b"referrer", referral_code.as_bytes()],
        bump
    )]
    pub referrer_account: Account<'info, ReferrerAccount>,

    #[account(
        associated_token::mint = program_state.otto_token_mint,
        associated_token::authority = authority,
    )]
    pub token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ProcessPurchase<'info> {
    #[account(
        seeds = [b"program_state"],
        bump = program_state.bump
    )]
    pub program_state: Account<'info, ProgramState>,

    #[account(
        init,
        payer = buyer,
        space = 8 + PurchaseAccount::INIT_SPACE,
        seeds = [b"purchase", buyer.key().as_ref(), &Clock::get()?.unix_timestamp.to_le_bytes()],
        bump
    )]
    pub purchase_account: Account<'info, PurchaseAccount>,

    #[account(mut)]
    pub referrer_account: Option<Account<'info, ReferrerAccount>>,

    #[account(
        mut,
        associated_token::mint = program_state.otto_token_mint,
        associated_token::authority = program_state,
    )]
    pub rewards_pool: Account<'info, TokenAccount>,

    pub referrer_token_account: Option<Account<'info, TokenAccount>>,

    #[account(mut)]
    pub buyer: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

#[derive(Accounts)]
pub struct UpdateHoldingsRatio<'info> {
    #[account(
        seeds = [b"program_state"],
        bump = program_state.bump
    )]
    pub program_state: Account<'info, ProgramState>,

    #[account(
        mut,
        seeds = [b"referrer", referrer_account.referral_code.as_bytes()],
        bump = referrer_account.bump,
        has_one = authority
    )]
    pub referrer_account: Account<'info, ReferrerAccount>,

    #[account(
        associated_token::mint = program_state.otto_token_mint,
        associated_token::authority = authority,
    )]
    pub token_account: Account<'info, TokenAccount>,

    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct UpdateTier<'info> {
    #[account(
        seeds = [b"program_state"],
        bump = program_state.bump
    )]
    pub program_state: Account<'info, ProgramState>,

    #[account(
        mut,
        seeds = [b"referrer", referrer_account.referral_code.as_bytes()],
        bump = referrer_account.bump,
        has_one = authority
    )]
    pub referrer_account: Account<'info, ReferrerAccount>,

    #[account(
        associated_token::mint = program_state.otto_token_mint,
        associated_token::authority = authority,
    )]
    pub token_account: Account<'info, TokenAccount>,

    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct ClaimRewards<'info> {
    #[account(
        seeds = [b"program_state"],
        bump = program_state.bump
    )]
    pub program_state: Account<'info, ProgramState>,

    #[account(
        mut,
        has_one = buyer
    )]
    pub purchase_account: Account<'info, PurchaseAccount>,

    pub otto_token_mint: Account<'info, Mint>,

    #[account(
        mut,
        associated_token::mint = otto_token_mint,
        associated_token::authority = program_state,
    )]
    pub rewards_pool: Account<'info, TokenAccount>,

    #[account(
        init_if_needed,
        payer = buyer,
        associated_token::mint = otto_token_mint,
        associated_token::authority = buyer,
    )]
    pub buyer_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub buyer: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

#[derive(Accounts)]
pub struct UpdateProgramParams<'info> {
    #[account(
        mut,
        seeds = [b"program_state"],
        bump = program_state.bump,
        has_one = authority
    )]
    pub program_state: Account<'info, ProgramState>,

    pub authority: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct ProgramState {
    pub authority: Pubkey,
    pub otto_token_mint: Pubkey,
    pub rewards_pool: Pubkey,
    pub rewards_percentage: u16,        // Basis points
    pub min_purchase_amount: u64,
    pub min_holdings_for_referral: u64,
    pub base_reward_rate: u16, // Base reward percentage in basis points
    pub total_referrals: u64,
    pub total_rewards_distributed: u64,
    pub bronze_threshold: u64,
    pub silver_threshold: u64,
    pub gold_threshold: u64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct ReferrerAccount {
    pub authority: Pubkey,
    #[max_len(32)]
    pub referral_code: String,
    pub total_referrals: u32,
    pub total_rewards_earned: u64,
    pub tier: Tier,
    pub last_activity: i64,
    pub is_active: bool,
    pub initial_holdings: u64,
    pub current_holdings: u64,
    pub holding_ratio: u16, // Basis points
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct PurchaseAccount {
    pub buyer: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
    #[max_len(32)]
    pub referral_code: Option<String>,
    pub rewards_claimed: bool,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace)]
pub enum Tier {
    None,
    Bronze,
    Silver,
    Gold,
}

#[event]
pub struct ProgramInitialized {
    pub authority: Pubkey,
    pub otto_token_mint: Pubkey,
    pub rewards_percentage: u16,
    pub min_purchase_amount: u64,
    pub min_holdings_for_referral: u64,
}

#[event]
pub struct ReferrerRegistered {
    pub authority: Pubkey,
    pub referral_code: String,
    pub initial_holdings: u64,
    pub timestamp: i64,
}

#[event]
pub struct PurchaseProcessed {
    pub buyer: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct DynamicReferralProcessed {
    pub buyer: Pubkey,
    pub referrer: Pubkey,
    pub referral_code: String,
    pub purchase_amount: u64,
    pub dynamic_reward: u64,
    pub holding_ratio: u16,
    pub referrer_holdings: u64,
    pub timestamp: i64,
}

#[event]
pub struct TierUpdated {
    pub authority: Pubkey,
    pub old_tier: Tier,
    pub new_tier: Tier,
    pub balance: u64,
    pub timestamp: i64,
}

#[event]
pub struct RewardsClaimed {
    pub buyer: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct ProgramParamsUpdated {
    pub authority: Pubkey,
    pub rewards_percentage: u16,
    pub min_purchase_amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct HoldingsRatioUpdated {
    pub authority: Pubkey,
    pub previous_holdings: u64,
    pub new_holdings: u64,
    pub holding_ratio: u16,
    pub timestamp: i64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Referral code must be between 4 and 32 characters")]
    ReferralCodeTooLong,
    #[msg("Referral code must be at least 4 characters")]
    ReferralCodeTooShort,
    #[msg("Purchase amount is below minimum threshold")]
    PurchaseAmountTooLow,
    #[msg("Self-referral is not allowed")]
    SelfReferralNotAllowed,
    #[msg("Rewards have already been claimed for this purchase")]
    RewardsAlreadyClaimed,
    #[msg("Unauthorized to claim rewards")]
    UnauthorizedClaim,
    #[msg("Invalid rewards percentage (max 10%)")]
    InvalidRewardsPercentage,
    #[msg("Insufficient holdings to become referrer")]
    InsufficientHoldingsForReferral,
} 