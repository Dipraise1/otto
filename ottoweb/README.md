# OTTO Referral+ Rewards - Web Dashboard

A modern, beautiful web dashboard for the OTTO Referral+ Rewards system built on Solana.

## 🎯 Features

- **Dashboard Analytics**: Real-time referral stats and earnings tracking
- **Tier Management**: Visual tier progression and rewards overview  
- **Referral Links**: Easy sharing and tracking of referral performance
- **Wallet Integration**: Connect with Solana wallets for rewards claiming
- **Mobile Responsive**: Beautiful UI that works on all devices

## 🚀 Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: TailwindCSS + Shadcn UI components
- **State Management**: TanStack Query for server state
- **Routing**: React Router DOM
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form + Zod validation

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📁 Project Structure

```
ottoweb/
├── src/
│   ├── components/ui/     # Shadcn UI components
│   ├── pages/             # Route pages
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   └── main.tsx           # App entry point
├── public/                # Static assets
└── package.json
```

## 🎨 Design System

The dashboard uses a warm, friendly color palette inspired by OTTO's personality:
- **Primary**: Amber/Orange gradients for main actions
- **Secondary**: Stone/Gray for text and backgrounds  
- **Accent**: Yellow highlights for rewards and achievements
- **Typography**: Inter for UI, Playfair Display for headings

## 🔗 Integration

This web dashboard integrates with:
- OTTO Telegram Bot (for user authentication via dashboard IDs)
- Solana blockchain (for real-time wallet and token data)
- Backend API (for referral stats and user management)

## 📱 Responsive Design

The dashboard is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)  
- Mobile (320px - 767px)

## 🚀 Deployment

Build the project and deploy the `dist` folder to your preferred hosting service:

```bash
npm run build
```

The build outputs to `dist/` and is ready for static hosting on services like Vercel, Netlify, or any CDN.
