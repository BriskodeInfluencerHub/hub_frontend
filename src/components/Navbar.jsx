import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/authContext';
import { Bell, MessageSquare, Wallet, User as UserIcon, LogOut, Menu, X } from 'lucide-react';
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

  const activeLink = (path) => location.pathname === path ? 'text-brand-500 font-bold' : 'text-neutral-600 hover:text-brand-500';

  return (
    <nav className="sticky top-0 z-40 border-b border-neutral-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex flex-shrink-0 items-center">
            <Link to="/" className="text-lg font-bold tracking-tight text-neutral-900 font-display">
              BRISKODE <span className="bg-gradient-to-r from-brand-500 to-indigo-500 bg-clip-text text-transparent">Influencer Hub</span>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link to="/" className={`text-sm transition-colors font-display font-medium ${activeLink('/')}`}>Home</Link>
            <Link to="/influencers" className={`text-sm transition-colors font-display font-medium ${activeLink('/influencers')}`}>Creators</Link>
            <Link to="/brands" className={`text-sm transition-colors font-display font-medium ${activeLink('/brands')}`}>Brands</Link>
            <Link to="/pricing" className={`text-sm transition-colors font-display font-medium ${activeLink('/pricing')}`}>Pricing</Link>
            <Link to="/about" className={`text-sm transition-colors font-display font-medium ${activeLink('/about')}`}>About</Link>
            <Link to="/contact" className={`text-sm transition-colors font-display font-medium ${activeLink('/contact')}`}>Contact</Link>
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
                <div className="flex items-center space-x-1.5 rounded-full bg-neutral-50 border border-neutral-200 px-3.5 py-1.5 text-xs font-semibold text-neutral-700">
                  <Wallet size={14} className="text-brand-500" />
                  <span>${walletBalance.toLocaleString()}</span>
                </div>

                <div className="relative">
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      if (!showNotifications) handleMarkNotificationsRead();
                    }}
                    className="relative rounded-full p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-750"
                  >
                    <Bell size={20} />
                    {notifications.some(n => !n.isRead) && (
                      <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-brand-500"></span>
                    )}
                  </button>
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 rounded-xl border border-neutral-150 bg-white p-2 shadow-xl animate-fade-in">
                      <div className="border-b border-neutral-100 px-3 py-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                        Notifications
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="px-3 py-4 text-center text-sm text-neutral-400">No notifications</div>
                        ) : (
                          notifications.map((n) => (
                            <div key={n._id} className={`p-2.5 hover:bg-neutral-50 rounded-lg text-sm transition-colors ${!n.isRead ? 'bg-brand-50/50' : ''}`}>
                              <p className="font-semibold text-neutral-800">{n.title}</p>
                              <p className="text-xs text-neutral-500 mt-0.5">{n.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  to="/chat"
                  className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-750"
                >
                  <MessageSquare size={20} />
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-2 rounded-full p-1 hover:bg-neutral-150"
                  >
                    {user.profileImage ? (
                      <img src={`http://localhost:5001${user.profileImage}`} alt="" className="h-8 w-8 rounded-full object-cover border border-neutral-200" />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-sm font-semibold text-white">
                        {user.name.charAt(0)}
                      </div>
                    )}
                  </button>
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 rounded-xl border border-neutral-100 bg-white p-1.5 shadow-lg animate-fade-in">
                      <div className="px-3 py-2 border-b border-neutral-100">
                        <p className="text-sm font-semibold text-neutral-800">{user.name}</p>
                        <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                      </div>
                      <Link to="/dashboard" onClick={() => setShowDropdown(false)} className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
                        <UserIcon size={16} />
                        <span>Profile & Stats</span>
                      </Link>
                      <button onClick={handleLogout} className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-sm text-brand-500 hover:bg-brand-50">
                        <LogOut size={16} />
                        <span>Log Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-sm font-medium text-neutral-600 hover:text-brand-500 font-display">Log In</Link>
                <Link to="/register" className="rounded-full bg-gradient-to-r from-brand-500 to-indigo-500 text-white px-5 py-2 text-sm font-semibold hover:opacity-90 shadow-sm transition-all">Sign Up</Link>
              </div>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-b border-neutral-100 bg-white md:hidden animate-fade-in">
          <div className="space-y-1 px-2 pt-2 pb-3">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-base font-semibold text-neutral-700 hover:bg-neutral-50">Home</Link>
            <Link to="/influencers" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-base font-semibold text-neutral-700 hover:bg-neutral-50">Creators</Link>
            <Link to="/brands" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-base font-semibold text-neutral-700 hover:bg-neutral-50">Brands</Link>
            <Link to="/pricing" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-base font-semibold text-neutral-700 hover:bg-neutral-50">Pricing</Link>
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-base font-semibold text-neutral-700 hover:bg-neutral-50">Dashboard</Link>
                <Link to="/chat" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-base font-semibold text-neutral-700 hover:bg-neutral-50">Messages</Link>
                <button onClick={handleLogout} className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-base font-semibold text-brand-500 hover:bg-brand-50">
                  <LogOut size={18} />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <div className="mt-4 flex flex-col space-y-2 px-3">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-center rounded-lg border border-neutral-200 py-2 text-sm font-semibold text-neutral-700">Log In</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="text-center rounded-lg bg-brand-500 py-2 text-sm font-semibold text-white">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
