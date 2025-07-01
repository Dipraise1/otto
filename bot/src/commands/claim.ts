import type { DatabaseService } from '../services/database.js';
import type { SolanaService } from '../services/solana.js';

export async function claimCommand(
  ctx: any,
  db: DatabaseService,
  solana: SolanaService,
  appUrl: string
) {
  try {
    // Only respond in private chats
    if (ctx.chat?.type !== 'private') {
      return;
    }

    const telegramId = ctx.from?.id;
    if (!telegramId) {
      await ctx.reply('⚠️ Unable to identify user. Please try again.');
      return;
    }

    // Show loading state
    const loadingMsg = await ctx.reply('💰 *Checking your rewards...*', {
      parse_mode: 'Markdown'
    });

    const user = await db.getOrCreateUser(telegramId, {
      username: ctx.from?.username,
      firstName: ctx.from?.first_name,
      lastName: ctx.from?.last_name
    });

    const stats = await db.getUserStats(telegramId);
    if (!stats) {
      await ctx.editMessageText('🚨 *Unable to fetch reward information. Please try again.*', {
        parse_mode: 'Markdown'
      });
      return;
    }

    // Delete loading message
    await ctx.api.deleteMessage(ctx.chat.id, loadingMsg.message_id);

    if (stats.pendingRewards === 0) {
      await ctx.reply(
        `💎 **Reward Center**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ **No Pending Rewards**

*Your reward balance is currently zero*

📈 **Earn More Rewards**
∙ Share your referral link
∙ Help friends discover OTTO
∙ Earn automatic $OTTO rewards
∙ Build your network

🔗 **Your Referral Power**
Every successful referral = instant rewards!`,
        {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [
                { text: '📊 View Analytics', callback_data: 'stats' },
                { text: '🔗 Share Link', callback_data: 'referral_link' }
              ]
            ]
          }
        }
      );
      return;
    }

    const rewardAmount = (stats.pendingRewards / 1_000_000).toFixed(6);

    if (user.userWallet) {
      // User has a wallet set
      const claimMessage = `
💰 **Reward Claim Center**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💎 **Available to Claim**
**${rewardAmount} $OTTO**

📬 **Destination Wallet**
\`${solana.formatWalletAddress(user.userWallet)}\`

🚀 **Instant Transfer**
Your rewards will be transferred immediately to your specified wallet

✨ **Gas-Free Process**
No transaction fees - we handle everything!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

*Ready to claim your rewards?*
`;

      const keyboard = {
        inline_keyboard: [
          [
            { text: '💰 Claim Now', callback_data: 'confirm_claim' }
          ],
          [
            { text: '🔄 Change Wallet', callback_data: 'set_receiving_wallet' },
            { text: '📊 View Stats', callback_data: 'stats' }
          ],
          [
            { text: '❌ Cancel', callback_data: 'cancel_claim' }
          ]
        ]
      };

      await ctx.reply(claimMessage, {
        parse_mode: 'Markdown',
        reply_markup: keyboard
      });

    } else {
      // User needs to set receiving wallet
      const setupMessage = `
💰 **Reward Claim Setup**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💎 **Available to Claim**
**${rewardAmount} $OTTO**

📬 **Setup Required**
*Please provide your Solana wallet address for reward delivery*

🔒 **Secure & Private**
∙ Saved for future claims
∙ Only used for reward transfers
∙ Can be updated anytime
∙ Never shared with third parties

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Send your Solana wallet address as a message**
*Example: 9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM*
`;

      const keyboard = {
        inline_keyboard: [
          [
            { text: '❌ Cancel Setup', callback_data: 'cancel_claim' },
            { text: '📊 View Stats', callback_data: 'stats' }
          ]
        ]
      };

      await ctx.reply(setupMessage, {
        parse_mode: 'Markdown',
        reply_markup: keyboard
      });

      // Set session state to expect wallet address
      ctx.session.pendingAction = 'waiting_for_receiving_wallet';
    }

  } catch (error) {
    console.error('Error in claim command:', error);
    await ctx.reply(
      '🚨 **Claim System Error**\n\n*Unable to process claim request. Our team has been notified.*',
      { parse_mode: 'Markdown' }
    );
  }
}

