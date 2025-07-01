import 'dotenv/config';
import { Bot, GrammyError, HttpError } from 'grammy';
import { SolanaService } from './services/solana.js';
import { DatabaseService } from './services/database.js';
import { startCommand, handleWalletAddress, dashboardCommand } from './commands/start.js';
import { statsCommand } from './commands/stats.js';
import { tierCommand } from './commands/tier.js';
import { claimCommand } from './commands/claim.js';

// Environment configuration
const env = {
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || '',
  SOLANA_RPC_URL: process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
  REFERRAL_PROGRAM_ID: process.env.REFERRAL_PROGRAM_ID || '11111111111111111111111111111111',
  OTTO_TOKEN_MINT: process.env.OTTO_TOKEN_MINT || '11111111111111111111111111111111',
  MIN_HOLDINGS_FOR_REFERRAL: parseInt(process.env.MIN_HOLDINGS_FOR_REFERRAL || '1000000'), // 1M tokens
  API_URL: process.env.API_URL || 'http://localhost:3001',
  APP_URL: process.env.APP_URL || 'http://localhost:3000',
};

// Validate required environment variables
if (!env.TELEGRAM_BOT_TOKEN) {
  console.error('❌ TELEGRAM_BOT_TOKEN is required but not provided');
  console.error('   Please check your .env file');
  process.exit(1);
}

console.log('🔧 Bot Configuration:');
console.log(`   Token: ${env.TELEGRAM_BOT_TOKEN.substring(0, 10)}...`);
console.log(`   RPC: ${env.SOLANA_RPC_URL}`);
console.log(`   API: ${env.API_URL}`);
console.log(`   Min Holdings: ${(env.MIN_HOLDINGS_FOR_REFERRAL / 1_000_000).toFixed(1)}M $OTTO`);

// Initialize services
const solana = new SolanaService(
  env.SOLANA_RPC_URL,
  env.REFERRAL_PROGRAM_ID,
  env.OTTO_TOKEN_MINT,
  env.MIN_HOLDINGS_FOR_REFERRAL
);

const database = new DatabaseService(env.API_URL);

// Initialize bot
const bot = new Bot(env.TELEGRAM_BOT_TOKEN);

// Store user sessions for wallet input flow
const userSessions = new Map();

// Error handling
bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
});

// Commands
bot.command('start', async (ctx) => {
  await startCommand(ctx, database, solana, env.APP_URL);
});

bot.command('dashboard', async (ctx) => {
  await dashboardCommand(ctx, database, solana, env.APP_URL);
});

bot.command('stats', async (ctx) => {
  await statsCommand(ctx, database, solana, env.APP_URL);
});

bot.command('tier', async (ctx) => {
  await tierCommand(ctx, database, solana, env.APP_URL);
});

bot.command('claim', async (ctx) => {
  await claimCommand(ctx, database, solana, env.APP_URL);
});

// Callback query handlers for new wallet flow
bot.callbackQuery('wallet_ready', async (ctx) => {
  // Only respond in private chats
  if (ctx.chat?.type !== 'private') {
    await ctx.answerCallbackQuery();
    return;
  }

  await ctx.answerCallbackQuery();
  const telegramId = ctx.from?.id;
  if (telegramId) {
    userSessions.set(telegramId, { awaitingWallet: true });
    await ctx.editMessageText(
      '💼 **Wallet Address Required**\n\nPlease send me your Solana wallet address to continue.\n\n*Example: 9WzDXwBbmcjH4LfXDd56YbZV8s...YtAWWM*\n\n⚠️ **Make sure you own this wallet and have $OTTO tokens in it!**',
      { parse_mode: 'Markdown' }
    );
  }
});

