import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/authContext';
import { ArrowRight, Lock, Mail, Phone, User as UserIcon } from 'lucide-react';

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
    const count = 60; // Balanced density

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
      className="theme-particle fixed inset-0 w-full h-full pointer-events-none z-0 bg-transparent"
    />
  );
};

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('influencer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await register(name, email, phone, password, role);
      navigate('/verify-otp', { state: { email, otpCode: res.otpCode } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Check details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-theme-bg text-theme-text px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden font-sans selection:bg-pink-500 selection:text-white">
      <GeoParticleBackground />

      {/* Glow Effects */}
      <div className="absolute top-[5%] left-[-10%] w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.1)_0%,rgba(14,129,236,0)_70%)] blur-[90px] pointer-events-none z-0" />
      <div className="absolute bottom-[5%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.1)_0%,rgba(14,129,236,0)_70%)] blur-[100px] pointer-events-none z-0" />

      {/* Main Glass Form Card */}
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-theme-border bg-theme-surface backdrop-blur-md p-8 shadow-2xl relative z-10 hover:border-theme-border-light transition-all duration-300">
        <div className="text-center">
          <Link to="/" className="text-2xl font-bold tracking-tight text-theme-text font-display">
            Odisha <span className="bg-gradient-to-r from-pink-400 to-indigo-400 bg-clip-text text-transparent font-semibold font-display">Influencer Market</span>
          </Link>
          <h2 className="mt-6 text-xl font-bold tracking-tight text-theme-text font-display">Create your account</h2>
          <p className="mt-2 text-xs text-theme-text-secondary font-sans">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-pink-400 hover:text-pink-300 transition-colors">
              Sign in here
            </Link>
          </p>
        </div>

        {error && (
          <div className="rounded-xl bg-red-950/40 border border-red-800/60 p-3.5 text-xs font-semibold text-red-400 animate-fade-in">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[10px] font-bold text-theme-text-secondary uppercase tracking-widest font-mono mb-2.5">Join Platform As</label>
            <div className="grid grid-cols-3 gap-2 rounded-xl bg-theme-surface p-1 border border-theme-border">
              {['influencer', 'brand', 'agency'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`rounded-lg py-2 text-xs font-semibold capitalize transition-all cursor-pointer ${
                    role === r 
                      ? 'bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white shadow-md' 
                      : 'text-theme-text-secondary hover:text-theme-text hover:bg-theme-surface-hover'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-[10px] font-bold text-theme-text-secondary uppercase tracking-widest font-mono">Full Name</label>
              <div className="relative mt-1.5">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
                  <UserIcon size={16} />
                </div>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-xl border border-theme-border bg-theme-surface py-3 pl-10 pr-3 text-sm text-theme-text placeholder-neutral-500 focus:border-pink-500/60 focus:ring-2 focus:ring-pink-500/10 focus:outline-none transition-all font-sans"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-[10px] font-bold text-theme-text-secondary uppercase tracking-widest font-mono">Email Address</label>
              <div className="relative mt-1.5">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
                  <Mail size={16} />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border border-theme-border bg-theme-surface py-3 pl-10 pr-3 text-sm text-theme-text placeholder-neutral-500 focus:border-pink-500/60 focus:ring-2 focus:ring-pink-500/10 focus:outline-none transition-all font-sans"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-[10px] font-bold text-theme-text-secondary uppercase tracking-widest font-mono">Phone Number</label>
              <div className="relative mt-1.5">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
                  <Phone size={16} />
                </div>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="block w-full rounded-xl border border-theme-border bg-theme-surface py-3 pl-10 pr-3 text-sm text-theme-text placeholder-neutral-500 focus:border-pink-500/60 focus:ring-2 focus:ring-pink-500/10 focus:outline-none transition-all font-sans"
                  placeholder="+1 555-555-5555"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-[10px] font-bold text-theme-text-secondary uppercase tracking-widest font-mono">Password</label>
              <div className="relative mt-1.5">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
                  <Lock size={16} />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-theme-border bg-theme-surface py-3 pl-10 pr-3 text-sm text-theme-text placeholder-neutral-500 focus:border-pink-500/60 focus:ring-2 focus:ring-pink-500/10 focus:outline-none transition-all font-sans"
                  placeholder="At least 6 characters"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-650 py-3 text-sm font-bold text-white shadow-lg shadow-purple-600/20 hover:opacity-95 transition-all hover:-translate-y-0.5 duration-200 cursor-pointer disabled:opacity-50"
            >
              <span>{submitting ? 'Registering...' : 'Sign Up'}</span> 
              <ArrowRight size={16} className="ml-2" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
