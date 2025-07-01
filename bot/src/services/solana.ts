import { Connection, PublicKey, Keypair, Transaction } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';
import { AnchorProvider, Wallet, Program } from '@coral-xyz/anchor';
import bs58 from 'bs58';
import type { ReferralStats, TierThresholds, GeneratedWallet } from '../types/index.js';

export class SolanaService {
  private connection: Connection;
  private programId: PublicKey | null;
  private ottTokenMint: PublicKey | null;
  private minHoldingsForReferral: number;

  constructor(
    rpcUrl: string,
    programId: string,
    ottTokenMint: string,
    minHoldingsForReferral: number = 1_000_000 // Default 1M tokens
  ) {
    this.connection = new Connection(rpcUrl, 'confirmed');
    this.minHoldingsForReferral = minHoldingsForReferral;
    
    // Handle potentially invalid public keys gracefully
    try {
      this.programId = programId ? new PublicKey(programId) : null;
    } catch (error) {
      console.warn('Invalid program ID provided, using null:', programId);
      this.programId = null;
    }
    
    try {
      this.ottTokenMint = ottTokenMint ? new PublicKey(ottTokenMint) : null;
    } catch (error) {
      console.warn('Invalid token mint provided, using null:', ottTokenMint);
      this.ottTokenMint = null;
    }
  }

  /**
   * Generate wallet seed phrase for client-side generation
   * Returns instructions for user to generate wallet in their preferred app
   */
  generateWalletInstructions(): { 
    instructions: string; 
    supportedWallets: string[]; 
    importInstructions: string;
  } {
    return {
      instructions: `🔐 **Generate Your Secure Wallet**

To participate in OTTO referrals, you need a non-custodial Solana wallet.

**Choose your preferred method:**`,
      supportedWallets: [
        '📱 **Phantom** - phantom.app',
        '🎒 **Backpack** - backpack.app', 
        '🦊 **Solflare** - solflare.com',
        '💼 **Sollet** - sollet.io'
      ],
      importInstructions: `**After creating your wallet:**
1. **Copy your wallet address** (starts with letters/numbers)
2. **Send it back to this bot** to verify your holdings
3. **Buy minimum ${(this.minHoldingsForReferral / 1_000_000).toFixed(1)}M $OTTO** to unlock referrals

⚠️ **Important**: Keep your seed phrase safe - we never store it!`
    };
  }