bot.callbackQuery('wallet_help', async (ctx) => {
  // Only respond in private chats
  if (ctx.chat?.type !== 'private') {
    await ctx.answerCallbackQuery();
    return;
  }

  await ctx.answerCallbackQuery();
  await ctx.editMessageText(
    `🔰 **How to Get a Solana Wallet**

**Recommended Wallets:**

📱 **Phantom** (Mobile & Desktop)
∙ Download from phantom.app
∙ Create new wallet
∙ Backup your seed phrase safely

🎒 **Backpack** (Mobile & Desktop)  
∙ Download from backpack.app
∙ Simple setup process
∙ Built for Solana

🦊 **Solflare** (Mobile & Desktop)
∙ Download from solflare.com
∙ Native Solana support
∙ Advanced features

**Next Steps:**
1. Download and set up wallet
2. Buy $OTTO tokens (minimum ${(env.MIN_HOLDINGS_FOR_REFERRAL / 1_000_000).toFixed(1)}M)
3. Come back and share your wallet address

Need help? Contact @OTTOSupport`,
    { 
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '🔙 Back to Setup', callback_data: 'back_to_setup' }]
        ]
      }
    }
  );
});

bot.callbackQuery('back_to_setup', async (ctx) => {
  // Only respond in private chats
  if (ctx.chat?.type !== 'private') {
    await ctx.answerCallbackQuery();
    return;
  }

  await ctx.answerCallbackQuery();
  // Restart the setup flow
  await startCommand(ctx, database, solana, env.APP_URL);
});

bot.callbackQuery('recheck_eligibility', async (ctx) => {
  // Only respond in private chats
  if (ctx.chat?.type !== 'private') {
    await ctx.answerCallbackQuery();
    return;
  }

  await ctx.answerCallbackQuery();
  const telegramId = ctx.from?.id;
  if (!telegramId) return;

  const walletStatus = await database.getUserWalletStatus(telegramId);
  if (!walletStatus.hasWallet) {
    await ctx.reply('❌ No wallet found. Please complete setup first.');
    return;
  }

  const checkMsg = await ctx.reply('🔍 *Rechecking your $OTTO holdings...*', {
    parse_mode: 'Markdown'
  });

  const eligibility = await solana.checkReferralEligibility(walletStatus.walletAddress!);
  await database.updateReferralEligibility(telegramId, eligibility.isEligible, eligibility.currentHoldings);

  if (ctx.chat) {
    await ctx.api.deleteMessage(ctx.chat.id, checkMsg.message_id);
  }

  if (eligibility.isEligible) {
    await ctx.reply(
      '🎉 **Great news!**\n\n✅ You now meet the requirements for referrals!\n\nRefresh your dashboard to see your new status.',
      { parse_mode: 'Markdown' }
    );
  } else {
    const statusMessage = solana.generateEligibilityMessage(eligibility);
    await ctx.reply(statusMessage, { parse_mode: 'Markdown' });
  }
});

bot.callbackQuery('change_wallet', async (ctx) => {
  // Only respond in private chats
  if (ctx.chat?.type !== 'private') {
    await ctx.answerCallbackQuery();
    return;
  }

  await ctx.answerCallbackQuery();
  const telegramId = ctx.from?.id;
  if (telegramId) {
    userSessions.set(telegramId, { awaitingWallet: true });
    await ctx.reply(
      '🔄 **Update Wallet Address**\n\nSend me your new Solana wallet address.\n\n*Make sure it has the required $OTTO holdings!*',
      { parse_mode: 'Markdown' }
    );
  }
});

// Copy dashboard ID callback
bot.callbackQuery(/copy_dashboard_id:(.+)/, async (ctx) => {
  // Only respond in private chats
  if (ctx.chat?.type !== 'private') {
    await ctx.answerCallbackQuery();
    return;
  }

  await ctx.answerCallbackQuery(`📋 Dashboard ID copied: ${ctx.match[1]}`);
});

// Existing callback handlers
bot.callbackQuery('analytics', async (ctx) => {
  // Only respond in private chats
  if (ctx.chat?.type !== 'private') {
    await ctx.answerCallbackQuery();
    return;
  }

  await ctx.answerCallbackQuery();
  await showAnalyticsDashboard(ctx, database, solana, env.APP_URL);
});

