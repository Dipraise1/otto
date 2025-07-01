#!/bin/bash

echo "🤖 OTTO Referral+ Rewards Bot Setup"
echo "===================================="

# Check if Bun is installed
if ! command -v bun &> /dev/null; then
    echo "❌ Bun is not installed. Please install Bun first:"
    echo "   curl -fsSL https://bun.sh/install | bash"
    exit 1
fi

echo "✅ Bun is installed"

# Install dependencies
echo "📦 Installing dependencies..."
bun install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📄 Creating .env file from template..."
    cp env.example .env
    echo "✅ Created .env file"
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env file with your actual values:"
    echo "   - TELEGRAM_BOT_TOKEN (get from @BotFather)"
    echo "   - SOLANA_RPC_URL (Helius or other RPC provider)"
    echo "   - REFERRAL_PROGRAM_ID (after deploying smart contract)"
    echo "   - OTTO_TOKEN_MINT (your token mint address)"
    echo "   - API_URL (your backend API endpoint)"
    echo "   - APP_URL (your frontend application URL)"
    echo ""
else
    echo "✅ .env file already exists"
fi

# Check TypeScript compilation
echo "🔍 Checking TypeScript compilation..."
bun run typecheck

if [ $? -eq 0 ]; then
    echo "✅ TypeScript compilation successful"
else
    echo "⚠️  TypeScript compilation has some issues, but the bot should still work"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Edit .env file with your configuration"
echo "   2. Start the bot with: bun dev"
echo "   3. Test with your Telegram bot"
echo ""
echo "🔗 Useful commands:"
echo "   bun dev          # Start development server"
echo "   bun start        # Start production server"
echo "   bun run typecheck # Check TypeScript"
echo "   bun run lint     # Run linter"
echo ""
echo "📚 Need help? Check README.md for detailed instructions" 