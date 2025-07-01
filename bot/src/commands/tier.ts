import type { DatabaseService } from '../services/database.js';
import type { SolanaService } from '../services/solana.js';

export async function tierCommand(
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
    const loadingMsg = await ctx.reply('🏆 *Loading tier information...*', {
      parse_mode: 'Markdown'
    });

    const user = await db.getOrCreateUser(telegramId, {
      username: ctx.from?.username,
      firstName: ctx.from?.first_name,
      lastName: ctx.from?.last_name
    });

    const stats = await db.getUserStats(telegramId);
    if (!stats) {
      await ctx.editMessageText('🚨 *Unable to fetch tier information. Please try again.*', {
        parse_mode: 'Markdown'
      });
      return;
    }

    // Delete loading message
    await ctx.api.deleteMessage(ctx.chat.id, loadingMsg.message_id);

    const progressBar = generateProgressBar(stats.tierProgress.percentage);
    const nextTierName = getNextTierName(stats.tier);
    const tierBenefits = getTierBenefits(stats.tier);
    const nextTierBenefits = getNextTierBenefits(stats.tier);

    const tierMessage = `
🏆 **Tier Management Center**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${getCurrentTierDisplay(stats.tier)}

📊 **Progress Tracking**
${progressBar}
*${stats.tierProgress.percentage.toFixed(1)}% progress to ${nextTierName}*

💎 **Holdings Analysis**
∙ Current Balance: **${(stats.tokenBalance / 1_000_000).toFixed(2)} $OTTO**
∙ Required for ${nextTierName}: **${getNextTierRequirement(stats.tier)} $OTTO**
∙ Still Needed: **${Math.max(0, (getNextTierRequirement(stats.tier) - stats.tokenBalance / 1_000_000)).toFixed(2)} $OTTO**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎁 **Current Benefits**
${tierBenefits}

${stats.tier !== 'Gold' ? `🚀 **Unlock Next: ${nextTierName}**\n${nextTierBenefits}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 **Tier System Overview**
${getAllTiersOverview()}
`;

    const keyboard = {
      inline_keyboard: [
        [
          { text: '🔄 Refresh Progress', callback_data: 'refresh_tier' },
          { text: '📊 View Analytics', callback_data: 'stats' }
        ],
        [
          { text: '💰 Claim Rewards', callback_data: 'claim' },
          { text: '🔗 Share Link', callback_data: 'referral_link' }
        ],
        [
          { text: '🌐 Web Dashboard', url: solana.generateDashboardLink(user.dashboardId, appUrl) }
        ],
        [
          { text: '👥 Leaderboard', callback_data: 'leaderboard' }
        ]
      ]
    };

    await ctx.reply(tierMessage, {
      parse_mode: 'Markdown',
      reply_markup: keyboard
    });

  } catch (error) {
    console.error('Error in tier command:', error);
    await ctx.reply(
      '🚨 **Tier System Error**\n\n*Unable to load tier information. Our team has been notified.*',
      { parse_mode: 'Markdown' }
    );
  }
}

function getCurrentTierDisplay(tier: string): string {
  switch (tier) {
    case 'Gold':
      return `🥇 **GOLD TIER** ✨
*Maximum tier achieved - Elite status*

🌟 **Elite Member Benefits**
∙ Full ecosystem governance rights
∙ Priority access to all features
∙ Maximum referral rewards
∙ Exclusive community access`;

    case 'Silver':
      return `🥈 **SILVER TIER** 
*Advanced member status*

⚡ **Enhanced Benefits**
∙ Early access to new features
∙ Increased referral multipliers
∙ Priority support access
∙ Advanced analytics`;

    case 'Bronze':
      return `🥉 **BRONZE TIER**
*Active community member*

🎯 **Core Benefits**
∙ Community access
∙ Base referral rewards
∙ Standard analytics
∙ Regular updates`;

    default:
      return `⚪ **STARTER TIER**
*Welcome to OTTO ecosystem*

🚀 **Getting Started**
∙ Basic referral tracking
∙ Standard reward rates
∙ Foundation features
∙ Growth opportunities`;
  }
}

function getTierBenefits(tier: string): string {
  switch (tier) {
    case 'Gold':
      return `✨ Governance voting rights
🎯 Exclusive whitelist access
💎 Maximum reward multipliers
🏆 VIP community access
📈 Advanced analytics suite
🚀 Priority feature access`;

    case 'Silver':
      return `⚡ Enhanced reward rates
🎯 Early feature access
💎 Priority support
🏆 Advanced community access
📈 Detailed analytics
🚀 Beta testing opportunities`;

    case 'Bronze':
      return `🎯 Community access
💎 Base reward rates
🏆 Standard analytics
📈 Regular updates
🚀 Growth tracking
⭐ Referral bonuses`;

    default:
      return `🚀 Basic referral tracking
⭐ Standard reward rates
📊 Foundation analytics
💡 Learning resources
🎯 Growth opportunities
📈 Progress monitoring`;
  }
}

function getNextTierBenefits(currentTier: string): string {
  switch (currentTier) {
    case 'Silver':
      return `✨ Unlock governance rights
🎯 Get exclusive whitelist access
💎 Achieve maximum multipliers
🏆 Join VIP community`;

    case 'Bronze':
      return `⚡ Boost your reward rates
🎯 Get early feature access
💎 Receive priority support
🏆 Join advanced community`;

    case 'None':
      return `🎯 Access private community
💎 Earn higher rewards
🏆 Get detailed analytics
⭐ Unlock referral bonuses`;

    default:
      return '';
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

function getNextTierRequirement(currentTier: string): number {
  switch (currentTier) {
    case 'None': return 0.1; // 0.1% of supply
    case 'Bronze': return 0.5; // 0.5% of supply
    case 'Silver': return 1.0; // 1.0% of supply
    default: return 1.0;
  }
}

function getAllTiersOverview(): string {
  return `⚪ **Starter** → Unlimited referrals
🥉 **Bronze** (≥0.1%) → Community + rewards
🥈 **Silver** (≥0.5%) → Enhanced features
🥇 **Gold** (≥1.0%) → Elite status + governance`;
}

function generateProgressBar(percentage: number): string {
  const barLength = 20;
  const filledLength = Math.floor((percentage / 100) * barLength);
  const emptyLength = barLength - filledLength;
  
  const filledBar = '▰'.repeat(filledLength);
  const emptyBar = '▱'.repeat(emptyLength);
  
  return `${filledBar}${emptyBar}`;
} 