export async function confirmClaim(
  ctx: any,
  db: DatabaseService,
  solana: SolanaService,
  appUrl: string
) {
  try {
    const telegramId = ctx.from?.id;
    if (!telegramId) {
      await ctx.editMessageText('⚠️ Unable to identify user. Please try again.');
      return;
    }

    const user = await db.getOrCreateUser(telegramId, {
      username: ctx.from?.username,
      firstName: ctx.from?.first_name,
      lastName: ctx.from?.last_name
    });

    if (!user.userWallet) {
      await ctx.editMessageText('🚨 **Setup Required**\n\n*Please connect your wallet first.*', {
        parse_mode: 'Markdown'
      });
      return;
    }

    const stats = await db.getUserStats(telegramId);
    if (!stats || stats.pendingRewards === 0) {
      await ctx.editMessageText('⚡ **No Rewards Available**\n\n*Your reward balance is currently zero.*', {
        parse_mode: 'Markdown'
      });
      return;
    }

    // Show processing state with animation
    await ctx.editMessageText(`⚡ **Processing Claim...**

🔄 *Preparing transaction*
⏳ *Please wait while we process your request*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Amount:** ${(stats.pendingRewards / 1_000_000).toFixed(6)} $OTTO
**To:** \`${solana.formatWalletAddress(user.userWallet)}\``, {
      parse_mode: 'Markdown'
    });

    try {
      // Submit claim request to backend
      const claimResult = await db.submitClaimRequest({
        telegramId,
        receivingAddress: user.userWallet,
        amount: stats.pendingRewards
      });

      if (claimResult.success && claimResult.transactionId) {
        await ctx.editMessageText(
          `✅ **Claim Submitted Successfully!**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎉 **Processing Complete**
Your claim is now being processed on the blockchain

📋 **Transaction Details**
∙ ID: \`${claimResult.transactionId}\`
∙ Amount: **${(stats.pendingRewards / 1_000_000).toFixed(6)} $OTTO**
∙ To: \`${solana.formatWalletAddress(user.userWallet)}\`

⏱️ **Estimated Time**
*Usually completes within 30-60 seconds*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔔 *We'll notify you when the transfer is confirmed!*`,
          {
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [
                  { text: '🔄 Check Status', callback_data: `check_claim_status:${claimResult.transactionId}` }
                ],
                [
                  { text: '📊 Analytics', callback_data: 'stats' },
                  { text: '🏆 My Tier', callback_data: 'tier' }
                ]
              ]
            }
          }
        );
      } else {
        await ctx.editMessageText(
          `🚨 **Claim Failed**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ **Error Details**
${claimResult.error || 'Unknown system error occurred'}

🔧 **What to do next:**
∙ Check your wallet address is correct
∙ Try again in a few moments
∙ Contact support if issue persists

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

*Our team has been automatically notified*`,
          {
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [
                  { text: '🔄 Try Again', callback_data: 'claim' },
                  { text: '📊 View Stats', callback_data: 'stats' }
                ]
              ]
            }
          }
        );
      }

    } catch (claimError) {
      console.error('Claim processing error:', claimError);
      await ctx.editMessageText(
        `🚨 **System Error**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ **Processing Failed**
*There was an error processing your claim*

🛠️ **Resolution Steps:**
∙ System automatically retries failed claims
∙ Check back in 5-10 minutes
∙ Contact support if needed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

*Our technical team has been notified*`,
        {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [
                { text: '🔄 Try Again', callback_data: 'claim' },
                { text: '📊 View Stats', callback_data: 'stats' }
              ]
            ]
          }
        }
      );
    }

  } catch (error) {
    console.error('Error in confirm claim:', error);
    await ctx.editMessageText('🚨 **System Error**\n\n*Unable to process claim. Please try again.*', {
      parse_mode: 'Markdown'
    });
  }
}

export async function setReceivingWallet(
  ctx: any,
  db: DatabaseService,
  solana: SolanaService
) {
  try {
    const telegramId = ctx.from?.id;
    if (!telegramId) return;

    await ctx.editMessageText(
      `🔄 **Wallet Setup**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📬 **Update Receiving Address**
*Send your new Solana wallet address as a message*

🔒 **Security Information**
∙ Address is encrypted and stored securely
∙ Only used for reward transfers
∙ Can be updated anytime
∙ Never shared with third parties

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Example Format:**
\`9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM\``,
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '❌ Cancel Setup', callback_data: 'cancel_claim' }]
          ]
        }
      }
    );

    // Set session state
    ctx.session.pendingAction = 'waiting_for_receiving_wallet';

  } catch (error) {
    console.error('Error in set receiving wallet:', error);
  }
}

