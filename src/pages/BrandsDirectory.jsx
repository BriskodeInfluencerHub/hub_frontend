import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { Search, Calendar, DollarSign } from 'lucide-react';

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
        this.size = Math.random() * 2.5 + 1.5;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.45 + 0.35;
        this.color = Math.random() > 0.5 
          ? `rgba(236, 72, 153, ${this.opacity})` 
          : `rgba(99, 102, 241, ${this.opacity})`;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

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
    const count = 60;

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

          if (dist < 125) {
            const alpha = (1 - dist / 125) * 0.28;
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        if (mouse.x !== null && mouse.y !== null) {
          const dxMouse = p1.x - mouse.x;
          const dyMouse = p1.y - mouse.y;
          const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

          if (distMouse < mouse.radius) {
            const alpha = (1 - distMouse / mouse.radius) * 0.45;
            ctx.strokeStyle = `rgba(236, 72, 153, ${alpha})`;
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
      className="fixed inset-0 w-full h-full pointer-events-none z-0 bg-transparent"
    />
  );
};

const BrandsDirectory = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/campaigns?status=active')
      .then((res) => {
        setCampaigns(res.data);
      })
      .catch(console.warn)
      .finally(() => setLoading(false));
  }, []);

  const filtered = campaigns.filter(c => {
    if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#050314] text-white flex flex-col font-sans overflow-x-hidden selection:bg-pink-500 selection:text-white relative">
      <Navbar />
      <GeoParticleBackground />

      {/* Glow Effects */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.1)_0%,rgba(14,129,236,0)_70%)] blur-[90px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.1)_0%,rgba(14,129,236,0)_70%)] blur-[100px] pointer-events-none z-0" />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-12 animate-fade-in relative z-10">
        <div className="mb-10">
          <span className="text-xs text-pink-400 uppercase tracking-widest font-bold font-mono">Campaign Roster</span>
          <h1 className="text-3xl font-bold font-display text-white mt-2">
            Active <span className="bg-gradient-to-r from-pink-400 to-indigo-400 bg-clip-text text-transparent font-semibold font-display">Brand Briefs</span>
          </h1>
        </div>

        {/* Glassmorphic Search Filter */}
        <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/40 backdrop-blur-md p-5 shadow-2xl mb-8 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute inset-y-0 left-3.5 my-auto h-4 w-4 text-neutral-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search active campaigns by title..."
              className="w-full rounded-full border border-neutral-800 bg-neutral-950/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-600 focus:border-pink-500/60 focus:ring-2 focus:ring-pink-500/10 focus:outline-none transition-all font-sans"
            />
          </div>
        </div>

        {/* Brand Briefs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-16 text-sm text-neutral-550">Loading campaigns...</div>
          ) : filtered.length === 0 ? (
            <div className="col-span-full text-center py-16 text-sm text-neutral-550 border border-dashed border-neutral-850 rounded-2xl bg-neutral-900/10">No active brand campaigns found</div>
          ) : (
            filtered.map((c) => (
              <div key={c._id} className="rounded-2xl border border-neutral-800/80 bg-neutral-900/30 p-6 shadow-xl hover:border-neutral-700/80 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between min-h-[300px]">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-display font-bold text-sm text-white">{c.title}</h3>
                    <span className="rounded-full bg-pink-500/10 border border-pink-500/25 px-2.5 py-0.5 text-[9px] font-semibold text-pink-400 uppercase tracking-wider font-mono">{c.category}</span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed line-clamp-4 mt-2">{c.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-900 space-y-3.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-500 flex items-center"><Calendar size={14} className="mr-1.5" /> End date:</span>
                    <span className="font-semibold text-neutral-350">{new Date(c.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-500 flex items-center font-bold uppercase"><DollarSign size={14} className="text-neutral-550 mr-0.5" /> Payout:</span>
                    <span className="font-display font-extrabold text-sm text-pink-400">${c.budget.toLocaleString()}</span>
                  </div>
                  <div className="pt-2 flex justify-end">
                    <Link
                      to={`/campaign/${c._id}`}
                      className="rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-650 text-white px-5 py-2.5 text-xs font-semibold hover:opacity-95 shadow-md shadow-purple-600/15 transition-all duration-200 cursor-pointer font-display"
                    >
                      Apply to Brief
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default BrandsDirectory;
