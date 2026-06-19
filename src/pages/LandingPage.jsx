import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Check, Star, ArrowRight, ShieldCheck, Zap, Instagram, Youtube, Sparkles, Lock } from 'lucide-react';

const ParticleBackground = () => {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width || canvas.parentElement.offsetWidth;
      canvas.height = rect.height || canvas.parentElement.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor(w, h) {
        this.w = w;
        this.h = h;
        this.reset();
      }

      reset() {
        this.x = Math.random() * this.w;
        this.y = Math.random() * this.h;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedX = Math.random() * 0.15 - 0.075;
        this.speedY = Math.random() * -0.2 - 0.05;
        this.opacity = Math.random() * 0.4 + 0.15;
        this.color = Math.random() > 0.5 
          ? `rgba(14, 129, 236, ${this.opacity})` 
          : `rgba(99, 102, 241, ${this.opacity})`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.y < 0 || this.x < 0 || this.x > this.w) {
          this.reset();
          this.y = this.h;
        }
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const particles = [];
    const count = 100;

    for (let i = 0; i < count; i++) {
      particles.push(new Particle(canvas.width, canvas.height));
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};

const LandingPage = () => {
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [activeIdx, setActiveIdx] = useState(0);
  const [isMatching, setIsMatching] = useState(false);
  const [matchProgress, setMatchProgress] = useState(100);
  const [matchStatus, setMatchStatus] = useState('matched'); // 'idle' | 'matching' | 'matched'

  const campaignMatches = [
    {
      id: 0,
      brand: "Aura Cosmetics",
      logo: "💄",
      brief: "Organic Skin Serum launch - 15s product demo showing hydration results.",
      budget: "$3,500",
      category: "Lifestyle & Beauty",
      creator: {
        name: "Sarah Vance",
        handle: "@sarah_v",
        category: "Beauty & Style",
        reach: "142K fans",
        engagement: "5.6%",
        color: "bg-blue-50 text-blue-600 border-blue-100",
        avatar: "S",
        platforms: ["instagram", "tiktok"]
      },
      matchPercent: 98,
      securityCode: "ESC-AURA-992A"
    },
    {
      id: 1,
      brand: "Nova Athletics",
      logo: "👟",
      brief: "Aero Running Shoes - High-intensity video routine showcasing cushioning.",
      budget: "$5,200",
      category: "Fitness & Wellness",
      creator: {
        name: "Marcus Flex",
        handle: "@marcus_fit",
        category: "Fitness & Gym",
        reach: "185K fans",
        engagement: "6.8%",
        color: "bg-emerald-50 text-emerald-600 border-emerald-100",
        avatar: "M",
        platforms: ["youtube", "instagram"]
      },
      matchPercent: 96,
      securityCode: "ESC-NOVA-118B"
    },
    {
      id: 2,
      brand: "Pixel Gear",
      logo: "⌨️",
      brief: "RGB Mechanical Keyboard - Typing sound test and review of custom switches.",
      budget: "$1,800",
      category: "Tech & Gaming",
      creator: {
        name: "Leo Dubois",
        handle: "@tech_leo",
        category: "Tech Review",
        reach: "52K subs",
        engagement: "7.2%",
        color: "bg-indigo-50 text-indigo-600 border-indigo-100",
        avatar: "L",
        platforms: ["youtube"]
      },
      matchPercent: 97,
      securityCode: "ESC-PIXL-776X"
    }
  ];

  const triggerMatch = (targetIdx) => {
    if (isMatching) return;
    setMatchStatus('matching');
    setIsMatching(true);
    setMatchProgress(0);

    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(progressInterval);
        setMatchStatus('matched');
        setIsMatching(false);
        setActiveIdx(targetIdx);
      }
      setMatchProgress(progress);
    }, 30);
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!isMatching) {
        const nextIdx = (activeIdx + 1) % campaignMatches.length;
        triggerMatch(nextIdx);
      }
    }, 8500);

    return () => clearInterval(interval);
  }, [activeIdx, isMatching]);

  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-900 font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32 border-b border-neutral-200/60 bg-neutral-50/20 bg-grid-pattern">
        {/* Glow Effects */}
        <div className="glow-bg top-[-150px] left-[-150px] opacity-80"></div>
        <div className="glow-bg bottom-[-150px] right-[-150px] opacity-80"></div>

        {/* Particle Motion Background */}
        <ParticleBackground />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
            
            {/* Left: Content Column */}
            <div className="lg:col-span-5 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 rounded-full bg-neutral-900 text-neutral-50 px-4 py-1.5 text-xs font-medium tracking-wide font-mono shadow-sm">
                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-neutral-300">SYSTEM: Matchmaker Active</span>
              </div>
              
              <h1 className="text-4xl font-extrabold tracking-tight font-display sm:text-5xl lg:text-6xl text-neutral-900 leading-[1.08]">
                Where creator talent gets{' '}
                <span className="block bg-gradient-to-r from-brand-500 via-indigo-500 to-indigo-600 bg-clip-text text-transparent">
                  paid on time.
                </span>
              </h1>
              
              <p className="max-w-lg text-neutral-500 text-base leading-relaxed mx-auto lg:mx-0 font-sans">
                Skip the payment chase. BRISKODE locks campaign budgets in secure smart escrow prior to content production, ensuring guaranteed payouts for creators and verified conversion performance for brands.
              </p>

              <div className="flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start pt-2">
                <Link
                  to="/register"
                  className="group flex items-center justify-center rounded-full bg-gradient-to-r from-brand-500 to-indigo-500 px-8 py-4 text-sm font-bold text-white shadow-[0_4px_18px_rgba(79,70,229,0.25)] hover:shadow-[0_6px_22px_rgba(79,70,229,0.35)] hover:-translate-y-0.5 transition-all duration-200"
                >
                  Onboard Today 
                  <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/influencers"
                  className="flex items-center justify-center rounded-full border border-neutral-200 bg-white px-8 py-4 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
                >
                  Browse Directory
                </Link>
              </div>

              {/* Trust signals badges */}
              <div className="pt-8 border-t border-neutral-200/80 flex flex-wrap gap-x-6 gap-y-3 justify-center lg:justify-start text-[11px] text-neutral-500 font-medium">
                <div className="flex items-center space-x-2">
                  <div className="p-1 rounded bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <ShieldCheck size={12} />
                  </div>
                  <span>Escrow-Secured Funds</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="p-1 rounded bg-amber-50 text-amber-600 border border-amber-100">
                    <Zap size={12} />
                  </div>
                  <span>Instant URL Verification</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="p-1 rounded bg-brand-50 text-brand-600 border border-brand-100">
                    <Check size={12} />
                  </div>
                  <span>Zero Payment Delays</span>
                </div>
              </div>
            </div>

            {/* Right: Interactive Mockup Panel */}
            <div className="lg:col-span-7 mt-16 lg:mt-0 relative">
              
              {/* Backdrops decorator */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-brand-500/10 rounded-full blur-2xl -z-10 animate-float-medium"></div>
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl -z-10 animate-float-slow"></div>

              {/* Main Dashboard Frame */}
              <div className="relative border border-neutral-200/80 rounded-2xl bg-white/80 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden">
                {/* Chrome Window Header */}
                <div className="bg-neutral-50 border-b border-neutral-200/80 px-4 py-3.5 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-red-400/80"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-400/80"></span>
                    <span className="w-3 h-3 rounded-full bg-green-400/80"></span>
                  </div>
                  <div className="bg-neutral-200/50 rounded-lg px-6 py-1 text-[10px] text-neutral-500 font-mono flex items-center space-x-1.5 max-w-[240px] truncate border border-neutral-300/30">
                    <span className="text-neutral-400">https://</span>
                    <span className="font-semibold text-neutral-600">briskode.com/matchmaker</span>
                  </div>
                  <div className="w-12"></div> {/* spacer */}
                </div>

                {/* Dashboard Core Body */}
                <div className="p-5 sm:p-7 grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[380px]">
                  
                  {/* Left Column: Brief Feed */}
                  <div className="md:col-span-5 space-y-3.5">
                    <div className="flex items-center justify-between px-1">
                      <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono">Live Brief Feed</h4>
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {campaignMatches.map((campaign, idx) => {
                        const isActive = idx === activeIdx;
                        return (
                          <button
                            key={campaign.id}
                            onClick={() => triggerMatch(idx)}
                            disabled={isMatching && !isActive}
                            className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 relative ${
                              isActive
                                ? 'border-brand-500 bg-brand-50/40 shadow-[0_4px_12px_rgba(14,129,236,0.04)]'
                                : 'border-neutral-200/60 bg-white hover:bg-neutral-50/50 hover:border-neutral-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="text-base filter drop-shadow-sm">{campaign.logo}</span>
                                <span className="font-display font-bold text-xs text-neutral-800">{campaign.brand}</span>
                              </div>
                              <span className="font-mono text-[9px] font-bold text-neutral-600">{campaign.budget}</span>
                            </div>
                            
                            {isActive && (
                              <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-brand-500 flex items-center justify-center text-[8px] text-white font-bold shadow-md shadow-brand-500/20">
                                →
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    
                    <div className="pt-1 text-center">
                      <p className="text-[9px] text-neutral-400 font-mono">Select a brand brief to test match</p>
                    </div>
                  </div>

                  {/* Right Column: AI recommendation results */}
                  <div className="md:col-span-7 flex flex-col justify-between border-t md:border-t-0 md:border-l border-neutral-200/80 pt-5 md:pt-0 md:pl-6">
                    
                    {/* Recommendation state */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono">AI Recommendation</span>
                        {matchStatus === 'matching' ? (
                          <span className="flex items-center text-[10px] font-bold text-brand-500">
                            <span className="animate-spin mr-1.5">🌀</span> Matching...
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center">
                            <span className="w-1 h-1 rounded-full bg-emerald-500 mr-1 animate-pulse"></span>
                            Match Verified
                          </span>
                        )}
                      </div>

                      {/* Matching profile */}
                      <div className="bg-neutral-50/50 rounded-xl p-4 border border-neutral-200/40 relative overflow-hidden transition-all duration-300">
                        {matchStatus === 'matching' ? (
                          <div className="flex flex-col items-center justify-center py-6 space-y-3">
                            <div className="relative w-14 h-14 flex items-center justify-center">
                              <div className="absolute inset-0 rounded-full border-2 border-brand-100"></div>
                              <div className="absolute inset-0 rounded-full border-2 border-brand-500 border-t-transparent animate-spin"></div>
                              <span className="text-xs font-bold font-mono text-brand-600">{matchProgress}%</span>
                            </div>
                            <p className="text-[10px] font-bold text-neutral-500 font-mono tracking-wide animate-pulse">Analyzing creator performance graph...</p>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-3.5">
                            <div className={`h-12 w-12 rounded-full ${campaignMatches[activeIdx].creator.color} flex items-center justify-center font-extrabold border text-base shadow-sm`}>
                              {campaignMatches[activeIdx].creator.avatar}
                            </div>
                            <div>
                              <div className="flex items-center space-x-1.5">
                                <h5 className="font-display font-bold text-sm text-neutral-900">{campaignMatches[activeIdx].creator.name}</h5>
                                <span className="text-[8px] bg-brand-500 text-white rounded-full flex items-center justify-center w-3.5 h-3.5 font-bold" title="Verified Member">✓</span>
                              </div>
                              <p className="text-xs text-neutral-400 font-medium font-mono">{campaignMatches[activeIdx].creator.handle}</p>
                            </div>
                            
                            <div className="ml-auto text-right">
                              <div className="text-[8px] text-neutral-400 font-bold uppercase tracking-wider font-mono">Match score</div>
                              <div className="font-display font-extrabold text-base text-brand-500 mt-0.5">{campaignMatches[activeIdx].matchPercent}%</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Escrow Agreement Ticket Section */}
                    <div className="mt-5">
                      <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono mb-2.5">Escrow Smart Agreement</div>
                      
                      {matchStatus === 'matching' ? (
                        <div className="border border-dashed border-neutral-200/80 rounded-xl p-6 text-center bg-white/40 min-h-[105px] flex items-center justify-center">
                          <p className="text-[10px] text-neutral-450 font-mono animate-pulse">Holding matching contract in queue...</p>
                        </div>
                      ) : (
                        <div className="group relative border border-neutral-200/80 rounded-xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.01)] overflow-hidden text-left transition-all duration-300 hover:border-brand-400 hover:shadow-[0_8px_24px_rgba(14,129,236,0.04)]">
                          
                          {/* Inner notches for ticket perforating look */}
                          <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-r border-neutral-200/80 z-10"></div>
                          <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-l border-neutral-200/80 z-10"></div>
                          
                          <div className="flex">
                            {/* Left Half: Brief Specs */}
                            <div className="flex-1 p-4 space-y-2 text-[10px] transition-transform duration-300 group-hover:-translate-x-0.5">
                              <span className="font-mono text-[8px] bg-neutral-100 text-neutral-500 px-1.5 py-0.5 rounded font-bold border border-neutral-200/40">
                                {campaignMatches[activeIdx].securityCode}
                              </span>
                              <p className="font-display font-extrabold text-neutral-800 text-xs mt-1">
                                {campaignMatches[activeIdx].brand} Brief
                              </p>
                              <p className="text-neutral-500 text-[10px] line-clamp-2 leading-relaxed">
                                {campaignMatches[activeIdx].brief}
                              </p>
                            </div>
                            
                            {/* Vertical divider */}
                            <div className="relative py-2 flex flex-col justify-between">
                              <div className="w-px h-full border-r border-dashed border-neutral-200"></div>
                            </div>
                            
                            {/* Right Half: Escrow locked indicator */}
                            <div className="w-24 p-4 text-center flex flex-col justify-between items-center transition-transform duration-300 group-hover:translate-x-0.5">
                              <div>
                                <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest font-mono block">Escrow hold</span>
                                <span className="font-display font-extrabold text-base text-neutral-900 block mt-0.5">
                                  {campaignMatches[activeIdx].budget}
                                </span>
                              </div>
                              <span className="rounded-full bg-emerald-50 text-emerald-600 px-2 py-0.5 text-[8px] font-bold border border-emerald-150 flex items-center justify-center space-x-1 mt-2.5">
                                <Lock size={8} className="mr-0.5 text-emerald-500 animate-pulse" />
                                <span>SECURED</span>
                              </span>
                            </div>
                          </div>

                        </div>
                      )}
                    </div>

                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Platform Statistics */}
      <section className="bg-neutral-950 py-16 text-white border-b border-neutral-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs text-brand-400 uppercase tracking-widest font-semibold font-display">Live Ledger</span>
            <h2 className="text-2xl font-bold font-display mt-2 text-white">Decentralized Escrow. Confirmed Analytics.</h2>
          </div>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center border-r border-neutral-800 last:border-0">
              <p className="text-4xl font-bold text-white font-display">10,240</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-neutral-450">Creators Onboarded</p>
            </div>
            <div className="text-center border-r border-neutral-800 last:border-0">
              <p className="text-4xl font-bold text-white font-display">500+</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-neutral-450">Active Brands</p>
            </div>
            <div className="text-center border-r border-neutral-800 last:border-0">
              <p className="text-4xl font-bold text-white font-display">$12.4M</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-neutral-450">Processed Volume</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-white font-display">5.24%</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-neutral-450">Average Engagement</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 border-b border-neutral-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight font-display text-neutral-900 sm:text-4xl">No-Fuss Collaboration</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-neutral-500">
              Three clear stages designed around transparent payments and verified deliverables.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-neutral-150 bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white text-xs font-bold font-display">01</div>
              <h3 className="mt-4 text-lg font-bold font-display text-neutral-800">Brands Post Campaign</h3>
              <p className="mt-2 text-xs text-neutral-500 leading-relaxed">
                Define specifications, select category filters, required followers count, and lock budget in escrow wallet.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-150 bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-white text-xs font-bold font-display">02</div>
              <h3 className="mt-4 text-lg font-bold font-display text-neutral-800">Creators Submit Pitch</h3>
              <p className="mt-2 text-xs text-neutral-500 leading-relaxed">
                Creators submit custom pitch rate. Acceptance locks the escrow payout agreement securely in the database ledger.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-150 bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white text-xs font-bold font-display">03</div>
              <h3 className="mt-4 text-lg font-bold font-display text-neutral-800">Verify & Release Payout</h3>
              <p className="mt-2 text-xs text-neutral-500 leading-relaxed">
                Submit campaign deliverable URL. The system validates posts parameters and immediately credits creator wallet balances.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 border-b border-neutral-100 bg-neutral-50/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold font-display text-neutral-900">Simple Escrow Plans</h2>
            <p className="mt-3 text-xs text-neutral-500">Choose the subscription tier for your brand requirements.</p>
            <div className="mt-6 flex justify-center items-center space-x-3">
              <span className={`text-xs ${billingPeriod === 'monthly' ? 'font-bold text-neutral-900' : 'text-neutral-500'}`}>Monthly</span>
              <button
                onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
                className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border border-neutral-200 bg-neutral-100 transition-colors"
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-brand-500 transition-transform ${billingPeriod === 'yearly' ? 'translate-x-5' : 'translate-x-0'}`}></span>
              </button>
              <span className={`text-xs ${billingPeriod === 'yearly' ? 'font-bold text-neutral-900' : 'text-neutral-500'}`}>Yearly (Save 20%)</span>
            </div>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {pricingPlans.map((plan, idx) => (
              <div
                key={idx}
                className={`relative rounded-2xl bg-white p-8 border border-neutral-200 shadow-sm transition-all hover:shadow-md ${plan.popular ? 'ring-2 ring-brand-500/20 border-brand-500' : ''}`}
              >
                {plan.popular && (
                  <span className="absolute top-0 right-6 -translate-y-1/2 rounded-full bg-gradient-to-r from-brand-500 to-indigo-500 px-3 py-0.5 text-xs font-semibold text-white uppercase tracking-wider">
                    Popular choice
                  </span>
                )}
                <h4 className="text-lg font-bold font-display text-neutral-850">{plan.name}</h4>
                <p className="mt-2 text-xs text-neutral-400 min-h-[32px]">{plan.desc}</p>
                
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-extrabold text-neutral-900 font-display">{plan.price}</span>
                  <span className="text-xs font-semibold text-neutral-450 ml-1">{plan.period}</span>
                </div>

                <ul className="mt-8 space-y-3.5 border-t border-neutral-100 pt-6">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start space-x-2 text-xs text-neutral-600 font-sans">
                      <Check size={14} className="text-brand-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Link
                    to="/register"
                    className={`block text-center rounded-full py-3 text-sm font-semibold transition-colors ${plan.popular ? 'bg-gradient-to-r from-brand-500 to-indigo-500 text-white shadow-sm hover:opacity-90' : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border border-neutral-200'}`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white border-b border-neutral-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold font-display text-neutral-900">Platform FAQs</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="rounded-xl border border-neutral-200 p-5 bg-neutral-50/30">
                <h4 className="text-sm font-bold font-display text-neutral-850">{faq.q}</h4>
                <p className="mt-2 text-xs text-neutral-500 leading-relaxed font-sans">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-xs text-neutral-400 bg-neutral-50/50">
        <p>&copy; {new Date().getFullYear()} BRISKODE. All Rights Reserved. <Link to="/terms" className="hover:underline">Terms</Link> | <Link to="/privacy" className="hover:underline">Privacy Policy</Link></p>
      </footer>
    </div>
  );
};

const pricingPlans = [
  {
    name: 'Starter Brief',
    price: '$49',
    period: '/mo',
    desc: 'For brands starting creator campaigns.',
    features: [
      'Up to 3 active Brief campaigns',
      'Direct chat communication',
      'Unified search platform filters',
      '5% platform transaction fee',
    ],
    cta: 'Start Trial',
    popular: false,
  },
  {
    name: 'Escrow Pro',
    price: '$149',
    period: '/mo',
    desc: 'For brands scaling marketing reach.',
    features: [
      'Unlimited campaign posts',
      'AI matching recommendations',
      'Automated Escrow contract holds',
      '2.5% platform transaction fee',
    ],
    cta: 'Get Started',
    popular: true,
  },
  {
    name: 'Enterprise Agency',
    price: '$399',
    period: '/mo',
    desc: 'Unified controls for marketing teams.',
    features: [
      'Multi-influencer tracking boards',
      'Unified ledger invoicing details',
      '1.5% platform transaction fee',
      'Priority payment support channels',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

const faqs = [
  { q: 'How does escrow guarantee payments?', a: 'When you approve a creator application, the budget is held in our wallet. Once post deliverables are verified by link validation, the code automatically releases escrow to the creator wallet.' },
  { q: 'What counts as a verified deliverable?', a: 'We support link parsing for TikTok Reels, YouTube Videos, and Instagram Posts to confirm the brief guidelines are matched.' },
];

export default LandingPage;