bot.callbackQuery('settings', async (ctx) => {
  // Only respond in private chats
  if (ctx.chat?.type !== 'private') {
    await ctx.answerCallbackQuery();
    return;
  }

  await ctx.answerCallbackQuery();
  await showWalletInfo(ctx, database, solana, env.APP_URL);
});

bot.callbackQuery('dashboard', async (ctx) => {
  // Only respond in private chats
  if (ctx.chat?.type !== 'private') {
    await ctx.answerCallbackQuery();
    return;
  }

  await ctx.answerCallbackQuery();
  await dashboardCommand(ctx, database, solana, env.APP_URL);
});

bot.callbackQuery('share_link', async (ctx) => {
  // Only respond in private chats
  if (ctx.chat?.type !== 'private') {
    await ctx.answerCallbackQuery();
    return;
  }

  await ctx.answerCallbackQuery();
  const telegramId = ctx.from?.id;
  if (!telegramId) return;
  
  const walletStatus = await database.getUserWalletStatus(telegramId);
  if (!walletStatus.isEligible || !walletStatus.referralCode) {
    await ctx.reply('❌ You need to be eligible for referrals first.');
    return;
  }
  
  const referralLink = `${env.APP_URL}/invite/${walletStatus.referralCode}`;
  await ctx.reply(
    `🔗 **Your Referral Link**\n\n\`${referralLink}\`\n\n**Share this link to earn rewards when people buy $OTTO!**`,
    { parse_mode: 'Markdown' }
  );
});

// Handle text messages (wallet addresses)
bot.on('message:text', async (ctx) => {
  // Only respond in private chats
  if (ctx.chat?.type !== 'private') {
    return;
  }

  const telegramId = ctx.from?.id;
  const messageText = ctx.message.text;
  
  // Check if user is in wallet input flow
  if (telegramId && userSessions.has(telegramId)) {
    const session = userSessions.get(telegramId);
    if (session.awaitingWallet) {
      userSessions.delete(telegramId); // Clear session
      await handleWalletAddress(ctx, database, solana, messageText);
      return;
    }
  }
  
  // Handle non-command messages
  if (!messageText.startsWith('/')) {
    await ctx.reply(
      '👋 Hi! Welcome to OTTO Referral+\n\n' +
      'Use these commands to get started:\n' +
      '/start - Complete wallet setup\n' +
      '/dashboard - Access your dashboard\n' +
      '/stats - View your stats\n' +
      '/tier - Check your tier\n' +
      '/claim - Claim rewards'
    );
  }
});

