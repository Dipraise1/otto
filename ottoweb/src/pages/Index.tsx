import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Index = () => {
  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      {/* Background Image with Parallax - Cloudy Mountain Landscape */}
      <div 
        className="parallax-bg-slow absolute top-0 left-0 right-0 h-screen bg-cover bg-center bg-no-repeat opacity-70"
        style={{ 
          backgroundImage: `url('/9690190-cloudy-mountain-landscape-wallpaper.jpg')`
        }}
      ></div>
      
      {/* Additional Parallax Background Layers with Mountain Image */}
      <div 
        className="parallax-bg-fast absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 mix-blend-soft-light"
        style={{ 
          backgroundImage: `url('/9690190-cloudy-mountain-landscape-wallpaper.jpg')`
        }}
      ></div>
      <div 
        className="parallax-bg-slow absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 mix-blend-overlay"
        style={{ 
          backgroundImage: `url('/9690190-cloudy-mountain-landscape-wallpaper.jpg')`
        }}
      ></div>
      
      {/* Enhanced gradient overlays for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/15 via-transparent to-blue-900/15"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/10 via-transparent to-cyan-900/10"></div>

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
          <div className="backdrop-blur-xl bg-gradient-to-r from-sky-900/20 via-cyan-800/15 to-blue-900/20 rounded-2xl sm:rounded-3xl lg:rounded-full border border-cyan-400/20 shadow-2xl shadow-cyan-500/10">
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
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-cyan-300 to-sky-200 bg-clip-text text-transparent tracking-wide">
                  OTTO
                </span>
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
                {['About', 'Features', 'Rewards', 'Community'].map((item, index) => (
                  <button
                    key={item}
                    className="px-4 lg:px-6 py-2 lg:py-2.5 text-sm font-medium text-cyan-100 hover:text-white transition-all duration-300 hover:bg-cyan-500/10 rounded-full border border-transparent hover:border-cyan-400/20 hover:shadow-lg hover:shadow-cyan-500/10"
                  >
                    {item}
                  </button>
                ))}
              </div>

              {/* CTA Button - Mobile Optimized */}
              <Link to="/dashboard" className="hidden md:block">
                <Button className="bg-gradient-to-r from-cyan-700 to-blue-800 hover:from-cyan-600 hover:to-blue-700 text-white px-4 lg:px-6 py-2 lg:py-2.5 text-sm font-semibold rounded-full shadow-lg shadow-cyan-700/25 border border-cyan-600/20 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-600/30">
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

      {/* Hero Section - Mobile First Design */}
      <section className="relative z-10 pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-12 lg:pb-0 overflow-visible min-h-[100dvh] flex items-center">
        {/* Simplified floating particles for mobile performance */}
        <div className="absolute inset-0 z-5 pointer-events-none">
          <div className="hidden sm:block floating-element absolute top-1/4 left-[10%] w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50"></div>
          <div className="hidden sm:block floating-element absolute top-1/3 right-[15%] w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 bg-blue-400 rounded-full animate-pulse animation-delay-1000 shadow-lg shadow-blue-400/50"></div>
          <div className="hidden lg:block floating-element absolute bottom-1/3 left-[20%] w-2 h-2 lg:w-3 lg:h-3 bg-sky-400 rounded-full animate-pulse animation-delay-2000 shadow-lg shadow-sky-400/50"></div>
        </div>

        {/* Mobile-First Content Container */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 text-center w-full relative z-10">
          
          {/* Hero Content - Mobile Optimized */}
          <div className="relative mb-4 sm:mb-6 lg:mb-4">
            {/* Simplified floating elements for mobile */}
            <div className="hidden sm:block floating-element absolute -top-12 sm:-top-16 lg:-top-32 left-1/4 w-24 h-24 sm:w-32 sm:h-32 lg:w-48 lg:h-48 bg-gradient-to-r from-cyan-500/10 via-purple-500/15 to-blue-500/10 rounded-full blur-3xl animate-pulse shadow-lg shadow-cyan-500/20"></div>
            <div className="hidden lg:block floating-element absolute -top-10 lg:-top-28 right-1/3 w-20 h-20 lg:w-40 lg:h-40 bg-gradient-to-r from-sky-400/15 via-pink-400/20 to-cyan-400/15 rounded-full blur-2xl animate-pulse animation-delay-1000 shadow-lg shadow-sky-400/20"></div>

            {/* Main OTTO Logo - Mobile Optimized */}
            <div className="relative mb-4 sm:mb-6 lg:mb-4">
              <div className="relative inline-block">
                {/* Simplified glow effect for mobile performance */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-sky-400/30 to-blue-500/20 blur-2xl sm:blur-3xl scale-125 sm:scale-150 opacity-60 sm:opacity-80 animate-pulse"></div>
                <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-purple-400/15 via-pink-400/20 to-cyan-400/15 blur-xl sm:blur-2xl scale-150 sm:scale-175 opacity-40 sm:opacity-60 animate-pulse animation-delay-1000"></div>
                
                {/* OTTO Text Image - Mobile First Sizing */}
                <img 
                  src="/ottotext.png" 
                  alt="OTTO" 
                  className="relative z-50 w-[180px] xs:w-[200px] sm:w-[250px] md:w-[300px] lg:w-[350px] xl:w-[400px] h-auto mx-auto drop-shadow-2xl"
                  style={{
                    imageRendering: 'crisp-edges',
                    filter: 'contrast(1.15) saturate(1.3) brightness(1.1) drop-shadow(0 0 20px rgba(6, 182, 212, 0.6)) drop-shadow(0 0 40px rgba(168, 85, 247, 0.3))',
                  }}
                />


                
                {/* Simplified cosmic accent lines - Desktop only */}
                <div className="hidden xl:block absolute -left-20 lg:-left-24 top-1/2 transform -translate-y-1/2 w-16 lg:w-20 h-1 bg-gradient-to-r from-transparent via-cyan-400/60 to-purple-400/50 animate-pulse shadow-lg shadow-cyan-400/30"></div>
                <div className="hidden xl:block absolute -right-20 lg:-right-24 top-1/2 transform -translate-y-1/2 w-16 lg:w-20 h-1 bg-gradient-to-l from-transparent via-purple-400/60 to-cyan-400/50 animate-pulse animation-delay-1000 shadow-lg shadow-purple-400/30"></div>
              </div>
            </div>



            {/* Mobile CTA Section */}
            <div className="block md:hidden mb-6 sm:mb-8">
              <p className="text-cyan-100/80 text-sm sm:text-base mb-4 leading-relaxed">
                The ultimate Solana meme token
              </p>
              <Link to="/dashboard">
                <Button className="bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-full shadow-lg shadow-cyan-600/30 border border-cyan-500/20 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/40 w-full sm:w-auto">
                  Launch App
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Character Image - Mobile Optimized & Extended */}
          <div className="relative -mt-2 sm:-mt-4 lg:-mt-16 mb-[-400px] xs:mb-[-470px] sm:mb-[-530px] md:mb-[-600px] lg:mb-0 parallax-container overflow-visible">
            {/* Main OTTO Character - Mobile Responsive */}
            <img 
              src="/ottomain.png" 
              alt="OTTO Character" 
              className="parallax-image w-full max-w-[120vw] xs:max-w-[130vw] sm:max-w-[140vw] md:max-w-[160vw] lg:max-w-[1600px] xl:max-w-[1900px] 2xl:max-w-[2500px] h-auto object-contain drop-shadow-2xl mx-auto transform-gpu will-change-transform relative z-40 lg:z-30 
                         scale-[1.15] xs:scale-[1.2] sm:scale-[1.3] md:scale-[1.4] lg:scale-100 
                         translate-y-11 xs:translate-y-16 sm:translate-y-21 md:translate-y-27 lg:translate-y-0"
              style={{
                imageRendering: 'crisp-edges',
                filter: 'contrast(1.1) saturate(1.2) brightness(1.1) drop-shadow(0 0 30px rgba(6, 182, 212, 0.4))',
              }}
            />


            
            {/* Simplified floating elements around character - Desktop only */}
            <div className="hidden lg:block floating-element absolute top-1/4 left-4 lg:left-8 w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-bounce animation-delay-2000 shadow-lg shadow-cyan-400/50 z-50"></div>
            <div className="hidden lg:block floating-element absolute top-1/3 right-4 lg:right-8 w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-sky-400 to-purple-500 rounded-full animate-pulse animation-delay-3000 shadow-lg shadow-sky-400/50 z-50"></div>
            <div className="hidden xl:block floating-element absolute bottom-1/4 left-6 lg:left-12 w-4 h-4 lg:w-6 lg:h-6 bg-gradient-to-r from-blue-400 to-pink-500 rounded-full animate-pulse animation-delay-4000 shadow-lg shadow-blue-400/50 z-50"></div>
            
            {/* Simplified background effects */}
            <div className="parallax-bg-fast absolute -inset-10 sm:-inset-20 lg:-inset-40 bg-gradient-to-r from-cyan-600/3 via-purple-600/5 to-blue-600/3 blur-3xl scale-125 opacity-30 sm:opacity-50"></div>
            <div className="hidden sm:block parallax-bg-slow absolute -inset-16 sm:-inset-32 lg:-inset-60 bg-gradient-to-r from-sky-500/2 via-pink-500/4 to-cyan-500/2 blur-3xl scale-150 opacity-20 sm:opacity-40"></div>
          </div>
        </div>
      </section>

      {/* Social Links Section - Mobile Optimized */}
      <section className="section-parallax relative z-10 bg-gradient-to-b from-black via-gray-900/50 to-black pt-20 xs:pt-24 sm:pt-32 lg:pt-40 xl:pt-16 pb-12 sm:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h3 className="scroll-fade text-xl sm:text-2xl font-bold text-cyan-300 mb-6 sm:mb-8 relative z-20">Official Links</h3>
          <div className="flex items-center justify-center gap-4 sm:gap-6 mb-8 sm:mb-12 relative z-20 flex-wrap">
            <a href="#" className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-800 hover:bg-cyan-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 relative z-20 touch-manipulation">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="#" className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-800 hover:bg-blue-500 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 relative z-20 touch-manipulation">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
            </a>
            <a href="#" className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-800 hover:bg-purple-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 relative z-20 touch-manipulation">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0190 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z"/>
              </svg>
            </a>
            <a href="#" className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-800 hover:bg-cyan-500 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 relative z-20 touch-manipulation">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0L1.608 6v12L12 24l10.392-6V6L12 0zm-1.073 8.45h2.146v1.305c.288-.434.823-.708 1.384-.708.054 0 .109.003.162.01v1.96a2.153 2.153 0 0 0-.325-.025c-.488 0-.897.32-1.033.771-.08.266-.121.551-.121.854v2.658H10.86V8.45h.067zm4.721 0h2.279v7.825h-2.279V8.45z"/>
              </svg>
            </a>
            <a href="#" className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-800 hover:bg-green-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 relative z-20 touch-manipulation">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.745.094.115.109.215.08.334-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Top Marquee with Parallax */}
      <section className="section-parallax relative z-20 bg-gray-800/50 overflow-hidden py-3 border-y border-cyan-400/10">
        <div className="parallax-bg-fast absolute inset-0 bg-gradient-to-r from-cyan-600/5 to-blue-600/5 opacity-30"></div>
        <div className="flex whitespace-nowrap animate-marquee relative z-10">
          <span className="text-sm md:text-base font-semibold text-cyan-300/70 mx-12 tracking-wide">THE ULTIMATE OTTO</span>
          <span className="text-sm md:text-base font-semibold text-gray-400/70 mx-12 tracking-wide">SOLANA POWERED</span>
          <span className="text-sm md:text-base font-semibold text-sky-300/70 mx-12 tracking-wide">COMMUNITY DRIVEN</span>
          <span className="text-sm md:text-base font-semibold text-cyan-300/70 mx-12 tracking-wide">THE ULTIMATE OTTO</span>
          <span className="text-sm md:text-base font-semibold text-gray-400/70 mx-12 tracking-wide">SOLANA POWERED</span>
          <span className="text-sm md:text-base font-semibold text-sky-300/70 mx-12 tracking-wide">COMMUNITY DRIVEN</span>
          <span className="text-sm md:text-base font-semibold text-cyan-300/70 mx-12 tracking-wide">THE ULTIMATE OTTO</span>
          <span className="text-sm md:text-base font-semibold text-gray-400/70 mx-12 tracking-wide">SOLANA POWERED</span>
          <span className="text-sm md:text-base font-semibold text-sky-300/70 mx-12 tracking-wide">COMMUNITY DRIVEN</span>
        </div>
      </section>

      {/* Find OTTO Section - Clean Contract Address */}
      <section className="section-parallax relative z-20 bg-gradient-to-b from-black via-gray-900 to-black py-20 overflow-hidden">
        {/* Simple gradient background only */}
        <div className="parallax-bg-slow absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 via-transparent to-blue-600/10"></div>
        </div>
        
        {/* Animated Network Nodes */}
        <div className="floating-element absolute top-1/4 left-1/4 w-3 h-3 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50 animate-pulse"></div>
        <div className="floating-element absolute top-1/3 right-1/4 w-2 h-2 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50 animate-pulse animation-delay-1000"></div>
        <div className="floating-element absolute bottom-1/4 left-1/3 w-4 h-4 bg-sky-400 rounded-full shadow-lg shadow-sky-400/50 animate-pulse animation-delay-2000"></div>
        <div className="floating-element absolute top-2/3 right-1/3 w-2 h-2 bg-cyan-300 rounded-full shadow-lg shadow-cyan-300/50 animate-pulse animation-delay-3000"></div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Find OTTO */}
            <div>
              <div className="mb-8">
                <span className="scroll-fade text-cyan-400 text-lg font-semibold tracking-wide uppercase">BASED & VERIFIED</span>
                <h2 className="scroll-fade text-5xl md:text-6xl font-black text-white mt-4 mb-8 leading-tight">
                  Find OTTO on
                </h2>
              </div>
              
              <div className="space-y-4">
                <a href="#" className="block bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 rounded-2xl p-6 transition-all duration-300 hover:scale-105 shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                      <svg className="w-8 h-8 text-pink-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 10.93C16.16 26.74 20 22.55 20 17V7l-10-5z"/>
                      </svg>
                    </div>
                    <span className="text-white text-xl font-bold">Uniswap</span>
                  </div>
                </a>
                
                <a href="#" className="block bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-2xl p-6 transition-all duration-300 hover:scale-105 shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                      <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 10.93C16.16 26.74 20 22.55 20 17V7l-10-5z"/>
                      </svg>
                    </div>
                    <span className="text-white text-xl font-bold">Jupiter</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Right Side - Contract Address */}
            <div>
              <h3 className="scroll-fade text-2xl font-bold text-cyan-300 mb-6 uppercase tracking-wide">Official Contract Address</h3>
              <div className="scroll-fade bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-cyan-400/20 transform transition-all duration-700">
                <div className="flex items-center justify-between gap-4">
                  <code className="text-cyan-100 text-sm md:text-base font-mono break-all">
                    0x0FBF1722C91AE96983026969F4FC1A648A51B3ED9
                  </code>
                  <button className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 flex-shrink-0">
                    Copy
                  </button>
                </div>
              </div>
              
              <div className="scroll-fade mt-8 p-6 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-2xl border border-cyan-400/10 transform transition-all duration-700">
                <h4 className="text-xl font-bold text-cyan-200 mb-4">Security Notice</h4>
                <p className="text-cyan-100/70 text-sm leading-relaxed">
                  Always verify the contract address before making any transactions. 
                  OTTO is built on Solana with full transparency and community trust at its core.
                </p>
              </div>
            </div>
                     </div>
         </div>
       </section>

      {/* Bottom Marquee - Moving Right with Parallax */}
      <section className="section-parallax relative z-20 bg-gray-800/50 overflow-hidden py-3 border-y border-cyan-400/10">
        <div className="parallax-bg-slow absolute inset-0 bg-gradient-to-l from-blue-600/5 to-cyan-600/5 opacity-30"></div>
        <div className="flex whitespace-nowrap animate-marquee-reverse relative z-10">
          <span className="text-sm md:text-base font-semibold text-blue-300/70 mx-12 tracking-wide">VERIFIED & SECURE</span>
          <span className="text-sm md:text-base font-semibold text-cyan-300/70 mx-12 tracking-wide">THE ULTIMATE OTTO</span>
          <span className="text-sm md:text-base font-semibold text-gray-400/70 mx-12 tracking-wide">BUILT ON SOLANA</span>
          <span className="text-sm md:text-base font-semibold text-blue-300/70 mx-12 tracking-wide">VERIFIED & SECURE</span>
          <span className="text-sm md:text-base font-semibold text-cyan-300/70 mx-12 tracking-wide">THE ULTIMATE OTTO</span>
          <span className="text-sm md:text-base font-semibold text-gray-400/70 mx-12 tracking-wide">BUILT ON SOLANA</span>
          <span className="text-sm md:text-base font-semibold text-blue-300/70 mx-12 tracking-wide">VERIFIED & SECURE</span>
          <span className="text-sm md:text-base font-semibold text-cyan-300/70 mx-12 tracking-wide">THE ULTIMATE OTTO</span>
          <span className="text-sm md:text-base font-semibold text-gray-400/70 mx-12 tracking-wide">BUILT ON SOLANA</span>
        </div>
      </section>

      {/* Meet OTTO Section - Professional with Dotted Lines Design */}
      <section className="section-parallax relative z-20 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center">
            {/* Professional Dotted Container - Glass Effect */}
            <div className="scroll-fade relative bg-gradient-to-br from-sky-900/20 via-cyan-800/15 to-blue-900/20 backdrop-blur-xl w-full max-w-7xl shadow-2xl transform transition-all duration-1000 overflow-hidden hover:scale-[1.02] hover:shadow-cyan-500/30 cursor-pointer group"
                 style={{
                   borderRadius: '2rem',
                   border: '4px dashed #06B6D4',
                   borderStyle: 'dashed',
                   borderWidth: '3px',
                   position: 'relative',
                 }}>
              
              {/* Dotted Corner Decorations */}
              <div className="absolute top-2 left-2 w-4 h-4 border-2 border-cyan-500 rotate-45 bg-cyan-100 animate-pulse"></div>
              <div className="absolute top-2 right-2 w-4 h-4 border-2 border-cyan-500 rotate-45 bg-cyan-100 animate-pulse animation-delay-1000"></div>
              <div className="absolute bottom-2 left-2 w-4 h-4 border-2 border-cyan-500 rotate-45 bg-cyan-100 animate-pulse animation-delay-2000"></div>
              <div className="absolute bottom-2 right-2 w-4 h-4 border-2 border-cyan-500 rotate-45 bg-cyan-100 animate-pulse animation-delay-3000"></div>
              
              {/* Professional Thread Lines */}
              <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-300/30 to-transparent animate-pulse"></div>
              <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-300/30 to-transparent animate-pulse animation-delay-1000"></div>
              <div className="absolute left-0 top-1/4 w-full h-px bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent animate-pulse animation-delay-2000"></div>
              <div className="absolute left-0 bottom-1/4 w-full h-px bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent animate-pulse animation-delay-3000"></div>
              
              {/* Inner Dotted Border */}
              <div className="absolute inset-4 border border-dashed border-cyan-400/40 rounded-2xl pointer-events-none animate-pulse"></div>
              
              {/* Professional Corner Rivets */}
              <div className="absolute top-6 left-6 w-3 h-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full shadow-lg animate-pulse"></div>
              <div className="absolute top-6 right-6 w-3 h-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full shadow-lg animate-pulse animation-delay-500"></div>
              <div className="absolute bottom-6 left-6 w-3 h-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full shadow-lg animate-pulse animation-delay-1500"></div>
              <div className="absolute bottom-6 right-6 w-3 h-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full shadow-lg animate-pulse animation-delay-2500"></div>
              
                            {/* Content - Mobile First Layout Like Hero */}
              <div className="relative z-10 p-6 sm:p-8 lg:p-12">
                {/* Mobile: Vertical Layout (Like Hero) | Desktop: Horizontal */}
                <div className="lg:grid lg:grid-cols-3 lg:gap-8 lg:items-center">
                  
                  {/* Mobile: Centered Content | Desktop: Left Column */}
                  <div className="lg:col-span-1 text-center mb-8 lg:mb-0 lg:text-left">
                    <div className="relative inline-block group-hover:scale-105 transition-all duration-500 mb-6">
                      {/* Professional Glow Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-blue-500/25 to-cyan-500/20 rounded-full blur-xl scale-110 opacity-60 animate-pulse"></div>
                      
                      <img 
                        src="/ottoicon.png" 
                        alt="Otto - Professional Solana Token" 
                        className="w-48 h-48 xs:w-56 xs:h-56 sm:w-64 sm:h-64 lg:w-56 lg:h-56 mx-auto lg:mx-0 object-cover rounded-full border-4 border-cyan-400 shadow-2xl hover:shadow-cyan-500/40 transition-all duration-500 cursor-pointer"
                        style={{
                          filter: 'contrast(1.1) saturate(1.1) brightness(1.05) drop-shadow(0 0 30px rgba(6, 182, 212, 0.4))',
                        }}
                      />
                    </div>
                    
                    {/* Professional Badge */}
                    <div className="flex justify-center lg:justify-start mb-8 lg:mb-0">
                      <span className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 text-xs sm:text-sm font-bold tracking-wide uppercase rounded-lg shadow-lg border-2 border-dashed border-cyan-300 hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 cursor-pointer">
                        SOLANA NATIVE
                      </span>
                    </div>
                  </div>
                  
                  {/* Mobile: Centered Content | Desktop: Right Columns */}
                  <div className="lg:col-span-2 text-center lg:text-left">
                    {/* Professional Title */}
                    <h2 className="text-3xl xs:text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-black text-white mb-4 lg:mb-4 relative">
                      MEET OTTO
                      {/* Decorative dotted underline */}
                      <div className="absolute -bottom-1 left-1/2 lg:left-0 transform lg:transform-none -translate-x-1/2 lg:translate-x-0 w-20 sm:w-24 h-1 bg-gradient-to-r from-cyan-400 via-cyan-400 to-transparent"></div>
                    </h2>
                    
                    {/* Professional Subtitle */}
                    <p className="text-lg xs:text-xl sm:text-2xl lg:text-2xl font-semibold text-cyan-200 mb-6 lg:mb-6">
                      The Mischievous Otter
                    </p>
                    
                    {/* Professional Description */}
                    <div className="text-cyan-100 text-sm xs:text-base sm:text-lg lg:text-lg leading-relaxed space-y-4 max-w-2xl mx-auto lg:mx-0 lg:max-w-none">
                      <div className="relative hover:bg-cyan-500/10 rounded-xl p-4 sm:p-6 transition-all duration-300 border-2 border-dashed border-transparent hover:border-cyan-400/30">
                        <p className="relative z-10 first-letter:text-xl sm:first-letter:text-2xl first-letter:font-bold first-letter:text-cyan-400 first-letter:float-left first-letter:mr-2 first-letter:mt-1">
                          Welcome to Otto, where we build utilities with unparalleled innovation. Otto represents the next evolution in Solana-based tokens, combining advanced DeFi mechanics with engaging user experiences.
                        </p>
                      </div>
                      
                      <div className="relative hover:bg-cyan-500/10 rounded-xl p-4 sm:p-6 transition-all duration-300 border-2 border-dashed border-transparent hover:border-cyan-400/30">
                        <p className="relative z-10">
                          OTTO delivers cutting-edge solutions including our revolutionary Referral System and Otto's River Adventure gaming platform. Built on Solana's high-performance infrastructure for sustainable community value.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Professional Bottom Dotted Decoration */}
                <div className="mt-6 flex justify-center">
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div 
                        key={i} 
                        className="w-1 h-3 bg-cyan-300/50 transform rotate-12 animate-pulse"
                        style={{ animationDelay: `${i * 150}ms` }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solana Meme Token DEX Partners Marquee */}
      <section className="relative z-20 py-20 overflow-hidden">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-cyan-300 mb-4 uppercase tracking-wide">
            Trade OTTO on Leading Solana DEXs
          </h3>
          <p className="text-gray-400 text-lg">Where the memecoin magic happens</p>
        </div>

        {/* Logo Marquee with Fade Effect */}
        <div className="relative">
          {/* Fade gradients for vanishing effect */}
          <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>
          
          {/* Scrolling Logo Container */}
          <div className="flex whitespace-nowrap animate-marquee-reverse py-12" style={{animationDuration: '20s'}}>
            
            {/* Jupiter - Most Important DEX Aggregator */}
            <div className="mx-16 flex-shrink-0 group">
              <div className="h-60 w-60 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center opacity-90 hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                <span className="text-white font-black text-5xl">JUP</span>
              </div>
            </div>
            
            {/* Pump.fun - Memecoin Launchpad */}
            <div className="mx-16 flex-shrink-0 group">
              <div className="h-60 w-60 bg-gradient-to-br from-green-400 to-blue-500 rounded-3xl flex items-center justify-center opacity-90 hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                <span className="text-white font-black text-4xl">PUMP</span>
              </div>
            </div>
            
            {/* Raydium - Top Solana DEX */}
            <div className="mx-16 flex-shrink-0 group">
              <img 
                src="https://assets.coingecko.com/coins/images/13928/standard/PSigc4ie_400x400.jpg" 
                alt="Raydium - Solana DEX" 
                className="h-60 w-60 object-cover opacity-90 hover:opacity-100 transition-all duration-300 group-hover:scale-110 filter brightness-110 rounded-3xl"
              />
            </div>
            
            {/* Orca - Solana AMM */}
            <div className="mx-16 flex-shrink-0 group">
              <div className="h-60 w-60 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-3xl flex items-center justify-center opacity-90 hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                <span className="text-white font-black text-6xl">🐋</span>
              </div>
            </div>
            
            {/* Meteora - Dynamic Liquidity */}
            <div className="mx-16 flex-shrink-0 group">
              <div className="h-60 w-60 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center opacity-90 hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                <span className="text-white font-black text-4xl">MET</span>
              </div>
            </div>
            
            {/* Phantom - Essential Wallet */}
            <div className="mx-16 flex-shrink-0 group">
              <div className="h-60 w-60 bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl flex items-center justify-center opacity-90 hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                <span className="text-white font-black text-6xl">👻</span>
              </div>
            </div>

            {/* Solana - The Blockchain */}
            <div className="mx-16 flex-shrink-0 group">
              <img 
                src="https://assets.coingecko.com/coins/images/4128/standard/solana.png" 
                alt="Solana - The Fastest Blockchain" 
                className="h-60 w-60 object-cover opacity-90 hover:opacity-100 transition-all duration-300 group-hover:scale-110 filter brightness-110 rounded-3xl"
              />
            </div>
            
            {/* Repeat for continuous loop */}
            <div className="mx-16 flex-shrink-0 group">
              <div className="h-60 w-60 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center opacity-90 hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                <span className="text-white font-black text-5xl">JUP</span>
              </div>
            </div>
            
            <div className="mx-16 flex-shrink-0 group">
              <div className="h-60 w-60 bg-gradient-to-br from-green-400 to-blue-500 rounded-3xl flex items-center justify-center opacity-90 hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                <span className="text-white font-black text-4xl">PUMP</span>
              </div>
            </div>
            
            <div className="mx-16 flex-shrink-0 group">
              <img 
                src="https://assets.coingecko.com/coins/images/13928/standard/PSigc4ie_400x400.jpg" 
                alt="Raydium - Solana DEX" 
                className="h-60 w-60 object-cover opacity-90 hover:opacity-100 transition-all duration-300 group-hover:scale-110 filter brightness-110 rounded-3xl"
              />
            </div>
            
            <div className="mx-16 flex-shrink-0 group">
              <div className="h-60 w-60 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-3xl flex items-center justify-center opacity-90 hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                <span className="text-white font-black text-6xl">🐋</span>
              </div>
            </div>
            
            <div className="mx-16 flex-shrink-0 group">
              <div className="h-60 w-60 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center opacity-90 hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                <span className="text-white font-black text-4xl">MET</span>
              </div>
            </div>
            
            <div className="mx-16 flex-shrink-0 group">
              <div className="h-60 w-60 bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl flex items-center justify-center opacity-90 hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                <span className="text-white font-black text-6xl">👻</span>
              </div>
            </div>

            <div className="mx-16 flex-shrink-0 group">
              <img 
                src="https://assets.coingecko.com/coins/images/4128/standard/solana.png" 
                alt="Solana - The Fastest Blockchain" 
                className="h-60 w-60 object-cover opacity-90 hover:opacity-100 transition-all duration-300 group-hover:scale-110 filter brightness-110 rounded-3xl"
              />
            </div>
            
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-8">
          <p className="text-cyan-300/60 text-sm font-semibold tracking-wide">
            🚀 Lightning-fast trades • 💎 Low fees • 🔥 Maximum liquidity for OTTO
          </p>
        </div>
      </section>

      {/* OTTO Memes Section - Enhanced with Multiple Marquees */}
      <section className="section-parallax relative z-20 py-32 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
        {/* Parallax background elements */}
        <div className="parallax-bg-slow absolute inset-0 bg-gradient-to-br from-cyan-600/3 via-transparent to-blue-600/3 opacity-50"></div>
        <div className="parallax-bg-fast absolute inset-0 bg-gradient-to-tl from-sky-500/2 via-transparent to-cyan-500/2 opacity-30"></div>
        
        {/* Animated floating meme particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="floating-element absolute top-1/6 left-1/12 w-6 h-6 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full animate-bounce shadow-lg shadow-pink-400/50" style={{animationDelay: '0s'}}></div>
          <div className="floating-element absolute top-1/4 right-1/8 w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse shadow-lg shadow-cyan-400/50" style={{animationDelay: '1s'}}></div>
          <div className="floating-element absolute top-1/3 left-1/6 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce shadow-lg shadow-yellow-400/50" style={{animationDelay: '2s'}}></div>
          <div className="floating-element absolute bottom-1/4 right-1/12 w-5 h-5 bg-gradient-to-r from-green-400 to-teal-500 rounded-full animate-pulse shadow-lg shadow-green-400/50" style={{animationDelay: '1.5s'}}></div>
          <div className="floating-element absolute bottom-1/3 left-1/4 w-7 h-7 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-bounce shadow-lg shadow-purple-400/50" style={{animationDelay: '3s'}}></div>
          <div className="floating-element absolute top-2/3 right-1/6 w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full animate-pulse shadow-lg shadow-blue-400/50" style={{animationDelay: '0.5s'}}></div>
        </div>
        
                 {/* Top Marquee - MEME themed */}
         <div className="relative z-20 bg-gradient-to-r from-purple-800/30 to-pink-800/30 overflow-hidden py-4 border-y border-purple-400/20 mb-8">
           <div className="flex whitespace-nowrap animate-marquee">
             <span className="text-lg font-bold text-purple-300 mx-16 tracking-wide">OTTO DIGITAL CONTENT COLLECTION</span>
             <span className="text-lg font-bold text-pink-300 mx-16 tracking-wide">COMMUNITY DRIVEN CULTURE</span>
             <span className="text-lg font-bold text-cyan-300 mx-16 tracking-wide">AUTHENTIC DIGITAL EXPRESSION</span>
             <span className="text-lg font-bold text-yellow-300 mx-16 tracking-wide">INNOVATIVE CONTENT CREATION</span>
             <span className="text-lg font-bold text-purple-300 mx-16 tracking-wide">OTTO DIGITAL CONTENT COLLECTION</span>
             <span className="text-lg font-bold text-pink-300 mx-16 tracking-wide">COMMUNITY DRIVEN CULTURE</span>
             <span className="text-lg font-bold text-cyan-300 mx-16 tracking-wide">AUTHENTIC DIGITAL EXPRESSION</span>
             <span className="text-lg font-bold text-yellow-300 mx-16 tracking-wide">INNOVATIVE CONTENT CREATION</span>
           </div>
         </div>
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-16">
            <span className="scroll-fade text-cyan-400 text-lg font-bold tracking-wide uppercase animate-pulse">OTTO LOVES MEMES</span>
            <h2 className="scroll-fade text-5xl md:text-6xl font-black text-white mt-4 hover:scale-105 transition-transform duration-300 cursor-pointer">
              OTTO MEMES
            </h2>
                         <p className="scroll-fade text-gray-400 mt-4 text-lg animate-bounce">Digital content collection showcasing community creativity</p>
          </div>
          
                     {/* Middle Marquee - Moving opposite direction */}
           <div className="relative z-20 bg-gradient-to-l from-cyan-800/30 to-blue-800/30 overflow-hidden py-3 border-y border-cyan-400/20 mb-8 rounded-lg">
             <div className="flex whitespace-nowrap animate-marquee-reverse">
               <span className="text-base font-semibold text-cyan-300 mx-12 tracking-wide">DIGITAL ASSET INNOVATION</span>
               <span className="text-base font-semibold text-blue-300 mx-12 tracking-wide">CREATIVE COMMUNITY PLATFORM</span>
               <span className="text-base font-semibold text-purple-300 mx-12 tracking-wide">DECENTRALIZED CONTENT NETWORK</span>
               <span className="text-base font-semibold text-green-300 mx-12 tracking-wide">BLOCKCHAIN POWERED CULTURE</span>
               <span className="text-base font-semibold text-cyan-300 mx-12 tracking-wide">DIGITAL ASSET INNOVATION</span>
               <span className="text-base font-semibold text-blue-300 mx-12 tracking-wide">CREATIVE COMMUNITY PLATFORM</span>
               <span className="text-base font-semibold text-purple-300 mx-12 tracking-wide">DECENTRALIZED CONTENT NETWORK</span>
               <span className="text-base font-semibold text-green-300 mx-12 tracking-wide">BLOCKCHAIN POWERED CULTURE</span>
             </div>
           </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {/* Enhanced Meme Grid with more animations */}
            <div className="aspect-square rounded-2xl shadow-xl overflow-hidden group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 hover:rotate-2">
              <img 
                src="/lovable-uploads/ottoonstage.jpg" 
                alt="OTTO Meme 1" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="aspect-square rounded-2xl shadow-xl overflow-hidden group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 hover:-rotate-1">
              <img 
                src="/lovable-uploads/photo_2025-06-27_22-29-35.jpg" 
                alt="OTTO Meme 2" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="aspect-square rounded-2xl shadow-xl overflow-hidden group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20 hover:rotate-1">
              <img 
                src="/lovable-uploads/photo_2025-06-27_22-29-38.jpg" 
                alt="OTTO Meme 3" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="aspect-square rounded-2xl shadow-xl overflow-hidden group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20 hover:-rotate-2">
              <img 
                src="/lovable-uploads/47cd0849-564e-4468-9718-a44679993c82.png" 
                alt="OTTO Meme 4" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="aspect-square rounded-2xl shadow-xl overflow-hidden group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 hover:rotate-3">
              <img 
                src="/lovable-uploads/8474c612-76c8-48c0-890e-86d5b53582c8.png" 
                alt="OTTO Meme 5" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="aspect-square rounded-2xl shadow-xl overflow-hidden group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/20 hover:-rotate-1">
              <img 
                src="/lovable-uploads/ottoonstage.jpg" 
                alt="OTTO Meme 6" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pink-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
          
                     {/* Bottom Marquee - Fast moving with different content */}
           <div className="relative z-20 bg-gradient-to-r from-yellow-800/30 to-orange-800/30 overflow-hidden py-3 border-y border-yellow-400/20 mb-4 rounded-lg">
             <div className="flex whitespace-nowrap animate-marquee" style={{animationDuration: '15s'}}>
               <span className="text-sm font-semibold text-yellow-300 mx-10 tracking-wide">NEXT GENERATION DIGITAL CULTURE</span>
               <span className="text-sm font-semibold text-orange-300 mx-10 tracking-wide">CREATIVE EXPRESSION PLATFORM</span>
               <span className="text-sm font-semibold text-red-300 mx-10 tracking-wide">INNOVATIVE CONTENT ECOSYSTEM</span>
               <span className="text-sm font-semibold text-pink-300 mx-10 tracking-wide">COMMUNITY POWERED CREATIVITY</span>
               <span className="text-sm font-semibold text-yellow-300 mx-10 tracking-wide">NEXT GENERATION DIGITAL CULTURE</span>
               <span className="text-sm font-semibold text-orange-300 mx-10 tracking-wide">CREATIVE EXPRESSION PLATFORM</span>
               <span className="text-sm font-semibold text-red-300 mx-10 tracking-wide">INNOVATIVE CONTENT ECOSYSTEM</span>
               <span className="text-sm font-semibold text-pink-300 mx-10 tracking-wide">COMMUNITY POWERED CREATIVITY</span>
             </div>
           </div>
          
                     {/* Extra Slow Marquee with different styling */}
           <div className="relative z-20 bg-gradient-to-r from-indigo-800/40 to-violet-800/40 overflow-hidden py-2 border border-indigo-400/30 rounded-full">
             <div className="flex whitespace-nowrap animate-marquee-reverse" style={{animationDuration: '45s'}}>
               <span className="text-xs font-medium text-indigo-200 mx-8 tracking-wider">OTTO CONTENT INNOVATION</span>
               <span className="text-xs font-medium text-violet-200 mx-8 tracking-wider">DIGITAL ART REVOLUTION</span>
               <span className="text-xs font-medium text-purple-200 mx-8 tracking-wider">CREATIVE COMMUNITY VISION</span>
               <span className="text-xs font-medium text-indigo-200 mx-8 tracking-wider">OTTO CONTENT INNOVATION</span>
               <span className="text-xs font-medium text-violet-200 mx-8 tracking-wider">DIGITAL ART REVOLUTION</span>
               <span className="text-xs font-medium text-purple-200 mx-8 tracking-wider">CREATIVE COMMUNITY VISION</span>
             </div>
           </div>
        </div>
      </section>

      {/* Big Social Icons Footer */}
      <footer className="relative z-20 py-20 bg-gradient-to-b from-black to-gray-900 overflow-hidden">
        {/* OTTO Background */}
        <div className="absolute inset-0 opacity-10">
          <img 
            src="/ottomain.png" 
            alt="OTTO Background" 
            className="w-full h-full object-contain object-center"
          />
        </div>
        
        {/* Elegant gradient glow at top */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-cyan-500/20 via-cyan-500/5 to-transparent"></div>
        
        {/* Floating social-themed orbs */}
        <div className="absolute top-10 left-1/4 w-20 h-20 bg-cyan-500/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-16 right-1/4 w-16 h-16 bg-blue-500/15 rounded-full blur-xl animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-10 left-1/5 w-24 h-24 bg-purple-500/8 rounded-full blur-2xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-16 right-1/5 w-18 h-18 bg-cyan-400/12 rounded-full blur-xl animate-pulse animation-delay-3000"></div>
        
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          {/* OTTO Logo */}
          <div className="mb-12">
            <img 
              src="/ottotext.png" 
              alt="OTTO" 
              className="w-48 h-auto mx-auto hover:scale-110 transition-transform duration-300"
            />
          </div>
          
          {/* Big Social Icons */}
          <div className="flex items-center justify-center gap-8 mb-12">
            {/* Twitter/X */}
            <a 
              href="#" 
              className="group relative w-20 h-20 bg-gradient-to-br from-gray-800 to-black hover:from-cyan-600 hover:to-cyan-700 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 border-4 border-cyan-400/30 hover:border-cyan-400 shadow-2xl hover:shadow-cyan-500/50"
            >
              <svg className="w-10 h-10 text-white group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <div className="absolute inset-0 bg-cyan-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
            </a>
            
            {/* Telegram */}
            <a 
              href="#" 
              className="group relative w-20 h-20 bg-gradient-to-br from-gray-800 to-black hover:from-blue-500 hover:to-blue-600 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 border-4 border-blue-400/30 hover:border-blue-400 shadow-2xl hover:shadow-blue-500/50"
            >
              <svg className="w-10 h-10 text-white group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              <div className="absolute inset-0 bg-blue-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
            </a>
            
            {/* Discord */}
            <a 
              href="#" 
              className="group relative w-20 h-20 bg-gradient-to-br from-gray-800 to-black hover:from-purple-600 hover:to-purple-700 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 border-4 border-purple-400/30 hover:border-purple-400 shadow-2xl hover:shadow-purple-500/50"
            >
              <svg className="w-10 h-10 text-white group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0190 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z"/>
              </svg>
              <div className="absolute inset-0 bg-purple-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
            </a>
            
            {/* DexScreener */}
            <a 
              href="#" 
              className="group relative w-20 h-20 bg-gradient-to-br from-gray-800 to-black hover:from-green-600 hover:to-green-700 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 border-4 border-green-400/30 hover:border-green-400 shadow-2xl hover:shadow-green-500/50"
            >
              <svg className="w-10 h-10 text-white group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 10.93C16.16 26.74 20 22.55 20 17V7l-10-5z"/>
              </svg>
              <div className="absolute inset-0 bg-green-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
            </a>
            
            {/* CoinGecko */}
            <a 
              href="#" 
              className="group relative w-20 h-20 bg-gradient-to-br from-gray-800 to-black hover:from-yellow-500 hover:to-yellow-600 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 border-4 border-yellow-400/30 hover:border-yellow-400 shadow-2xl hover:shadow-yellow-500/50"
            >
              <svg className="w-10 h-10 text-white group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.745.094.115.109.215.08.334-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
              </svg>
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
          <p className="scroll-fade text-cyan-300/60 mb-2">
            The future of crypto referrals, built for the community
          </p>
          <p className="scroll-fade text-sky-400/40 text-sm">
            Powered by Solana • Built with ❤️
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