  /**
   * Validate a Solana wallet address
   */
  isValidWalletAddress(address: string): boolean {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if wallet meets minimum holdings for referral eligibility
   */
  async checkReferralEligibility(walletAddress: string): Promise<{
    isEligible: boolean;
    currentHoldings: number;
    requiredHoldings: number;
    shortfall?: number;
  }> {
    try {
      if (!this.ottTokenMint) {
        throw new Error('OTTO token mint not configured');
      }

      const balance = await this.getTokenBalance(walletAddress);
      const isEligible = balance >= this.minHoldingsForReferral;
      
      return {
        isEligible,
        currentHoldings: balance,
        requiredHoldings: this.minHoldingsForReferral,
        shortfall: isEligible ? undefined : this.minHoldingsForReferral - balance
      };
    } catch (error) {
      console.error('Error checking referral eligibility:', error);
      return {
        isEligible: false,
        currentHoldings: 0,
        requiredHoldings: this.minHoldingsForReferral,
        shortfall: this.minHoldingsForReferral
      };
    }
  }

  /**
   * Get token balance for a wallet
   */
  async getTokenBalance(walletAddress: string): Promise<number> {
    try {
      if (!this.ottTokenMint) {
        console.warn('No token mint configured, returning 0 balance');
        return 0;
      }

      const walletPubkey = new PublicKey(walletAddress);
      const tokenAccount = await getAssociatedTokenAddress(
        this.ottTokenMint,
        walletPubkey
      );

      const account = await getAccount(this.connection, tokenAccount);
      return Number(account.amount);
    } catch (error) {
      console.error('Error getting token balance:', error);
      return 0;
    }
  }

  /**
   * Calculate dynamic reward based on new mechanics
   */
  calculateDynamicReward(
    baseRate: number, // Basis points
    referrerHoldings: number,
    purchaseAmount: number,
    holdingRatio: number = 10000 // Default 100%
  ): number {
    // Base reward calculation
    const baseReward = (purchaseAmount * baseRate) / 10000;
    
    // Apply holding ratio penalty (if user sold tokens)
    const holdingAdjustedReward = (baseReward * holdingRatio) / 10000;
    
    // Apply holdings multiplier (more holdings = higher rewards)
    let holdingsMultiplier = 10000; // 1x base
    
    if (referrerHoldings >= this.minHoldingsForReferral * 10) {
      holdingsMultiplier = 15000; // 1.5x for 10x minimum holdings
    } else if (referrerHoldings >= this.minHoldingsForReferral * 5) {
      holdingsMultiplier = 12500; // 1.25x for 5x minimum holdings
    } else if (referrerHoldings >= this.minHoldingsForReferral * 2) {
      holdingsMultiplier = 11000; // 1.1x for 2x minimum holdings
    }
    
    return Math.floor((holdingAdjustedReward * holdingsMultiplier) / 10000);
  }

  /**
   * Determine tier based on token balance
   */
  getTierFromBalance(balance: number, thresholds: TierThresholds): 'None' | 'Bronze' | 'Silver' | 'Gold' {
    if (balance >= thresholds.gold) return 'Gold';
    if (balance >= thresholds.silver) return 'Silver';
    if (balance >= thresholds.bronze) return 'Bronze';
    return 'None';
  }

  /**
   * Calculate tier progress
   */
  getTierProgress(balance: number, thresholds: TierThresholds) {
    if (balance >= thresholds.gold) {
      return { current: balance, next: thresholds.gold, percentage: 100 };
    }
    if (balance >= thresholds.silver) {
      return { 
        current: balance, 
        next: thresholds.gold, 
        percentage: (balance / thresholds.gold) * 100 
      };
    }
    if (balance >= thresholds.bronze) {
      return { 
        current: balance, 
        next: thresholds.silver, 
        percentage: (balance / thresholds.silver) * 100 
      };
    }
    return { 
      current: balance, 
      next: thresholds.bronze, 
      percentage: (balance / thresholds.bronze) * 100 
    };
  }

  /**
   * Generate eligibility message based on holdings
   */
  generateEligibilityMessage(eligibility: {
    isEligible: boolean;
    currentHoldings: number;
    requiredHoldings: number;
    shortfall?: number;
  }): string {
    if (eligibility.isEligible) {
      return `✅ **Eligible for Referrals!**

🎯 **Current Holdings**: ${(eligibility.currentHoldings / 1_000_000).toFixed(2)}M $OTTO
💎 **Required**: ${(eligibility.requiredHoldings / 1_000_000).toFixed(1)}M $OTTO

**You can now generate referral links and start earning!**`;
    } else {
      return `❌ **Not Yet Eligible**

📊 **Current Holdings**: ${(eligibility.currentHoldings / 1_000_000).toFixed(2)}M $OTTO
💎 **Required**: ${(eligibility.requiredHoldings / 1_000_000).toFixed(1)}M $OTTO
📈 **Need**: ${((eligibility.shortfall || 0) / 1_000_000).toFixed(2)}M more $OTTO

**Purchase more $OTTO to unlock referral privileges!**`;
    }
  }

  /**
   * Get referrer account PDA
   */
  getReferrerAccountPDA(referralCode: string): [PublicKey, number] | null {
    if (!this.programId) {
      console.warn('No program ID configured');
      return null;
    }
    
    return PublicKey.findProgramAddressSync(
      [Buffer.from('referrer'), Buffer.from(referralCode)],
      this.programId
    );
  }

  /**
   * Get program state PDA
   */
  getProgramStatePDA(): [PublicKey, number] | null {
    if (!this.programId) {
      console.warn('No program ID configured');
      return null;
    }
    
    return PublicKey.findProgramAddressSync(
      [Buffer.from('program_state')],
      this.programId
    );
  }

  /**
   * Generate referral link
   */
  generateReferralLink(referralCode: string, appUrl: string): string {
    return `${appUrl}/invite/${referralCode}`;
  }

  /**
   * Generate dashboard access link with user ID
   */
  generateDashboardLink(dashboardId: string, appUrl: string): string {
    return `${appUrl}/dashboard?id=${dashboardId}`;
  }

  /**
   * Format wallet address for display
   */
  formatWalletAddress(address: string): string {
    if (!address || address.length < 8) return address;
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  }

  /**
   * Generate unique dashboard ID
   */
  generateDashboardId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'OTTO-';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Get comprehensive referral stats with new mechanics
   */
  async getReferralStats(
    walletAddress: string,
    referralCode: string,
    thresholds: TierThresholds
  ): Promise<ReferralStats & { eligibility: any }> {
    const balance = await this.getTokenBalance(walletAddress);
    const eligibility = await this.checkReferralEligibility(walletAddress);
    const tier = this.getTierFromBalance(balance, thresholds);
    const tierProgress = this.getTierProgress(balance, thresholds);

    return {
      totalReferrals: 0, // Would be fetched from database
      totalRewardsEarned: 0, // Would be fetched from database  
      pendingRewards: 0, // Would be calculated from pending transactions
      tier,
              tokenBalance: balance,
        tierProgress,
        eligibility
    };
  }
} 