// Helper functions
async function showAnalyticsDashboard(ctx: any, db: any, solana: any, appUrl: string) {
  try {
    // Only respond in private chats
    if (ctx.chat?.type !== 'private') {
      return;
    }

    const telegramId = ctx.from?.id;
    if (!telegramId) return;

    const user = await db.getOrCreateUser(telegramId, {
      username: ctx.from?.username,
      firstName: ctx.from?.first_name,
      lastName: ctx.from?.last_name
    });

    const walletStatus = await db.getUserWalletStatus(telegramId);

    if (!walletStatus.hasWallet) {
      await ctx.reply('❌ Please complete wallet setup first using /start');
      return;
    }

    const analyticsMessage = `
📊 **Your Analytics Dashboard**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🆔 **Dashboard Access**
Your unique ID: \`${user.dashboardId}\`

💎 **Wallet Status**
${walletStatus.isEligible ? '✅ Eligible for referrals' : '❌ Needs more $OTTO'}
\`${solana.formatWalletAddress(walletStatus.walletAddress || 'Not set')}\`

${walletStatus.isEligible ? `🔗 **Referral Code**
\`${walletStatus.referralCode}\`` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 **Current Stats**
∙ Tier: ${getTierEmoji(user.tier)} ${user.tier}
∙ Total Referrals: **${user.totalReferrals}**
∙ Rewards Earned: **${(user.totalRewardsEarned / 1_000_000).toFixed(2)} $OTTO**

🌐 **Web Dashboard**
Access your full analytics at web dashboard

*Copy your Dashboard ID to access detailed analytics on any device*
`;

    const keyboard = {
      inline_keyboard: [
        [
          { text: '📋 Copy Dashboard ID', callback_data: `copy_dashboard_id:${user.dashboardId}` }
        ],
        [
          { text: '⚙️ Settings', callback_data: 'settings' },
          { text: '🔄 Refresh', callback_data: 'analytics' }
        ],
        [
          { text: '🏠 Back to Home', callback_data: 'back_to_start' }
        ]
      ]
    };

    if (ctx.editMessageText) {
      await ctx.editMessageText(analyticsMessage, {
        parse_mode: 'Markdown',
        reply_markup: keyboard
      });
    } else {
      await ctx.reply(analyticsMessage, {
        parse_mode: 'Markdown',
        reply_markup: keyboard
      });
    }

  } catch (error) {
    console.error('Error showing analytics dashboard:', error);
    await ctx.reply('❌ Error loading analytics. Please try again later.');
  }
}

async function showWalletInfo(ctx: any, db: any, solana: any, appUrl: string) {
  try {
    // Only respond in private chats
    if (ctx.chat?.type !== 'private') {
      return;
    }

    const telegramId = ctx.from?.id;
    if (!telegramId) return;

    const user = await db.getOrCreateUser(telegramId, {
      username: ctx.from?.username,
      firstName: ctx.from?.first_name,
      lastName: ctx.from?.last_name
    });

    const walletStatus = await db.getUserWalletStatus(telegramId);

    const walletMessage = `
⚙️ **Wallet Settings**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🆔 **Account Info**
Dashboard ID: \`${user.dashboardId}\`
Created: ${user.createdAt.toLocaleDateString()}

💎 **Wallet Status**
${walletStatus.hasWallet ? 
  `Address: \`${solana.formatWalletAddress(walletStatus.walletAddress!)}\`
Status: ${walletStatus.isEligible ? '✅ Eligible' : '❌ Needs more $OTTO'}` :
  'No wallet connected'
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Your wallet is non-custodial - only you control your private keys!**
`;

    const keyboard = {
      inline_keyboard: [
        [
          { text: '🔄 Check Holdings', callback_data: 'recheck_eligibility' },
          { text: '🔧 Change Wallet', callback_data: 'change_wallet' }
        ],
        [
          { text: '📊 Analytics', callback_data: 'analytics' },
          { text: '🏠 Main Menu', callback_data: 'back_to_start' }
        ]
      ]
    };

    if (ctx.editMessageText) {
      await ctx.editMessageText(walletMessage, {
        parse_mode: 'Markdown',
        reply_markup: keyboard
      });
    } else {
      await ctx.reply(walletMessage, {
        parse_mode: 'Markdown',
        reply_markup: keyboard
      });
    }

  } catch (error) {
    console.error('Error showing wallet info:', error);
    await ctx.reply('❌ Error loading wallet info. Please try again later.');
  }
}

bot.callbackQuery('back_to_start', async (ctx) => {
  // Only respond in private chats
  if (ctx.chat?.type !== 'private') {
    await ctx.answerCallbackQuery();
    return;
  }

  await ctx.answerCallbackQuery();
  await startCommand(ctx, database, solana, env.APP_URL);
});

function getTierEmoji(tier: string): string {
  switch (tier) {
    case 'Gold': return '🥇';
    case 'Silver': return '🥈';
    case 'Bronze': return '🥉';
    default: return '⚪';
  }
}

// Start bot
console.log('🤖 Starting OTTO Referral+ Bot...');
bot.start();
console.log('✅ Bot is running!'); 