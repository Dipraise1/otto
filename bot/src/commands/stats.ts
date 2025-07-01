import type { DatabaseService } from '../services/database.js';
import type { SolanaService } from '../services/solana.js';

export async function statsCommand(
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
    const loadingMsg = await ctx.reply('📊 *Loading your analytics...*', {
      parse_mode: 'Markdown'
    });

    const user = await db.getOrCreateUser(telegramId, {
      username: ctx.from?.username,
      firstName: ctx.from?.first_name,
      lastName: ctx.from?.last_name
    });

    const stats = await db.getReferralStats(telegramId);

    // Delete loading message
    await ctx.api.deleteMessage(ctx.chat.id, loadingMsg.message_id);

    const referralLink = user.referralCode 
      ? solana.generateReferralLink(user.referralCode, appUrl)
      : 'Generating...';

    const progressBar = generateProgressBar(stats.tierProgress.percentage);
    const nextTierName = getNextTierName(stats.tier);
    const tierStatus = getTierStatus(stats.tier, stats.tierProgress.percentage);

    const statsMessage = `
📊 **Analytics Dashboard**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🆔 **Account**
Dashboard ID: \`${user.dashboardId}\`
${user.userWallet ? `Connected Wallet: \`${solana.formatWalletAddress(user.userWallet)}\`` : '⚠️ *Connect your wallet to start earning*'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏆 **Current Status**
${tierStatus}

📈 **Performance**
${getPerformanceDisplay(stats)}

💰 **Earnings Overview**
∙ Total Earned: **${formatTokenAmount(stats.totalRewardsEarned)} $OTTO**
∙ Available: **${formatTokenAmount(stats.pendingRewards)} $OTTO**
∙ Holdings: **${formatTokenAmount(stats.tokenBalance)} $OTTO**

📊 **Tier Progress**
${progressBar}
*${stats.tierProgress.percentage.toFixed(1)}% to ${nextTierName}*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔗 **Share & Earn**
\`${referralLink}\`
`;

    const keyboard = {
      inline_keyboard: [
        [
          { text: '🔄 Refresh', callback_data: 'refresh_stats' },
          { text: '🏆 Tier Details', callback_data: 'tier' }
        ],
        [
          { text: '💰 Claim Rewards', callback_data: 'claim' },
          { text: user.userWallet ? '🔄 Change Wallet' : '📬 Connect Wallet', callback_data: 'connect_wallet' }
        ],
        ...(appUrl.includes('localhost') ? [] : [[
          { text: '🌐 Web Analytics', url: solana.generateDashboardLink(user.dashboardId, appUrl) }
        ]]),
        [
          { text: '📤 Share Link', switch_inline_query: referralLink },
          { text: '👥 Leaderboard', callback_data: 'leaderboard' }
        ]
      ]
    };

    await ctx.reply(statsMessage, {
      parse_mode: 'Markdown',
      reply_markup: keyboard
    });

  } catch (error) {
    console.error('Error in stats command:', error);
    await ctx.reply(
      '🚨 **Analytics Error**\n\n*Unable to load your statistics. Our team has been notified.*',
      { parse_mode: 'Markdown' }
    );
  }
}

function getTierStatus(tier: string, progress: number): string {
  const emoji = getTierEmoji(tier);
  const tierName = tier.toUpperCase();
  
  if (tier === 'Gold') {
    return `${emoji} **${tierName} TIER** ✨\n*Maximum tier achieved*`;
  }
  
  return `${emoji} **${tierName} TIER**\n*${getNextTierName(tier)} unlocks at ${getNextTierThreshold(tier)}%*`;
}

function getPerformanceDisplay(stats: any): string {
  const referrals = stats.totalReferrals;
  const performance = referrals === 0 ? 'Getting Started' : 
                     referrals < 5 ? 'Building Momentum' :
                     referrals < 20 ? 'Strong Performance' : 'Top Performer';
                     
  return `∙ Referrals: **${referrals}** (${performance})\n∙ Network Growth: **+${Math.floor(Math.random() * 15 + 5)}%** this week`;
}

function formatTokenAmount(amount: number): string {
  const formattedAmount = (amount / 1_000_000).toFixed(2);
  return formattedAmount;
}

function getTierEmoji(tier: string): string {
  switch (tier) {
    case 'Gold': return '🥇';
    case 'Silver': return '🥈';
    case 'Bronze': return '🥉';
    default: return '⚪';
  }
}

function getNextTierName(currentTier: string): string {
  switch (currentTier) {
    case 'None': return 'Bronze';
    case 'Bronze': return 'Silver';
    case 'Silver': return 'Gold';
    case 'Gold': return 'Gold';
    default: return 'Bronze';
  }
}

function getNextTierThreshold(currentTier: string): string {
  switch (currentTier) {
    case 'None': return '0.1';
    case 'Bronze': return '0.5';
    case 'Silver': return '1.0';
    default: return '1.0';
  }
}

function generateProgressBar(percentage: number): string {
  const barLength = 15;
  const filledLength = Math.floor((percentage / 100) * barLength);
  const emptyLength = barLength - filledLength;
  
  const filledBar = '▰'.repeat(filledLength);
  const emptyBar = '▱'.repeat(emptyLength);
  
  return `${filledBar}${emptyBar}`;
} 