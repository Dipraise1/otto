export interface UserProfile {
  telegramId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  dashboardId: string;
  userWallet?: string;
  referralCode?: string;
  tier: 'None' | 'Bronze' | 'Silver' | 'Gold';
  totalReferrals: number;
  totalRewardsEarned: number;
  isEligibleForReferrals: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReferralStats {
  totalReferrals: number;
  totalRewardsEarned: number;
  pendingRewards: number;
  tier: 'None' | 'Bronze' | 'Silver' | 'Gold';
  tokenBalance: number;
  tierProgress: {
    current: number;
    next: number;
    percentage: number;
  };
}

export interface GeneratedWallet {
  publicKey: string;
  privateKey: string;
  mnemonic?: string;
}

export interface WalletSetup {
  dashboardId: string;
  generatedWallet: string;
  referralCode: string;
  referralLink: string;
}

export interface WalletConnection {
  address: string;
  signature: string;
  timestamp: number;
}

export interface BotContext {
  telegramId: number;
  user?: UserProfile;
  session?: {
    walletConnection?: WalletConnection;
    pendingAction?: string;
    tempWalletAddress?: string;
    pendingEligibilityCheck?: boolean;
  };
}

export interface CommandResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface TierThresholds {
  bronze: number;
  silver: number;
  gold: number;
}

export interface ClaimRequest {
  telegramId: number;
  receivingAddress: string;
  amount: number;
}

export interface EligibilityCheck {
  isEligible: boolean;
  currentHoldings: number;
  requiredHoldings: number;
  shortfall?: number;
} 