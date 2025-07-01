import { UserProfile, ReferralStats, WalletSetup, ClaimRequest, GeneratedWallet } from '../types/index.js';

// In-memory storage for development/testing
const users = new Map<number, UserProfile>();
const walletSetups = new Map<string, WalletSetup>();
const claimRequests = new Map<string, ClaimRequest & { id: string; status: 'pending' | 'confirmed' | 'failed'; createdAt: Date }>();

export class DatabaseService {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || '';
    console.log('🗄️ Database Service initialized (In-Memory Mode)');
  }

  async getOrCreateUser(telegramId: number, userInfo: {
    username?: string;
    firstName?: string;
    lastName?: string;
  }): Promise<UserProfile> {
    try {
      // Check if user exists
      let user = users.get(telegramId);
      
      if (!user) {
        // Create new user - but don't generate wallet yet
        const dashboardId = this.generateDashboardId();
        
        user = {
          telegramId,
          username: userInfo.username,
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          dashboardId,
          referralCode: undefined, // Will be set after wallet verification
          tier: 'None', // Start with None until wallet is verified
          totalReferrals: 0,
          totalRewardsEarned: 0,
          userWallet: undefined, // User's own wallet address
          isEligibleForReferrals: false, // Must verify holdings first
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        users.set(telegramId, user);
        console.log(`✅ Created new user profile: ${dashboardId}`);
      } else {
        // Update user info if provided
        if (userInfo.username) user.username = userInfo.username;
        if (userInfo.firstName) user.firstName = userInfo.firstName;
        if (userInfo.lastName) user.lastName = userInfo.lastName;
        user.updatedAt = new Date();
        users.set(telegramId, user);
      }
      
      return user;
    } catch (error) {
      console.error('Error getting/creating user:', error);
      throw new Error('Failed to access user data');
    }
  }

  async getUserByDashboardId(dashboardId: string): Promise<UserProfile | null> {
    for (const user of users.values()) {
      if (user.dashboardId === dashboardId) {
        return user;
      }
    }
    return null;
  }

  async updateUser(telegramId: number, updates: Partial<UserProfile>): Promise<UserProfile> {
    const user = users.get(telegramId);
    if (!user) {
      throw new Error('User not found');
    }
    
    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    users.set(telegramId, updatedUser);
    return updatedUser;
  }

  /**
   * Set user's wallet address and verify eligibility
   */
  async setUserWallet(
    telegramId: number, 
    walletAddress: string, 
    isEligible: boolean,
    holdings: number
  ): Promise<UserProfile> {
    const user = users.get(telegramId);
    if (!user) {
      throw new Error('User not found');
    }

    // Update user with wallet and eligibility
    user.userWallet = walletAddress;
    user.isEligibleForReferrals = isEligible;
    
    // Generate referral code only if eligible
    if (isEligible && !user.referralCode) {
      user.referralCode = this.generateRandomCode(8);
      user.tier = this.calculateTierFromHoldings(holdings);
    }
    
    user.updatedAt = new Date();
    users.set(telegramId, user);
    
    // Create wallet setup record
    if (isEligible) {
      const walletSetup: WalletSetup = {
        dashboardId: user.dashboardId,
        generatedWallet: walletAddress, // In new model, this is user's wallet
        referralCode: user.referralCode!,
        referralLink: `https://otto.so/invite/${user.referralCode}`
      };
      walletSetups.set(user.dashboardId, walletSetup);
    }
    
    return user;
  }

  /**
   * Check if user has wallet set up and is eligible
   */
  async getUserWalletStatus(telegramId: number): Promise<{
    hasWallet: boolean;
    isEligible: boolean;
    walletAddress?: string;
    referralCode?: string;
  }> {
    const user = users.get(telegramId);
    if (!user) {
      return { hasWallet: false, isEligible: false };
    }

    return {
      hasWallet: !!user.userWallet,
      isEligible: user.isEligibleForReferrals,
      walletAddress: user.userWallet,
      referralCode: user.referralCode
    };
  }

  /**
   * Update user's referral eligibility (called when holdings change)
   */
  async updateReferralEligibility(
    telegramId: number,
    isEligible: boolean,
    holdings: number
  ): Promise<UserProfile> {
    const user = users.get(telegramId);
    if (!user) {
      throw new Error('User not found');
    }

    const wasEligible = user.isEligibleForReferrals;
    user.isEligibleForReferrals = isEligible;
    user.tier = this.calculateTierFromHoldings(holdings);
    
    // Generate referral code if newly eligible
    if (isEligible && !wasEligible && !user.referralCode) {
      user.referralCode = this.generateRandomCode(8);
      
      // Create wallet setup
      const walletSetup: WalletSetup = {
        dashboardId: user.dashboardId,
        generatedWallet: user.userWallet!,
        referralCode: user.referralCode,
        referralLink: `https://otto.so/invite/${user.referralCode}`
      };
      walletSetups.set(user.dashboardId, walletSetup);
    }
    
    user.updatedAt = new Date();
    users.set(telegramId, user);
    
    return user;
  }

  async getWalletSetup(telegramId: number): Promise<WalletSetup | null> {
    const user = users.get(telegramId);
    if (!user || !user.isEligibleForReferrals) return null;
    
    return walletSetups.get(user.dashboardId) || null;
  }

  async generateReferralCode(telegramId: number): Promise<string> {
    const user = users.get(telegramId);
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.isEligibleForReferrals) {
      throw new Error('User not eligible for referrals');
    }
    
    const code = this.generateRandomCode(8);
    
    // Update user with referral code
    user.referralCode = code;
    users.set(telegramId, user);
    
    return code;
  }

  async getReferralStats(telegramId: number): Promise<ReferralStats> {
    const user = users.get(telegramId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Calculate pending rewards (mock calculation)
    const pendingRewards = Math.floor(Math.random() * 1000000); // Random pending rewards for demo
    
    // Calculate tier progress
    const tierProgress = this.calculateTierProgress(user.totalRewardsEarned);
    
    return {
      totalReferrals: user.totalReferrals,
      totalRewardsEarned: user.totalRewardsEarned,
      pendingRewards,
      tier: user.tier,
              tokenBalance: user.totalRewardsEarned, // Simplified - same as total earned
        tierProgress
    };
  }

  async createClaimRequest(telegramId: number, amount: number, receivingWallet: string): Promise<ClaimRequest & { id: string; status: string; createdAt: Date }> {
    const claimId = `claim_${Date.now()}_${telegramId}`;
    
    const claimRequest = {
      id: claimId,
      telegramId,
      receivingAddress: receivingWallet,
      amount,
      status: 'pending' as const,
      createdAt: new Date()
    };
    
    claimRequests.set(claimId, claimRequest);
    return claimRequest;
  }

  async getClaimRequest(claimId: string): Promise<(ClaimRequest & { id: string; status: string; createdAt: Date }) | null> {
    return claimRequests.get(claimId) || null;
  }

  async updateClaimRequest(claimId: string, updates: Partial<{ status: 'pending' | 'confirmed' | 'failed' }>): Promise<ClaimRequest & { id: string; status: string; createdAt: Date }> {
    const claim = claimRequests.get(claimId);
    if (!claim) {
      throw new Error('Claim request not found');
    }
    
    const updatedClaim = { ...claim, ...updates };
    claimRequests.set(claimId, updatedClaim);
    return updatedClaim;
  }

  async getLeaderboard(limit: number = 10): Promise<UserProfile[]> {
    const allUsers = Array.from(users.values());
    return allUsers
      .filter(user => user.isEligibleForReferrals) // Only show eligible users
      .sort((a, b) => b.totalRewardsEarned - a.totalRewardsEarned)
      .slice(0, limit);
  }

  async getUserStats(telegramId: number): Promise<ReferralStats> {
    return this.getReferralStats(telegramId);
  }

  async submitClaimRequest(claimData: {
    telegramId: number;
    amount: number;
    receivingAddress: string;
  }): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    try {
      const user = users.get(claimData.telegramId);
      if (!user || !user.isEligibleForReferrals) {
        return { success: false, error: 'User not eligible for claims' };
      }

      // Create claim request
      const claim = await this.createClaimRequest(
        claimData.telegramId,
        claimData.amount,
        claimData.receivingAddress
      );
      
      // In production, this would integrate with the smart contract
      // For now, simulate successful claim
      await this.updateClaimRequest(claim.id, { status: 'confirmed' });
      
      return { success: true, transactionId: claim.id };
    } catch (error) {
      console.error('Error submitting claim request:', error);
      return { success: false, error: 'Failed to process claim' };
    }
  }

  async getClaimStatus(telegramId: number, transactionId?: string): Promise<{ status: string; txHash?: string; error?: string }> {
    try {
      if (transactionId) {
        const claim = await this.getClaimRequest(transactionId);
        if (claim) {
          return { 
            status: claim.status,
            txHash: claim.status === 'confirmed' ? `mock_tx_${claim.id}` : undefined
          };
        }
      }
      
      // Return most recent claim for user
      const allClaims = Array.from(claimRequests.values())
        .filter(claim => claim.telegramId === telegramId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      if (allClaims.length > 0) {
        const latestClaim = allClaims[0];
        return {
          status: latestClaim.status,
          txHash: latestClaim.status === 'confirmed' ? `mock_tx_${latestClaim.id}` : undefined
        };
      }
      
      return { status: 'none' };
    } catch (error) {
      console.error('Error getting claim status:', error);
      return { status: 'error', error: 'Failed to get claim status' };
    }
  }

  async setReceivingWallet(telegramId: number, walletAddress: string): Promise<UserProfile> {
    // In new model, user wallet and receiving wallet are the same
    return this.updateUser(telegramId, { userWallet: walletAddress });
  }

  private calculateTierFromHoldings(holdings: number): 'None' | 'Bronze' | 'Silver' | 'Gold' {
    if (holdings >= 10_000_000) return 'Gold';   // 10M tokens
    if (holdings >= 5_000_000) return 'Silver';  // 5M tokens  
    if (holdings >= 1_000_000) return 'Bronze';  // 1M tokens
    return 'None';
  }

  private calculateTierProgress(totalEarned: number): { current: number; next: number; percentage: number } {
    const bronzeThreshold = 100_000;  // 100k tokens earned
    const silverThreshold = 1_000_000; // 1M tokens earned
    const goldThreshold = 10_000_000;  // 10M tokens earned
    
    if (totalEarned >= goldThreshold) {
      return { current: totalEarned, next: goldThreshold, percentage: 100 };
    } else if (totalEarned >= silverThreshold) {
      return { 
        current: totalEarned, 
        next: goldThreshold, 
        percentage: (totalEarned / goldThreshold) * 100 
      };
    } else if (totalEarned >= bronzeThreshold) {
      return { 
        current: totalEarned, 
        next: silverThreshold, 
        percentage: (totalEarned / silverThreshold) * 100 
      };
    } else {
      return { 
        current: totalEarned, 
        next: bronzeThreshold, 
        percentage: (totalEarned / bronzeThreshold) * 100 
      };
    }
  }

  private generateDashboardId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'OTTO-';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private generateRandomCode(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async getAllUsers(): Promise<UserProfile[]> {
    return Array.from(users.values());
  }

  async clearAllData(): Promise<void> {
    users.clear();
    walletSetups.clear();
    claimRequests.clear();
  }
} 