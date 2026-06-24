import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/authContext';
import { Bell, MessageSquare, Wallet, User as UserIcon, LogOut, Menu, X, ChevronDown } from 'lucide-react';
import api from '../services/api';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [walletBalance, setWalletBalance] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showResources, setShowResources] = useState(false);

  useEffect(() => {
    if (user) {
      api.get('/payments/wallet').then((res) => {
        setWalletBalance(res.data.wallet.balance);
      }).catch(console.warn);

      api.get('/users/notifications').then((res) => {
        setNotifications(res.data);
      }).catch(console.warn);
    }
  }, [user, location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleMarkNotificationsRead = async () => {
    try {
      await api.patch('/users/notifications/read');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (e) {
      console.warn(e);
    }
  };

  const activeLink = (path) => location.pathname === path ? 'text-brand-400 font-bold' : 'text-neutral-400 hover:text-brand-400 transition-colors';

  return (
    <nav className="sticky top-0 z-40 border-b border-neutral-900 bg-neutral-950/90 backdrop-blur-md shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex flex-shrink-0 items-center">
            <Link to="/" className="text-lg font-bold tracking-tight text-white font-display">
              BRISKODE <span className="bg-gradient-to-r from-brand-400 to-indigo-400 bg-clip-text text-transparent">Influencer Hub</span>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link to="/" className={`text-sm transition-colors font-display font-medium ${activeLink('/')}`}>Home</Link>
            <Link to="/influencers" className={`text-sm transition-colors font-display font-medium ${activeLink('/influencers')}`}>Influencers</Link>
            <Link to="/brands" className={`text-sm transition-colors font-display font-medium ${activeLink('/brands')}`}>Brands</Link>
            <a href="/#how-it-works" className="text-sm transition-colors font-display font-medium text-neutral-400 hover:text-brand-400">How It Works</a>
            <Link to="/pricing" className={`text-sm transition-colors font-display font-medium ${activeLink('/pricing')}`}>Pricing</Link>
            
            {/* Resources Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowResources(!showResources)}
                className="flex items-center space-x-1 text-sm font-display font-medium text-neutral-400 hover:text-brand-400 transition-colors focus:outline-none cursor-pointer"
              >
                <span>Resources</span>
                <ChevronDown size={14} />
              </button>
              {showResources && (
                <div className="absolute left-0 mt-2 w-40 rounded-xl border border-neutral-850 bg-neutral-950 p-1.5 shadow-2xl animate-fade-in text-white z-50">
                  <Link to="/about" onClick={() => setShowResources(false)} className="block w-full rounded-lg px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors">About Us</Link>
                  <Link to="/contact" onClick={() => setShowResources(false)} className="block w-full rounded-lg px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors">Contact</Link>
                  <Link to="/privacy" onClick={() => setShowResources(false)} className="block w-full rounded-lg px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors">Privacy</Link>
                  <Link to="/terms" onClick={() => setShowResources(false)} className="block w-full rounded-lg px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors">Terms</Link>
                </div>
              )}
            </div>

            {user && (
              <>
                <Link to="/dashboard" className={`text-sm transition-colors font-display font-medium ${activeLink('/dashboard')}`}>Dashboard</Link>
                <Link to="/chat" className={`text-sm transition-colors font-display font-medium ${activeLink('/chat')}`}>Messages</Link>
              </>
            )}
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-1.5 rounded-full bg-neutral-900 border border-neutral-800 px-3.5 py-1.5 text-xs font-semibold text-neutral-300">
                  <Wallet size={14} className="text-brand-400" />
                  <span>${walletBalance.toLocaleString()}</span>
                </div>

                <div className="relative">
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      if (!showNotifications) handleMarkNotificationsRead();
                    }}
                    className="relative rounded-full p-2 text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200 transition-colors"
                  >
                    <Bell size={20} />
                    {notifications.some(n => !n.isRead) && (
                      <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-brand-500"></span>
                    )}
                  </button>
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 rounded-xl border border-neutral-850 bg-neutral-950 p-2 shadow-2xl animate-fade-in text-white">
                      <div className="border-b border-neutral-900 px-3 py-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                        Notifications
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="px-3 py-4 text-center text-sm text-neutral-500">No notifications</div>
                        ) : (
                          notifications.map((n) => (
                            <div key={n._id} className={`p-2.5 hover:bg-neutral-900 rounded-lg text-sm transition-colors ${!n.isRead ? 'bg-brand-950/30' : ''}`}>
                              <p className="font-semibold text-neutral-200">{n.title}</p>
                              <p className="text-xs text-neutral-400 mt-0.5">{n.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  to="/chat"
                  className="rounded-full p-2 text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200 transition-colors"
                >
                  <MessageSquare size={20} />
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-2 rounded-full p-1 hover:bg-neutral-900 transition-colors"
                  >
                    {user.profileImage ? (
                      <img src={`http://localhost:5001${user.profileImage}`} alt="" className="h-8 w-8 rounded-full object-cover border border-neutral-800" />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-sm font-semibold text-white">
                        {user.name.charAt(0)}
                      </div>
                    )}
                  </button>
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 rounded-xl border border-neutral-850 bg-neutral-950 p-1.5 shadow-2xl animate-fade-in text-white">
                      <div className="px-3 py-2 border-b border-neutral-900">
                        <p className="text-sm font-semibold text-white">{user.name}</p>
                        <p className="text-xs text-neutral-450 truncate">{user.email}</p>
                      </div>
                      <Link to="/dashboard" onClick={() => setShowDropdown(false)} className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors">
                        <UserIcon size={16} />
                        <span>Profile & Stats</span>
                      </Link>
                      <button onClick={handleLogout} className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-sm text-brand-400 hover:bg-brand-950/40 hover:text-brand-300 transition-colors">
                        <LogOut size={16} />
                        <span>Log Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="rounded-lg border border-neutral-800 bg-neutral-900/50 text-white hover:bg-neutral-900 hover:border-neutral-700 px-5 py-1.5 text-xs font-semibold transition-all duration-200 font-display">Login</Link>
                <Link to="/register" className="rounded-lg bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white px-5 py-1.5 text-xs font-semibold hover:opacity-90 shadow-lg hover:shadow-brand-500/20 transition-all duration-200 font-display">Join Now</Link>
              </div>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-neutral-450 hover:bg-neutral-900 transition-colors"
            >
              {mobileMenuOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-b border-neutral-900 bg-neutral-950 md:hidden animate-fade-in text-white">
          <div className="space-y-1 px-2 pt-2 pb-4">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-base font-semibold text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors">Home</Link>
            <Link to="/influencers" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-base font-semibold text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors">Influencers</Link>
            <Link to="/brands" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-base font-semibold text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors">Brands</Link>
            <a href="/#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-base font-semibold text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors">How It Works</a>
            <Link to="/pricing" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-base font-semibold text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors">Pricing</Link>
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-base font-semibold text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors">Dashboard</Link>
                <Link to="/chat" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-base font-semibold text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors">Messages</Link>
                <button onClick={handleLogout} className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-base font-semibold text-brand-400 hover:bg-brand-950/40 hover:text-brand-300 transition-colors">
                  <LogOut size={18} />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <div className="mt-4 flex flex-col space-y-2 px-3 pb-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-center rounded-lg border border-neutral-800 py-2 text-sm font-semibold text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors">Log In</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="text-center rounded-lg bg-gradient-to-r from-brand-500 to-indigo-500 py-2 text-sm font-semibold text-white">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
