import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
      tierEmoji: userId.includes("pro") ? "PRO" : userId.includes("elite") ? "ELITE" : userId.includes("legend") ? "LEGEND" : "BASIC",
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
      emoji: ["LEGEND", "ELITE", "PRO", "BASIC"][Math.floor(Math.random() * 4)]
    }));

    setUserData(mockUserData);
    setReferrals(mockReferrals);
    setLeaderboard(mockLeaderboard);
    setIsLoading(false);
    setHasSearched(true);
  };

  const handleSearch = () => {
    if (!userIdInput.trim()) {
      toast.error("Please enter a user ID or Telegram username!");
      return;
    }
    fetchUserData(userIdInput);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard! 🎉");
  };

  const resetDashboard = () => {
    setUserData(null);
    setUserIdInput("");
    setHasSearched(false);
    setReferrals([]);
    setLeaderboard([]);
  };

  // Auto-search if dashboard ID is provided
  useEffect(() => {
    if (dashboardId && !hasSearched) {
      setUserIdInput(dashboardId);
      fetchUserData(dashboardId);
    }
  }, [dashboardId, hasSearched]);

  return (
    <div 
      className="min-h-screen relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ 
        backgroundImage: 'url(/newhomepage/1.png)'
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        
        {/* Otto Title */}
        <div className="text-center mb-8">
          <h1 className="text-6xl md:text-8xl font-black text-white mb-4 tracking-wider drop-shadow-2xl">
            $OTTO
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-semibold drop-shadow-lg">
            Dashboard
          </p>
        </div>

        {/* Dashboard Input Section */}
        {!userData && !isLoading && (
          <div className="w-full max-w-md mx-auto">
            <Card className="bg-black/80 backdrop-blur-sm border border-white/20 shadow-2xl">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl text-white flex items-center justify-center">
                  <Search className="w-6 h-6 mr-2" />
                  Access Dashboard
                </CardTitle>
                <CardDescription className="text-white/70">
                  Enter your User ID or Telegram username
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="userId" className="text-white font-medium mb-2 block">
                    User ID / Telegram Username
                  </Label>
                  <Input
                    id="userId"
                    type="text"
                    placeholder="@your_username or OTTO-12345678"
                    value={userIdInput}
                    onChange={(e) => setUserIdInput(e.target.value)}
                    className="bg-white/10 border-white/30 text-white placeholder-white/50 rounded-lg text-lg p-4 focus:border-white/50 backdrop-blur-sm"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black px-6 py-4 text-lg font-bold rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Access Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center">
            <div className="animate-spin w-16 h-16 border-4 border-white border-t-transparent rounded-full mx-auto mb-6"></div>
            <p className="text-white text-xl font-medium drop-shadow-lg">
              Loading your Otto stats...
            </p>
          </div>
        )}

        {/* Dashboard Content */}
        {userData && !isLoading && (
          <div className="w-full max-w-6xl mx-auto space-y-8">
            
            {/* Back Button */}
            <div className="text-center">
              <Button
                onClick={resetDashboard}
                variant="outline"
                className="bg-black/50 border-white/30 text-white hover:bg-black/70 backdrop-blur-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Search Another User
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-black/80 backdrop-blur-sm border border-white/20 shadow-xl">
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                  <div className="text-3xl font-bold text-white">{userData.totalReferrals}</div>
                  <div className="text-sm text-white/70">Total Referrals</div>
                </CardContent>
              </Card>

              <Card className="bg-black/80 backdrop-blur-sm border border-white/20 shadow-xl">
                <CardContent className="p-6 text-center">
                  <Coins className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                  <div className="text-3xl font-bold text-white">${userData.totalEarnings}</div>
                  <div className="text-sm text-white/70">Total Earnings</div>
                </CardContent>
              </Card>

              <Card className="bg-black/80 backdrop-blur-sm border border-white/20 shadow-xl">
                <CardContent className="p-6 text-center">
                  <Star className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                  <div className="text-lg font-bold text-white">{userData.currentTier}</div>
                  <div className="text-sm text-white/70">Current Tier</div>
                </CardContent>
              </Card>

              <Card className="bg-black/80 backdrop-blur-sm border border-white/20 shadow-xl">
                <CardContent className="p-6 text-center">
                  <Trophy className="w-8 h-8 mx-auto mb-2 text-orange-400" />
                  <div className="text-3xl font-bold text-white">#{userData.rank}</div>
                  <div className="text-sm text-white/70">Leaderboard Rank</div>
                </CardContent>
              </Card>
            </div>

            {/* Progress Alert */}
            {userData.nextTierRequirement && (
              <Alert className="bg-black/60 border border-yellow-400/50 backdrop-blur-sm">
                <Zap className="w-4 h-4 text-yellow-400" />
                <AlertDescription className="text-white font-medium">
                  <strong>Almost there!</strong> You need {userData.nextTierRequirement} more referrals to reach the next tier!
                </AlertDescription>
              </Alert>
            )}

            {/* Tabs Section */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-black/50 backdrop-blur-sm border border-white/20">
                <TabsTrigger value="overview" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70">Overview</TabsTrigger>
                <TabsTrigger value="referrals" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70">Referrals</TabsTrigger>
                <TabsTrigger value="leaderboard" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70">Leaderboard</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card className="bg-black/80 backdrop-blur-sm border border-white/20 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <User className="w-6 h-6 mr-2" />
                      Your Otto Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-white font-semibold">Commission Rate</Label>
                        <div className="text-2xl font-bold text-yellow-400">{userData.commissionRate}</div>
                      </div>
                      <div>
                        <Label className="text-white font-semibold">Referral Link</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input 
                            value={userData.referralLink} 
                            readOnly 
                            className="flex-1 bg-white/10 border-white/30 text-white"
                          />
                          <Button 
                            size="sm" 
                            onClick={() => copyToClipboard(userData.referralLink)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-black"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="referrals" className="space-y-6">
                <Card className="bg-black/80 backdrop-blur-sm border border-white/20 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-white">Your Referrals ({referrals.length})</CardTitle>
                    <CardDescription className="text-white/70">People who joined using your referral link</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {referrals.slice(0, 10).map((referral, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <div className="font-semibold text-white">{referral.username}</div>
                              <div className="text-sm text-white/70">Joined {referral.joinDate}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-white">${referral.earnings}</div>
                            <Badge 
                              variant={referral.status === 'Active' ? 'default' : 'secondary'}
                              className={referral.status === 'Active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}
                            >
                              {referral.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="leaderboard" className="space-y-6">
                <Card className="bg-black/80 backdrop-blur-sm border border-white/20 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Trophy className="w-6 h-6 mr-2" />
                      Top Otto Referrers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {leaderboard.map((entry, index) => (
                        <div key={index} className={`flex items-center justify-between p-4 rounded-lg border border-white/20 ${
                          entry.rank <= 3 ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20' : 'bg-white/10'
                        } backdrop-blur-sm`}>
                          <div className="flex items-center space-x-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                              entry.rank === 1 ? 'bg-yellow-500 text-black' :
                              entry.rank === 2 ? 'bg-gray-400 text-black' :
                              entry.rank === 3 ? 'bg-orange-500 text-black' :
                              'bg-gray-600 text-white'
                            }`}>
                              {entry.rank}
                            </div>
                            <div>
                              <div className="font-semibold text-white">{entry.username}</div>
                              <div className="text-sm text-white/70">{entry.tier}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-white">{entry.referrals} referrals</div>
                            <div className="text-sm text-white/70">${entry.earnings}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
