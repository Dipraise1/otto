import { CommandContext, Context } from 'grammy';
import { InlineKeyboard } from 'grammy';
import type { DatabaseService } from '../services/database.js';
import type { SolanaService } from '../services/solana.js';

export async function startCommand(
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
    const loadingMsg = await ctx.reply('⚡ *Setting up your OTTO account...*', {
      parse_mode: 'Markdown'
    });

    // Get or create user profile
    const user = await db.getOrCreateUser(telegramId, {
      username: ctx.from?.username,
      firstName: ctx.from?.first_name,
      lastName: ctx.from?.last_name
    });

    // Check if user already has a wallet set up
    const walletStatus = await db.getUserWalletStatus(telegramId);
    
    // Delete loading message
    await ctx.api.deleteMessage(ctx.chat.id, loadingMsg.message_id);
    
    if (!walletStatus.hasWallet) {
      // User needs to set up their wallet first
      await showWalletSetupFlow(ctx, solana, user.dashboardId);
    } else if (!walletStatus.isEligible) {
      // User has wallet but needs more holdings
      await showEligibilityStatus(ctx, solana, walletStatus.walletAddress!, user.dashboardId);
    } else {
      // User is fully set up and eligible
      await showFullDashboard(ctx, user, walletStatus, appUrl);
    }

  } catch (error) {
    console.error('Error in start command:', error);
    await ctx.reply(
      '🚨 **System Error**\n\n*We encountered an issue setting up your account. Our team has been notified.*\n\n▫️ Please try again in a moment\n▫️ Contact support if this persists',
      { parse_mode: 'Markdown' }
    );
  }
}

async function showWalletSetupFlow(ctx: any, solana: SolanaService, dashboardId: string) {
  const walletInstructions = solana.generateWalletInstructions();
  
  const setupMessage = `
🎉 **Welcome to OTTO Referral+**

*To participate in our referral system, you need a secure Solana wallet.*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${walletInstructions.instructions}

${walletInstructions.supportedWallets.map(wallet => `∙ ${wallet}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${walletInstructions.importInstructions}

🆔 **Your Dashboard ID**: \`${dashboardId}\`
*Save this for web access*
`;

  const keyboard = {
    inline_keyboard: [
      [
        { text: '✅ I Have a Wallet', callback_data: 'wallet_ready' },
        { text: '❓ Need Help', callback_data: 'wallet_help' }
      ],
      [
        { text: '📋 Copy Dashboard ID', callback_data: `copy_dashboard_id:${dashboardId}` }
      ]
    ]
  };

  await ctx.reply(setupMessage, {
    parse_mode: 'Markdown',
    reply_markup: keyboard
  });
}

async function showEligibilityStatus(ctx: any, solana: SolanaService, walletAddress: string, dashboardId: string) {
  const eligibility = await solana.checkReferralEligibility(walletAddress);
  const statusMessage = solana.generateEligibilityMessage(eligibility);

  const fullMessage = `
🔍 **Wallet Status Check**

**Wallet**: \`${solana.formatWalletAddress(walletAddress)}\`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${statusMessage}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🆔 **Dashboard ID**: \`${dashboardId}\`
`;

  const keyboard = {
    inline_keyboard: [
      [
        { text: '🔄 Check Again', callback_data: 'recheck_eligibility' },
        { text: '💰 Buy $OTTO', url: 'https://jup.ag/swap/SOL-OTTO' }
      ],
      [
        { text: '🔧 Change Wallet', callback_data: 'change_wallet' },
        { text: '📊 Dashboard', callback_data: 'dashboard' }
      ]
    ]
  };

  await ctx.reply(fullMessage, {
    parse_mode: 'Markdown',
    reply_markup: keyboard
  });
}

async function showFullDashboard(ctx: any, user: any, walletStatus: any, appUrl: string) {
  const welcomeMessage = `
✨ **Welcome Back to OTTO Referral+**

*Hey ${ctx.from?.first_name || 'there'}!* You're all set up and ready to earn!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🆔 **Dashboard ID**
\`${user.dashboardId}\`

💎 **Your Wallet**
\`${walletStatus.walletAddress}\`

🔗 **Referral Code**
\`${walletStatus.referralCode}\`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 **Current Status**
${getTierDisplay(user.tier)}

📈 **Your Stats**
∙ Total Referrals: **${user.totalReferrals}**
∙ Rewards Earned: **${(user.totalRewardsEarned / 1_000_000).toFixed(2)} $OTTO**

🌐 **Cross-Platform Access**
Your Dashboard ID works on web, mobile, and Telegram
`;

  const keyboard = {
    inline_keyboard: [
      [
        { text: '📊 Analytics', callback_data: 'analytics' },
        { text: '🔗 Share Link', callback_data: 'share_link' }
      ],
      [
        { text: '🏆 My Tier', callback_data: 'tier' },
        { text: '💰 Claim Rewards', callback_data: 'claim' }
      ],
      [
        { text: '👥 Leaderboard', callback_data: 'leaderboard' },
        { text: '⚙️ Settings', callback_data: 'settings' }
      ],
      ...(appUrl.includes('localhost') ? [] : [[
        { text: '🌐 Web Dashboard', url: `${appUrl}/dashboard?id=${user.dashboardId}` }
      ]])
    ]
  };

  await ctx.reply(welcomeMessage, {
    parse_mode: 'Markdown',
    reply_markup: keyboard
  });
}

