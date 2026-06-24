import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { UserCheck, ShieldAlert, CheckCircle, XCircle, Database, Eye, ExternalLink, MapPin, Globe, Instagram, Youtube, Twitter, Music } from 'lucide-react';

const platformIcons = { instagram: Instagram, youtube: Youtube, twitter: Twitter, tiktok: Music };

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({});
  const [users, setUsers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [activeTab, setActiveTab] = useState('users');

  // Profile review state
  const [reviewingUser, setReviewingUser] = useState(null);
  const [reviewProfile, setReviewProfile] = useState(null);
  const [loadingReview, setLoadingReview] = useState(false);
  const [reviewingCampaign, setReviewingCampaign] = useState(null);

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

  useEffect(() => {
    loadAdminData();
  }, []);

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

  const handleApproveCampaign = async (campaignId, approve) => {
    try {
      await api.patch(`/admin/campaigns/${campaignId}/approve`, { approve });
      alert(approve ? 'Campaign approved!' : 'Campaign rejected');
      closeCampaignReview();
      loadAdminData();
    } catch (err) {
      alert('Action failed');
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
            <span className="text-xs font-semibold text-neutral-400 uppercase">Total Creators</span>
            <p className="text-2xl font-extrabold text-neutral-800 mt-1">{metrics.totalInfluencers || 0}</p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <span className="text-xs font-semibold text-neutral-400 uppercase">Brands onboarded</span>
            <p className="text-2xl font-extrabold text-neutral-800 mt-1">{metrics.totalBrands || 0}</p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <span className="text-xs font-semibold text-neutral-400 uppercase">Total Campaigns</span>
            <p className="text-2xl font-extrabold text-neutral-800 mt-1">{metrics.totalCampaigns || 0}</p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <span className="text-xs font-semibold text-neutral-400 uppercase">Escrow Volume</span>
            <p className="text-2xl font-extrabold text-brand-600 mt-1">${metrics.platformVolume?.toLocaleString() || 0}</p>
          </div>
        </div>

        <div className="flex border-b border-neutral-200 mb-6 space-x-4">
          <button onClick={() => setActiveTab('reviews')} className={`pb-3 text-sm font-semibold border-b-2 transition-all ${activeTab === 'reviews' ? 'border-brand-500 text-brand-600' : 'border-transparent text-neutral-500'}`}>Profile Reviews {(pendingInfluencers.length + pendingBrands.length) > 0 && <span className="ml-1 text-brand-500">({pendingInfluencers.length + pendingBrands.length})</span>}</button>
          <button onClick={() => setActiveTab('users')} className={`pb-3 text-sm font-semibold border-b-2 transition-all ${activeTab === 'users' ? 'border-brand-500 text-brand-600' : 'border-transparent text-neutral-500'}`}>All Users</button>
          <button onClick={() => setActiveTab('approvals')} className={`pb-3 text-sm font-semibold border-b-2 transition-all ${activeTab === 'approvals' ? 'border-brand-500 text-brand-600' : 'border-transparent text-neutral-500'}`}>Campaign Approvals ({campaigns.length})</button>
          <button onClick={() => setActiveTab('analytics')} className={`pb-3 text-sm font-semibold border-b-2 transition-all ${activeTab === 'analytics' ? 'border-brand-500 text-brand-600' : 'border-transparent text-neutral-500'}`}>Signups Analytics</button>
        </div>

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
      </main>

      {/* Campaign Review Modal */}
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
                  onClick={() => handleApproveCampaign(reviewingCampaign._id, false)}
                  className="rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  <XCircle size={16} className="inline mr-1" />
                  Reject Campaign
                </button>
                <button
                  onClick={() => handleApproveCampaign(reviewingCampaign._id, true)}
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

      {/* Profile Review Modal */}
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
                  {/* Basic Info */}
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

                  {/* Brand-specific fields */}
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

                  {/* Influencer-specific fields */}
                  {reviewingUser.role === 'influencer' && (
                    <>
                      {/* Categories */}
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

                      {/* Bio */}
                      {reviewProfile?.bio && (
                        <div>
                          <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Bio</span>
                          <p className="text-sm text-neutral-700 mt-1.5">{reviewProfile.bio}</p>
                        </div>
                      )}

                      {/* Social Accounts */}
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

                      {/* Portfolio */}
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

                      {/* Profile Completion */}
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

                  {/* Actions */}
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
