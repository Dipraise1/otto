import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

// Simpler Counter Animation Hook
const useCountUp = (end: number, duration: number = 2000, shouldStart: boolean = false) => {
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (!shouldStart || isAnimating) return;
    
    setIsAnimating(true);
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.floor(easeOut * end);
      
      setCount(currentCount);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
        setIsAnimating(false);
      }
    };
    
    requestAnimationFrame(animate);
  }, [end, duration, shouldStart, isAnimating]);
  
  return count;
};

// Intersection Observer Hook for triggering animations
const useIntersectionObserver = (ref: React.RefObject<Element>, options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, { threshold: 0.1, ...options });
    
    observer.observe(element);
    
    return () => observer.disconnect();
  }, [ref, options]);
  
  return isIntersecting;
};

const Index = () => {
  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Stats animation refs and state
  const statsRef = useRef<HTMLDivElement>(null);
  const isStatsVisible = useIntersectionObserver(statsRef, { threshold: 0.3 });
  const [hasStarted, setHasStarted] = useState(false);
  
  // Trigger animation when visible for the first time
  useEffect(() => {
    if (isStatsVisible && !hasStarted) {
      setHasStarted(true);
    }
  }, [isStatsVisible, hasStarted]);
  
  // Counter animations
  const followersCount = useCountUp(25, 2000, hasStarted);
  const membersCount = useCountUp(15, 2200, hasStarted);
  const holdersCount = useCountUp(50, 2400, hasStarted);

  // Enhanced Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const windowHeight = window.innerHeight;
      
      // Main character parallax
      const parallaxElements = document.querySelectorAll('.parallax-image');
      parallaxElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + scrolled;
        const elementHeight = rect.height;
        const rate = (scrolled - elementTop + windowHeight) / (windowHeight + elementHeight);
        const yPos = -(scrolled * 0.3);
        (element as HTMLElement).style.transform = `translate3d(0, ${yPos}px, 0) scale(1.05)`;
      });
      
      // Background parallax layers
      const parallaxBg1 = document.querySelectorAll('.parallax-bg-slow');
      parallaxBg1.forEach((element) => {
        const yPos = -(scrolled * 0.2);
        (element as HTMLElement).style.transform = `translate3d(0, ${yPos}px, 0)`;
      });
      
      const parallaxBg2 = document.querySelectorAll('.parallax-bg-fast');
      parallaxBg2.forEach((element) => {
        const yPos = -(scrolled * 0.6);
        (element as HTMLElement).style.transform = `translate3d(0, ${yPos}px, 0)`;
      });
      
      // Floating elements
      const floatingElements = document.querySelectorAll('.floating-element');
      floatingElements.forEach((element, index) => {
        const speed = 0.1 + (index % 3) * 0.1;
        const xOffset = Math.sin(scrolled * 0.001 + index) * 20;
        const yPos = -(scrolled * speed);
        (element as HTMLElement).style.transform = `translate3d(${xOffset}px, ${yPos}px, 0)`;
      });
      
      // Section parallax
      const sectionElements = document.querySelectorAll('.section-parallax');
      sectionElements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        if (rect.top < windowHeight && rect.bottom > 0) {
          const rate = (scrolled - rect.top) / windowHeight;
          const yPos = -(rate * 50);
          (element as HTMLElement).style.transform = `translate3d(0, ${yPos}px, 0)`;
        }
      });
      
      // Opacity effects based on scroll
      const fadeElements = document.querySelectorAll('.scroll-fade');
      fadeElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top;
        const opacity = Math.max(0, Math.min(1, 1 - (elementTop - windowHeight * 0.8) / (windowHeight * 0.4)));
        (element as HTMLElement).style.opacity = opacity.toString();
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background with blue theme */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-black to-black"></div>
      
      {/* Enhanced gradient overlays for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/10 via-transparent to-blue-900/10"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/5 via-transparent to-cyan-900/5"></div>

              {/* Enhanced Floating Particles/Stars Effect with Parallax */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="floating-element absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse opacity-60"></div>
        <div className="floating-element absolute top-1/3 right-1/3 w-1 h-1 bg-sky-300 rounded-full animate-pulse opacity-80 animation-delay-1000"></div>
        <div className="floating-element absolute bottom-1/4 left-1/3 w-3 h-3 bg-blue-400 rounded-full animate-pulse opacity-40 animation-delay-2000"></div>
        <div className="floating-element absolute top-2/3 right-1/4 w-2 h-2 bg-cyan-300 rounded-full animate-pulse opacity-70 animation-delay-3000"></div>
        <div className="floating-element absolute top-1/2 left-1/6 w-1 h-1 bg-sky-400 rounded-full animate-pulse opacity-50 animation-delay-4000"></div>
        
        {/* More floating elements for enhanced parallax depth */}
        <div className="floating-element absolute top-1/5 right-1/2 w-2 h-2 bg-cyan-500 rounded-full animate-pulse opacity-30 animation-delay-5000"></div>
        <div className="floating-element absolute bottom-1/3 right-1/5 w-1 h-1 bg-sky-400 rounded-full animate-pulse opacity-60 animation-delay-6000"></div>
        <div className="floating-element absolute top-3/4 left-2/3 w-3 h-3 bg-blue-300 rounded-full animate-pulse opacity-40 animation-delay-7000"></div>
        
        {/* Additional parallax background elements */}
        <div className="parallax-bg-slow absolute -top-32 left-1/5 w-96 h-96 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl"></div>
        <div className="parallax-bg-fast absolute top-1/4 right-1/5 w-64 h-64 bg-gradient-to-r from-sky-400/8 to-cyan-400/8 rounded-full blur-2xl"></div>
        <div className="parallax-bg-slow absolute bottom-1/4 left-1/2 w-48 h-48 bg-gradient-to-r from-blue-400/6 to-cyan-400/6 rounded-full blur-3xl"></div>
        <div className="parallax-bg-fast absolute top-1/2 left-1/4 w-72 h-72 bg-gradient-to-r from-cyan-400/4 to-sky-400/4 rounded-full blur-3xl"></div>
        <div className="parallax-bg-slow absolute bottom-1/3 right-1/3 w-56 h-56 bg-gradient-to-r from-blue-500/3 to-cyan-500/3 rounded-full blur-2xl"></div>
      </div>

      {/* Navigation - Mobile First Ultra Modern 2025 Style */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-3 sm:p-4 lg:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="backdrop-blur-xl bg-gradient-to-r from-sky-900/30 via-cyan-800/25 to-blue-900/30 rounded-2xl sm:rounded-3xl lg:rounded-full border-2 border-black shadow-2xl shadow-cyan-500/20">
            <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between border border-black/50 rounded-2xl sm:rounded-3xl lg:rounded-full">
              {/* Logo Section - Mobile Optimized */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="relative">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/25 ring-2 ring-black border-2 border-black overflow-hidden">
                    <img 
                      src="/ottoicon.png" 
                      alt="OTTO Icon" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-cyan-400 rounded-full animate-pulse border border-black"></div>
                </div>
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-cyan-300 to-sky-200 bg-clip-text text-transparent tracking-wide">
                  OTTO
                </span>
              </div>

              {/* Mobile Menu Button */}
              <div className="block md:hidden">
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="w-10 h-10 flex items-center justify-center text-cyan-100 hover:text-white transition-all duration-300 rounded-lg hover:bg-cyan-500/10 border-2 border-black/70 hover:border-black"
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
                {['About', 'Features', 'Rewards', 'Community'].map((item, index) => (
                  <button
                    key={item}
                    className="px-4 lg:px-6 py-2 lg:py-2.5 text-sm font-medium text-cyan-100 hover:text-white transition-all duration-300 hover:bg-cyan-500/10 rounded-full border-2 border-black/70 hover:border-black hover:shadow-lg hover:shadow-cyan-500/10"
                  >
                    {item}
                  </button>
                ))}
              </div>

              {/* CTA Button - Mobile Optimized */}
              <Link to="/dashboard" className="hidden md:block">
                <Button className="bg-gradient-to-r from-cyan-700 to-blue-800 hover:from-cyan-600 hover:to-blue-700 text-white px-4 lg:px-6 py-2 lg:py-2.5 text-sm font-semibold rounded-full shadow-lg shadow-cyan-700/25 border-2 border-black transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-600/30">
                  <span className="hidden lg:inline">Launch App</span>
                  <span className="lg:hidden">Launch</span>
                  <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4 ml-1 lg:ml-2" />
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
                {['About', 'Features', 'Rewards', 'Community'].map((item) => (
                  <button
                    key={item}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-left py-4 px-6 text-lg font-medium text-cyan-100 hover:text-white hover:bg-cyan-500/10 rounded-xl transition-all duration-300 border border-transparent hover:border-cyan-400/20"
                  >
                    {item}
                  </button>
                ))}
                
                {/* Mobile CTA in Menu */}
                <div className="pt-4 border-t border-cyan-400/20">
                  <Link 
                    to="/dashboard" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block"
                  >
                    <Button className="w-full bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white py-4 text-lg font-semibold rounded-xl shadow-lg">
                      Launch App
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section - Blue Style */}
      <section className="relative z-10 min-h-screen overflow-hidden fixed-bg-section"
        style={{
          backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.9), rgba(8, 145, 178, 0.9), rgba(29, 78, 216, 0.9)), url('/13-138775_blue-wave-png-wave.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat'
        }}>
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-400/15 to-sky-400/15 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-300/10 to-blue-300/10 rounded-full blur-2xl"></div>
          
          {/* Floating particles */}
          <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-cyan-400/60 rounded-full animate-pulse"></div>
          <div className="absolute top-3/4 right-1/6 w-2 h-2 bg-blue-400/40 rounded-full animate-pulse animation-delay-1000"></div>
          <div className="absolute top-1/2 left-1/6 w-4 h-4 bg-sky-300/30 rounded-full animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-cyan-300/50 rounded-full animate-pulse animation-delay-3000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-24 sm:pt-32 pb-16 sm:pb-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[75vh] sm:min-h-[80vh]">
            {/* Left Content */}
            <div className="space-y-6 sm:space-y-8">
              {/* Social Links Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="flex items-center gap-2 sm:gap-3">
                  <a href="#" className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all duration-300">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all duration-300">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all duration-300">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0190 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z"/>
                    </svg>
                  </a>
                </div>
                <div className="bg-green-400 text-black px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold">
                  OTTOPAPER
                </div>
              </div>
              
                             {/* Main Heading */}
               <div className="space-y-4 sm:space-y-6">
                 <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-none">
                   Make<br />
                   Memes<br />
                   <span className="text-cyan-300">Fun</span><br />
                   Again.
                 </h1>
                
                <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-medium max-w-lg">
                  A community-driven meme token delivering otter-ly amazing rewards on Solana.
                </p>
              </div>
              
              {/* Contract Address */}
              <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border-2 border-black overflow-hidden">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 10.93C16.16 26.74 20 22.55 20 17V7l-10-5z"/>
                </svg>
                <span className="text-white font-mono text-xs sm:text-sm md:text-base tracking-wide truncate min-w-0">
                  0x7528BD0F620d1568c307cc8d5db481A29E8d4E37
                </span>
              </div>
              
                             {/* Buy Buttons */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white border-2 border-black px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-bold rounded-2xl transition-all duration-300 hover:scale-105 shadow-xl flex items-center justify-center">
                   <span className="hidden sm:inline mr-2 sm:mr-3">BUY ON</span>
                   <img src="https://raw.githubusercontent.com/raydium-io/media-assets/master/logo.svg" alt="Raydium" className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                   <span>Raydium</span>
                 </Button>
                 
                 <Button className="bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-500 hover:to-cyan-600 text-white border-2 border-black px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-bold rounded-2xl transition-all duration-300 hover:scale-105 shadow-xl flex items-center justify-center">
                   <span className="hidden sm:inline mr-2 sm:mr-3">BUY ON</span>
                   <img src="/orca-logo.png" alt="Orca" className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                   <span>Orca</span>
                 </Button>
               </div>
               
               {/* Info Buttons */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <Button className="bg-sky-500 hover:bg-sky-600 text-white px-3 sm:px-6 py-3 text-sm sm:text-base font-semibold rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center border-2 border-black">
                   <img src="https://coinmarketcap.com/favicon.ico" alt="CoinMarketCap" className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                   <span className="hidden xs:inline">CoinMarketCap</span>
                   <span className="xs:hidden">CMC</span>
                 </Button>
                 
                 <Button className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 sm:px-6 py-3 text-sm sm:text-base font-semibold rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center border-2 border-black">
                   <img src="https://www.coingecko.com/favicon.ico" alt="CoinGecko" className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                   CoinGecko
                 </Button>
               </div>
            </div>
            
            {/* Right Content - OTTO Character */}
            <div className="relative">
              <div className="relative">
                {/* Character Image */}
                <img 
                  src="/ottomain.png" 
                  alt="OTTO Character" 
                  className="w-full h-auto object-contain drop-shadow-2xl transform scale-[1.5] sm:scale-[2] md:scale-[2.5] lg:scale-[3]"
                  style={{
                    filter: 'contrast(1.15) saturate(1.2) brightness(1.1) drop-shadow(0 0 40px rgba(0, 0, 0, 0.3))',
                  }}
                />
                
                                 {/* Floating elements around character */}
                 <div className="absolute top-1/4 -left-4 w-8 h-8 bg-cyan-400 rounded-full animate-bounce animation-delay-1000 shadow-lg shadow-cyan-400/50"></div>
                 <div className="absolute top-1/3 -right-4 w-6 h-6 bg-blue-400 rounded-full animate-pulse animation-delay-2000 shadow-lg shadow-blue-400/50"></div>
                 <div className="absolute bottom-1/4 left-8 w-10 h-10 bg-sky-400 rounded-full animate-bounce animation-delay-3000 shadow-lg shadow-sky-400/50"></div>
                 
                 {/* Glow effect behind character */}
                 <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-400/30 to-sky-400/20 blur-3xl scale-110 -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Stats Section - P33L Inspired */}
      <section className="relative z-20 py-16 bg-gradient-to-b from-blue-900/50 to-cyan-900/50 overflow-hidden">
        {/* Top Marquee - Moving Right */}
        <div className="relative overflow-hidden mb-8 border-t-2 border-b-2 border-dotted border-yellow-400 py-3 bg-gradient-to-r from-yellow-400/20 via-orange-400/20 to-yellow-400/20">
          <div className="flex animate-marquee whitespace-nowrap">
            <span className="text-sm md:text-base font-black text-yellow-300 mx-2 tracking-wider">OTTO ON SOLANA -- LIGHTNING FAST -- TO THE MOON -- DIAMOND HANDS -- COMMUNITY STRONG -- OTTER-LY AMAZING -- HODL TIGHT -- BULLISH AF -- MOON MISSION -- SOLANA SPEED -- DEFI KING -- MEME LEGEND -- ZERO FEES -- INSTANT TRADES -- PUMP INCOMING -- DEGEN APPROVED -- CRYPTO REVOLUTION -- OTTO ON SOLANA -- LIGHTNING FAST -- TO THE MOON -- DIAMOND HANDS -- COMMUNITY STRONG -- OTTER-LY AMAZING -- HODL TIGHT -- BULLISH AF -- MOON MISSION -- SOLANA SPEED -- DEFI KING -- MEME LEGEND -- ZERO FEES -- INSTANT TRADES -- PUMP INCOMING -- DEGEN APPROVED -- CRYPTO REVOLUTION</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center" ref={statsRef}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-8 border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-300 hover:scale-105">
              <div className={`text-4xl md:text-5xl font-black text-cyan-300 mb-2 transition-all duration-300 ${hasStarted ? 'scale-110' : 'scale-100'}`}>
                {followersCount}K+
              </div>
              <div className="text-lg font-semibold text-white mb-1">Followers on X</div>
              <div className="text-cyan-400 text-sm">@OttoSolana</div>
            </div>
            <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-8 border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-105">
              <div className={`text-4xl md:text-5xl font-black text-purple-300 mb-2 transition-all duration-300 ${hasStarted ? 'scale-110' : 'scale-100'}`}>
                {membersCount}K+
              </div>
              <div className="text-lg font-semibold text-white mb-1">Members on TG</div>
              <div className="text-purple-400 text-sm">@OttoOfficial</div>
            </div>
            <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-8 border border-green-400/20 hover:border-green-400/40 transition-all duration-300 hover:scale-105">
              <div className={`text-4xl md:text-5xl font-black text-green-300 mb-2 transition-all duration-300 ${hasStarted ? 'scale-110' : 'scale-100'}`}>
                {holdersCount}K+
              </div>
              <div className="text-lg font-semibold text-white mb-1">Total Holders</div>
              <div className="text-green-400 text-sm">Growing Daily</div>
            </div>
          </div>
        </div>

        {/* Bottom Marquee - Moving Left */}
        <div className="relative overflow-hidden mt-8 border-t-2 border-b-2 border-dotted border-red-500 py-3 bg-gradient-to-r from-red-500/20 via-pink-500/20 to-red-500/20">
          <div className="flex animate-marquee-reverse whitespace-nowrap">
            <span className="text-sm md:text-base font-black text-red-300 mx-2 tracking-wider">TRENDING NOW -- BULLISH VIBES -- SOLANA POWER -- MOON MISSION -- DEGEN APPROVED -- HODL STRONG -- APE IN NOW -- FOMO KICKS IN -- PUMP ALERT -- WHALE MOVES -- DIAMOND PAWS -- OTTER GANG -- ROCKET FUEL -- MEGA PUMP -- GAINS INCOMING -- HIGH TIDE -- SURF'S UP -- BREAKOUT MODE -- ATH SOON -- SEND IT -- TRENDING NOW -- BULLISH VIBES -- SOLANA POWER -- MOON MISSION -- DEGEN APPROVED -- HODL STRONG -- APE IN NOW -- FOMO KICKS IN -- PUMP ALERT -- WHALE MOVES -- DIAMOND PAWS -- OTTER GANG -- ROCKET FUEL -- MEGA PUMP -- GAINS INCOMING -- HIGH TIDE -- SURF'S UP -- BREAKOUT MODE -- ATH SOON -- SEND IT</span>
          </div>
        </div>
      </section>

      {/* WHO'S OTTO Section - P33L Inspired with Fixed Background */}
      <section className="relative z-20 py-20 overflow-hidden fixed-bg-section">
        {/* Fixed Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-fixed bg-no-repeat opacity-100"
            style={{
              backgroundImage: 'url(/9690190-cloudy-mountain-landscape-wallpaper.jpg)',
              filter: 'brightness(0.6) contrast(1.4)',
            }}
          ></div>
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
          {/* Blue overlay for theme consistency */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-cyan-800/20 to-blue-800/30"></div>
        </div>

        {/* Animated floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="floating-element absolute top-1/4 left-1/6 w-4 h-4 bg-cyan-400/60 rounded-full animate-pulse shadow-lg shadow-cyan-400/30"></div>
          <div className="floating-element absolute top-1/3 right-1/4 w-3 h-3 bg-blue-400/60 rounded-full animate-bounce shadow-lg shadow-blue-400/30 animation-delay-1000"></div>
          <div className="floating-element absolute bottom-1/4 left-1/4 w-5 h-5 bg-sky-400/60 rounded-full animate-pulse shadow-lg shadow-sky-400/30 animation-delay-2000"></div>
          <div className="floating-element absolute top-2/3 right-1/6 w-2 h-2 bg-cyan-300/60 rounded-full animate-bounce shadow-lg shadow-cyan-300/30 animation-delay-3000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            {/* Left - Image */}
            <div className="relative p-4 sm:p-6 md:p-8">
                             <div className="relative overflow-visible rounded-3xl transform hover:scale-105 transition-all duration-500 shadow-2xl shadow-black/50 border-2 border-black min-h-[300px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[600px] flex items-center justify-center">
                <img 
                  src="/ottoisking.png" 
                  alt="WHO'S OTTO?" 
                  className="w-full h-auto object-contain scale-[1] sm:scale-[1.2] md:scale-[1.5] lg:scale-[2]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent"></div>
                {/* Glowing border effect */}
                <div className="absolute inset-0 rounded-3xl border-2 border-black shadow-lg shadow-cyan-400/20"></div>
              </div>
              {/* Enhanced floating decorative elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse shadow-2xl shadow-cyan-400/60"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full animate-bounce shadow-2xl shadow-blue-400/60"></div>
              <div className="absolute top-1/4 -left-2 w-3 h-3 bg-sky-400 rounded-full animate-pulse shadow-lg shadow-sky-400/50 animation-delay-1500"></div>
              <div className="absolute bottom-1/3 -right-2 w-4 h-4 bg-cyan-300 rounded-full animate-bounce shadow-lg shadow-cyan-300/50 animation-delay-2500"></div>
            </div>
            
            {/* Right - Content */}
            <div className="relative">
              {/* Content background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-3xl blur-xl -z-10"></div>
              
              <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight drop-shadow-2xl">
                WHO'S <span className="text-cyan-400 text-shadow-glow">OTTO</span>?
              </h2>
              
              <div className="space-y-4 text-gray-200 text-lg leading-relaxed drop-shadow-lg">
                <p className="backdrop-blur-sm bg-black/20 rounded-xl p-4 border-2 border-black">
                  Meet Otto, the mischievous otter who's making waves in the Solana ecosystem! 
                  This isn't just another memecoin - Otto represents a revolution in community-driven innovation.
                </p>
                
                <p className="backdrop-blur-sm bg-black/20 rounded-xl p-4 border-2 border-black">
                  Born from the depths of DeFi creativity, Otto combines the playful spirit of meme culture 
                  with serious blockchain technology. Our furry friend is on a mission to make DeFi 
                  accessible, fun, and profitable for everyone.
                </p>
                
                <p className="backdrop-blur-sm bg-black/20 rounded-xl p-4 border-2 border-black">
                  With lightning-fast Solana transactions and a community that never sleeps, 
                  Otto is building the future of decentralized finance, one splash at a time.
                </p>
              </div>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-3 rounded-xl shadow-lg shadow-cyan-600/30 hover:shadow-cyan-600/50 transition-all duration-300 hover:scale-105 border-2 border-black">
                  <span className="text-white font-bold drop-shadow-lg">DeFi Pioneer</span>
                </div>
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 rounded-xl shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 transition-all duration-300 hover:scale-105 border-2 border-black">
                  <span className="text-white font-bold drop-shadow-lg">Community First</span>
                </div>
                <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-3 rounded-xl shadow-lg shadow-green-600/30 hover:shadow-green-600/50 transition-all duration-300 hover:scale-105 border-2 border-black">
                  <span className="text-white font-bold drop-shadow-lg">Solana Speed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Content Section */}
      <section className="relative z-20 py-20 bg-gradient-to-br from-blue-900/50 via-cyan-800/30 to-blue-800/50 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              STILL THINK <span className="text-cyan-400">MEMES</span> ARE BORING?
            </h2>
            <p className="text-gray-400 text-xl">Check out what the community is saying!</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tweet Card 1 */}
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border-2 border-black transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center border-2 border-black">
                  <span className="text-white font-bold text-sm">O</span>
                </div>
                <div>
                  <div className="text-white font-bold">@OttoSolana</div>
                  <div className="text-gray-400 text-sm">2h ago</div>
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                "Just witnessed Otto break another ATH! This otter is unstoppable! 
                The community energy is INSANE! #OTTO #Solana"
              </p>
              <div className="flex gap-4 text-gray-400 text-sm">
                <span>♥ 1.2K</span>
                <span>↻ 890</span>
                <span>💬 234</span>
              </div>
            </div>

            {/* Tweet Card 2 */}
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border-2 border-black transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center border-2 border-black">
                  <span className="text-white font-bold text-sm">D</span>
                </div>
                <div>
                  <div className="text-white font-bold">@DeFiOtter</div>
                  <div className="text-gray-400 text-sm">4h ago</div>
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                "Otto's utility features are game-changing! The staking rewards 
                + gaming integration = pure genius #OttoCommunity"
              </p>
              <div className="flex gap-4 text-gray-400 text-sm">
                <span>♥ 892</span>
                <span>↻ 456</span>
                <span>💬 123</span>
              </div>
            </div>

            {/* Tweet Card 3 */}
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border-2 border-black transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center border-2 border-black">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <div>
                  <div className="text-white font-bold">@SolanaMaxi</div>
                  <div className="text-gray-400 text-sm">6h ago</div>
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                "Solana + Otto = Perfect match! Lightning fast transactions, 
                zero lag, pure meme magic! This is the future!"
              </p>
              <div className="flex gap-4 text-gray-400 text-sm">
                <span>♥ 567</span>
                <span>↻ 234</span>
                <span>💬 89</span>
              </div>
            </div>

            {/* Community Highlight */}
            <div className="md:col-span-2 lg:col-span-3 bg-gradient-to-r from-cyan-900/40 to-blue-900/40 backdrop-blur-xl rounded-2xl p-4 border-2 border-black">
              <div className="text-center">
                <h3 className="text-lg font-bold text-white mb-2">Join the Otto Revolution!</h3>
                <p className="text-gray-300 text-sm mb-3">
                  Be part of the most vibrant memecoin community on Solana.
                </p>
                <div className="flex justify-center gap-3">
                  <button className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 hover:scale-105 border-2 border-black flex items-center">
                    <img src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6cc3c481a15a141738_icon_clyde_white_RGB.png" alt="Discord" className="w-4 h-4 mr-1" />
                    Discord
                  </button>
                  <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 hover:scale-105 border-2 border-black flex items-center">
                    <img src="https://abs.twimg.com/responsive-web/client-web/icon-ios.8ea219d6.png" alt="X" className="w-4 h-4 mr-1" />
                    Follow X
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Big Social Icons Footer */}
      <footer className="relative z-20 py-20 overflow-hidden fixed-bg-section">
        {/* Fixed OTTO Background */}
        <div className="absolute inset-0 w-full h-full">
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-gray-900/80"></div>
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-fixed bg-no-repeat opacity-30"
            style={{
              backgroundImage: 'url(/ottomain.png)',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat'
            }}
          ></div>
        </div>
        
        {/* Elegant gradient glow at top */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-cyan-500/20 via-cyan-500/5 to-transparent"></div>
        
        {/* Floating social-themed orbs */}
        <div className="absolute top-10 left-1/4 w-20 h-20 bg-cyan-500/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-16 right-1/4 w-16 h-16 bg-blue-500/15 rounded-full blur-xl animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-10 left-1/5 w-24 h-24 bg-purple-500/8 rounded-full blur-2xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-16 right-1/5 w-18 h-18 bg-cyan-400/12 rounded-full blur-xl animate-pulse animation-delay-3000"></div>
        
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          {/* Big Social Icons */}
          <div className="flex items-center justify-center gap-8 mb-12">
            {/* Twitter/X */}
            <a 
              href="#" 
              className="group relative w-20 h-20 bg-gradient-to-br from-gray-800 to-black hover:from-cyan-600 hover:to-cyan-700 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 border-4 border-black shadow-2xl hover:shadow-cyan-500/50"
            >
              <img src="https://abs.twimg.com/responsive-web/client-web/icon-ios.8ea219d6.png" alt="X" className="w-10 h-10 text-white group-hover:text-white transition-colors duration-300" />
              <div className="absolute inset-0 bg-cyan-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
            </a>
            
            {/* Telegram */}
            <a 
              href="#" 
              className="group relative w-20 h-20 bg-gradient-to-br from-gray-800 to-black hover:from-blue-500 hover:to-blue-600 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 border-4 border-black shadow-2xl hover:shadow-blue-500/50"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg" alt="Telegram" className="w-10 h-10 text-white group-hover:text-white transition-colors duration-300" />
              <div className="absolute inset-0 bg-blue-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
            </a>
            
            {/* Discord */}
            <a 
              href="#" 
              className="group relative w-20 h-20 bg-gradient-to-br from-gray-800 to-black hover:from-purple-600 hover:to-purple-700 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 border-4 border-black shadow-2xl hover:shadow-purple-500/50"
            >
              <img src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6cc3c481a15a141738_icon_clyde_white_RGB.png" alt="Discord" className="w-10 h-10 text-white group-hover:text-white transition-colors duration-300" />
              <div className="absolute inset-0 bg-purple-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
            </a>
            
            {/* DexScreener */}
            <a 
              href="#" 
              className="group relative w-20 h-20 bg-gradient-to-br from-gray-800 to-black hover:from-green-600 hover:to-green-700 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 border-4 border-black shadow-2xl hover:shadow-green-500/50"
            >
              <svg className="w-10 h-10 text-white group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 10.93C16.16 26.74 20 22.55 20 17V7l-10-5z"/>
              </svg>
              <div className="absolute inset-0 bg-green-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
            </a>
            
            {/* CoinGecko */}
            <a 
              href="#" 
              className="group relative w-20 h-20 bg-gradient-to-br from-gray-800 to-black hover:from-yellow-500 hover:to-yellow-600 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 border-4 border-black shadow-2xl hover:shadow-yellow-500/50"
            >
              <img src="https://www.coingecko.com/favicon.ico" alt="CoinGecko" className="w-10 h-10 text-white group-hover:text-white transition-colors duration-300" />
              <div className="absolute inset-0 bg-yellow-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
            </a>
          </div>
          
          {/* Footer Text */}
          <div className="border-t-4 border-cyan-400/30 pt-8">
            <p className="text-cyan-300/70 text-lg font-semibold tracking-wide">
              JOIN THE OTTO REVOLUTION
            </p>
            <p className="text-gray-400 text-sm mt-2">
              © 2025 OTTO. Building utilities like no-otter!
            </p>
          </div>
        </div>
      </footer>

      {/* Footer with Parallax */}
      <footer className="section-parallax py-12 bg-black border-t border-cyan-400/20 relative overflow-hidden">
        {/* Footer Background Elements */}
        <div className="parallax-bg-slow absolute inset-0 bg-gradient-to-t from-cyan-900/5 to-transparent opacity-30"></div>
        <div className="floating-element absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400/30 rounded-full animate-pulse"></div>
        <div className="floating-element absolute bottom-1/4 right-1/4 w-3 h-3 bg-blue-400/20 rounded-full animate-pulse animation-delay-2000"></div>
        
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="scroll-fade flex items-center justify-center space-x-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 overflow-hidden">
              <img 
                src="/ottoicon.jpg" 
                alt="OTTO Icon" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-2xl font-bold text-cyan-400">OTTO</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