export async function handleWalletAddress(
  ctx: any,
  db: DatabaseService,
  solana: SolanaService,
  walletAddress: string
) {
  try {
    // Only respond in private chats
    if (ctx.chat?.type !== 'private') {
      return;
    }

    const telegramId = ctx.from?.id;
    if (!telegramId) {
      await ctx.reply('⚠️ Unable to identify user.');
      return;
    }

    // Validate wallet address format
    if (!solana.isValidWalletAddress(walletAddress)) {
      await ctx.reply(
        '❌ **Invalid Wallet Address**\n\nPlease provide a valid Solana wallet address.\n\n*Example: 9WzDXwBbmcjH...YtAWWM*',
        { parse_mode: 'Markdown' }
      );
      return;
    }

    // Show verification message
    const verifyMsg = await ctx.reply('🔍 *Verifying your wallet and checking $OTTO holdings...*', {
      parse_mode: 'Markdown'
    });

    // Check eligibility
    const eligibility = await solana.checkReferralEligibility(walletAddress);
    const holdings = eligibility.currentHoldings;

    // Update user in database
    await db.setUserWallet(telegramId, walletAddress, eligibility.isEligible, holdings);

    // Delete verification message
    await ctx.api.deleteMessage(ctx.chat.id, verifyMsg.message_id);

    if (eligibility.isEligible) {
      await ctx.reply(
        '🎉 **Congratulations!**\n\n✅ Wallet verified and eligible for referrals!\n\nYou can now start earning with OTTO Referral+',
        { parse_mode: 'Markdown' }
      );
      
      // Show full dashboard
      const user = await db.getOrCreateUser(telegramId, {});
      const walletStatus = await db.getUserWalletStatus(telegramId);
      await showFullDashboard(ctx, user, walletStatus, process.env.APP_URL || 'http://localhost:3000');
    } else {
      const statusMessage = solana.generateEligibilityMessage(eligibility);
      await ctx.reply(statusMessage, { parse_mode: 'Markdown' });
    }

  } catch (error) {
    console.error('Error handling wallet address:', error);
    await ctx.reply(
      '❌ **Verification Failed**\n\nUnable to verify your wallet. Please try again or contact support.',
      { parse_mode: 'Markdown' }
    );
  }
}

export async function dashboardCommand(
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

    const user = await db.getOrCreateUser(telegramId, {
      username: ctx.from?.username,
      firstName: ctx.from?.first_name,
      lastName: ctx.from?.last_name
    });

    const walletStatus = await db.getUserWalletStatus(telegramId);

    if (!walletStatus.hasWallet) {
      await ctx.reply(
        '🔧 **Setup Required**\n\nPlease complete wallet setup first using /start',
        { parse_mode: 'Markdown' }
      );
      return;
    }

    const dashboardMessage = `
🌐 **OTTO Web Dashboard**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🆔 **Your Access ID**
\`${user.dashboardId}\`

💎 **Wallet Status**
${walletStatus.isEligible ? '✅ Eligible for referrals' : '❌ Needs more $OTTO holdings'}

📱 **Universal Access**
∙ Works on any device
∙ No wallet connection required
∙ Real-time analytics
∙ Advanced features

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

*Your Dashboard ID is your key to the full OTTO experience*
`;

    const keyboard = {
      inline_keyboard: [
        // Only add launch dashboard button if not using localhost
        ...(appUrl.includes('localhost') ? [] : [[
          { text: '🌐 Launch Dashboard', url: `${appUrl}/dashboard?id=${user.dashboardId}` }
        ]]),
        [
          { text: '📋 Copy ID', callback_data: `copy_dashboard_id:${user.dashboardId}` },
          { text: '🔄 Refresh', callback_data: 'dashboard' }
        ],
        [
          { text: '📊 Quick Stats', callback_data: 'stats' },
          { text: '⚙️ Settings', callback_data: 'settings' }
        ]
      ]
    };

    await ctx.reply(dashboardMessage, {
      parse_mode: 'Markdown',
      reply_markup: keyboard
    });

  } catch (error) {
    console.error('Error in dashboard command:', error);
    await ctx.reply(
      '🚨 **Dashboard Error**\n\n*Unable to load dashboard information.*',
      { parse_mode: 'Markdown' }
    );
  }
}

function getTierDisplay(tier: string): string {
  switch (tier) {
    case 'Gold':
      return '🥇 **GOLD TIER**\n*Full ecosystem access + governance*';
    case 'Silver':
      return '🥈 **SILVER TIER**\n*Early access + enhanced rewards*';
    case 'Bronze':
      return '🥉 **BRONZE TIER**\n*Community access + base rewards*';
    default:
      return '⚪ **STARTER**\n*Complete wallet setup to unlock tiers*';
  }
}

function getTierEmoji(tier: string): string {
  switch (tier) {
    case 'Gold': return '🥇';
    case 'Silver': return '🥈';
    case 'Bronze': return '🥉';
    default: return '⚪';
  }
} 