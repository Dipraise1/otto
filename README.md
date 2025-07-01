# OTTO Referral+ Rewards

A sophisticated **non-custodial** referral and rewards system built on Solana, featuring dynamic reward calculations based on token holdings and selling penalties to incentivize long-term commitment.

## 🌟 Key Features

### Non-Custodial Architecture
- **User-controlled wallets**: Users generate wallets in their preferred apps (Phantom, Backpack, Solflare)
- **No private key storage**: System never stores or has access to user private keys
- **Self-sovereign rewards**: Users maintain full control of their earnings

### Holdings-Based Eligibility
- **Minimum holdings requirement**: 1M+ $OTTO tokens required for referral eligibility
- **Real-time verification**: On-chain balance checking via SPL token accounts
- **Anti-gaming measures**: Prevents manipulation by uncommitted users

### Dynamic Reward System
- **Holdings multipliers**: Higher holdings = increased reward rates
  - 1x multiplier: 1M $OTTO (minimum holdings)
  - 1.1x multiplier: 2M $OTTO (2x minimum)
  - 1.25x multiplier: 5M $OTTO (5x minimum)
  - 1.5x multiplier: 10M+ $OTTO (10x+ minimum)
- **Selling penalties**: Token sales reduce reward rates proportionally
- **Holding ratio tracking**: Maintains ratio of current vs. initial holdings

### Professional User Experience
- **Telegram bot integration**: Seamless wallet verification and management
- **Modern React dashboard**: Built with TailwindCSS and Shadcn UI
- **Dashboard ID system**: Wallet-free web access for easy sharing
- **Real-time updates**: Live balance and eligibility checking

## 🏗️ System Architecture

### Components

#### 1. Smart Contract (`programs/otto-referral-rewards/`)
- **Language**: Rust with Anchor framework
- **Features**: 
  - PDA-based account architecture
  - Dynamic reward calculation
  - Holdings verification
  - Anti-abuse mechanisms
  - Event emissions for tracking

#### 2. Telegram Bot (`bot/`)
- **Runtime**: Bun with Grammy framework
- **Features**:
  - Wallet connection flow
  - Eligibility checking
  - Professional messaging
  - Dashboard integration
  - Real-time analytics

#### 3. Web Dashboard (`ottoweb/`)
- **Framework**: React with Vite
- **UI**: TailwindCSS + Shadcn UI components
- **Features**:
  - Responsive design
  - Analytics visualization
  - Social sharing
  - Mobile-first approach

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Rust 1.70+
- Solana CLI tools
- Anchor framework

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Dipraise1/otto.git

   cd otto-referral-rewards
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install bot dependencies
   cd bot && npm install && cd ..
   
   # Install web dependencies
   cd ottoweb && npm install && cd ..
   ```

3. **Environment setup**
   ```bash
   # Copy environment templates
   cp env.example .env
   cp bot/env.example bot/.env
   
   # Configure your environment variables
   # See Configuration section below
   ```

### Configuration

#### Root Environment (`.env`)
```bash
# Solana Configuration
SOLANA_NETWORK=devnet
SOLANA_RPC_URL=https://api.devnet.solana.com
REFERRAL_PROGRAM_ID=your_program_id_here

# Token Configuration  
OTTO_TOKEN_MINT=your_token_mint_here
MIN_HOLDINGS_FOR_REFERRAL=1000000000000  # 1M tokens with decimals

# Reward Configuration
BASE_REWARD_RATE=500  # 5% in basis points
```

#### Bot Environment (`bot/.env`)
```bash
# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token_here

# Solana
SOLANA_RPC_URL=https://api.devnet.solana.com
REFERRAL_PROGRAM_ID=your_program_id_here
OTTO_TOKEN_MINT=your_token_mint_here

# System Configuration
MIN_HOLDINGS_FOR_REFERRAL=1000000000000
BASE_REWARD_RATE=500
```

### Development

```bash
# Start all services in development mode
npm run dev

# Or start individual services
npm run dev:bot      # Telegram bot
npm run dev:web      # React dashboard  
```

### Building

```bash
# Build all components
npm run build

# Build individual components
npm run build:bot    # Bot service
npm run build:web    # Web dashboard
```

## 📊 System Flow

### User Onboarding
1. **Bot interaction**: User starts `/start` command
2. **Wallet setup**: System guides user to create/connect wallet
3. **Holdings verification**: On-chain balance check for eligibility
4. **Referral generation**: Eligible users receive unique referral codes
5. **Dashboard access**: Users get Dashboard ID for web access

### Referral Process  
1. **Share referral link**: Users share personalized referral URLs
2. **New user purchase**: Referred users buy $OTTO tokens
3. **Dynamic calculation**: Smart contract calculates rewards based on:
   - Referrer's current holdings (multiplier effect)
   - Referrer's holding ratio (selling penalty)
   - Purchase volume
4. **Instant distribution**: Rewards transferred immediately on-chain
5. **Tier progression**: Automatic tier updates based on holdings

### Reward Formula
```
base_reward = purchase_amount * base_rate / 10000
holding_adjusted = base_reward * holding_ratio / 10000  
final_reward = holding_adjusted * holdings_multiplier / 10000
```

## 🎯 Deployment Status

### ✅ Completed Components
- [x] **Bot Service**: TypeScript compilation ✓
- [x] **Web Dashboard**: React build successful ✓  
- [x] **Environment Setup**: Configuration templates ✓
- [x] **Project Structure**: Workspace organization ✓
- [x] **Documentation**: Comprehensive README ✓

### ⚠️ In Progress
- [ ] **Smart Contract**: Anchor framework compilation issues
  - Some account constraint configurations need refinement
  - Instruction/function distinction needs clarification
  - Bumps trait implementation for custom structs

### 🔧 Known Issues
1. **Smart Contract**: Requires Anchor framework expertise for final compilation fixes
2. **Dependencies**: Some Anchor version compatibility considerations
3. **Testing**: Unit tests need to be implemented

## 🛡️ Security Features

### Anti-Abuse Mechanisms
- **Minimum holdings gate**: Prevents spam from low-commitment users
- **Self-referral prevention**: On-chain validation prevents gaming
- **Selling penalties**: Discourages pump-and-dump behavior
- **Holdings verification**: Real-time on-chain balance checking

### Web3 Principles
- **Non-custodial**: Users maintain full control of assets
- **Transparent**: All logic on-chain and auditable
- **Decentralized**: No central authority over user funds
- **Permissionless**: Open participation within system rules

## 📈 Analytics & Monitoring

### Dashboard Metrics
- Total referrals processed
- Rewards distributed  
- User tier distribution
- Holdings-based performance
- Retention analytics

### Bot Analytics
- User engagement rates
- Wallet connection success
- Eligibility conversion rates
- Command usage patterns

#

### Development Guidelines
- Follow TypeScript/Rust best practices
- Add tests for new functionality
- Update documentation for changes
- Ensure security considerations

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Solana Foundation** for the robust blockchain infrastructure
- **Anchor Framework** for simplified Solana development
- **Grammy** for the excellent Telegram bot framework
- **Shadcn UI** for beautiful, accessible components
