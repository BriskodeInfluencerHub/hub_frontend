import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/authContext';
import Navbar from '../components/Navbar';
import { 
  Search, 
  ArrowRight, 
  Shield, 
  Tag, 
  Target, 
  Sparkles, 
  MapPin, 
  Star, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  Instagram, 
  Youtube, 
  Heart, 
  Users, 
  Handshake, 
  BarChart3, 
  Trophy, 
  Briefcase, 
  UserCheck
} from 'lucide-react';

// Import generated local assets
import heroNeonCreator from '../assets/hero_neon_creator.png';
import brandAdvocate from '../assets/brand_advocate.png';
import influencerCreative from '../assets/influencer_creative.png';
import creatorAnanya from '../assets/creator_ananya.png';
import creatorSubham from '../assets/creator_subham.png';
import creatorLipi from '../assets/creator_lipi.png';
import creatorDebasis from '../assets/creator_debasis.png';
import discoverFitness from '../assets/discover_fitness.png';
import discoverPhotography from '../assets/discover_photography.png';
import discoverBeauty from '../assets/discover_beauty.png';
import discoverTravel from '../assets/discover_travel.png';
import discoverLifestyle from '../assets/discover_lifestyle.png';

const GeoParticleBackground = () => {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Mouse interaction state
    const mouse = {
      x: null,
      y: null,
      radius: 150 // Connection radius for mouse lines
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    class Particle {
      constructor(w, h) {
        this.w = w;
        this.h = h;
        this.reset();
        // Random placement initially
        this.x = Math.random() * w;
        this.y = Math.random() * h;
      }

      reset() {
        this.x = Math.random() * this.w;
        this.y = Math.random() * this.h;
        this.size = Math.random() * 2.5 + 1.5; // particle size 1.5px to 4px (more visible)
        this.vx = (Math.random() - 0.5) * 0.4; // slow drifting speed
        this.vy = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.45 + 0.35; // higher opacity for visibility (0.35 to 0.8)
        this.color = Math.random() > 0.5 
          ? `rgba(236, 72, 153, ${this.opacity})` // Pink
          : `rgba(99, 102, 241, ${this.opacity})`; // Indigo
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around borders or bounce
        if (this.x < 0 || this.x > this.w) this.vx *= -1;
        if (this.y < 0 || this.y > this.h) this.vy *= -1;

        if (this.x < 0) this.x = 0;
        if (this.x > this.w) this.x = this.w;
        if (this.y < 0) this.y = 0;
        if (this.y > this.h) this.y = this.h;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const particles = [];
    const count = 95; // Increased particle count for richer density

    for (let i = 0; i < count; i++) {
      particles.push(new Particle(canvas.width, canvas.height));
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      // Draw interactive connections (geometric mesh network lines)
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        
        // Connections between particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 125) { // slightly larger connection range
            const alpha = (1 - dist / 125) * 0.28; // higher line opacity (up to 0.28)
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`; // indigo lines
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Connections to mouse cursor
        if (mouse.x !== null && mouse.y !== null) {
          const dxMouse = p1.x - mouse.x;
          const dyMouse = p1.y - mouse.y;
          const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

          if (distMouse < mouse.radius) {
            const alpha = (1 - distMouse / mouse.radius) * 0.45; // much brighter connections to cursor (up to 0.45)
            ctx.strokeStyle = `rgba(236, 72, 153, ${alpha})`; // pink cursor lines
            ctx.lineWidth = 1.0;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="theme-particle fixed inset-0 w-full h-full pointer-events-none z-0 bg-transparent"
    />
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.role === 'influencer') {
      navigate(`/influencer/${user._id || user.id}`);
    }
  }, [user, navigate]);

  const carouselImages = [
    heroNeonCreator,
    creatorAnanya,
    creatorSubham,
    creatorLipi,
    creatorDebasis
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  // Filters state for Discover Section
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [followersFilter, setFollowersFilter] = useState('All');
  const [engagementFilter, setEngagementFilter] = useState('All');

  // Discover Influencers Mock Data
  const influencers = [
    {
      id: 1,
      name: 'Priya Fitness',
      category: 'Fitness',
      location: 'Bhubaneswar',
      followers: '110K',
      engagement: '4.6%',
      image: discoverFitness,
      isLiked: false,
    },
    {
      id: 2,
      name: 'Clicker Sonu',
      category: 'Photography',
      location: 'Cuttack',
      followers: '85K',
      engagement: '5.0%',
      image: discoverPhotography,
      isLiked: false,
    },
    {
      id: 3,
      name: 'Glam By Riya',
      category: 'Beauty',
      location: 'Bhubaneswar',
      followers: '132K',
      engagement: '4.9%',
      image: discoverBeauty,
      isLiked: true,
    },
    {
      id: 4,
      name: 'Odisha Explorer',
      category: 'Travel',
      location: 'Puri',
      followers: '98K',
      engagement: '5.7%',
      image: discoverTravel,
      isLiked: false,
    },
    {
      id: 5,
      name: 'Life With Sweta',
      category: 'Lifestyle',
      location: 'Bhubaneswar',
      followers: '76K',
      engagement: '4.3%',
      image: discoverLifestyle,
      isLiked: false,
    },
  ];

  const [influencerList, setInfluencerList] = useState(influencers);

  // Toggle favorite/like state
  const handleLike = (id) => {
    setInfluencerList(prev => 
      prev.map(inf => inf.id === id ? { ...inf, isLiked: !inf.isLiked } : inf)
    );
  };

  // Filter logic
  const filteredInfluencers = influencerList.filter(inf => {
    if (categoryFilter !== 'All' && inf.category !== categoryFilter) return false;
    if (locationFilter !== 'All' && inf.location !== locationFilter) return false;
    if (followersFilter !== 'All') {
      const followersNum = parseInt(inf.followers);
      if (followersFilter === 'Under 100K' && followersNum >= 100) return false;
      if (followersFilter === '100K+' && followersNum < 100) return false;
    }
    if (engagementFilter !== 'All') {
      const engNum = parseFloat(inf.engagement);
      if (engagementFilter === 'Under 5%' && engNum >= 5.0) return false;
      if (engagementFilter === '5%+' && engNum < 5.0) return false;
    }
    return true;
  });

  return (
    <div className="flex min-h-screen flex-col bg-theme-bg text-theme-text font-sans overflow-x-hidden selection:bg-pink-500 selection:text-white relative">
      <Navbar />
      <GeoParticleBackground />

      {/* Decorative Glow Background Vectors */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.12)_0%,rgba(14,129,236,0)_70%)] blur-[100px] pointer-events-none z-0" />
      <div className="absolute top-[25%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.12)_0%,rgba(14,129,236,0)_70%)] blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] left-[-5%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(14,129,236,0.1)_0%,rgba(236,72,153,0)_70%)] blur-[100px] pointer-events-none z-0" />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-16 lg:pb-32 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
            
            {/* Left Column: Headline and CTAs */}
            <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-pink-500/10 border border-pink-500/20 px-3 py-1 rounded-full text-xs font-semibold text-pink-450 uppercase tracking-widest font-display animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                <span>India's First Brand-Influencer Connection Hub</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display leading-[1.1] text-white">
                Where Brands Meet <br />
                <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-400 bg-clip-text text-transparent">
                  Genuine Influencers
                </span>
              </h1>

              <p className="max-w-xl text-theme-text-secondary text-base leading-relaxed mx-auto lg:mx-0 font-sans">
                Connect your brand with trusted, verified influencers across Odisha and beyond. Our platform makes influencer marketing simple, transparent, and result-driven by helping brands discover authentic creators at genuine prices.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                <Link
                  to="/register"
                  className="group flex items-center justify-center rounded-full bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 px-8 py-3.5 text-sm font-bold text-white shadow-[0_4px_18px_rgba(236,72,153,0.3)] hover:shadow-[0_6px_22px_rgba(236,72,153,0.45)] hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span>Find Influencers</span>
                  <Search size={16} className="ml-2" />
                </Link>

                <Link
                  to="/register"
                  className="group flex items-center justify-center rounded-full border border-neutral-750 bg-neutral-900/60 hover:bg-neutral-800 px-8 py-3.5 text-sm font-bold text-white hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span>I'm a Creator</span>
                  <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Overlapping Creator Faces & Trust Signals */}
              <div className="pt-6 border-t border-neutral-900/80 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-xs text-neutral-400">
                <div className="flex -space-x-3">
                  <img src={creatorAnanya} alt="" className="h-10 w-10 rounded-full border-2 border-[#050314] object-cover" />
                  <img src={creatorSubham} alt="" className="h-10 w-10 rounded-full border-2 border-[#050314] object-cover" />
                  <img src={creatorLipi} alt="" className="h-10 w-10 rounded-full border-2 border-[#050314] object-cover" />
                  <img src={creatorDebasis} alt="" className="h-10 w-10 rounded-full border-2 border-[#050314] object-cover" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="font-bold text-white"><span className="text-pink-500">10K+</span> Influencers &bull; <span className="text-indigo-400">500+</span> Brands</p>
                  <p className="text-neutral-500 text-[11px] mt-0.5">Trusted by creators & businesses across Odisha</p>
                </div>
              </div>
            </div>

            {/* Right Column: Floating Interactive Creator Panels Stack */}
            <div className="lg:col-span-6 mt-16 lg:mt-0 relative h-[480px] w-full max-w-[480px] mx-auto z-10 flex items-center justify-center">
              
              {/* Pulse glowing decoration behind stack */}
              <div className="absolute w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl -z-10 animate-pulse"></div>

              {/* Central Neon stream guy card */}
              <div className="relative w-[300px] h-[300px] rounded-3xl overflow-hidden border border-neutral-800 shadow-[0_0_50px_rgba(99,102,241,0.25)] bg-[#0c0a21]">
                <img 
                  key={currentImageIndex}
                  src={carouselImages[currentImageIndex]} 
                  alt="Featured Creator" 
                  className="w-full h-full object-cover opacity-90 animate-fade-in transition-all duration-700 ease-in-out"
                />
                {/* Floating Social Reels Icon overlay */}
                <div className="absolute top-4 right-4 bg-pink-500/20 backdrop-blur-md border border-pink-500/30 p-2 rounded-xl shadow-lg">
                  <Instagram size={18} className="text-pink-400" />
                </div>
                <div className="absolute bottom-4 left-4 bg-red-600/20 backdrop-blur-md border border-red-500/30 p-2 rounded-xl shadow-lg">
                  <Youtube size={18} className="text-red-500" />
                </div>
              </div>

              {/* Card 1: Ananya Mishra (Fashion Creator) - Floating top right */}
              <div className="absolute -top-4 -right-2 bg-neutral-950/80 backdrop-blur-md border border-neutral-800 hover:border-pink-500/40 p-3.5 rounded-2xl shadow-2xl w-[210px] space-y-2 hover:-translate-y-1 transition-all duration-300 z-20">
                <div className="flex items-center space-x-2">
                  <img src={creatorAnanya} alt="" className="w-8 h-8 rounded-full object-cover border border-neutral-800" />
                  <div className="min-w-0">
                    <h4 className="text-[11px] font-bold text-white truncate flex items-center">
                      Ananya Mishra
                      <span className="ml-1 bg-brand-500 text-white rounded-full p-[1px] text-[6px]">✓</span>
                    </h4>
                    <p className="text-[9px] text-neutral-500 truncate">Fashion Creator</p>
                  </div>
                </div>
                <div className="flex justify-between border-t border-neutral-900 pt-2 text-[10px]">
                  <div>
                    <span className="text-neutral-500 block text-[8px] uppercase font-mono">Followers</span>
                    <span className="font-bold text-white">125K</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[8px] uppercase font-mono">Engagement</span>
                    <span className="font-bold text-pink-400">4.8%</span>
                  </div>
                </div>
                <span className="absolute -top-1 -left-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                </span>
              </div>

              {/* Card 2: Foodie Subham (Food Blogger) - Floating left center */}
              <div className="absolute top-28 -left-4 bg-neutral-950/80 backdrop-blur-md border border-neutral-800 hover:border-brand-500/40 p-3.5 rounded-2xl shadow-2xl w-[200px] space-y-2 hover:-translate-y-1 transition-all duration-300 z-20">
                <div className="flex items-center space-x-2">
                  <img src={creatorSubham} alt="" className="w-8 h-8 rounded-full object-cover border border-neutral-800" />
                  <div className="min-w-0">
                    <h4 className="text-[11px] font-bold text-white truncate flex items-center">
                      Foodie Subham
                      <span className="ml-1 bg-brand-500 text-white rounded-full p-[1px] text-[6px]">✓</span>
                    </h4>
                    <p className="text-[9px] text-neutral-500 truncate">Food Blogger</p>
                  </div>
                </div>
                <div className="flex justify-between border-t border-neutral-900 pt-2 text-[10px]">
                  <div>
                    <span className="text-neutral-500 block text-[8px] uppercase font-mono">Followers</span>
                    <span className="font-bold text-white">78K</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[8px] uppercase font-mono">Engagement</span>
                    <span className="font-bold text-brand-400">5.2%</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Travel With Lipi - Floating bottom right */}
              <div className="absolute bottom-20 -right-6 bg-neutral-950/80 backdrop-blur-md border border-neutral-800 hover:border-indigo-500/40 p-3.5 rounded-2xl shadow-2xl w-[210px] space-y-2 hover:-translate-y-1 transition-all duration-300 z-20">
                <div className="flex items-center space-x-2">
                  <img src={creatorLipi} alt="" className="w-8 h-8 rounded-full object-cover border border-neutral-800" />
                  <div className="min-w-0">
                    <h4 className="text-[11px] font-bold text-white truncate flex items-center">
                      Travel With Lipi
                      <span className="ml-1 bg-brand-500 text-white rounded-full p-[1px] text-[6px]">✓</span>
                    </h4>
                    <p className="text-[9px] text-neutral-500 truncate">Travel Influencer</p>
                  </div>
                </div>
                <div className="flex justify-between border-t border-neutral-900 pt-2 text-[10px]">
                  <div>
                    <span className="text-neutral-500 block text-[8px] uppercase font-mono">Followers</span>
                    <span className="font-bold text-white">95K</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[8px] uppercase font-mono">Engagement</span>
                    <span className="font-bold text-indigo-400">6.1%</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Techy Debasis - Floating bottom center */}
              <div className="absolute bottom-[-16px] right-20 bg-neutral-950/80 backdrop-blur-md border border-neutral-800 hover:border-green-500/40 p-3.5 rounded-2xl shadow-2xl w-[205px] space-y-2 hover:-translate-y-1 transition-all duration-300 z-20">
                <div className="flex items-center space-x-2">
                  <img src={creatorDebasis} alt="" className="w-8 h-8 rounded-full object-cover border border-neutral-800" />
                  <div className="min-w-0">
                    <h4 className="text-[11px] font-bold text-white truncate flex items-center">
                      Techy Debasis
                      <span className="ml-1 bg-brand-500 text-white rounded-full p-[1px] text-[6px]">✓</span>
                    </h4>
                    <p className="text-[9px] text-neutral-500 truncate">Tech Reviewer</p>
                  </div>
                </div>
                <div className="flex justify-between border-t border-neutral-900 pt-2 text-[10px]">
                  <div>
                    <span className="text-neutral-500 block text-[8px] uppercase font-mono">Followers</span>
                    <span className="font-bold text-white">60K</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[8px] uppercase font-mono">Engagement</span>
                    <span className="font-bold text-green-400">3.9%</span>
                  </div>
                </div>
              </div>

              {/* Verified Badge Overlay - Floating bottom left */}
              <div className="absolute bottom-6 left-[10px] bg-neutral-950/90 backdrop-blur-md border border-neutral-850 p-2.5 px-4 rounded-xl shadow-2xl flex items-center space-x-2.5 z-20 hover:scale-105 transition-transform duration-200">
                <div className="bg-emerald-500/20 p-1.5 rounded-lg border border-emerald-500/30">
                  <Check className="text-emerald-400" size={14} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-white block leading-none">Verified</span>
                  <span className="text-[8px] text-neutral-500 uppercase tracking-widest font-mono">Influencers Only</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 border-t border-theme-border bg-theme-bg-alt relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold font-display text-white">Why Choose Us?</h2>
            <div className="w-12 h-1 bg-pink-500 mx-auto mt-3 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Card 1: Verified & Genuine Influencers */}
            <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800/60 rounded-2xl p-6 hover:bg-neutral-900/70 hover:border-neutral-700/80 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(236,72,153,0.05)] hover:-translate-y-1">
              <div className="bg-purple-500/10 border border-purple-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-purple-400">
                <Shield size={22} />
              </div>
              <h3 className="text-lg font-bold font-display text-white mb-2">Verified & Genuine Influencers</h3>
              <p className="text-xs text-neutral-450 leading-relaxed">
                We carefully verify influencer profiles to ensure authentic audiences, real engagement, and quality content. No fake followers. No inflated numbers. Just genuine creators who can help your brand grow.
              </p>
            </div>

            {/* Card 2: Transparent Pricing */}
            <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800/60 rounded-2xl p-6 hover:bg-neutral-900/70 hover:border-neutral-700/80 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(251,146,60,0.05)] hover:-translate-y-1">
              <div className="bg-orange-500/10 border border-orange-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-orange-400">
                <Tag size={22} />
              </div>
              <h3 className="text-lg font-bold font-display text-white mb-2">Transparent Pricing</h3>
              <p className="text-xs text-neutral-450 leading-relaxed">
                Know exactly what you're paying for. Compare influencer rates, campaign packages, and audience insights before making a decision. Get the best value for your marketing budget.
              </p>
            </div>

            {/* Card 3: Smart Influencer Discovery */}
            <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800/60 rounded-2xl p-6 hover:bg-neutral-900/70 hover:border-neutral-700/80 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(14,129,236,0.05)] hover:-translate-y-1">
              <div className="bg-brand-500/10 border border-brand-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-brand-400">
                <Search size={22} />
              </div>
              <h3 className="text-lg font-bold font-display text-white mb-2">Smart Influencer Discovery</h3>
              <p className="text-xs text-neutral-450 leading-relaxed mb-4">
                Find the perfect influencer using advanced filters:
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] text-neutral-350">
                <div className="flex items-center space-x-2">
                  <Check size={12} className="text-brand-400" />
                  <span>Content Category</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check size={12} className="text-brand-400" />
                  <span>Location & City</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check size={12} className="text-brand-400" />
                  <span>Audience Demographics</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check size={12} className="text-brand-400" />
                  <span>Follower Range</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check size={12} className="text-brand-400" />
                  <span>Engagement Rate</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check size={12} className="text-brand-400" />
                  <span>Language Preference</span>
                </div>
              </div>
            </div>

            {/* Card 4: Product & Industry-Based Matching */}
            <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800/60 rounded-2xl p-6 hover:bg-neutral-900/70 hover:border-neutral-700/80 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(236,72,153,0.05)] hover:-translate-y-1">
              <div className="bg-pink-500/10 border border-pink-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-pink-400">
                <Target size={22} />
              </div>
              <h3 className="text-lg font-bold font-display text-white mb-2">Product & Industry-Based Matching</h3>
              <p className="text-xs text-neutral-450 leading-relaxed">
                Whether you're promoting a restaurant, fashion brand, real estate project, beauty product, educational institute, or local business, our platform helps you discover influencers who create content specifically in your industry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Discover Influencers Section */}
      <section className="py-20 relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-extrabold font-display text-white">
                Discover <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-400 bg-clip-text text-transparent">Influencers</span>
              </h2>
              <div className="w-12 h-1 bg-pink-500 mt-3 rounded-full"></div>
            </div>
            
            <Link to="/influencers" className="text-sm font-semibold text-neutral-400 hover:text-white transition-colors flex items-center space-x-1">
              <span>View All Influencers</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          {/* Dynamic Filter Pills */}
          <div className="flex flex-wrap items-center gap-3 bg-neutral-900/30 border border-neutral-800/80 p-3.5 rounded-2xl mb-8">
            
            {/* Category Filter */}
            <div>
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 rounded-xl px-3 py-2 cursor-pointer focus:outline-none focus:border-pink-500/60"
              >
                <option value="All">Category: All</option>
                <option value="Fitness">Fitness</option>
                <option value="Photography">Photography</option>
                <option value="Beauty">Beauty</option>
                <option value="Travel">Travel</option>
                <option value="Lifestyle">Lifestyle</option>
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <select 
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 rounded-xl px-3 py-2 cursor-pointer focus:outline-none focus:border-pink-500/60"
              >
                <option value="All">Location: All</option>
                <option value="Bhubaneswar">Bhubaneswar</option>
                <option value="Cuttack">Cuttack</option>
                <option value="Puri">Puri</option>
              </select>
            </div>

            {/* Followers Filter */}
            <div>
              <select 
                value={followersFilter}
                onChange={(e) => setFollowersFilter(e.target.value)}
                className="bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 rounded-xl px-3 py-2 cursor-pointer focus:outline-none focus:border-pink-500/60"
              >
                <option value="All">Followers: All</option>
                <option value="Under 100K">Under 100K</option>
                <option value="100K+">100K+</option>
              </select>
            </div>

            {/* Engagement Filter */}
            <div>
              <select 
                value={engagementFilter}
                onChange={(e) => setEngagementFilter(e.target.value)}
                className="bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 rounded-xl px-3 py-2 cursor-pointer focus:outline-none focus:border-pink-500/60"
              >
                <option value="All">Engagement: All</option>
                <option value="Under 5%">Under 5.0%</option>
                <option value="5%+">5.0%+</option>
              </select>
            </div>

            <button 
              onClick={() => {
                setCategoryFilter('All');
                setLocationFilter('All');
                setFollowersFilter('All');
                setEngagementFilter('All');
              }}
              className="bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90 text-white text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer ml-auto"
            >
              Reset Filters
            </button>

          </div>

          {/* Influencer Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {filteredInfluencers.map((inf) => (
              <div 
                key={inf.id}
                className="group relative bg-neutral-900/30 border border-neutral-800/80 rounded-2xl overflow-hidden hover:border-neutral-700/80 transition-all duration-300 hover:shadow-xl"
              >
                
                {/* Image Cover */}
                <div className="h-56 relative overflow-hidden bg-neutral-950">
                  <img 
                    src={inf.image} 
                    alt={inf.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Category overlay */}
                  <span className="absolute bottom-3 left-3 bg-[#050314]/70 backdrop-blur-sm border border-neutral-800 text-[10px] text-brand-400 font-semibold px-2.5 py-0.5 rounded-full">
                    {inf.category}
                  </span>

                  {/* Heart button */}
                  <button 
                    onClick={() => handleLike(inf.id)}
                    className="absolute top-3 right-3 bg-neutral-950/60 backdrop-blur-md border border-neutral-850 p-1.5 rounded-full hover:bg-neutral-900 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <Heart size={14} className={inf.isLiked ? "fill-pink-500 text-pink-500" : "text-neutral-300"} />
                  </button>
                </div>

                {/* Body Details */}
                <div className="p-4 space-y-3">
                  <div>
                    <h4 className="font-display font-bold text-sm text-white">{inf.name}</h4>
                    <div className="flex items-center text-[10px] text-neutral-500 mt-1">
                      <MapPin size={10} className="mr-1" />
                      <span>{inf.location}</span>
                    </div>
                  </div>

                  <div className="flex justify-between border-t border-neutral-900 pt-3 text-[11px]">
                    <div>
                      <span className="text-neutral-500 block text-[9px] font-mono">Followers</span>
                      <span className="font-bold text-white">{inf.followers}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-neutral-500 block text-[9px] font-mono">Engagement</span>
                      <span className="font-bold text-pink-400">{inf.engagement}</span>
                    </div>
                  </div>
                </div>

              </div>
            ))}

            {filteredInfluencers.length === 0 && (
              <div className="col-span-full text-center py-16 border border-dashed border-neutral-800 rounded-2xl bg-neutral-900/10">
                <p className="text-sm text-neutral-500">No influencers match the selected filters.</p>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 border-t border-theme-border bg-theme-bg-alt relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold font-display text-white">How It Works</h2>
            <div className="w-12 h-1 bg-pink-500 mx-auto mt-3 rounded-full"></div>
          </div>

          {/* Process Timeline Steps */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start relative">
            
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center space-y-4 relative z-10 group">
              <div className="w-16 h-16 rounded-full bg-gradient-to-b from-purple-900/40 to-neutral-950 border border-purple-500/30 flex items-center justify-center shadow-lg shadow-purple-500/5 group-hover:border-purple-400 group-hover:shadow-purple-500/15 transition-all duration-300">
                <span className="text-purple-400 text-sm font-bold font-mono">01</span>
              </div>
              <div>
                <h3 className="text-sm font-bold font-display text-white mb-1">Create Campaign</h3>
                <p className="text-[11px] text-neutral-450 px-2 leading-relaxed">
                  Share your goals and campaign requirements
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center space-y-4 relative z-10 group">
              <div className="w-16 h-16 rounded-full bg-gradient-to-b from-blue-900/40 to-neutral-950 border border-blue-500/30 flex items-center justify-center shadow-lg shadow-blue-500/5 group-hover:border-blue-400 group-hover:shadow-blue-500/15 transition-all duration-300">
                <span className="text-blue-400 text-sm font-bold font-mono">02</span>
              </div>
              <div>
                <h3 className="text-sm font-bold font-display text-white mb-1">Find Influencers</h3>
                <p className="text-[11px] text-neutral-450 px-2 leading-relaxed">
                  Discover and connect with the right influencers
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center space-y-4 relative z-10 group">
              <div className="w-16 h-16 rounded-full bg-gradient-to-b from-pink-900/40 to-neutral-950 border border-pink-500/30 flex items-center justify-center shadow-lg shadow-pink-500/5 group-hover:border-pink-400 group-hover:shadow-pink-500/15 transition-all duration-300">
                <span className="text-pink-400 text-sm font-bold font-mono">03</span>
              </div>
              <div>
                <h3 className="text-sm font-bold font-display text-white mb-1">Collaborate</h3>
                <p className="text-[11px] text-neutral-450 px-2 leading-relaxed">
                  Work together and create amazing content
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center space-y-4 relative z-10 group">
              <div className="w-16 h-16 rounded-full bg-gradient-to-b from-indigo-900/40 to-neutral-950 border border-indigo-500/30 flex items-center justify-center shadow-lg shadow-indigo-500/5 group-hover:border-indigo-400 group-hover:shadow-indigo-500/15 transition-all duration-300">
                <span className="text-indigo-400 text-sm font-bold font-mono">04</span>
              </div>
              <div>
                <h3 className="text-sm font-bold font-display text-white mb-1">Track Performance</h3>
                <p className="text-[11px] text-neutral-450 px-2 leading-relaxed">
                  Monitor results and engagement analytics
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col items-center text-center space-y-4 relative z-10 group">
              <div className="w-16 h-16 rounded-full bg-gradient-to-b from-orange-900/40 to-neutral-950 border border-orange-500/30 flex items-center justify-center shadow-lg shadow-orange-500/5 group-hover:border-orange-400 group-hover:shadow-orange-500/15 transition-all duration-300">
                <span className="text-orange-400 text-sm font-bold font-mono">05</span>
              </div>
              <div>
                <h3 className="text-sm font-bold font-display text-white mb-1">Grow Your Brand</h3>
                <p className="text-[11px] text-neutral-450 px-2 leading-relaxed">
                  Achieve your marketing goals and maximum impact
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* For Brands vs For Influencers Split Section */}
      <section className="py-20 border-t border-neutral-900 relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* For Brands Column */}
            <div className="bg-gradient-to-br from-neutral-900/60 to-neutral-950/80 border border-neutral-800/80 rounded-3xl p-8 overflow-hidden shadow-2xl relative flex flex-col justify-between hover:border-neutral-700/80 transition-all duration-300">
              <div className="space-y-6">
                <div className="flex items-center space-x-3.5">
                  <div className="bg-pink-500/10 border border-pink-500/20 p-2.5 rounded-xl text-pink-400">
                    <Briefcase size={22} />
                  </div>
                  <h3 className="text-xl font-bold font-display text-white">For Brands</h3>
                </div>

                <ul className="space-y-3.5 text-xs text-neutral-350">
                  <li className="flex items-start space-x-2.5">
                    <span className="bg-pink-500/20 text-pink-400 p-0.5 rounded-full mt-0.5"><Check size={12} /></span>
                    <span>Search and connect with verified influencers.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <span className="bg-pink-500/20 text-pink-400 p-0.5 rounded-full mt-0.5"><Check size={12} /></span>
                    <span>Compare pricing and performance metrics.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <span className="bg-pink-500/20 text-pink-400 p-0.5 rounded-full mt-0.5"><Check size={12} /></span>
                    <span>Launch targeted campaigns.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <span className="bg-pink-500/20 text-pink-400 p-0.5 rounded-full mt-0.5"><Check size={12} /></span>
                    <span>Track campaign performance.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <span className="bg-pink-500/20 text-pink-400 p-0.5 rounded-full mt-0.5"><Check size={12} /></span>
                    <span>Manage collaborations in one place.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 border-t border-neutral-900/60 pt-6">
                <img 
                  src={brandAdvocate} 
                  alt="Brand Advocate Dashboard" 
                  className="w-full h-48 object-cover rounded-2xl border border-neutral-900 shadow-lg"
                />
              </div>
            </div>

            {/* For Influencers Column */}
            <div className="bg-gradient-to-br from-neutral-900/60 to-neutral-950/80 border border-neutral-800/80 rounded-3xl p-8 overflow-hidden shadow-2xl relative flex flex-col justify-between hover:border-neutral-700/80 transition-all duration-300">
              <div className="space-y-6">
                <div className="flex items-center space-x-3.5">
                  <div className="bg-indigo-500/10 border border-indigo-500/20 p-2.5 rounded-xl text-indigo-400">
                    <UserCheck size={22} />
                  </div>
                  <h3 className="text-xl font-bold font-display text-white">For Influencers</h3>
                </div>

                <ul className="space-y-3.5 text-xs text-neutral-350">
                  <li className="flex items-start space-x-2.5">
                    <span className="bg-indigo-500/20 text-indigo-400 p-0.5 rounded-full mt-0.5"><Check size={12} /></span>
                    <span>Get discovered by leading brands.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <span className="bg-indigo-500/20 text-indigo-400 p-0.5 rounded-full mt-0.5"><Check size={12} /></span>
                    <span>Showcase your content portfolio.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <span className="bg-indigo-500/20 text-indigo-400 p-0.5 rounded-full mt-0.5"><Check size={12} /></span>
                    <span>Receive collaboration requests directly.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <span className="bg-indigo-500/20 text-indigo-400 p-0.5 rounded-full mt-0.5"><Check size={12} /></span>
                    <span>Set transparent pricing.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <span className="bg-indigo-500/20 text-indigo-400 p-0.5 rounded-full mt-0.5"><Check size={12} /></span>
                    <span>Build long-term partnerships with businesses.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 border-t border-neutral-900/60 pt-6">
                <img 
                  src={influencerCreative} 
                  alt="Influencer Creative Portfolio" 
                  className="w-full h-48 object-cover rounded-2xl border border-neutral-900 shadow-lg"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Bottom Call-to-Action Banner */}
      <section className="py-12 pb-24 relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 rounded-3xl p-10 md:p-12 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
            
            {/* Wave decoration on banner */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center gap-6 relative z-10 max-w-2xl">
              {/* Overlapping hexagonal/circular creator faces */}
              <div className="flex -space-x-3.5 flex-shrink-0">
                <img src={creatorAnanya} alt="" className="w-12 h-12 rounded-full border-2 border-purple-600 object-cover" />
                <img src={creatorSubham} alt="" className="w-12 h-12 rounded-full border-2 border-purple-600 object-cover" />
                <img src={creatorLipi} alt="" className="w-12 h-12 rounded-full border-2 border-purple-600 object-cover" />
              </div>
              <div className="text-center md:text-left space-y-1">
                <h3 className="text-xl md:text-2xl font-extrabold font-display text-white">
                  Join Odisha's Trusted Influencer Marketing Marketplace
                </h3>
                <p className="text-xs text-purple-100 font-sans">
                  Discover trusted influencers, create impactful campaigns, and grow your brand with confidence.
                </p>
              </div>
            </div>

            <div className="relative z-10 flex-shrink-0">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-full bg-white text-purple-700 hover:bg-neutral-50 px-8 py-3.5 text-sm font-extrabold shadow-lg shadow-black/20 hover:-translate-y-0.5 transition-all duration-200"
              >
                <span>Start Your Journey Today</span>
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-950 border-t border-neutral-900 py-12 text-neutral-500 text-xs font-sans relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-2">
              <span className="text-white font-display font-bold text-sm tracking-wide">BRISKODE</span>
              <span className="bg-gradient-to-r from-pink-400 to-indigo-400 bg-clip-text text-transparent font-semibold font-display text-sm">Influencer Hub</span>
            </div>
            <div className="flex space-x-6 text-[11px]">
              <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            </div>
            <div>
              <p>&copy; {new Date().getFullYear()} BRISKODE. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
