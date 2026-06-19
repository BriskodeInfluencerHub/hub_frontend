import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../store/authContext';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import OtpPage from '../pages/OtpPage';
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
      <div className="flex h-screen items-center justify-center bg-neutral-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
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
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-otp" element={<OtpPage />} />
      
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