export async function checkClaimStatus(
  ctx: any,
  db: DatabaseService,
  transactionId: string
) {
  try {
    const telegramId = ctx.from?.id;
    if (!telegramId) return;

    // Show checking animation
    await ctx.editMessageText('🔍 **Checking Transaction Status...**\n\n*Querying blockchain...*', {
      parse_mode: 'Markdown'
    });

    const status = await db.getClaimStatus(telegramId, transactionId);

    if (status.status === 'confirmed') {
      await ctx.editMessageText(
        `🎉 **Claim Successful!**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ **Transfer Completed**
Your $OTTO rewards have been successfully transferred!

🔗 **Transaction Confirmed**
\`${status.txHash}\`

💰 **Next Steps**
∙ Check your wallet for the tokens
∙ Share more referrals to earn additional rewards
∙ Unlock higher tiers for better benefits

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

*Congratulations on your successful claim!* 🎊`,
        {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [
                { text: '📊 Updated Analytics', callback_data: 'stats' },
                { text: '🏆 Check Tier', callback_data: 'tier' }
              ]
            ]
          }
        }
      );
    } else if (status.status === 'failed') {
      await ctx.editMessageText(
        `🚨 **Claim Failed**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ **Transaction Failed**
${status.error || 'Blockchain transaction failed'}

🔄 **What happens now:**
∙ Your rewards remain in your account
∙ You can try claiming again
∙ Our team investigates all failures

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

*Your funds are safe and can be reclaimed*`,
        {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [
                { text: '🔄 Try Claiming Again', callback_data: 'claim' },
                { text: '📊 View Stats', callback_data: 'stats' }
              ]
            ]
          }
        }
      );
    } else {
      await ctx.editMessageText(
        `⏳ **Transaction Pending**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔄 **Still Processing**
Your claim is being processed on the Solana blockchain

⏱️ **Typical Processing Time**
∙ Usually completes within 60 seconds
∙ Network congestion may cause delays
∙ We'll notify you when complete

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

*Please wait while the transaction confirms*`,
        {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [
                { text: '🔄 Check Again', callback_data: `check_claim_status:${transactionId}` },
                { text: '📊 View Stats', callback_data: 'stats' }
              ]
            ]
          }
        }
      );
    }

  } catch (error) {
    console.error('Error checking claim status:', error);
    await ctx.editMessageText('🚨 **Status Check Error**\n\n*Unable to check transaction status.*', {
      parse_mode: 'Markdown'
    });
  }
}

export async function handleReceivingWalletInput(
  ctx: any,
  db: DatabaseService,
  solana: SolanaService,
  walletAddress: string
) {
  try {
    const telegramId = ctx.from?.id;
    if (!telegramId) return;

    // Validate wallet address
    if (!solana.isValidWalletAddress(walletAddress)) {
      await ctx.reply(
        `🚨 **Invalid Wallet Address**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ **Format Error**
*The address you provided is not a valid Solana wallet*

📝 **Correct Format:**
\`9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM\`

🔧 **Requirements:**
∙ Must be a valid Solana address
∙ Typically 32-44 characters long
∙ Contains letters and numbers only

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

*Please try again with a valid address*`,
        {
          parse_mode: 'Markdown'
        }
      );
      return;
    }

    // Save wallet address
    await db.setReceivingWallet(telegramId, walletAddress);

    await ctx.reply(
      `✅ **Wallet Setup Complete!**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎉 **Successfully Configured**
Your receiving wallet has been saved

📬 **Wallet Address**
\`${solana.formatWalletAddress(walletAddress)}\`

🔒 **Security Features**
∙ Encrypted storage
∙ Secure transmission
∙ Easy to update anytime

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

*You can now claim your rewards instantly!*`,
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '💰 Claim Rewards', callback_data: 'claim' },
              { text: '📊 View Analytics', callback_data: 'stats' }
            ]
          ]
        }
      }
    );

    // Clear session state
    ctx.session.pendingAction = undefined;

  } catch (error) {
    console.error('Error handling receiving wallet input:', error);
    await ctx.reply('🚨 **Setup Error**\n\n*Unable to save wallet address. Please try again.*', {
      parse_mode: 'Markdown'
    });
  }
} 