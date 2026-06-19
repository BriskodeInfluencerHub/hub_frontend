import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../store/authContext';

// Core Views
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import OtpPage from '../pages/OtpPage';

// Public Directory Pages
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import PricingPage from '../pages/PricingPage';
import BlogPage from '../pages/BlogPage';
import BlogPostPage from '../pages/BlogPostPage';
import InfluencersDirectory from '../pages/InfluencersDirectory';
import BrandsDirectory from '../pages/BrandsDirectory';
import TermsPage from '../pages/TermsPage';
import PrivacyPage from '../pages/PrivacyPage';

// Dashboard & Protected Pages
import InfluencerDashboard from '../pages/InfluencerDashboard';
import BrandDashboard from '../pages/BrandDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import InfluencerDiscovery from '../pages/InfluencerDiscovery';
import ChatPage from '../pages/ChatPage';
import CampaignDetails from '../pages/CampaignDetails';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-raw-cotton">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-bright-tangerine border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const DashboardRouter = () => {
  const { user } = useAuth();

  if (user?.role === 'influencer') {
    return <InfluencerDashboard />;
  } else if (user?.role === 'brand' || user?.role === 'agency') {
    return <BrandDashboard />;
  } else if (user?.role === 'admin') {
    return <AdminDashboard />;
  }
  return <div className="p-8">Unauthorized Role</div>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-otp" element={<OtpPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
      <Route path="/influencers" element={<InfluencersDirectory />} />
      <Route path="/brands" element={<BrandsDirectory />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      
      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardRouter />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/discovery" 
        element={
          <ProtectedRoute allowedRoles={['brand', 'admin', 'agency']}>
            <InfluencerDiscovery />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/chat" 
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/campaign/:id" 
        element={
          <ProtectedRoute>
            <CampaignDetails />
          </ProtectedRoute>
        } 
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
