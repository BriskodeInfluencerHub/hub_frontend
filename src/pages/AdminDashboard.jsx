import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { UserCheck, ShieldAlert, CheckCircle, XCircle, Database, Eye, ExternalLink, MapPin, Globe, Instagram, Youtube, Twitter, Music, Plus, Trash2, Users, DollarSign, TrendingUp, ClipboardList, UserPlus, Clock, Calendar } from 'lucide-react';

const platformIcons = { instagram: Instagram, youtube: Youtube, twitter: Twitter, tiktok: Music };

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({});
  const [users, setUsers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [newCategoryName, setNewCategoryName] = useState('');

  const [reviewingUser, setReviewingUser] = useState(null);
  const [reviewProfile, setReviewProfile] = useState(null);
  const [loadingReview, setLoadingReview] = useState(false);
  const [reviewingCampaign, setReviewingCampaign] = useState(null);

  const [campaignRequests, setCampaignRequests] = useState([]);
  const [coordinators, setCoordinators] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [assignCoordinatorId, setAssignCoordinatorId] = useState('');
  const [coordinatorForm, setCoordinatorForm] = useState({ name: '', email: '', phone: '', password: '', assignedRegion: '' });
  const [showCoordinatorForm, setShowCoordinatorForm] = useState(false);

  const loadAdminData = async () => {
    try {
      const analyticsRes = await api.get('/admin/analytics');
      setMetrics(analyticsRes.data.metrics);
      setGraphData(analyticsRes.data.signupsOverview);

      const usersRes = await api.get('/admin/users');
      setUsers(usersRes.data);

      const campaignsRes = await api.get('/admin/campaigns');
      setCampaigns(campaignsRes.data);
    } catch (e) {
      console.warn(e);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await api.get('/admin/categories');
      setCategories(res.data);
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadCampaignRequests = async () => {
    try {
      const res = await api.get('/admin/campaign-requests');
      setCampaignRequests(res.data);
    } catch (e) {
      console.warn(e);
    }
  };

  const loadCoordinators = async () => {
    try {
      const res = await api.get('/admin/coordinators');
      setCoordinators(res.data);
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    if (activeTab === 'categories') {
      loadCategories();
    }
    if (activeTab === 'requests') {
      loadCampaignRequests();
    }
    if (activeTab === 'coordinators') {
      loadCoordinators();
    }
  }, [activeTab]);

  const openReview = async (userId) => {
    setLoadingReview(true);
    try {
      const res = await api.get(`/admin/users/${userId}/profile`);
      setReviewingUser(res.data.user);
      setReviewProfile(res.data.profile);
    } catch (err) {
      alert('Failed to load profile details');
    } finally {
      setLoadingReview(false);
    }
  };

  const closeReview = () => {
    setReviewingUser(null);
    setReviewProfile(null);
  };

  const handleVerifyProfile = async () => {
    try {
      await api.patch(`/admin/users/${reviewingUser._id}/status`, { isVerified: true, status: 'active' });
      alert('Profile verified and published!');
      closeReview();
      loadAdminData();
    } catch (err) {
      alert('Failed to verify profile');
    }
  };

  const handleRejectProfile = async () => {
    try {
      await api.patch(`/admin/users/${reviewingUser._id}/status`, { isVerified: false, status: 'active' });
      alert('Profile review skipped. Profile remains unlisted.');
      closeReview();
      loadAdminData();
    } catch (err) {
      alert('Failed to update');
    }
  };

  const handleUpdateUser = async (userId, isVerified, status) => {
    try {
      await api.patch(`/admin/users/${userId}/status`, { isVerified, status });
      alert('User status updated successfully');
      loadAdminData();
    } catch (err) {
      alert('Failed to update user status');
    }
  };

  const openCampaignReview = (campaign) => {
    setReviewingCampaign(campaign);
  };

  const closeCampaignReview = () => {
    setReviewingCampaign(null);
  };

  const handleApproveCampaign = async (campaignId, approve, spam) => {
    try {
      await api.patch(`/admin/campaigns/${campaignId}/approve`, { approve, spam });
      alert(spam ? 'Campaign rejected as spam' : (approve ? 'Campaign approved!' : 'Campaign rejected'));
      closeCampaignReview();
      loadAdminData();
    } catch (err) {
      alert('Action failed');
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      await api.post('/admin/categories', { name: newCategoryName.trim() });
      setNewCategoryName('');
      loadCategories();
    } catch (err) {
      alert('Failed to create category');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      loadCategories();
    } catch (err) {
      alert('Failed to delete category');
    }
  };

  const handleAssignCoordinator = async (requestId) => {
    if (!assignCoordinatorId) return;
    try {
      await api.patch(`/admin/campaign-requests/${requestId}/status`, {
        status: 'assigned',
        assignedCoordinator: assignCoordinatorId,
      });
      alert('Campaign assigned to coordinator!');
      setSelectedRequest(null);
      setAssignCoordinatorId('');
      loadCampaignRequests();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to assign');
    }
  };

  const handleUpdateRequestStatus = async (requestId, status) => {
    try {
      await api.patch(`/admin/campaign-requests/${requestId}/status`, { status });
      alert(`Request ${status}`);
      loadCampaignRequests();
      if (selectedRequest?._id === requestId) {
        const updated = campaignRequests.find((r) => r._id === requestId);
        setSelectedRequest(updated || null);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update');
    }
  };

  const handleCreateCoordinator = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/coordinators', coordinatorForm);
      alert('Coordinator created successfully!');
      setShowCoordinatorForm(false);
      setCoordinatorForm({ name: '', email: '', phone: '', password: '', assignedRegion: '' });
      loadCoordinators();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create coordinator');
    }
  };

  const handleToggleCoordinator = async (id, isActive) => {
    try {
      await api.patch(`/admin/coordinators/${id}`, { isActive: !isActive });
      loadCoordinators();
    } catch (err) {
      alert('Failed to update coordinator');
    }
  };

  const handleDeleteCoordinator = async (id) => {
    if (!window.confirm('Remove this coordinator? Their assigned campaigns will be unassigned.')) return;
    try {
      await api.delete(`/admin/coordinators/${id}`);
      loadCoordinators();
    } catch (err) {
      alert('Failed to remove coordinator');
    }
  };

  const requestStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock size={14} className="text-amber-500" />;
      case 'approved': return <CheckCircle size={14} className="text-green-500" />;
      case 'rejected': return <XCircle size={14} className="text-red-500" />;
      case 'assigned': return <UserCheck size={14} className="text-blue-500" />;
      case 'completed': return <CheckCircle size={14} className="text-brand-500" />;
      default: return null;
    }
  };

  const pendingInfluencers = users.filter(
    (u) => u.role === 'influencer' && u.status === 'active' && !u.influencerProfile?.isVerified
  );

  const pendingBrands = users.filter(
    (u) => u.role === 'brand' && u.status === 'active' && u.brandProfile?.kycStatus !== 'verified'
  );

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <h2 className="text-xl font-bold text-neutral-800 mb-6 flex items-center space-x-2">
          <Database className="text-brand-500" />
          <span>Platform Administrator Console</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <span className="text-xs font-semibold text-neutral-400 uppercase flex items-center gap-1.5">
              <Users size={14} className="text-neutral-400" />
              Total Users
            </span>
            <p className="text-2xl font-extrabold text-neutral-800 mt-1">{metrics.totalUsers || 0}</p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <span className="text-xs font-semibold text-neutral-400 uppercase flex items-center gap-1.5">
              <DollarSign size={14} className="text-neutral-400" />
              Total Revenue
            </span>
            <p className="text-2xl font-extrabold text-brand-600 mt-1">${metrics.platformVolume?.toLocaleString() || 0}</p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <span className="text-xs font-semibold text-neutral-400 uppercase flex items-center gap-1.5">
              <TrendingUp size={14} className="text-neutral-400" />
              Active Campaigns
            </span>
            <p className="text-2xl font-extrabold text-neutral-800 mt-1">{metrics.activeCampaigns || 0}</p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <span className="text-xs font-semibold text-neutral-400 uppercase flex items-center gap-1.5">
              <Database size={14} className="text-neutral-400" />
              Total Campaigns
            </span>
            <p className="text-2xl font-extrabold text-neutral-800 mt-1">{metrics.totalCampaigns || 0}</p>
          </div>
        </div>

        <div className="flex border-b border-neutral-200 mb-6 space-x-4 overflow-x-auto">
          <button onClick={() => setActiveTab('users')} className={`pb-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${activeTab === 'users' ? 'border-brand-500 text-brand-600' : 'border-transparent text-neutral-500'}`}>All Users</button>
          <button onClick={() => setActiveTab('reviews')} className={`pb-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${activeTab === 'reviews' ? 'border-brand-500 text-brand-600' : 'border-transparent text-neutral-500'}`}>Profile Reviews {(pendingInfluencers.length + pendingBrands.length) > 0 && <span className="ml-1 text-brand-500">({pendingInfluencers.length + pendingBrands.length})</span>}</button>
          <button onClick={() => setActiveTab('approvals')} className={`pb-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${activeTab === 'approvals' ? 'border-brand-500 text-brand-600' : 'border-transparent text-neutral-500'}`}>Campaign Approvals ({campaigns.length})</button>
          <button onClick={() => setActiveTab('categories')} className={`pb-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${activeTab === 'categories' ? 'border-brand-500 text-brand-600' : 'border-transparent text-neutral-500'}`}>Categories</button>
          <button onClick={() => setActiveTab('analytics')} className={`pb-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${activeTab === 'analytics' ? 'border-brand-500 text-brand-600' : 'border-transparent text-neutral-500'}`}>Signups Analytics</button>
          <button onClick={() => setActiveTab('requests')} className={`pb-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${activeTab === 'requests' ? 'border-brand-500 text-brand-600' : 'border-transparent text-neutral-500'}`}>Campaign Requests</button>
          <button onClick={() => setActiveTab('coordinators')} className={`pb-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${activeTab === 'coordinators' ? 'border-brand-500 text-brand-600' : 'border-transparent text-neutral-500'}`}>Coordinators</button>
        </div>

        {activeTab === 'users' && (
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200 text-sm text-left">
              <thead>
                <tr className="text-xs font-semibold text-neutral-400 uppercase tracking-wider bg-neutral-50">
                  <th className="px-6 py-3">User Details</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Verification</th>
                  <th className="px-6 py-3">Account Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-neutral-50/50">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-neutral-800">{u.name}</p>
                      <p className="text-xs text-neutral-400">{u.email} | {u.phone}</p>
                    </td>
                    <td className="px-6 py-4 capitalize font-semibold text-neutral-600">{u.role}</td>
                    <td className="px-6 py-4">
                      {u.role === 'influencer' ? (
                        <div>
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${u.influencerProfile?.isVerified ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                            {u.influencerProfile?.isVerified ? 'Profile Live' : 'Profile Pending'}
                          </span>
                          <div className="text-[10px] text-neutral-400 mt-1">Completion: {u.influencerProfile?.profileCompletion || 0}%</div>
                        </div>
                      ) : u.role === 'brand' ? (
                        <div>
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            u.brandProfile?.kycStatus === 'verified' ? 'bg-green-50 text-green-600' :
                            u.brandProfile?.kycStatus === 'pending' ? 'bg-blue-50 text-blue-600' :
                            'bg-amber-50 text-amber-600'
                          }`}>
                            KYC: {u.brandProfile?.kycStatus || 'unverified'}
                          </span>
                          <div className="text-[10px] text-neutral-400 mt-1">{u.brandProfile?.companyName || ''}</div>
                        </div>
                      ) : (
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${u.isVerified ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                          {u.isVerified ? 'Verified' : 'Unverified'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 capitalize">{u.status}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {u.role === 'influencer' && !u.influencerProfile?.isVerified && (
                        <button
                          onClick={() => openReview(u._id)}
                          className="rounded-lg bg-brand-50 text-brand-600 px-2.5 py-1 text-xs font-semibold hover:bg-brand-100"
                        >
                          Review
                        </button>
                      )}
                      {u.role === 'brand' && u.brandProfile?.kycStatus !== 'verified' && (
                        <button
                          onClick={() => openReview(u._id)}
                          className="rounded-lg bg-brand-50 text-brand-600 px-2.5 py-1 text-xs font-semibold hover:bg-brand-100"
                        >
                          Review
                        </button>
                      )}
                      {u.role !== 'influencer' && u.role !== 'brand' && !u.isVerified && (
                        <button
                          onClick={() => handleUpdateUser(u._id, true, 'active')}
                          className="rounded-lg bg-green-50 text-green-600 px-2.5 py-1 text-xs font-semibold hover:bg-green-100"
                        >
                          Verify
                        </button>
                      )}
                      {u.status === 'active' ? (
                        <button
                          onClick={() => handleUpdateUser(u._id, u.isVerified, 'suspended')}
                          className="rounded-lg bg-red-50 text-red-600 px-2.5 py-1 text-xs font-semibold hover:bg-red-100"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateUser(u._id, u.isVerified, 'active')}
                          className="rounded-lg bg-neutral-100 text-neutral-700 px-2.5 py-1 text-xs font-semibold hover:bg-neutral-200"
                        >
                          Activate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-neutral-800 mb-1">Profile Reviews</h3>
              <p className="text-xs text-neutral-400 mb-6">Review profiles before approving them on the platform.</p>

              {pendingBrands.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-sm font-bold text-neutral-700 mb-3 flex items-center space-x-2">
                    <span>Brands Pending Verification</span>
                    <span className="rounded-full bg-amber-50 text-amber-600 px-2 py-0.5 text-[10px] font-bold">{pendingBrands.length}</span>
                  </h4>
                  <div className="space-y-3">
                    {pendingBrands.map((u) => (
                      <div key={u._id} className="rounded-xl border border-neutral-200 p-4 hover:border-neutral-300 transition-colors flex items-center justify-between gap-4">
                        <div className="flex items-center space-x-4">
                          {u.profileImage ? (
                            <img src={`http://localhost:5001${u.profileImage}`} alt="" className="h-12 w-12 rounded-full object-cover border border-neutral-200" />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-brand-50 flex items-center justify-center font-bold text-brand-600 text-lg">
                              {u.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-neutral-800">{u.brandProfile?.companyName || u.name}</p>
                            <p className="text-xs text-neutral-400">{u.email}</p>
                            <div className="flex items-center space-x-3 mt-1">
                              <span className="text-[10px] text-neutral-400">KYC: {u.brandProfile?.kycStatus || 'unverified'}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => openReview(u._id)}
                          className="rounded-lg bg-brand-600 text-white px-4 py-2 text-xs font-semibold hover:bg-brand-700 transition-colors flex items-center space-x-1.5"
                        >
                          <Eye size={14} />
                          <span>Review Brand</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <h4 className="text-sm font-bold text-neutral-700 mb-3 flex items-center space-x-2">
                <span>Influencers Pending Verification</span>
                {pendingInfluencers.length > 0 && <span className="rounded-full bg-amber-50 text-amber-600 px-2 py-0.5 text-[10px] font-bold">{pendingInfluencers.length}</span>}
              </h4>
              {pendingInfluencers.length === 0 ? (
                <div className="text-center py-8 text-sm text-neutral-400 bg-neutral-50 rounded-xl border border-neutral-100">All influencer profiles have been reviewed.</div>
              ) : (
                <div className="space-y-3">
                  {pendingInfluencers.map((u) => (
                    <div key={u._id} className="rounded-xl border border-neutral-200 p-4 hover:border-neutral-300 transition-colors flex items-center justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        {u.profileImage ? (
                          <img src={`http://localhost:5001${u.profileImage}`} alt="" className="h-12 w-12 rounded-full object-cover border border-neutral-200" />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-brand-50 flex items-center justify-center font-bold text-brand-600 text-lg">
                            {u.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-neutral-800">{u.name}</p>
                          <p className="text-xs text-neutral-400">{u.email}</p>
                          {u.influencerProfile && (
                            <div className="flex items-center space-x-3 mt-1">
                              <span className="text-[10px] text-neutral-400">Completion: {u.influencerProfile.profileCompletion}%</span>
                              <span className="text-[10px] text-neutral-400">Categories: {u.influencerProfile.categories?.join(', ') || 'None'}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => openReview(u._id)}
                        className="rounded-lg bg-brand-600 text-white px-4 py-2 text-xs font-semibold hover:bg-brand-700 transition-colors flex items-center space-x-1.5"
                      >
                        <Eye size={14} />
                        <span>Review Profile</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'approvals' && (
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-neutral-800 mb-6">Pending Campaigns</h3>
            <div className="space-y-4">
              {campaigns.length === 0 ? (
                <div className="text-center py-12 text-sm text-neutral-400">All campaigns processed. No pending approvals.</div>
              ) : (
                campaigns.map((c) => (
                  <div key={c._id} className="rounded-2xl border border-neutral-200 p-5 hover:border-neutral-300 transition-colors flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-neutral-800">{c.title}</h4>
                      <p className="text-xs text-neutral-500 mt-1">Brand: {c.brand?.name} | Category: {c.category} | Budget: ${c.budget.toLocaleString()}</p>
                      <p className="text-xs text-neutral-400 mt-2">{c.description}</p>
                    </div>
                    <div className="flex space-x-2 shrink-0">
                      <button
                        onClick={() => openCampaignReview(c)}
                        className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700 flex items-center space-x-1"
                      >
                        <Eye size={14} />
                        <span>Review</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-neutral-800 mb-1">Manage Categories</h3>
            <p className="text-xs text-neutral-400 mb-6">Create and manage platform categories for campaigns and influencer profiles.</p>

            <div className="flex items-center gap-3 mb-6">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Category name (e.g. Fashion)"
                className="flex-1 rounded-xl border border-neutral-300 px-4 py-2.5 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10"
                onKeyDown={(e) => e.key === 'Enter' && handleCreateCategory()}
              />
              <button
                onClick={handleCreateCategory}
                className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition-colors flex items-center space-x-1.5"
              >
                <Plus size={16} />
                <span>Add Category</span>
              </button>
            </div>

            {categories.length === 0 ? (
              <div className="text-center py-12 text-sm text-neutral-400 bg-neutral-50 rounded-xl border border-neutral-100">
                No categories yet. Add one above.
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {categories.map((cat) => (
                  <div key={cat._id} className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 flex items-center justify-between group hover:border-neutral-300 transition-colors">
                    <span className="text-sm font-semibold text-neutral-700">{cat.name}</span>
                    <button
                      onClick={() => handleDeleteCategory(cat._id)}
                      className="text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      title="Delete category"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-neutral-800 mb-6">Monthly User Signups</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={graphData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" stroke="#a1a1aa" />
                  <YAxis stroke="#a1a1aa" />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#0e81ec" strokeWidth={3} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-neutral-800 mb-6 flex items-center space-x-2">
              <ClipboardList size={18} className="text-brand-500" />
              <span>Incoming Campaign Requests</span>
            </h3>
            {campaignRequests.length === 0 ? (
              <div className="text-center py-12 text-sm text-neutral-400">No campaign requests yet.</div>
            ) : (
              <div className="space-y-4">
                {campaignRequests.map((req) => (
                  <div key={req._id} className="rounded-2xl border border-neutral-200 p-5 hover:border-neutral-300 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-bold text-neutral-800">{req.title}</h4>
                          <span className={`inline-flex items-center space-x-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                            req.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                            req.status === 'approved' ? 'bg-green-50 text-green-600' :
                            req.status === 'rejected' ? 'bg-red-50 text-red-600' :
                            req.status === 'assigned' ? 'bg-blue-50 text-blue-600' :
                            'bg-brand-50 text-brand-600'
                          }`}>
                            {requestStatusIcon(req.status)}
                            <span>{req.status}</span>
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 mt-1">{req.description}</p>
                        <div className="flex flex-wrap gap-3 mt-2 text-[11px] text-neutral-400">
                          <span className="flex items-center gap-1"><UserCheck size={12} />{req.brand?.name}</span>
                          {req.location && <span className="flex items-center gap-1"><MapPin size={12} />{req.location}</span>}
                          {req.budget > 0 && <span className="flex items-center gap-1"><DollarSign size={12} />${req.budget.toLocaleString()}</span>}
                          {req.timeline && <span className="flex items-center gap-1"><Calendar size={12} />{req.timeline}</span>}
                        </div>
                        {req.assignedCoordinator && (
                          <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                            <UserCheck size={12} />
                            Assigned to: {req.assignedCoordinator.name}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => setSelectedRequest(selectedRequest?._id === req._id ? null : req)}
                        className="rounded-lg bg-brand-50 text-brand-600 px-3 py-1.5 text-xs font-semibold hover:bg-brand-100 shrink-0"
                      >
                        {selectedRequest?._id === req._id ? 'Close' : 'Manage'}
                      </button>
                    </div>

                    {selectedRequest?._id === req._id && (
                      <div className="mt-4 pt-4 border-t border-neutral-100 space-y-4">
                        {req.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button onClick={() => handleUpdateRequestStatus(req._id, 'approved')} className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700">Approve</button>
                            <button onClick={() => handleUpdateRequestStatus(req._id, 'rejected')} className="rounded-lg bg-red-50 text-red-600 px-3 py-1.5 text-xs font-semibold hover:bg-red-100">Reject</button>
                          </div>
                        )}
                        {coordinators.length > 0 && req.status === 'approved' && (
                          <div className="flex items-center space-x-2">
                            <select
                              value={assignCoordinatorId}
                              onChange={(e) => setAssignCoordinatorId(e.target.value)}
                              className="rounded-xl border border-neutral-200 py-1.5 px-3 text-xs focus:border-brand-500 focus:outline-none bg-neutral-50/50"
                            >
                              <option value="">Select coordinator...</option>
                              {coordinators.filter((c) => c.isActive).map((c) => (
                                <option key={c._id} value={c.user?._id}>{c.user?.name} ({c.assignedRegion || 'No region'})</option>
                              ))}
                            </select>
                            <button onClick={() => handleAssignCoordinator(req._id)} className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700">Assign</button>
                          </div>
                        )}
                        {(req.status === 'assigned' || req.status === 'completed') && (
                          <div className="flex space-x-2">
                            {req.status === 'assigned' && (
                              <button onClick={() => handleUpdateRequestStatus(req._id, 'completed')} className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700">Mark Completed</button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'coordinators' && (
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-neutral-800 flex items-center space-x-2">
                  <UserCheck size={18} className="text-brand-500" />
                  <span>Manage Coordinators</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-1">Create and manage coordinator accounts. Coordinators handle assigned campaigns.</p>
              </div>
              <button
                onClick={() => setShowCoordinatorForm(!showCoordinatorForm)}
                className="rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700 transition-colors flex items-center space-x-1.5"
              >
                <UserPlus size={14} />
                <span>{showCoordinatorForm ? 'Cancel' : 'Add Coordinator'}</span>
              </button>
            </div>

            {showCoordinatorForm && (
              <form onSubmit={handleCreateCoordinator} className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 mb-6 space-y-4">
                <h4 className="text-sm font-bold text-neutral-700">New Coordinator</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Full Name</label>
                    <input type="text" required value={coordinatorForm.name} onChange={(e) => setCoordinatorForm({ ...coordinatorForm, name: e.target.value })} className="block w-full rounded-xl border border-neutral-200 py-2 px-3 text-sm focus:border-brand-500 focus:outline-none bg-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Email</label>
                    <input type="email" required value={coordinatorForm.email} onChange={(e) => setCoordinatorForm({ ...coordinatorForm, email: e.target.value })} className="block w-full rounded-xl border border-neutral-200 py-2 px-3 text-sm focus:border-brand-500 focus:outline-none bg-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Phone</label>
                    <input type="text" required value={coordinatorForm.phone} onChange={(e) => setCoordinatorForm({ ...coordinatorForm, phone: e.target.value })} className="block w-full rounded-xl border border-neutral-200 py-2 px-3 text-sm focus:border-brand-500 focus:outline-none bg-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Password</label>
                    <input type="password" required value={coordinatorForm.password} onChange={(e) => setCoordinatorForm({ ...coordinatorForm, password: e.target.value })} className="block w-full rounded-xl border border-neutral-200 py-2 px-3 text-sm focus:border-brand-500 focus:outline-none bg-white" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Assigned Region</label>
                    <input type="text" value={coordinatorForm.assignedRegion} onChange={(e) => setCoordinatorForm({ ...coordinatorForm, assignedRegion: e.target.value })} className="block w-full rounded-xl border border-neutral-200 py-2 px-3 text-sm focus:border-brand-500 focus:outline-none bg-white" placeholder="e.g. Mumbai, All India" />
                  </div>
                </div>
                <button type="submit" className="rounded-xl bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700">Create Coordinator</button>
              </form>
            )}

            {coordinators.length === 0 ? (
              <div className="text-center py-12 text-sm text-neutral-400">No coordinators yet. Add one above.</div>
            ) : (
              <div className="space-y-3">
                {coordinators.map((c) => (
                  <div key={c._id} className="rounded-xl border border-neutral-200 p-4 flex items-center justify-between gap-4 hover:border-neutral-300 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-brand-50 flex items-center justify-center font-bold text-brand-600">
                        {c.user?.name?.charAt(0) || 'C'}
                      </div>
                      <div>
                        <p className="font-bold text-neutral-800">{c.user?.name}</p>
                        <p className="text-xs text-neutral-400">{c.user?.email}</p>
                        <div className="flex items-center space-x-3 mt-1 text-[11px]">
                          <span className="text-neutral-400">{c.user?.phone}</span>
                          {c.assignedRegion && <span className="flex items-center gap-1 text-neutral-400"><MapPin size={10} />{c.assignedRegion}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${c.isActive ? 'bg-green-50 text-green-600' : 'bg-neutral-100 text-neutral-500'}`}>
                        {c.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <button
                        onClick={() => handleToggleCoordinator(c._id, c.isActive)}
                        className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${c.isActive ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                      >
                        {c.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDeleteCoordinator(c._id)}
                        className="rounded-lg bg-red-50 text-red-600 px-2.5 py-1 text-xs font-semibold hover:bg-red-100"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {reviewingCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-neutral-800 flex items-center space-x-2">
                <ShieldAlert size={20} className="text-brand-500" />
                <span>Review Campaign</span>
              </h3>
              <button onClick={closeCampaignReview} className="text-neutral-400 hover:text-neutral-600 text-xl">&times;</button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4 pb-4 border-b border-neutral-100">
                <div>
                  <p className="text-lg font-bold text-neutral-800">{reviewingCampaign.title}</p>
                  <p className="text-sm text-neutral-400">by {reviewingCampaign.brand?.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-neutral-50 p-3 border border-neutral-100">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Category</span>
                  <p className="text-sm font-semibold text-neutral-700 mt-1">{reviewingCampaign.category}</p>
                </div>
                <div className="rounded-xl bg-neutral-50 p-3 border border-neutral-100">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Budget</span>
                  <p className="text-sm font-semibold text-neutral-700 mt-1">${reviewingCampaign.budget?.toLocaleString()}</p>
                </div>
                {reviewingCampaign.targetAudience && (
                  <div className="rounded-xl bg-neutral-50 p-3 border border-neutral-100">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Target Audience</span>
                    <p className="text-sm font-semibold text-neutral-700 mt-1">{reviewingCampaign.targetAudience}</p>
                  </div>
                )}
                {reviewingCampaign.location && (
                  <div className="rounded-xl bg-neutral-50 p-3 border border-neutral-100">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Location</span>
                    <p className="text-sm font-semibold text-neutral-700 mt-1">{reviewingCampaign.location}</p>
                  </div>
                )}
                {reviewingCampaign.requiredFollowers > 0 && (
                  <div className="rounded-xl bg-neutral-50 p-3 border border-neutral-100">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Min Followers</span>
                    <p className="text-sm font-semibold text-neutral-700 mt-1">{reviewingCampaign.requiredFollowers?.toLocaleString()}</p>
                  </div>
                )}
                <div className="rounded-xl bg-neutral-50 p-3 border border-neutral-100">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Duration</span>
                  <p className="text-sm font-semibold text-neutral-700 mt-1">{new Date(reviewingCampaign.startDate).toLocaleDateString()} — {new Date(reviewingCampaign.endDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Description & Guidelines</span>
                <p className="text-sm text-neutral-700 mt-1.5">{reviewingCampaign.description}</p>
              </div>

              {reviewingCampaign.requiredPlatforms?.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Required Platforms</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {reviewingCampaign.requiredPlatforms.map((p, i) => (
                      <span key={i} className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-600 capitalize">{p}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-100">
                <button
                  onClick={() => handleApproveCampaign(reviewingCampaign._id, false, true)}
                  className="rounded-xl border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  <XCircle size={16} className="inline mr-1" />
                  Reject as Spam
                </button>
                <button
                  onClick={() => handleApproveCampaign(reviewingCampaign._id, false, false)}
                  className="rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
                >
                  <XCircle size={16} className="inline mr-1" />
                  Reject Campaign
                </button>
                <button
                  onClick={() => handleApproveCampaign(reviewingCampaign._id, true, false)}
                  className="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors flex items-center space-x-1.5"
                >
                  <CheckCircle size={16} />
                  <span>Approve & Publish Campaign</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {reviewingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl animate-fade-in">
            {loadingReview ? (
              <div className="text-center py-12 text-sm text-neutral-400">Loading profile...</div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-neutral-800 flex items-center space-x-2">
                    <ShieldAlert size={20} className="text-brand-500" />
                    <span>Review {reviewingUser.role === 'brand' ? 'Brand' : 'Influencer'} Profile</span>
                  </h3>
                  <button onClick={closeReview} className="text-neutral-400 hover:text-neutral-600 text-xl">&times;</button>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center space-x-4 pb-4 border-b border-neutral-100">
                    {reviewingUser.profileImage ? (
                      <img src={`http://localhost:5001${reviewingUser.profileImage}`} alt="" className="h-16 w-16 rounded-full object-cover border border-neutral-200" />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-brand-50 flex items-center justify-center font-bold text-brand-600 text-2xl">
                        {reviewingUser.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="text-lg font-bold text-neutral-800">{reviewingUser.role === 'brand' ? (reviewProfile?.companyName || reviewingUser.name) : reviewingUser.name}</p>
                      <p className="text-sm text-neutral-400">{reviewingUser.email} | {reviewingUser.phone}</p>
                      {reviewProfile?.location && (
                        <div className="flex items-center space-x-1.5 text-xs text-neutral-500 mt-1">
                          <MapPin size={12} />
                          <span>{reviewProfile.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {reviewingUser.role === 'brand' && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-xl bg-neutral-50 p-3 border border-neutral-100">
                          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Industry</span>
                          <p className="text-sm font-semibold text-neutral-700 mt-1">{reviewProfile?.industry || 'Not specified'}</p>
                        </div>
                        <div className="rounded-xl bg-neutral-50 p-3 border border-neutral-100">
                          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">KYC Status</span>
                          <p className={`text-sm font-semibold mt-1 capitalize ${reviewProfile?.kycStatus === 'verified' ? 'text-green-600' : 'text-amber-600'}`}>{reviewProfile?.kycStatus || 'unverified'}</p>
                        </div>
                      </div>
                      {reviewProfile?.website && (
                        <div>
                          <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Website</span>
                          <a href={reviewProfile.website} target="_blank" rel="noreferrer" className="block text-sm text-brand-600 hover:underline mt-1">{reviewProfile.website}</a>
                        </div>
                      )}
                      {reviewProfile?.bio && (
                        <div>
                          <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">About / Bio</span>
                          <p className="text-sm text-neutral-700 mt-1.5">{reviewProfile.bio}</p>
                        </div>
                      )}
                      {reviewProfile?.kycDocumentUrl && (
                        <div>
                          <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">KYC Document</span>
                          <a href={reviewProfile.kycDocumentUrl} target="_blank" rel="noreferrer" className="inline-flex items-center space-x-1 text-sm text-brand-600 hover:underline mt-1">
                            <ExternalLink size={14} />
                            <span>View Document</span>
                          </a>
                        </div>
                      )}
                    </>
                  )}

                  {reviewingUser.role === 'influencer' && (
                    <>
                      <div>
                        <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Categories</span>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {reviewProfile?.categories?.length > 0 ? (
                            reviewProfile.categories.map((c, i) => (
                              <span key={i} className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-600">{c}</span>
                            ))
                          ) : (
                            <span className="text-xs text-neutral-400 italic">None specified</span>
                          )}
                        </div>
                      </div>

                      {reviewProfile?.bio && (
                        <div>
                          <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Bio</span>
                          <p className="text-sm text-neutral-700 mt-1.5">{reviewProfile.bio}</p>
                        </div>
                      )}

                      <div>
                        <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Social Accounts</span>
                        <div className="space-y-2 mt-2">
                          {reviewProfile?.socialAccounts?.length > 0 ? (
                            reviewProfile.socialAccounts.map((acc, i) => {
                              const Icon = platformIcons[acc.platform] || Globe;
                              return (
                                <div key={i} className="flex items-center justify-between rounded-xl bg-neutral-50 p-3 border border-neutral-100">
                                  <div className="flex items-center space-x-2.5">
                                    <Icon size={16} className="text-neutral-500" />
                                    <span className="capitalize font-bold text-xs text-neutral-700">{acc.platform}</span>
                                    <span className="text-xs text-neutral-500">@{acc.username}</span>
                                  </div>
                                  <div className="text-right text-xs">
                                    <span className="font-semibold text-neutral-700">{acc.followers?.toLocaleString()} followers</span>
                                    {acc.engagementRate > 0 && (
                                      <span className="text-neutral-400 ml-2">ER: {acc.engagementRate}%</span>
                                    )}
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <span className="text-xs text-neutral-400 italic">No social accounts linked</span>
                          )}
                        </div>
                      </div>

                      {reviewProfile?.portfolio?.length > 0 && (
                        <div>
                          <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Portfolio ({reviewProfile.portfolio.length} items)</span>
                          <div className="grid grid-cols-2 gap-3 mt-2">
                            {reviewProfile.portfolio.map((item, i) => (
                              <div key={i} className="rounded-xl border border-neutral-200 p-3 bg-neutral-50/50">
                                <p className="text-sm font-semibold text-neutral-800">{item.title || 'Untitled'}</p>
                                {item.description && <p className="text-xs text-neutral-500 mt-1">{item.description}</p>}
                                {item.fileUrl && (
                                  <a href={item.fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center space-x-1 text-xs text-brand-600 hover:underline mt-2">
                                    <ExternalLink size={12} />
                                    <span>View Link</span>
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="rounded-xl bg-neutral-50 p-4 border border-neutral-100">
                        <div className="flex justify-between text-sm font-semibold text-neutral-600">
                          <span>Profile Completion</span>
                          <span className="text-brand-600">{reviewProfile?.profileCompletion || 0}%</span>
                        </div>
                        <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden mt-2">
                          <div className="bg-brand-500 h-full rounded-full transition-all" style={{ width: `${reviewProfile?.profileCompletion || 0}%` }}></div>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-100">
                    <button
                      onClick={handleRejectProfile}
                      className="rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
                    >
                      {reviewingUser.role === 'brand' ? 'Skip (Keep Unverified)' : 'Skip (Keep Unlisted)'}
                    </button>
                    <button
                      onClick={handleVerifyProfile}
                      className="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors flex items-center space-x-1.5"
                    >
                      <CheckCircle size={16} />
                      <span>{reviewingUser.role === 'brand' ? 'Approve Brand' : 'Approve & Publish Profile'}</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
