import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/authContext';
import { useTheme } from '../store/themeContext';
import { Bell, MessageSquare, Wallet, User as UserIcon, LogOut, Menu, X, Sun, Moon } from 'lucide-react';
import api from '../services/api';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
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

  const isDashboardPage = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/chat') || location.pathname.startsWith('/campaign/');

  const c = {
    nav: isDashboardPage
      ? 'sticky top-0 z-40 border-b border-neutral-900 bg-neutral-950/90 backdrop-blur-md shadow-lg'
      : 'sticky top-0 z-40 border-b border-theme-nav-border bg-theme-nav backdrop-blur-md shadow-lg',
    wallet: isDashboardPage
      ? 'flex items-center space-x-1.5 rounded-full bg-neutral-900 border border-neutral-800 px-3.5 py-1.5 text-xs font-semibold text-neutral-300'
      : 'flex items-center space-x-1.5 rounded-full bg-theme-surface border border-theme-border px-3.5 py-1.5 text-xs font-semibold text-theme-text-secondary',
    iconBtn: isDashboardPage
      ? 'relative rounded-full p-2 text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200 transition-colors'
      : 'relative rounded-full p-2 text-theme-text-secondary hover:bg-theme-surface-hover hover:text-theme-text transition-colors',
    dropdown: isDashboardPage
      ? 'border-neutral-850 bg-neutral-950 text-white'
      : 'border-theme-nav-border bg-theme-glass text-theme-text',
    dropdownHeader: isDashboardPage
      ? 'border-neutral-900 text-neutral-500'
      : 'border-theme-border text-theme-text-muted',
    dropdownItemHover: isDashboardPage
      ? 'hover:bg-neutral-900'
      : 'hover:bg-theme-surface-hover',
    dropdownItemText: isDashboardPage
      ? 'text-neutral-300 hover:text-white'
      : 'text-theme-text-secondary hover:text-theme-text',
    dropdownTitle: isDashboardPage ? 'text-neutral-200' : 'text-theme-text',
    dropdownSubtitle: isDashboardPage ? 'text-neutral-450' : 'text-theme-text-secondary',
    loginBtn: isDashboardPage
      ? 'rounded-lg border border-neutral-800 bg-neutral-900/50 text-white hover:bg-neutral-900 px-5 py-1.5 text-xs font-semibold transition-all duration-200 font-display'
      : 'rounded-lg border border-theme-border bg-theme-surface text-theme-text hover:bg-theme-surface-hover px-5 py-1.5 text-xs font-semibold transition-all duration-200 font-display',
    mobileBtn: isDashboardPage
      ? 'rounded-lg p-2 text-neutral-450 hover:bg-neutral-900 transition-colors'
      : 'rounded-lg p-2 text-theme-text-secondary hover:bg-theme-surface-hover transition-colors',
    mobileIcon: isDashboardPage ? 'text-white' : 'text-theme-text',
    mobileMenu: isDashboardPage
      ? 'border-neutral-900 bg-neutral-950 text-white'
      : 'border-theme-nav-border bg-theme-nav text-theme-text',
    mobileLink: isDashboardPage
      ? 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
      : 'text-theme-text-secondary hover:bg-theme-surface-hover hover:text-theme-text',
    mobileLogin: isDashboardPage
      ? 'text-center rounded-lg border border-neutral-800 py-2 text-sm font-semibold text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors'
      : 'text-center rounded-lg border border-theme-border py-2 text-sm font-semibold text-theme-text-secondary hover:bg-theme-surface-hover hover:text-theme-text transition-colors',
    mobileBorder: isDashboardPage ? 'border-neutral-900' : 'border-theme-border',
  };

  const activeLink = (path) => location.pathname === path ? 'text-brand-400 font-bold' : 'text-neutral-400 hover:text-brand-400 transition-colors';

  return (
    <nav className={c.nav}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex flex-shrink-0 items-center">
            <Link to="/" className="text-lg font-bold tracking-tight text-white font-display">
              Odisha <span className="bg-gradient-to-r from-brand-400 to-indigo-400 bg-clip-text text-transparent">Influencer Market</span>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link to="/" className={`text-sm transition-colors font-display font-medium ${activeLink('/')}`}>Home</Link>
            <Link to="/brands" className={`text-sm transition-colors font-display font-medium ${activeLink('/brands')}`}>Brands</Link>
            <Link to="/how-it-works" className={`text-sm transition-colors font-display font-medium ${activeLink('/how-it-works')}`}>How It Works</Link>
            <Link to="/campaign-request" className={`text-sm transition-colors font-display font-medium ${activeLink('/campaign-request')}`}>Start Campaign</Link>

            <Link to="/discovery" className={`text-sm transition-colors font-display font-medium ${activeLink('/discovery')}`}>Discover</Link>

            {user && (
              <>
                <Link to="/dashboard" className={`text-sm transition-colors font-display font-medium ${activeLink('/dashboard')}`}>Dashboard</Link>
                <Link to="/chat" className={`text-sm transition-colors font-display font-medium ${activeLink('/chat')}`}>Messages</Link>
              </>
            )}
          </div>

          {!isDashboardPage && (
            <div className="hidden md:flex md:items-center">
              <button
                onClick={toggleTheme}
                className="rounded-full p-2 text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          )}

          <div className="hidden md:flex md:items-center md:space-x-4">
            {user ? (
              <>
                <div className={c.wallet}>
                  <Wallet size={14} className="text-brand-400" />
                  <span>${walletBalance.toLocaleString()}</span>
                </div>

                <div className="relative">
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      if (!showNotifications) handleMarkNotificationsRead();
                    }}
                    className={c.iconBtn}
                  >
                    <Bell size={20} />
                    {notifications.some(n => !n.isRead) && (
                      <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-brand-500"></span>
                    )}
                  </button>
                  {showNotifications && (
                    <div className={`absolute right-0 mt-2 w-80 rounded-xl border ${c.dropdown} p-2 shadow-2xl animate-fade-in`}>
                      <div className={`border-b ${c.dropdownHeader} px-3 py-2 text-xs font-semibold uppercase tracking-wider`}>
                        Notifications
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="px-3 py-4 text-center text-sm text-neutral-500">No notifications</div>
                        ) : (
                          notifications.map((n) => (
                            <div key={n._id} className={`p-2.5 ${c.dropdownItemHover} rounded-lg text-sm transition-colors ${!n.isRead ? 'bg-brand-950/30' : ''}`}>
                              <p className={`font-semibold ${c.dropdownTitle}`}>{n.title}</p>
                              <p className={`text-xs ${c.dropdownSubtitle} mt-0.5`}>{n.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  to="/chat"
                  className={c.iconBtn}
                >
                  <MessageSquare size={20} />
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className={`flex items-center space-x-2 rounded-full p-1 ${c.dropdownItemHover} transition-colors`}
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
                    <div className={`absolute right-0 mt-2 w-48 rounded-xl border ${c.dropdown} p-1.5 shadow-2xl animate-fade-in`}>
                      <div className={`px-3 py-2 border-b ${c.dropdownHeader}`}>
                        <p className={`text-sm font-semibold ${c.dropdownTitle}`}>{user.name}</p>
                        <p className={`text-xs ${c.dropdownSubtitle} truncate`}>{user.email}</p>
                      </div>
                      <Link to="/dashboard" onClick={() => setShowDropdown(false)} className={`flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-sm ${c.dropdownItemText} ${c.dropdownItemHover} transition-colors`}>
                        <UserIcon size={16} />
                        <span>Profile & Stats</span>
                      </Link>
                      <button onClick={handleLogout} className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-sm text-brand-400 hover:bg-brand-950/40 transition-colors">
                        <LogOut size={16} />
                        <span>Log Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className={c.loginBtn}>Login</Link>
                <Link to="/register" className="rounded-lg bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white px-5 py-1.5 text-xs font-semibold hover:opacity-90 shadow-lg hover:shadow-brand-500/20 transition-all duration-200 font-display">Join Now</Link>
              </div>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={c.mobileBtn}
            >
              {mobileMenuOpen ? <X size={24} className={c.mobileIcon} /> : <Menu size={24} className={c.mobileIcon} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className={`border-b ${c.mobileMenu} md:hidden animate-fade-in`}>
          <div className="space-y-1 px-2 pt-2 pb-4">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className={`block rounded-lg px-3 py-2 text-base font-semibold ${c.mobileLink} transition-colors`}>Home</Link>
            <Link to="/brands" onClick={() => setMobileMenuOpen(false)} className={`block rounded-lg px-3 py-2 text-base font-semibold ${c.mobileLink} transition-colors`}>Brands</Link>
            <Link to="/how-it-works" onClick={() => setMobileMenuOpen(false)} className={`block rounded-lg px-3 py-2 text-base font-semibold ${c.mobileLink} transition-colors`}>How It Works</Link>
            <Link to="/campaign-request" onClick={() => setMobileMenuOpen(false)} className={`block rounded-lg px-3 py-2 text-base font-semibold ${c.mobileLink} transition-colors`}>Start Campaign</Link>
            <Link to="/discovery" onClick={() => setMobileMenuOpen(false)} className={`block rounded-lg px-3 py-2 text-base font-semibold ${c.mobileLink} transition-colors`}>Discover</Link>
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className={`block rounded-lg px-3 py-2 text-base font-semibold ${c.mobileLink} transition-colors`}>Dashboard</Link>
                <Link to="/chat" onClick={() => setMobileMenuOpen(false)} className={`block rounded-lg px-3 py-2 text-base font-semibold ${c.mobileLink} transition-colors`}>Messages</Link>
                <button onClick={handleLogout} className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-base font-semibold text-brand-400 hover:bg-brand-950/40 transition-colors">
                  <LogOut size={18} />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <div className="mt-4 flex flex-col space-y-2 px-3 pb-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className={c.mobileLogin}>Log In</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="text-center rounded-lg bg-gradient-to-r from-brand-500 to-indigo-500 py-2 text-sm font-semibold text-white">Sign Up</Link>
              </div>
            )}
            {!isDashboardPage && (
              <div className={`border-t ${c.mobileBorder} pt-2 px-3`}>
                <button
                  onClick={() => { toggleTheme(); setMobileMenuOpen(false); }}
                  className={`flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-base font-semibold ${c.dropdownItemText} ${c.dropdownItemHover} transition-colors`}
                >
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                  <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
