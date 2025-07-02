import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Users, 
  Coins, 
  TrendingUp, 
  Copy, 
  ExternalLink, 
  Star,
  Trophy,
  Zap,
  Search,
  User,
  ArrowLeft,
  Home,
  Menu,
  X,
  ArrowRight
} from "lucide-react";
import { toast } from "sonner";

// Types
interface UserStats {
  totalReferrals: number;
  totalEarnings: number;
  currentTier: string;
  tierEmoji: string;
  commissionRate: string;
  referralLink: string;
  rank: number;
  nextTierRequirement?: number;
}

interface ReferralData {
  username: string;
  joinDate: string;
  earnings: number;
  status: string;
}

interface LeaderboardEntry {
  rank: number;
  username: string;
  referrals: number;
  earnings: number;
  tier: string;
  emoji: string;
}

const Dashboard = () => {
  const { dashboardId } = useParams();
  const [userIdInput, setUserIdInput] = useState("");
  const [userData, setUserData] = useState<UserStats | null>(null);
  const [referrals, setReferrals] = useState<ReferralData[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mock function to simulate API call
  const fetchUserData = async (userId: string) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock data based on user ID
    const mockUserData: UserStats = {
      totalReferrals: Math.floor(Math.random() * 50) + 5,
      totalEarnings: Math.floor(Math.random() * 10000) + 500,
      currentTier: userId.includes("pro") ? "Otter Pro" : userId.includes("elite") ? "Otter Elite" : userId.includes("legend") ? "Otter Legend" : "Otter Newbie",
      tierEmoji: userId.includes("pro") ? "🔥" : userId.includes("elite") ? "💎" : userId.includes("legend") ? "👑" : "🐣",
      commissionRate: userId.includes("pro") ? "10%" : userId.includes("elite") ? "15%" : userId.includes("legend") ? "25%" : "5%",
      referralLink: `https://t.me/OTTOBot?start=${userId}`,
      rank: Math.floor(Math.random() * 100) + 1,
      nextTierRequirement: userId.includes("legend") ? undefined : Math.floor(Math.random() * 20) + 5
    };

    const mockReferrals: ReferralData[] = Array.from({ length: mockUserData.totalReferrals }, (_, i) => ({
      username: `@crypto_fren_${i + 1}`,
      joinDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      earnings: Math.floor(Math.random() * 500) + 50,
      status: Math.random() > 0.3 ? "Active" : "Pending"
    }));

    const mockLeaderboard: LeaderboardEntry[] = Array.from({ length: 10 }, (_, i) => ({
      rank: i + 1,
      username: i === 0 && userData ? userId : `@otter_${i + 1}`,
      referrals: Math.floor(Math.random() * 100) + 10,
      earnings: Math.floor(Math.random() * 20000) + 1000,
      tier: ["Otter Legend", "Otter Elite", "Otter Pro", "Otter Newbie"][Math.floor(Math.random() * 4)],
      emoji: ["👑", "💎", "🔥", "🐣"][Math.floor(Math.random() * 4)]
    }));

    setUserData(mockUserData);
    setReferrals(mockReferrals);
    setLeaderboard(mockLeaderboard);
    setIsLoading(false);
    setHasSearched(true);
  };

  const handleSearch = () => {
    if (!userIdInput.trim()) {
      toast.error("Please enter a user ID!");
      return;
    }
    fetchUserData(userIdInput);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard! 🎉");
  };

  // Auto-search if dashboard ID is provided
  useEffect(() => {
    if (dashboardId && !hasSearched) {
      setUserIdInput(dashboardId);
      fetchUserData(dashboardId);
    }
  }, [dashboardId, hasSearched]);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Image with Parallax - Matching Index Page */}
      <div 
        className="absolute top-0 left-0 right-0 h-screen bg-cover bg-center bg-no-repeat opacity-30"
        style={{ 
          backgroundImage: `url('/9690190-cloudy-mountain-landscape-wallpaper.jpg')`
        }}
      ></div>
      
      {/* Enhanced gradient overlays for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/15 via-transparent to-blue-900/15"></div>
      
      {/* Floating Particles Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-sky-300 rounded-full animate-pulse opacity-80 animation-delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-blue-400 rounded-full animate-pulse opacity-40 animation-delay-2000"></div>
        <div className="absolute top-2/3 right-1/4 w-2 h-2 bg-cyan-300 rounded-full animate-pulse opacity-70 animation-delay-3000"></div>
      </div>

      {/* Navigation - Mobile First Ultra Modern 2025 Style */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-3 sm:p-4 lg:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="backdrop-blur-xl bg-gradient-to-r from-sky-900/80 via-cyan-800/70 to-blue-900/80 rounded-2xl sm:rounded-3xl lg:rounded-full border border-cyan-400/30 shadow-2xl shadow-cyan-500/20">
            <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
              {/* Logo Section - Mobile Optimized */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="relative">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/25 ring-2 ring-cyan-400/30 overflow-hidden">
                    <img 
                      src="/ottoicon.png" 
                      alt="OTTO Icon" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-cyan-300 to-sky-200 bg-clip-text text-transparent tracking-wide">
                    OTTO
                  </span>
                  <span className="text-xs text-cyan-200/70 font-medium -mt-1">
                    Dashboard
                  </span>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <div className="block md:hidden">
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="w-10 h-10 flex items-center justify-center text-cyan-100 hover:text-white transition-all duration-300 rounded-lg hover:bg-cyan-500/10"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>
              </div>

              {/* Navigation Links - Desktop */}
              <div className="hidden md:flex items-center space-x-1">
                {[
                  { name: 'Overview', path: '/dashboard' },
                  { name: 'Referrals', path: '/dashboard' },
                  { name: 'Leaderboard', path: '/dashboard' },
                  { name: 'Profile', path: '/profile' }
                ].map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="px-4 lg:px-6 py-2 lg:py-2.5 text-sm font-medium text-cyan-100 hover:text-white transition-all duration-300 hover:bg-cyan-500/10 rounded-full border border-transparent hover:border-cyan-400/20 hover:shadow-lg hover:shadow-cyan-500/10"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Back to Home Button - Mobile Optimized */}
              <Link to="/" className="hidden md:block">
                <Button className="bg-gradient-to-r from-cyan-700 to-blue-800 hover:from-cyan-600 hover:to-blue-700 text-white px-4 lg:px-6 py-2 lg:py-2.5 text-sm font-semibold rounded-full shadow-lg shadow-cyan-700/25 border border-cyan-600/20 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-600/30">
                  <span className="hidden lg:inline">Back to Home</span>
                  <span className="lg:hidden">Home</span>
                  <ArrowLeft className="w-3 h-3 lg:w-4 lg:h-4 ml-1 lg:ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          {/* Menu Panel */}
          <div className="fixed top-0 left-0 right-0 bg-gradient-to-b from-sky-900/95 via-cyan-800/95 to-blue-900/95 backdrop-blur-xl border-b border-cyan-400/20 shadow-2xl transform transition-all duration-300 ease-out">
            <div className="px-6 py-6 mt-16">
              <div className="flex flex-col space-y-4">
                {[
                  { name: 'Overview', path: '/dashboard' },
                  { name: 'Referrals', path: '/dashboard' },
                  { name: 'Leaderboard', path: '/dashboard' },
                  { name: 'Profile', path: '/profile' }
                ].map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-left py-4 px-6 text-lg font-medium text-cyan-100 hover:text-white hover:bg-cyan-500/10 rounded-xl transition-all duration-300 border border-transparent hover:border-cyan-400/20"
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* Mobile Back to Home in Menu */}
                <div className="pt-4 border-t border-cyan-400/20">
                  <Link 
                    to="/" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block"
                  >
                    <Button className="w-full bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white py-4 text-lg font-semibold rounded-xl shadow-lg">
                      Back to Home
                      <ArrowLeft className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 pt-20 sm:pt-24 lg:pt-28 p-3 sm:p-4 md:p-6 w-full">
        <div className="max-w-7xl mx-auto">
          {/* Dashboard Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 md:mb-12 space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-2xl border-2 border-cyan-400/30 overflow-hidden">
                <img 
                  src="/ottoicon.png" 
                  alt="OTTO Character" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-4xl font-bold bg-gradient-to-r from-cyan-300 to-sky-200 bg-clip-text text-transparent tracking-wide">
                  OTTO Dashboard
                </h1>
                <p className="text-cyan-200 text-xs sm:text-sm md:text-base font-medium">
                  Track your referral empire! 🏆
                </p>
              </div>
            </div>
            
            {userData && (
              <Badge className="backdrop-blur-xl bg-gradient-to-r from-sky-900/70 via-cyan-800/60 to-blue-900/70 text-cyan-100 border border-cyan-400/30 text-xs sm:text-sm md:text-base px-2 sm:px-3 md:px-4 py-1 sm:py-2 font-medium shadow-lg shadow-cyan-500/20 rounded-xl">
                <Trophy className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-2" />
                Rank #{userData.rank}
              </Badge>
            )}
          </div>

          {/* User ID Search */}
          {!userData && (
            <Card className="bg-gradient-to-br from-sky-900/80 via-cyan-800/70 to-blue-900/80 backdrop-blur-xl border border-cyan-400/30 mb-6 sm:mb-8 md:mb-12 rounded-2xl shadow-2xl shadow-cyan-500/20">
              <CardHeader className="p-4 sm:p-6 md:p-8">
                <CardTitle className="text-lg sm:text-xl md:text-2xl text-cyan-300 flex items-center">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-2 sm:mr-3" />
                  Find Your Stats
                </CardTitle>
                <CardDescription className="text-cyan-200 text-sm sm:text-base md:text-lg">
                  Enter your Telegram username or OTTO ID to view your referral stats! 🔍
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 md:p-8 pt-0">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="flex-1">
                    <Label htmlFor="userId" className="text-cyan-200 text-sm sm:text-base font-medium mb-2 block">
                      User ID / Telegram Username
                    </Label>
                    <Input
                      id="userId"
                      value={userIdInput}
                      onChange={(e) => setUserIdInput(e.target.value)}
                      placeholder="@your_username or OTTO-12345678"
                      className="bg-gray-800/50 border border-cyan-400/30 text-white placeholder-cyan-300/50 rounded-xl text-sm sm:text-base md:text-lg p-2 sm:p-3 md:p-4 focus:border-cyan-400/50 backdrop-blur-sm"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button 
                      onClick={handleSearch}
                      disabled={isLoading}
                      className="w-full sm:w-auto bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg font-bold rounded-xl shadow-lg shadow-cyan-600/25 transition-all duration-300 hover:scale-105"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                          Search
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-8 sm:py-12 md:py-16">
              <div className="animate-spin w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 border-4 sm:border-6 md:border-8 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4 sm:mb-6"></div>
              <p className="text-cyan-200 text-base sm:text-lg md:text-xl font-medium">
                Loading your empire stats... 🦦
              </p>
            </div>
          )}

        {/* Main Dashboard Content */}
        {userData && !isLoading && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-12">
              <Card className="bg-gradient-to-br from-sky-900/80 via-cyan-800/70 to-blue-900/80 backdrop-blur-xl border border-cyan-400/30 rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/20">
                <CardHeader className="p-3 sm:p-4 md:p-6 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="p-1.5 sm:p-2 md:p-3 bg-cyan-500/20 rounded-full">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-cyan-400" />
                    </div>
                    <Badge className="text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 bg-cyan-600/20 text-cyan-300 border-cyan-400/30">Total</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">
                    {userData.totalReferrals}
                  </div>
                  <p className="text-cyan-100 text-xs sm:text-sm md:text-base font-medium">
                    Referrals
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-sky-900/80 via-cyan-800/70 to-blue-900/80 backdrop-blur-xl border border-cyan-400/30 rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/20">
                <CardHeader className="p-3 sm:p-4 md:p-6 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="p-1.5 sm:p-2 md:p-3 bg-sky-500/20 rounded-full">
                      <Coins className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-sky-400" />
                    </div>
                    <Badge className="text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 bg-sky-600/20 text-sky-300 border-sky-400/30">$OTTO</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">
                    {userData.totalEarnings.toLocaleString()}
                  </div>
                  <p className="text-cyan-100 text-xs sm:text-sm md:text-base font-medium">
                    Earnings
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-sky-900/80 via-cyan-800/70 to-blue-900/80 backdrop-blur-xl border border-cyan-400/30 rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/20">
                <CardHeader className="p-3 sm:p-4 md:p-6 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="p-1.5 sm:p-2 md:p-3 bg-blue-500/20 rounded-full">
                      <Star className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-400" />
                    </div>
                    <div className="text-lg sm:text-xl md:text-2xl">{userData.tierEmoji}</div>
                  </div>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
                  <div className="text-sm sm:text-base md:text-lg font-bold text-white mb-1">
                    {userData.currentTier}
                  </div>
                  <p className="text-cyan-100 text-xs sm:text-sm md:text-base font-medium">
                    Current Tier
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-sky-900/80 via-cyan-800/70 to-blue-900/80 backdrop-blur-xl border border-cyan-400/30 rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/20">
                <CardHeader className="p-3 sm:p-4 md:p-6 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="p-1.5 sm:p-2 md:p-3 bg-cyan-500/20 rounded-full">
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-cyan-400" />
                    </div>
                    <Badge className="text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 bg-cyan-600/20 text-cyan-300 border-cyan-400/30">Rate</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">
                    {userData.commissionRate}
                  </div>
                  <p className="text-cyan-100 text-xs sm:text-sm md:text-base font-medium">
                    Commission
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Progress Alert */}
            {userData.nextTierRequirement && (
              <Alert className="mb-6 sm:mb-8 md:mb-12 bg-gradient-to-r from-cyan-900/80 to-blue-900/80 border border-cyan-400/40 backdrop-blur-xl rounded-2xl shadow-lg shadow-cyan-500/20">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                <AlertDescription className="text-cyan-100 text-sm sm:text-base md:text-lg font-medium">
                  <strong>So close to the next tier!</strong> You need {userData.nextTierRequirement} more referrals to level up! Keep grinding, fren! 🔥
                </AlertDescription>
              </Alert>
            )}

            {/* Referral Link Section */}
            <Card className="mb-6 sm:mb-8 md:mb-12 bg-gradient-to-br from-sky-900/80 via-cyan-800/70 to-blue-900/80 backdrop-blur-xl border border-cyan-400/30 rounded-2xl shadow-2xl shadow-cyan-500/20">
              <CardHeader className="p-4 sm:p-6 md:p-8">
                <CardTitle className="text-lg sm:text-xl md:text-2xl text-cyan-300 flex items-center">
                  <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:w-6 mr-2 sm:mr-3" />
                  Your Referral Link
                </CardTitle>
                <CardDescription className="text-cyan-200 text-sm sm:text-base md:text-lg">
                  Share this link with your frens to start earning! 💰
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 md:p-8 pt-0">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Input
                    value={userData.referralLink}
                    readOnly
                    className="bg-gray-800/50 border border-cyan-400/30 text-white rounded-xl text-sm sm:text-base md:text-lg p-2 sm:p-3 md:p-4 flex-1 focus:border-cyan-400/50 backdrop-blur-sm"
                  />
                  <Button
                    onClick={() => copyToClipboard(userData.referralLink)}
                    className="w-full sm:w-auto backdrop-blur-xl bg-gradient-to-r from-sky-900/70 via-cyan-800/60 to-blue-900/70 hover:from-sky-900/85 hover:via-cyan-800/75 hover:to-blue-900/85 text-cyan-100 hover:text-white border border-cyan-400/30 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-cyan-500/20"
                  >
                    <Copy className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                    Copy
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tabs Section */}
            <Tabs defaultValue="referrals" className="space-y-4 sm:space-y-6 md:space-y-8">
              <TabsList className="grid w-full grid-cols-2 backdrop-blur-xl bg-gradient-to-r from-sky-900/80 via-cyan-800/70 to-blue-900/80 border border-cyan-400/30 rounded-xl p-1 shadow-lg shadow-cyan-500/20">
                <TabsTrigger 
                  value="referrals" 
                  className="text-xs sm:text-sm md:text-base py-2 sm:py-3 md:py-4 data-[state=active]:bg-sky-900/30 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-cyan-500/20 text-cyan-100 hover:text-white rounded-lg transition-all duration-300"
                >
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:w-5 mr-1 sm:mr-2" />
                  My Referrals ({referrals.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="leaderboard" 
                  className="text-xs sm:text-sm md:text-base py-2 sm:py-3 md:py-4 data-[state=active]:bg-sky-900/30 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-cyan-500/20 text-cyan-100 hover:text-white rounded-lg transition-all duration-300"
                >
                  <Trophy className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:w-5 mr-1 sm:mr-2" />
                  Leaderboard
                </TabsTrigger>
              </TabsList>

              <TabsContent value="referrals" className="space-y-3 sm:space-y-4 md:space-y-6">
                <Card className="bg-gradient-to-br from-sky-900/80 via-cyan-800/70 to-blue-900/80 backdrop-blur-xl border border-cyan-400/30 rounded-2xl shadow-2xl shadow-cyan-500/20">
                  <CardHeader className="p-4 sm:p-6 md:p-8">
                    <CardTitle className="text-lg sm:text-xl md:text-2xl text-cyan-300">
                      Your Referral Army 🦦
                    </CardTitle>
                    <CardDescription className="text-cyan-200 text-sm sm:text-base md:text-lg">
                      Look at all these beautiful frens you've brought to OTTO! 
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 md:p-8 pt-0">
                    <div className="space-y-2 sm:space-y-3 md:space-y-4 max-h-64 sm:max-h-80 md:max-h-96 overflow-y-auto">
                      {referrals.map((referral, index) => (
                        <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 md:p-6 bg-cyan-800/10 backdrop-blur-sm rounded-xl border border-cyan-500/20 space-y-2 sm:space-y-0 hover:bg-cyan-700/20 transition-all duration-300">
                          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
                              <User className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-white font-medium text-sm sm:text-base md:text-lg">
                                {referral.username}
                              </p>
                              <p className="text-cyan-200 text-xs sm:text-sm md:text-base">
                                Joined {referral.joinDate}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3 md:space-x-4">
                            <Badge 
                              className={`text-xs px-2 py-1 ${referral.status === 'Active' ? 'bg-green-500/20 text-green-400 border-green-400/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30'}`}
                            >
                              {referral.status}
                            </Badge>
                            <span className="text-cyan-300 font-bold text-sm sm:text-base md:text-lg">
                              +{referral.earnings} $OTTO
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="leaderboard" className="space-y-3 sm:space-y-4 md:space-y-6">
                <Card className="bg-gradient-to-br from-sky-900/80 via-cyan-800/70 to-blue-900/80 backdrop-blur-xl border border-cyan-400/30 rounded-2xl shadow-2xl shadow-cyan-500/20">
                  <CardHeader className="p-4 sm:p-6 md:p-8">
                    <CardTitle className="text-lg sm:text-xl md:text-2xl text-cyan-300">
                      Top Otters 🏆
                    </CardTitle>
                    <CardDescription className="text-cyan-200 text-sm sm:text-base md:text-lg">
                      The most based referrers in our community!
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 md:p-8 pt-0">
                    <div className="space-y-2 sm:space-y-3 md:space-y-4 max-h-64 sm:max-h-80 md:max-h-96 overflow-y-auto">
                      {leaderboard.map((entry, index) => (
                        <div 
                          key={index} 
                          className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 md:p-6 rounded-xl border space-y-2 sm:space-y-0 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${
                            entry.rank <= 3 
                              ? 'bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border-cyan-400/50 shadow-cyan-500/20 shadow-lg' 
                              : 'bg-cyan-800/10 border-cyan-500/20 hover:bg-cyan-700/20'
                          }`}
                        >
                          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
                            <div className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base md:text-lg ${
                              entry.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black shadow-lg shadow-yellow-500/50' :
                              entry.rank === 2 ? 'bg-gradient-to-r from-gray-300 to-gray-500 text-black shadow-lg shadow-gray-400/50' :
                              entry.rank === 3 ? 'bg-gradient-to-r from-amber-500 to-amber-700 text-black shadow-lg shadow-amber-500/50' :
                              'bg-gradient-to-r from-cyan-600 to-blue-700 text-white'
                            }`}>
                              {entry.rank <= 3 ? entry.emoji : entry.rank}
                            </div>
                            <div>
                              <p className="text-white font-medium text-sm sm:text-base md:text-lg">
                                {entry.username}
                              </p>
                              <p className="text-cyan-200 text-xs sm:text-sm md:text-base">
                                {entry.tier}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3 md:space-x-6 text-right">
                            <div>
                              <p className="text-white font-bold text-sm sm:text-base md:text-lg">
                                {entry.referrals} referrals
                              </p>
                              <p className="text-cyan-300 text-xs sm:text-sm md:text-base">
                                {entry.earnings.toLocaleString()} $OTTO
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* New Search Button */}
            <div className="text-center mt-6 sm:mt-8 md:mt-12">
              <Button 
                onClick={() => {
                  setUserData(null);
                  setUserIdInput("");
                  setHasSearched(false);
                  setReferrals([]);
                  setLeaderboard([]);
                }}
                variant="outline"
                className="backdrop-blur-xl bg-gradient-to-r from-sky-900/70 via-cyan-800/60 to-blue-900/70 hover:from-sky-900/85 hover:via-cyan-800/75 hover:to-blue-900/85 text-cyan-100 hover:text-white border border-cyan-400/30 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-cyan-500/20"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                Search Another User
              </Button>
            </div>
          </>
        )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
