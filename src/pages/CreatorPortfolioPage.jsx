import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../store/authContext';
import api from '../services/api';
import { 
  MapPin, 
  Instagram, 
  Youtube, 
  MessageSquare, 
  ArrowLeft, 
  ExternalLink, 
  Sparkles,
  Award,
  Globe,
  Lock,
  User as UserIcon,
  Check,
  ChevronRight,
  Mail,
  Linkedin
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

const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) 
    ? `https://www.youtube.com/embed/${match[2]}` 
    : null;
};

const CreatorPortfolioPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startingChat, setStartingChat] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError('');
    api.get(`/users/influencers/${id}`)
      .then((res) => {
        setProfile(res.data);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to load influencer profile');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleStartChat = async () => {
    if (!profile?.user?._id) return;
    setStartingChat(true);
    try {
      const res = await api.post('/chats', { participantId: profile.user._id });
      navigate('/chat', { state: { activeChatId: res.data._id } });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to initialize conversation');
    } finally {
      setStartingChat(false);
    }
  };

  const getPlatformIcon = (platform) => {
    if (platform === 'instagram') return <Instagram className="text-pink-400" size={16} />;
    if (platform === 'youtube') return <Youtube className="text-red-500" size={16} />;
    if (platform === 'linkedin') return <Linkedin className="text-blue-400" size={16} />;
    return <Globe className="text-blue-400" size={16} />;
  };

  const getPlatformIconMonochrome = (platform) => {
    if (platform === 'instagram') return <Instagram size={16} />;
    if (platform === 'youtube') return <Youtube size={16} />;
    if (platform === 'linkedin') return <Linkedin size={16} />;
    return <Globe size={16} />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050314] text-white flex flex-col font-sans relative overflow-hidden">
        <Navbar />
        <div className="flex-1 flex items-center justify-center relative z-10">
          <div className="space-y-4 text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-pink-500 border-t-transparent mx-auto"></div>
            <p className="text-sm text-neutral-450 font-mono tracking-wider">Loading portfolio data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#050314] text-white flex flex-col font-sans relative overflow-hidden">
        <Navbar />
        <div className="flex-1 flex items-center justify-center relative z-10">
          <div className="max-w-md w-full bg-neutral-900/40 border border-neutral-800 rounded-2xl p-8 text-center space-y-6">
            <h3 className="text-xl font-bold font-display text-white">Profile Not Found</h3>
            <p className="text-sm text-neutral-450">{error || 'This creator profile might have been deleted or is not verified yet.'}</p>
            <Link to="/influencers" className="inline-flex items-center justify-center rounded-xl bg-neutral-900 border border-neutral-800 py-2.5 px-5 text-sm font-semibold hover:bg-neutral-800">
              <ArrowLeft size={16} className="mr-2" />
              Back to Directory
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isOwnProfile = user && user._id === profile.user?._id;

  return (
    <div className="min-h-screen bg-[#050314] text-white flex flex-col font-sans overflow-x-hidden selection:bg-pink-500 selection:text-white relative">
      <Navbar />
      <GeoParticleBackground />

      {/* Glow Effects */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.1)_0%,rgba(14,129,236,0)_70%)] blur-[90px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.1)_0%,rgba(14,129,236,0)_70%)] blur-[100px] pointer-events-none z-0" />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-12 relative z-10 animate-fade-in">
        
        {/* Back Link */}
        <div className="mb-8">
          <Link to="/influencers" className="inline-flex items-center text-xs text-neutral-450 hover:text-white transition-colors">
            <ArrowLeft size={14} className="mr-2" />
            <span>Back to Creators Directory</span>
          </Link>
        </div>

        {/* Full-width Hero Header Section matching the mock layout exactly */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center py-12 md:py-20 border-b border-neutral-900 mb-12 animate-fade-in">
          {/* Left Hero: Identity & Hook */}
          <div className="md:col-span-7 space-y-6">
            <div className="space-y-3">
              <h1 className="text-5xl md:text-7xl font-bold font-serif text-white tracking-tight leading-[1.1]">
                {profile.user?.name || 'Unknown'}
              </h1>
              <p className="text-lg md:text-xl text-neutral-400 font-sans tracking-wide">
                {profile.tagline || 'Digital Creator'}
              </p>
            </div>
            
            <p className="text-sm md:text-base text-neutral-300 font-sans leading-relaxed max-w-xl">
              {profile.bio || 'Visual storyteller crafting premium creative content and narrative campaign integrations.'}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button 
                onClick={() => {
                  const target = document.getElementById('work-section');
                  if (target) target.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-extrabold uppercase px-6 py-3.5 tracking-wider transition-all duration-300 cursor-pointer shadow-lg animate-float-slow"
              >
                <span>VIEW MY WORK</span>
                <span className="ml-2 text-[10px]">↓</span>
              </button>
              
              <button 
                onClick={handleStartChat}
                disabled={startingChat}
                className="inline-flex items-center justify-center rounded-full border border-neutral-800 hover:bg-neutral-900/60 text-white text-xs font-bold px-6 py-3.5 tracking-wider transition-all duration-300 cursor-pointer"
              >
                <Mail size={14} className="mr-2 text-neutral-400" />
                <span>{startingChat ? 'Loading...' : 'Get in touch'}</span>
              </button>
            </div>

            {/* Socials & Location Metadata Row */}
            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-neutral-900/60">
              <div className="flex items-center space-x-4">
                {(profile.socialAccounts && profile.socialAccounts.length > 0 
                  ? profile.socialAccounts 
                  : [
                      { platform: 'instagram', link: '#' },
                      { platform: 'youtube', link: '#' },
                      { platform: 'linkedin', link: '#' }
                    ]
                ).map((acc, idx) => (
                  <a 
                    key={idx}
                    href={acc.link || '#'} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-neutral-400 hover:text-white transition-colors"
                  >
                    {getPlatformIconMonochrome(acc.platform)}
                  </a>
                ))}
              </div>
              
              <div className="h-4 w-[1px] bg-neutral-800 hidden sm:block" />

              <div className="flex items-center text-xs text-neutral-400 font-sans">
                <MapPin size={14} className="mr-2 text-neutral-500" />
                <span>{profile.location && profile.location !== 'Not Specified' ? profile.location : 'Mumbai, Maharashtra, India'}</span>
              </div>
            </div>
          </div>

          {/* Right Hero: Creator Image with Verified overlay badge */}
          <div className="md:col-span-5 flex justify-center md:justify-end">
            <div className="relative w-full max-w-sm aspect-square p-3 bg-neutral-900/40 backdrop-blur-md border border-neutral-800/80 rounded-[2.5rem] shadow-2xl group">
              <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-neutral-950">
                {profile.user?.profileImage ? (
                  <img 
                    src={`http://localhost:5001${profile.user.profileImage}`} 
                    alt={profile.user?.name || 'Creator'} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                ) : (
                  <div className="w-full h-full bg-indigo-500/10 flex items-center justify-center font-bold text-indigo-400 text-5xl font-serif">
                    {(profile.user?.name || 'C').charAt(0)}
                  </div>
                )}
              </div>

              {/* Verified Badge overlay matching style spec exactly */}
              <div className="absolute bottom-1 right-1 translate-x-1.5 translate-y-1.5 bg-[#0a0f1d]/90 backdrop-blur-md border border-neutral-800 rounded-full py-1.5 px-3 flex items-center space-x-1.5 shadow-2xl z-10">
                <div className="h-4 w-4 rounded-full bg-emerald-500 flex items-center justify-center text-neutral-950">
                  <Check size={10} strokeWidth={4} />
                </div>
                <span className="text-[10px] font-bold text-neutral-200 font-sans tracking-wide">
                  {profile.pastBrands ? `Featured in ${profile.pastBrands.split(',')[0].trim()}` : 'Featured in Vogue India'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: visual stats details */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Categories & Specialties Card */}
            {(profile.categories?.length > 0 || profile.contentFormats) && (
              <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800/80 rounded-2xl p-6 shadow-xl space-y-4">
                <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono border-b border-neutral-850 pb-2 flex items-center justify-between">
                  <span>Specialties & Niches</span>
                  <Sparkles size={12} className="text-pink-400" />
                </h4>
                <div className="flex flex-wrap gap-2 pt-1">
                  {profile.categories?.map((cat, idx) => (
                    <span 
                      key={idx} 
                      className="rounded-full bg-pink-500/10 border border-pink-500/20 px-3 py-1 text-[10px] font-semibold text-pink-400 uppercase tracking-wider font-mono"
                    >
                      {cat}
                    </span>
                  ))}
                  {profile.contentFormats?.split(',').map((fmt, idx) => (
                    <span 
                      key={idx} 
                      className="rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-[10px] font-semibold text-indigo-400 uppercase tracking-wider font-mono"
                    >
                      {fmt.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social channels reach box */}
            <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800/80 rounded-2xl p-6 shadow-xl space-y-4">
              <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono border-b border-neutral-850 pb-2 flex items-center justify-between">
                <span>Platform Reach</span>
                <Sparkles size={12} className="text-indigo-400" />
              </h4>
              
              <div className="space-y-3">
                {profile.socialAccounts?.length > 0 ? (
                  profile.socialAccounts.map((acc, idx) => (
                    <div 
                      key={idx} 
                      className="flex justify-between items-center rounded-xl bg-neutral-950/60 p-3 border border-neutral-850"
                    >
                      <div className="flex items-center space-x-2">
                        {getPlatformIcon(acc.platform)}
                        <span className="text-xs font-bold text-neutral-200 capitalize">{acc.platform}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-white font-mono">{acc.followers.toLocaleString()}</span>
                        <span className="text-[9px] text-neutral-450 block">{acc.engagementRate ? `${acc.engagementRate}% engagement` : 'fans'}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-neutral-500 italic text-center py-2">No social profiles connected</p>
                )}
              </div>
            </div>

            {/* Client collaborations box */}
            {profile.pastBrands && (
              <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800/80 rounded-2xl p-6 shadow-xl space-y-4">
                <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono border-b border-neutral-850 pb-2 flex items-center justify-between">
                  <span>Collaborations</span>
                  <Award size={12} className="text-indigo-400" />
                </h4>
                <div className="flex flex-wrap gap-2 pt-1">
                  {profile.pastBrands.split(',').map((b, idx) => (
                    <span 
                      key={idx}
                      className="text-xs font-semibold px-3 py-1 bg-neutral-950/65 rounded-lg border border-neutral-850 text-indigo-200 font-mono shadow-sm"
                    >
                      {b.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
 
            {/* Demographics Card */}
            {(profile.audienceGenderMale !== undefined || profile.audienceAgeRange || profile.audienceTopCountries) && (
              <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800/80 rounded-2xl p-6 shadow-xl space-y-4">
                <h4 className="text-[10px] font-bold text-neutral-450 uppercase tracking-widest font-mono border-b border-neutral-850 pb-2 flex items-center justify-between">
                  <span>Audience Demographics</span>
                  <Globe size={12} className="text-indigo-400" />
                </h4>
                
                {/* Gender Split Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono text-neutral-400">
                    <span>Male {profile.audienceGenderMale || 50}%</span>
                    <span>Female {profile.audienceGenderFemale || 50}%</span>
                  </div>
                  <div className="w-full bg-neutral-950 h-2.5 rounded-full overflow-hidden flex border border-neutral-850">
                    <div 
                      className="bg-indigo-550 h-full rounded-l-full" 
                      style={{ width: `${profile.audienceGenderMale || 50}%` }}
                    />
                    <div 
                      className="bg-pink-500 h-full rounded-r-full" 
                      style={{ width: `${profile.audienceGenderFemale || 50}%` }}
                    />
                  </div>
                </div>

                {/* Country / Age stats */}
                <div className="space-y-3.5 pt-2 text-xs">
                  {profile.audienceAgeRange && (
                    <div className="rounded-xl bg-neutral-950/60 p-3 border border-neutral-850">
                      <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block font-mono">Age Profile</span>
                      <span className="text-neutral-200 mt-1 block font-sans">{profile.audienceAgeRange}</span>
                    </div>
                  )}
                  {profile.audienceTopCountries && (
                    <div className="rounded-xl bg-neutral-950/60 p-3 border border-neutral-850">
                      <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block font-mono">Top Geos</span>
                      <span className="text-neutral-200 mt-1 block font-sans">{profile.audienceTopCountries}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Direct Inquiry details */}
            {(profile.businessEmail || profile.businessPhone) && (
              <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800/80 rounded-2xl p-6 shadow-xl space-y-3">
                <h4 className="text-[10px] font-bold text-neutral-450 uppercase tracking-widest font-mono border-b border-neutral-850 pb-2">
                  <span>Direct Business Inquiry</span>
                </h4>
                <div className="space-y-2 text-xs font-mono">
                  {profile.businessEmail && (
                    <div className="flex justify-between items-center text-neutral-300">
                      <span className="text-neutral-550">Email:</span>
                      <a href={`mailto:${profile.businessEmail}`} className="text-indigo-450 hover:text-indigo-350 hover:underline">{profile.businessEmail}</a>
                    </div>
                  )}
                  {profile.businessPhone && (
                    <div className="flex justify-between items-center text-neutral-300">
                      <span className="text-neutral-550">Phone:</span>
                      <a href={`tel:${profile.businessPhone}`} className="text-pink-400 hover:text-pink-300 hover:underline">{profile.businessPhone}</a>
                    </div>
                  )}
                </div>
              </div>
            )}
 
            {/* Actions Card */}
            <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800/80 rounded-2xl p-6 shadow-xl">
              {isOwnProfile ? (
                <div className="space-y-3 text-center">
                  <p className="text-xs text-neutral-400 font-sans">This is your public portfolio as visible to brands.</p>
                  <Link 
                    to="/dashboard"
                    className="flex w-full items-center justify-center rounded-xl bg-neutral-800 border border-neutral-750 py-3 text-xs font-bold text-white hover:bg-neutral-750 transition-colors"
                  >
                    <span>Edit Profile Dashboard</span>
                  </Link>
                </div>
              ) : user ? (
                user.role === 'brand' || user.role === 'agency' || user.role === 'admin' ? (
                  <div className="space-y-4">
                    <button
                      onClick={handleStartChat}
                      disabled={startingChat}
                      className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-650 py-3 text-xs font-bold text-white hover:opacity-95 shadow-lg shadow-purple-600/20 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer disabled:opacity-50"
                    >
                      <MessageSquare size={14} className="mr-2" />
                      <span>{startingChat ? 'Initializing...' : 'Chat Now'}</span>
                    </button>
                    <p className="text-[10px] text-neutral-500 text-center leading-relaxed">
                      Start direct message negotiations regarding pricing packages or target campaign requirements.
                    </p>
                  </div>
                ) : (
                  <div className="text-center p-2">
                    <p className="text-xs text-neutral-500 font-sans italic">Only brands can invite creators to collaborate.</p>
                  </div>
                )
              ) : (
                <div className="space-y-4">
                  <Link
                    to="/register"
                    className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-650 py-3 text-xs font-bold text-white hover:opacity-95 shadow-lg shadow-purple-600/20 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                  >
                    <Lock size={14} className="mr-2" />
                    <span>Join Now to Hire</span>
                  </Link>
                  <p className="text-[10px] text-neutral-550 text-center">
                    Register as a brand to negotiate payouts and lock smart escrow campaign agreements.
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Bio & Portfolio grid */}
          <div className="lg:col-span-8 space-y-6">

            {/* YouTube Featured Video Intro */}
            {profile.featuredVideo && getYouTubeEmbedUrl(profile.featuredVideo) && (
              <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800/80 rounded-2xl p-6 shadow-xl space-y-4 relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-pink-500/30 to-transparent" />
                
                <h4 className="text-[11px] font-bold text-neutral-450 uppercase tracking-widest font-mono flex items-center space-x-2">
                  <Youtube size={14} className="text-red-500" />
                  <span>Featured Video Presentation</span>
                </h4>
                
                <div className="aspect-video w-full rounded-xl overflow-hidden border border-neutral-850 shadow-2xl relative bg-black animate-fade-in">
                  <iframe 
                    className="w-full h-full"
                    src={getYouTubeEmbedUrl(profile.featuredVideo)}
                    title="Creator Showcase Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
            
            {/* About / Bio Panel */}
            <div className="bg-neutral-900/40 backdrop-blur-md border border-[#1e1b4b]/30 rounded-2xl p-6 shadow-xl space-y-4 relative">
              
              {/* Highlight card border */}
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-pink-500/30 to-transparent" />

              <h4 className="text-[11px] font-bold text-neutral-450 uppercase tracking-widest font-mono flex items-center space-x-2">
                <UserIcon size={14} className="text-pink-400" />
                <span>About Creator</span>
              </h4>
              
              <div className="text-sm text-neutral-300 leading-relaxed font-sans whitespace-pre-line border-t border-neutral-900 pt-3">
                {profile.bio || 'This creator hasn\'t specified their description yet.'}
              </div>
            </div>

            {/* Collaboration Packages */}
            {profile.services?.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-[11px] font-bold text-neutral-450 uppercase tracking-widest font-mono flex items-center space-x-2">
                  <Sparkles size={14} className="text-pink-400" />
                  <span>Collaboration Packages & Rates</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                  {profile.services.map((svc, idx) => (
                    <div 
                      key={idx}
                      className="bg-gradient-to-br from-neutral-900/60 to-neutral-950/60 backdrop-blur-md border border-neutral-850 hover:border-neutral-800 rounded-2xl p-6 flex flex-col justify-between shadow-lg relative group transition-all duration-300"
                    >
                      <div className="absolute top-0 right-0 h-[1px] w-[50%] bg-gradient-to-l from-pink-500/20 to-transparent" />
                      
                      <div className="space-y-3">
                        <h5 className="font-display font-bold text-sm text-neutral-100 group-hover:text-pink-400 transition-colors">
                          {svc.title}
                        </h5>
                        <div className="flex items-baseline space-x-1.5 mt-2">
                          <span className="text-2xl font-extrabold text-white font-mono">${svc.price}</span>
                          <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-mono">base rate</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-neutral-900 flex justify-between items-center text-xs font-mono">
                        <span className="text-neutral-500">Delivery Time</span>
                        <span className="text-neutral-300 font-bold">{svc.deliveryDays} Days</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Portfolio Grid */}
            <div id="work-section" className="space-y-4 scroll-mt-24">
              <h4 className="text-[11px] font-bold text-neutral-450 uppercase tracking-widest font-mono flex items-center space-x-2">
                <Award size={14} className="text-indigo-400" />
                <span>Featured Campaigns & Work</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile.portfolio?.length > 0 ? (
                  profile.portfolio.map((item, idx) => (
                    <div 
                      key={idx}
                      className="bg-neutral-900/30 border border-neutral-850 hover:border-neutral-800 rounded-2xl p-5 flex flex-col justify-between shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h5 className="font-display font-bold text-sm text-white group-hover:text-pink-400 transition-colors">
                            {item.title || 'Untitled Portfolio Item'}
                          </h5>
                          {item.fileUrl && (
                            <a 
                              href={item.fileUrl} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-neutral-500 hover:text-white transition-colors"
                            >
                              <ExternalLink size={14} />
                            </a>
                          )}
                        </div>
                        <p className="text-xs text-neutral-450 leading-relaxed line-clamp-3">
                          {item.description || 'No description provided.'}
                        </p>
                      </div>

                      {item.fileUrl && (
                        <div className="mt-4 pt-4 border-t border-neutral-950 flex justify-end">
                          <a
                            href={item.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center text-[10px] font-bold text-indigo-450 hover:text-indigo-350 tracking-wider uppercase font-mono transition-colors"
                          >
                            <span>View Project Link</span>
                            <ChevronRight size={12} className="ml-1" />
                          </a>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-16 border border-dashed border-neutral-850 rounded-2xl bg-neutral-900/10">
                    <p className="text-sm text-neutral-500 italic">No past campaigns or portfolio items connected yet.</p>
                  </div>
                )}
              </div>
            </div>

            {/* FAQs Accordion */}
            {profile.faqs?.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-[11px] font-bold text-neutral-450 uppercase tracking-widest font-mono flex items-center space-x-2">
                  <MessageSquare size={14} className="text-indigo-400" />
                  <span>Frequently Asked Questions</span>
                </h4>

                <div className="space-y-3">
                  {profile.faqs.map((faq, idx) => (
                    <details 
                      key={idx}
                      className="group bg-neutral-900/40 backdrop-blur-sm border border-neutral-850 rounded-2xl p-4 transition-all duration-300 open:border-neutral-700/80 [&_summary::-webkit-details-marker]:hidden"
                    >
                      <summary className="flex justify-between items-center font-semibold text-sm text-neutral-100 cursor-pointer list-none select-none group-hover:text-indigo-300">
                        <span>{faq.question}</span>
                        <span className="text-neutral-500 transition-transform duration-300 group-open:rotate-180">
                          ▼
                        </span>
                      </summary>
                      <p className="mt-3 text-xs text-neutral-450 leading-relaxed border-t border-neutral-900 pt-3 font-sans whitespace-pre-line">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </main>
    </div>
  );
};

export default CreatorPortfolioPage;
