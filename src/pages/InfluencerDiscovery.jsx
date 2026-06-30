import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../store/authContext';
import { Search, MessageSquare, Sparkles, MapPin, Users, TrendingUp, Tag } from 'lucide-react';

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

const InfluencerDiscovery = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [platform, setPlatform] = useState('');
  const [minFollowers, setMinFollowers] = useState('');
  const [minEngagement, setMinEngagement] = useState('');

  const loadInfluencers = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      if (location) params.location = location;
      if (minFollowers) params.minFollowers = minFollowers;
      if (minEngagement) params.minEngagement = minEngagement;

      const res = await api.get('/users/influencers', { params });
      let filtered = res.data;

      if (platform) {
        filtered = filtered.filter((inf) =>
          (inf.socialAccounts || []).some(
            (acct) => acct.platform?.toLowerCase() === platform.toLowerCase()
          )
        );
      }

      setInfluencers(filtered);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  }, [search, category, location, platform, minFollowers, minEngagement]);

  useEffect(() => {
    const timer = setTimeout(() => loadInfluencers(), 300);
    return () => clearTimeout(timer);
  }, [loadInfluencers]);

  const handleStartChat = async (creatorId) => {
    if (!user) {
      alert('Please log in first to chat with creators.');
      navigate('/login');
      return;
    }
    try {
      const res = await api.post('/chats', { participantId: creatorId });
      navigate('/chat', { state: { activeChatId: res.data._id } });
    } catch (err) {
      alert('Failed to initialize conversation');
    }
  };

  const formatCount = (n) => {
    if (!n) return '0';
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
  };

  const maxFollowers = (socialAccounts) => {
    if (!socialAccounts || socialAccounts.length === 0) return 0;
    return Math.max(...socialAccounts.map((a) => a.followers || 0));
  };

  const maxEngagement = (socialAccounts) => {
    if (!socialAccounts || socialAccounts.length === 0) return 0;
    return Math.max(...socialAccounts.map((a) => a.engagementRate || 0));
  };

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text flex flex-col font-sans overflow-x-hidden selection:bg-pink-500 selection:text-white relative">
      <Navbar />
      <GeoParticleBackground />

      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.1)_0%,rgba(14,129,236,0)_70%)] blur-[90px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.1)_0%,rgba(14,129,236,0)_70%)] blur-[100px] pointer-events-none z-0" />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-12 animate-fade-in relative z-10">
        <h2 className="text-2xl font-bold font-display text-white mb-6 flex items-center space-x-2">
          <Sparkles className="text-pink-400" />
          <span>Discover <span className="bg-gradient-to-r from-pink-400 to-indigo-400 bg-clip-text text-transparent font-semibold font-display">Content Creator Talent</span></span>
        </h2>

        <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/40 backdrop-blur-md p-5 shadow-2xl mb-8 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute inset-y-0 left-3.5 my-auto h-4 w-4 text-neutral-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search creators by name..."
              className="w-full rounded-full border border-neutral-800 bg-neutral-950/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-600 focus:border-pink-500/60 focus:ring-2 focus:ring-pink-500/10 focus:outline-none transition-all font-sans"
            />
          </div>

          <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border border-neutral-800 py-2 px-3.5 text-xs bg-neutral-950/80 text-neutral-300 focus:outline-none focus:border-pink-500/60 cursor-pointer"
            >
              <option value="">All Categories</option>
              <option value="tech">Tech</option>
              <option value="beauty">Beauty</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="food">Food</option>
              <option value="travel">Travel</option>
              <option value="fashion">Fashion</option>
              <option value="fitness">Fitness</option>
              <option value="gaming">Gaming</option>
            </select>

            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="rounded-xl border border-neutral-800 py-2 px-3.5 text-xs bg-neutral-950/80 text-neutral-300 focus:outline-none focus:border-pink-500/60 cursor-pointer"
            >
              <option value="">All Platforms</option>
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
            </select>

            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location (e.g. Odisha)"
              className="rounded-xl border border-neutral-800 py-2 px-3.5 text-xs bg-neutral-950/50 text-white placeholder-neutral-600 focus:border-pink-500/60 focus:ring-2 focus:ring-pink-500/10 focus:outline-none transition-all font-sans w-32"
            />

            <select
              value={minFollowers}
              onChange={(e) => setMinFollowers(e.target.value)}
              className="rounded-xl border border-neutral-800 py-2 px-3.5 text-xs bg-neutral-950/80 text-neutral-300 focus:outline-none focus:border-pink-500/60 cursor-pointer"
            >
              <option value="">Min Followers</option>
              <option value="1000">1K+</option>
              <option value="5000">5K+</option>
              <option value="10000">10K+</option>
              <option value="50000">50K+</option>
              <option value="100000">100K+</option>
              <option value="500000">500K+</option>
              <option value="1000000">1M+</option>
            </select>

            <select
              value={minEngagement}
              onChange={(e) => setMinEngagement(e.target.value)}
              className="rounded-xl border border-neutral-800 py-2 px-3.5 text-xs bg-neutral-950/80 text-neutral-300 focus:outline-none focus:border-pink-500/60 cursor-pointer"
            >
              <option value="">Min Engagement</option>
              <option value="1">1%+</option>
              <option value="2">2%+</option>
              <option value="3">3%+</option>
              <option value="5">5%+</option>
              <option value="10">10%+</option>
              <option value="15">15%+</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-16 text-sm text-neutral-500">Searching creators...</div>
          ) : influencers.length === 0 ? (
            <div className="col-span-full text-center py-16 text-sm text-neutral-500 border border-dashed border-neutral-800 rounded-2xl bg-neutral-900/10">
              No influencers match your search filters
            </div>
          ) : (
            influencers.map((c) => (
              <div key={c._id} className="rounded-2xl border border-neutral-800/80 bg-neutral-900/30 p-6 shadow-xl hover:border-neutral-700/80 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between min-h-[290px]">
                <div>
                  <div className="flex items-center space-x-4 mb-4">
                    {c.profileImage ? (
                      <img src={`http://localhost:5001${c.profileImage}`} alt="" className="h-12 w-12 rounded-full object-cover border border-neutral-800" />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-indigo-500/10 flex items-center justify-center font-bold text-indigo-400 border border-indigo-500/25">
                        {c.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-white flex items-center">
                        {c.name}
                        <span className="ml-1.5 bg-brand-500 text-white rounded-full p-[1px] text-[6px]">✓</span>
                      </h4>
                      <p className="text-[10px] text-neutral-500 font-mono">Verified Platform Creator</p>
                    </div>
                  </div>

                  {(c.categories?.length > 0 || c.location) && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {c.categories?.map((cat) => (
                        <span key={cat} className="inline-flex items-center gap-1 rounded-full bg-pink-500/10 px-2.5 py-0.5 text-[10px] font-medium text-pink-300 border border-pink-500/20">
                          <Tag size={10} />
                          {cat}
                        </span>
                      ))}
                      {c.location && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-medium text-indigo-300 border border-indigo-500/20">
                          <MapPin size={10} />
                          {c.location}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3 mt-2">
                    {(c.socialAccounts || []).slice(0, 2).map((acct, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                        <span className="capitalize text-neutral-500">{acct.platform}</span>
                        <span className="flex items-center gap-0.5" title="Followers">
                          <Users size={11} className="text-neutral-500" />
                          {formatCount(acct.followers)}
                        </span>
                        <span className="flex items-center gap-0.5" title="Engagement Rate">
                          <TrendingUp size={11} className="text-neutral-500" />
                          {acct.engagementRate ? `${acct.engagementRate}%` : '-'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 border-t border-neutral-900 pt-4 flex justify-between items-center">
                  <Link
                    to={`/influencer/${c._id}`}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold font-display transition-colors"
                  >
                    View Portfolio
                  </Link>
                  <button
                    onClick={() => handleStartChat(c._id)}
                    className="rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-650 px-4 py-2 text-xs font-bold text-white hover:opacity-95 shadow-md shadow-purple-600/15 transition-all duration-200 flex items-center space-x-1.5 cursor-pointer"
                  >
                    <MessageSquare size={14} />
                    <span>Chat Now</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default InfluencerDiscovery;
