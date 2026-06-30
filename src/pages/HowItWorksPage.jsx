import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
  Sparkles,
  Check,
  Briefcase,
  UserCheck,
  ArrowRight,
  TrendingUp,
  Search,
  MessageSquare,
  ShieldCheck,
  FileText,
  Coins,
  Share2
} from 'lucide-react';

const GeoParticleBackground = () => {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const mouse = {
      x: null,
      y: null,
      radius: 120
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
        this.x = Math.random() * w;
        this.y = Math.random() * h;
      }

      reset() {
        this.x = Math.random() * this.w;
        this.y = Math.random() * this.h;
        this.size = Math.random() * 2 + 1;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.4 + 0.2;
        this.color = Math.random() > 0.5
          ? `rgba(236, 72, 153, ${this.opacity})`
          : `rgba(99, 102, 241, ${this.opacity})`;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > this.w) this.vx *= -1;
        if (this.y < 0 || this.y > this.h) this.vy *= -1;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const particles = [];
    const count = 40;

    for (let i = 0; i < count; i++) {
      particles.push(new Particle(canvas.width, canvas.height));
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            const alpha = (1 - dist / 150) * 0.15;
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousemove', handleMouseMove);
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

const HowItWorksPage = () => {
  const [activeRole, setActiveRole] = useState('brand');

  const brandSteps = [
    {
      num: '01',
      title: 'Post Campaign or Browse Creators',
      desc: 'Define your budget, deliverables, and targets, or search directly from our verified directory of influencers.',
      icon: <Search size={24} className="text-pink-400" />
    },
    {
      num: '02',
      title: 'Fund Escrow Securing Payment',
      desc: 'Lock the campaign budget. Payments are held safely in escrow before work begins to guarantee trust.',
      icon: <ShieldCheck size={24} className="text-purple-400" />
    },
    {
      num: '03',
      title: 'Review and Approve Submissions',
      desc: 'Influencers submit draft content deliverables directly through their creator workspace for your brand review.',
      icon: <FileText size={24} className="text-indigo-400" />
    },
    {
      num: '04',
      title: 'Auto-verify Post Publication',
      desc: 'Once the final content goes live, our platform reads metrics, verifies the post link, and releases the budget.',
      icon: <TrendingUp size={24} className="text-blue-400" />
    }
  ];

  const creatorSteps = [
    {
      num: '01',
      title: 'Create Your Premium Portfolio',
      desc: 'Register as a creator, sync your platforms, upload highlight photos, and add your showcase video portfolio.',
      icon: <UserCheck size={24} className="text-pink-400" />
    },
    {
      num: '02',
      title: 'Apply or Receive Direct Invites',
      desc: 'Apply to open campaign briefs in the directory or receive direct partnership invitations from brands.',
      icon: <MessageSquare size={24} className="text-purple-400" />
    },
    {
      num: '03',
      title: 'Deliver Creative Content',
      desc: 'Collaborate with the brand, agree on drafts, and upload links to your published deliverables.',
      icon: <Share2 size={24} className="text-indigo-400" />
    },
    {
      num: '04',
      title: 'Instant Payout Releases',
      desc: 'Once live posts are validated by our server hook, locked escrow funds are instantly released into your wallet.',
      icon: <Coins size={24} className="text-blue-400" />
    }
  ];

  const currentSteps = activeRole === 'brand' ? brandSteps : creatorSteps;

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text flex flex-col font-sans relative overflow-x-hidden">
      <Navbar />
      <GeoParticleBackground />

      {/* Glow Ambient Effects */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.08)_0%,rgba(14,129,236,0)_70%)] blur-[90px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.08)_0%,rgba(14,129,236,0)_70%)] blur-[100px] pointer-events-none z-0" />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-16 relative z-10 animate-fade-in">

        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase font-mono bg-pink-500/10 text-pink-400 border border-pink-500/20 shadow-sm">
            <Sparkles size={10} className="text-pink-400" />
            <span>Process & Workflows</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight font-display sm:text-5xl bg-gradient-to-r from-white via-neutral-100 to-neutral-450 bg-clip-text text-transparent">
            How it Works
          </h1>
          <p className="text-sm text-neutral-400 max-w-xl mx-auto leading-relaxed">
            We hold campaign payments in safe escrow and auto-verify posts, protecting both brands and creators.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="max-w-md mx-auto mb-16">
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-neutral-950 p-1 border border-neutral-900">
            <button
              onClick={() => setActiveRole('brand')}
              className={`rounded-lg py-2.5 text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${activeRole === 'brand'
                  ? 'bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white shadow-md'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900/40'
                }`}
            >
              <Briefcase size={14} />
              <span>For Brands</span>
            </button>
            <button
              onClick={() => setActiveRole('creator')}
              className={`rounded-lg py-2.5 text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${activeRole === 'creator'
                  ? 'bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white shadow-md'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900/40'
                }`}
            >
              <UserCheck size={14} />
              <span>For Creators</span>
            </button>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20 relative">
          {currentSteps.map((step, idx) => (
            <div
              key={idx}
              className="bg-neutral-900/10 border border-neutral-900/60 rounded-3xl p-6 shadow-2xl relative overflow-hidden group hover:border-pink-500/25 transition-all duration-500 flex flex-col justify-between"
            >
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-neutral-800 to-transparent group-hover:via-pink-500/25 transition-colors" />

              <div className="space-y-6">
                {/* Step Top Bar */}
                <div className="flex justify-between items-center">
                  <div className="p-3 bg-neutral-950 rounded-2xl border border-neutral-850 shadow-inner">
                    {step.icon}
                  </div>
                  <span className="text-[20px] font-extrabold font-mono text-neutral-800 group-hover:text-pink-500/20 transition-colors">
                    {step.num}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-white group-hover:text-pink-400 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                    {step.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Split Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          <div className="bg-gradient-to-br from-neutral-900/30 to-neutral-950/60 border border-neutral-900/60 rounded-3xl p-8 shadow-2xl space-y-6">
            <h3 className="text-lg font-bold font-display text-white">Trust & Security (Escrow Guarantee)</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-sans">
              BRISKODE eliminates the classic payment friction. Brands pre-fund campaigns which holds budgets securely. Creators publish content with complete peace of mind, knowing the payment is already locked and will release instantly when social links are validated.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-neutral-950/40 border border-neutral-900">
                <span className="block text-[18px] font-extrabold font-mono text-pink-500">0%</span>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-mono">Invoice Chasing</span>
              </div>
              <div className="p-4 rounded-2xl bg-neutral-950/40 border border-neutral-900">
                <span className="block text-[18px] font-extrabold font-mono text-indigo-400">100%</span>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-mono">Automatic Payouts</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-neutral-900/30 to-neutral-950/60 border border-neutral-900/60 rounded-3xl p-8 shadow-2xl space-y-6">
            <h3 className="text-lg font-bold font-display text-white">Advanced Conversion Tracking</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-sans">
              No need to rely on static screenshots. Our analytics framework fetches post links directly, recording actual impressions, video views, and audience engagement metrics. Transparent performance tracking allows brands to measure accurate ROI.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-neutral-950/40 border border-neutral-900">
                <span className="block text-[18px] font-extrabold font-mono text-pink-500">Live API</span>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-mono">Data sync hook</span>
              </div>
              <div className="p-4 rounded-2xl bg-neutral-950/40 border border-neutral-900">
                <span className="block text-[18px] font-extrabold font-mono text-indigo-400">Verified</span>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-mono">Account Metrics</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Card Banner */}
        <div className="relative rounded-3xl bg-neutral-900/20 border border-neutral-900/60 p-8 md:p-12 overflow-hidden text-center shadow-2xl">
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-pink-500/25 to-transparent" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold font-display text-white sm:text-3xl">
              Ready to start collaborating?
            </h2>
            <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed font-sans">
              Create your account today and launch campaign collaborations with transparent, performance-verified creator partnerships.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Link
                to="/register"
                className="rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-650 px-6 py-3 text-xs font-bold text-white hover:opacity-95 shadow-lg shadow-purple-600/20 hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2"
              >
                <span>Find Influencers</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                to="/register"
                className="rounded-xl border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900 hover:border-neutral-750 px-6 py-3 text-xs font-bold text-white hover:-translate-y-0.5 transition-all duration-200"
              >
                I'm a Creator
              </Link>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default HowItWorksPage;
