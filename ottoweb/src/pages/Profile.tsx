import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { 
  User,
  Settings,
  Bell,
  Shield,
  Wallet,
  Edit,
  Save,
  ArrowLeft,
  Menu,
  X,
  Trophy,
  Star,
  TrendingUp,
  Copy,
  Check
} from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: "@crypto_otter_pro",
    displayName: "Crypto Otter Pro",
    email: "otter.pro@example.com",
    bio: "Professional meme token trader and OTTO enthusiast. Building the future of DeFi, one otter at a time!",
    twitter: "@cryptootterpro",
    telegram: "@cryptootterpro",
    walletAddress: "0x1234567890123456789012345678901234567890"
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    tradingAlerts: true,
    weeklyReport: true,
    privacyMode: false,
    twoFactorAuth: true
  });

  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Profile updated successfully! 🎉");
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success(`${field} copied to clipboard! 📋`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSettingChange = (setting: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
    toast.success(`${setting.replace(/([A-Z])/g, ' $1').toLowerCase()} ${value ? 'enabled' : 'disabled'}!`);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Image with Parallax - Matching Dashboard */}
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
                  <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-cyan-300 to-sky-200 bg-clip-text text-transparent tracking-wide font-bubble">
                    OTTO
                  </span>
                  <span className="text-xs text-cyan-200/70 font-medium -mt-1">
                    Profile
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
                  { name: 'Dashboard', path: '/dashboard' },
                  { name: 'Referrals', path: '/dashboard' },
                  { name: 'Leaderboard', path: '/dashboard' },
                  { name: 'Profile', path: '/profile', active: true }
                ].map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`px-4 lg:px-6 py-2 lg:py-2.5 text-sm font-medium transition-all duration-300 rounded-full border ${
                      item.active 
                        ? 'text-white bg-cyan-500/20 border-cyan-400/30 shadow-lg shadow-cyan-500/20' 
                        : 'text-cyan-100 hover:text-white hover:bg-cyan-500/10 border-transparent hover:border-cyan-400/20'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Back to Dashboard Button - Mobile Optimized */}
              <Link to="/dashboard" className="hidden md:block">
                <Button className="bg-gradient-to-r from-cyan-700 to-blue-800 hover:from-cyan-600 hover:to-blue-700 text-white px-4 lg:px-6 py-2 lg:py-2.5 text-sm font-semibold rounded-full shadow-lg shadow-cyan-700/25 border border-cyan-600/20 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-600/30">
                  <span className="hidden lg:inline">Dashboard</span>
                  <span className="lg:hidden">Back</span>
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
                  { name: 'Dashboard', path: '/dashboard' },
                  { name: 'Referrals', path: '/dashboard' },
                  { name: 'Leaderboard', path: '/dashboard' },
                  { name: 'Profile', path: '/profile', active: true }
                ].map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-left py-4 px-6 text-lg font-medium rounded-xl transition-all duration-300 border ${
                      item.active
                        ? 'text-white bg-cyan-500/20 border-cyan-400/30'
                        : 'text-cyan-100 hover:text-white hover:bg-cyan-500/10 border-transparent hover:border-cyan-400/20'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* Mobile Back to Dashboard in Menu */}
                <div className="pt-4 border-t border-cyan-400/20">
                  <Link 
                    to="/dashboard" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block"
                  >
                    <Button className="w-full bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white py-4 text-lg font-semibold rounded-xl shadow-lg">
                      Back to Dashboard
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
          {/* Profile Header */}
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
                <h1 className="text-xl sm:text-2xl md:text-4xl font-bold bg-gradient-to-r from-cyan-300 to-sky-200 bg-clip-text text-transparent tracking-wide font-display">
                  User Profile
                </h1>
                <p className="text-cyan-200 text-xs sm:text-sm md:text-base font-medium">
                  Manage your account and preferences 👤
                </p>
              </div>
            </div>
            
            <Button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="backdrop-blur-xl bg-gradient-to-r from-sky-900/70 via-cyan-800/60 to-blue-900/70 hover:from-sky-900/85 hover:via-cyan-800/75 hover:to-blue-900/85 text-cyan-100 hover:text-white border border-cyan-400/30 text-xs sm:text-sm md:text-base px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 font-medium shadow-lg shadow-cyan-500/20 rounded-xl transition-all duration-300 hover:scale-105"
            >
              {isEditing ? (
                <>
                  <Save className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-2" />
                  Save Changes
                </>
              ) : (
                <>
                  <Edit className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-2" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>

          {/* Profile Content */}
          <Tabs defaultValue="profile" className="space-y-4 sm:space-y-6 md:space-y-8">
            <TabsList className="grid w-full grid-cols-3 backdrop-blur-xl bg-gradient-to-r from-sky-900/80 via-cyan-800/70 to-blue-900/80 border border-cyan-400/30 rounded-xl p-1 shadow-lg shadow-cyan-500/20">
              <TabsTrigger 
                value="profile" 
                className="text-xs sm:text-sm md:text-base py-2 sm:py-3 md:py-4 data-[state=active]:bg-sky-900/30 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-cyan-500/20 text-cyan-100 hover:text-white rounded-lg transition-all duration-300"
              >
                <User className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:w-5 mr-1 sm:mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="text-xs sm:text-sm md:text-base py-2 sm:py-3 md:py-4 data-[state=active]:bg-sky-900/30 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-cyan-500/20 text-cyan-100 hover:text-white rounded-lg transition-all duration-300"
              >
                <Settings className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:w-5 mr-1 sm:mr-2" />
                Settings
              </TabsTrigger>
              <TabsTrigger 
                value="achievements" 
                className="text-xs sm:text-sm md:text-base py-2 sm:py-3 md:py-4 data-[state=active]:bg-sky-900/30 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-cyan-500/20 text-cyan-100 hover:text-white rounded-lg transition-all duration-300"
              >
                <Trophy className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:w-5 mr-1 sm:mr-2" />
                Achievements
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-4 sm:space-y-6 md:space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                
                {/* Profile Information */}
                <Card className="bg-gradient-to-br from-sky-900/80 via-cyan-800/70 to-blue-900/80 backdrop-blur-xl border border-cyan-400/30 rounded-2xl shadow-2xl shadow-cyan-500/20">
                  <CardHeader className="p-4 sm:p-6 md:p-8">
                    <CardTitle className="text-lg sm:text-xl md:text-2xl text-cyan-300 flex items-center">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-2 sm:mr-3" />
                      Profile Information
                    </CardTitle>
                    <CardDescription className="text-cyan-200 text-sm sm:text-base md:text-lg">
                      Your personal details and public information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 md:p-8 pt-0 space-y-4 sm:space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-cyan-200 text-sm font-medium mb-2 block">Username</Label>
                        <Input
                          value={profileData.username}
                          onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                          disabled={!isEditing}
                          className="bg-gray-800/50 border border-cyan-400/30 text-white placeholder-cyan-300/50 rounded-xl text-sm sm:text-base p-2 sm:p-3 focus:border-cyan-400/50 backdrop-blur-sm"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-cyan-200 text-sm font-medium mb-2 block">Display Name</Label>
                        <Input
                          value={profileData.displayName}
                          onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                          disabled={!isEditing}
                          className="bg-gray-800/50 border border-cyan-400/30 text-white placeholder-cyan-300/50 rounded-xl text-sm sm:text-base p-2 sm:p-3 focus:border-cyan-400/50 backdrop-blur-sm"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-cyan-200 text-sm font-medium mb-2 block">Email</Label>
                        <Input
                          value={profileData.email}
                          onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                          disabled={!isEditing}
                          className="bg-gray-800/50 border border-cyan-400/30 text-white placeholder-cyan-300/50 rounded-xl text-sm sm:text-base p-2 sm:p-3 focus:border-cyan-400/50 backdrop-blur-sm"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-cyan-200 text-sm font-medium mb-2 block">Bio</Label>
                        <textarea
                          value={profileData.bio}
                          onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                          disabled={!isEditing}
                          rows={3}
                          className="w-full bg-gray-800/50 border border-cyan-400/30 text-white placeholder-cyan-300/50 rounded-xl text-sm sm:text-base p-2 sm:p-3 focus:border-cyan-400/50 backdrop-blur-sm resize-none"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Social & Wallet Information */}
                <Card className="bg-gradient-to-br from-sky-900/80 via-cyan-800/70 to-blue-900/80 backdrop-blur-xl border border-cyan-400/30 rounded-2xl shadow-2xl shadow-cyan-500/20">
                  <CardHeader className="p-4 sm:p-6 md:p-8">
                    <CardTitle className="text-lg sm:text-xl md:text-2xl text-cyan-300 flex items-center">
                      <Wallet className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-2 sm:mr-3" />
                      Connected Accounts
                    </CardTitle>
                    <CardDescription className="text-cyan-200 text-sm sm:text-base md:text-lg">
                      Your social media and wallet connections
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 md:p-8 pt-0 space-y-4 sm:space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-cyan-200 text-sm font-medium mb-2 block">Twitter Handle</Label>
                        <Input
                          value={profileData.twitter}
                          onChange={(e) => setProfileData(prev => ({ ...prev, twitter: e.target.value }))}
                          disabled={!isEditing}
                          className="bg-gray-800/50 border border-cyan-400/30 text-white placeholder-cyan-300/50 rounded-xl text-sm sm:text-base p-2 sm:p-3 focus:border-cyan-400/50 backdrop-blur-sm"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-cyan-200 text-sm font-medium mb-2 block">Telegram Username</Label>
                        <Input
                          value={profileData.telegram}
                          onChange={(e) => setProfileData(prev => ({ ...prev, telegram: e.target.value }))}
                          disabled={!isEditing}
                          className="bg-gray-800/50 border border-cyan-400/30 text-white placeholder-cyan-300/50 rounded-xl text-sm sm:text-base p-2 sm:p-3 focus:border-cyan-400/50 backdrop-blur-sm"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-cyan-200 text-sm font-medium mb-2 block">Wallet Address</Label>
                        <div className="flex gap-2">
                          <Input
                            value={profileData.walletAddress}
                            disabled
                            className="bg-gray-800/50 border border-cyan-400/30 text-white rounded-xl text-sm sm:text-base p-2 sm:p-3 flex-1"
                          />
                          <Button
                            onClick={() => copyToClipboard(profileData.walletAddress, 'Wallet Address')}
                            className="backdrop-blur-xl bg-gradient-to-r from-sky-900/70 via-cyan-800/60 to-blue-900/70 hover:from-sky-900/85 hover:via-cyan-800/75 hover:to-blue-900/85 text-cyan-100 hover:text-white border border-cyan-400/30 px-3 py-2 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-cyan-500/20"
                          >
                            {copiedField === 'Wallet Address' ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-4 sm:space-y-6 md:space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                
                {/* Notification Settings */}
                <Card className="bg-gradient-to-br from-sky-900/80 via-cyan-800/70 to-blue-900/80 backdrop-blur-xl border border-cyan-400/30 rounded-2xl shadow-2xl shadow-cyan-500/20">
                  <CardHeader className="p-4 sm:p-6 md:p-8">
                    <CardTitle className="text-lg sm:text-xl md:text-2xl text-cyan-300 flex items-center">
                      <Bell className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-2 sm:mr-3" />
                      Notifications
                    </CardTitle>
                    <CardDescription className="text-cyan-200 text-sm sm:text-base md:text-lg">
                      Configure your notification preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 md:p-8 pt-0 space-y-4 sm:space-y-6">
                    <div className="space-y-4">
                      {[
                        { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive updates via email' },
                        { key: 'pushNotifications', label: 'Push Notifications', description: 'Browser push notifications' },
                        { key: 'tradingAlerts', label: 'Trading Alerts', description: 'Important market updates' },
                        { key: 'weeklyReport', label: 'Weekly Report', description: 'Performance summary emails' }
                      ].map((setting) => (
                        <div key={setting.key} className="flex items-center justify-between p-3 bg-cyan-800/10 backdrop-blur-sm rounded-xl border border-cyan-500/20">
                          <div>
                            <p className="text-white font-medium text-sm sm:text-base">{setting.label}</p>
                            <p className="text-cyan-200 text-xs sm:text-sm">{setting.description}</p>
                          </div>
                          <Switch
                            checked={settings[setting.key as keyof typeof settings] as boolean}
                            onCheckedChange={(checked) => handleSettingChange(setting.key, checked)}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Security Settings */}
                <Card className="bg-gradient-to-br from-sky-900/80 via-cyan-800/70 to-blue-900/80 backdrop-blur-xl border border-cyan-400/30 rounded-2xl shadow-2xl shadow-cyan-500/20">
                  <CardHeader className="p-4 sm:p-6 md:p-8">
                    <CardTitle className="text-lg sm:text-xl md:text-2xl text-cyan-300 flex items-center">
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-2 sm:mr-3" />
                      Security
                    </CardTitle>
                    <CardDescription className="text-cyan-200 text-sm sm:text-base md:text-lg">
                      Protect your account and privacy
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 md:p-8 pt-0 space-y-4 sm:space-y-6">
                    <div className="space-y-4">
                      {[
                        { key: 'twoFactorAuth', label: 'Two-Factor Authentication', description: 'Enhanced account security' },
                        { key: 'privacyMode', label: 'Privacy Mode', description: 'Hide profile from public view' }
                      ].map((setting) => (
                        <div key={setting.key} className="flex items-center justify-between p-3 bg-cyan-800/10 backdrop-blur-sm rounded-xl border border-cyan-500/20">
                          <div>
                            <p className="text-white font-medium text-sm sm:text-base">{setting.label}</p>
                            <p className="text-cyan-200 text-xs sm:text-sm">{setting.description}</p>
                          </div>
                          <Switch
                            checked={settings[setting.key as keyof typeof settings] as boolean}
                            onCheckedChange={(checked) => handleSettingChange(setting.key, checked)}
                          />
                        </div>
                      ))}
                      
                      <div className="pt-4 border-t border-cyan-400/20">
                        <Button className="w-full backdrop-blur-xl bg-gradient-to-r from-red-900/70 via-red-800/60 to-red-900/70 hover:from-red-900/85 hover:via-red-800/75 hover:to-red-900/85 text-red-100 hover:text-white border border-red-400/30 py-3 text-sm font-medium rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-red-500/20">
                          Change Password
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="space-y-4 sm:space-y-6 md:space-y-8">
              <Card className="bg-gradient-to-br from-sky-900/80 via-cyan-800/70 to-blue-900/80 backdrop-blur-xl border border-cyan-400/30 rounded-2xl shadow-2xl shadow-cyan-500/20">
                <CardHeader className="p-4 sm:p-6 md:p-8">
                  <CardTitle className="text-lg sm:text-xl md:text-2xl text-cyan-300 flex items-center">
                    <Trophy className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-2 sm:mr-3" />
                    Your Achievements
                  </CardTitle>
                  <CardDescription className="text-cyan-200 text-sm sm:text-base md:text-lg">
                    Milestones and badges you've earned in the OTTO ecosystem
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 md:p-8 pt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {[
                          { title: 'First Referral', description: 'Made your first successful referral', icon: '•', earned: true, date: '2024-01-15' },
    { title: 'Rising Star', description: 'Reached 10 referrals', icon: '•', earned: true, date: '2024-01-28' },
                                              { title: 'Community Builder', description: 'Reached 25 referrals', icon: '•', earned: true, date: '2024-02-10' },
                      { title: 'Otter Elite', description: 'Joined the elite tier', icon: '•', earned: true, date: '2024-02-20' },
                                              { title: 'Top Performer', description: 'Finish in top 10 of monthly leaderboard', icon: '•', earned: false, requirement: '3 more referrals' },
                        { title: 'Otter Legend', description: 'Reach the legendary tier', icon: '•', earned: false, requirement: '15 more referrals' }
                    ].map((achievement, index) => (
                      <div 
                        key={index}
                        className={`p-4 sm:p-6 rounded-xl border transition-all duration-300 hover:scale-105 ${
                          achievement.earned
                            ? 'bg-cyan-800/20 border-cyan-400/30 shadow-lg shadow-cyan-500/20'
                            : 'bg-gray-800/20 border-gray-600/30 opacity-60'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{achievement.icon}</div>
                          <h3 className="text-white font-bold text-sm sm:text-base mb-1 sm:mb-2">{achievement.title}</h3>
                          <p className="text-cyan-200 text-xs sm:text-sm mb-2 sm:mb-3">{achievement.description}</p>
                          {achievement.earned ? (
                            <Badge className="bg-green-500/20 text-green-400 border-green-400/30 text-xs">
                              Earned {achievement.date}
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-600/20 text-gray-400 border-gray-500/30 text-xs">
                              {achievement.requirement}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile; 