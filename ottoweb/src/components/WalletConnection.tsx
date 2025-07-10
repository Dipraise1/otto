import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, ExternalLink, Copy, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface WalletConnectionProps {
  onWalletConnected?: (walletAddress: string) => void;
}

const WalletConnection = ({ onWalletConnected }: WalletConnectionProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      // Simulate wallet connection - in real app, this would use @solana/wallet-adapter
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockWalletAddress = "7xKWZQhQkpk8h6VqCrBVoQ9FnJkL2mNpQrSt3uVwXyZ4";
      setConnectedWallet(mockWalletAddress);
      onWalletConnected?.(mockWalletAddress);
      toast.success("Wallet connected successfully! 🎉");
    } catch (error) {
      toast.error("Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setConnectedWallet(null);
    toast.success("Wallet disconnected");
  };

  const copyWalletAddress = () => {
    if (connectedWallet) {
      navigator.clipboard.writeText(connectedWallet);
      toast.success("Wallet address copied!");
    }
  };

  if (connectedWallet) {
    return (
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-4 border-green-200/50 text-stone-800 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3 font-serif text-xl tracking-wide">
            <CheckCircle className="w-6 h-6 text-green-700" />
            <span>Wallet Connected</span>
          </CardTitle>
          <CardDescription className="text-stone-600 font-serif">
            Your Solana wallet is connected and ready
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <code className="text-sm bg-stone-100 px-3 py-2 rounded-lg font-mono text-stone-800 border-2 border-stone-200 flex-1 truncate">
              {connectedWallet}
            </code>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={copyWalletAddress}
              className="text-stone-700 hover:bg-green-100/50 border border-green-200/50 rounded-lg"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex space-x-2">
            <Badge className="bg-green-100 text-green-800 border border-green-200">
              ✅ Connected
            </Badge>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={disconnectWallet}
              className="text-stone-700 hover:bg-red-50 border-red-200"
            >
              Disconnect
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-4 border-amber-200/50 text-stone-800 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-3 font-serif text-xl tracking-wide">
          <Wallet className="w-6 h-6 text-amber-700" />
          <span>Connect Your Wallet</span>
        </CardTitle>
        <CardDescription className="text-stone-600 font-serif">
          Connect your Solana wallet to claim rewards and interact with the blockchain
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={connectWallet}
          disabled={isConnecting}
          className="w-full bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800 text-amber-50 font-serif font-medium py-3 rounded-xl shadow-lg border-2 border-amber-300"
        >
          {isConnecting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="w-5 h-5 mr-2" />
              Connect Wallet
            </>
          )}
        </Button>
        
        <div className="text-center space-y-2">
          <p className="text-sm text-stone-600 font-serif">
            Supported wallets: Phantom, Solflare, Backpack
          </p>
          <div className="flex justify-center space-x-2">
            <a 
              href="https://phantom.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm font-serif flex items-center"
            >
              Get Phantom <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletConnection; 