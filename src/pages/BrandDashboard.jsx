import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, Check, X, ShieldAlert, Sparkles, ClipboardList, Wallet, UserCheck, Calendar, Globe, Instagram, Youtube, Twitter, Music, ExternalLink } from 'lucide-react';

const platformIcons = { instagram: Instagram, youtube: Youtube, twitter: Twitter, tiktok: Music };

const BrandDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaignApps, setSelectedCampaignApps] = useState([]);
  const [activeTab, setActiveTab] = useState('campaigns');
  const [activeCampaignId, setActiveCampaignId] = useState(null);
  const [applicantFilter, setApplicantFilter] = useState('all');

  const filteredApps = applicantFilter === 'all'
    ? selectedCampaignApps
    : selectedCampaignApps.filter((a) => a.status === applicantFilter);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [budget, setBudget] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [campaignLocation, setCampaignLocation] = useState('');
  const [requiredFollowers, setRequiredFollowers] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [kycDocUrl, setKycDocUrl] = useState('');
  const [payments, setPayments] = useState([]);

  // Profile edit state
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('');
  const [brandBio, setBrandBio] = useState('');
  const [brandLocation, setBrandLocation] = useState('');

  const loadBrandData = async () => {
    try {
      const profileRes = await api.get('/users/profile');
      const p = profileRes.data.profile;
      setUser(profileRes.data.user);
      setProfile(p);
      setCompanyName(p?.companyName || '');
      setWebsite(p?.website || '');
      setIndustry(p?.industry || '');
      setBrandBio(p?.bio || '');
      setBrandLocation(p?.location || '');

      const brandId = profileRes.data.user._id;
      const resActive = await api.get(`/campaigns?brandId=${brandId}&status=active`);
      const resPending = await api.get(`/campaigns?brandId=${brandId}&status=pending_approval`);
      const resDraft = await api.get(`/campaigns?brandId=${brandId}&status=draft`);
      setCampaigns([...resActive.data, ...resPending.data, ...resDraft.data]);

      const walletRes = await api.get('/payments/wallet');
      setPayments(walletRes.data.transactions || []);
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    loadBrandData();
  }, []);

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    try {
      await api.post('/campaigns', {
        title,
        description,
        category,
        budget: Number(budget),
        targetAudience,
        location: campaignLocation,
        requiredFollowers: Number(requiredFollowers) || 0,
        requiredPlatforms: ['instagram'],
        startDate,
        endDate
      });

      alert('Campaign created! Sent for admin approval.');
      setTitle('');
      setDescription('');
      setCategory('');
      setBudget('');
      setTargetAudience('');
      setCampaignLocation('');
      setRequiredFollowers('');
      setStartDate('');
      setEndDate('');
      loadBrandData();
      setActiveTab('campaigns');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create campaign');
    }
  };

  const handleViewApplicants = async (campaignId) => {
    try {
      const res = await api.get(`/applications/campaign/${campaignId}/applications`);
      setSelectedCampaignApps(res.data);
      setActiveCampaignId(campaignId);
      setActiveTab('applicants');
    } catch (err) {
      alert('Failed to load applicants');
    }
  };

  const handleUpdateAppStatus = async (appId, status) => {
    try {
      await api.patch(`/applications/${appId}/status`, { status });
      alert(`Application updated to ${status}`);
      if (activeCampaignId) handleViewApplicants(activeCampaignId);
      loadBrandData();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleUploadKyc = async (e) => {
    e.preventDefault();
    try {
      await api.put('/users/profile', { kycDocumentUrl: kycDocUrl });
      alert('KYC Document uploaded. Pending verification.');
      loadBrandData();
    } catch (err) {
      alert('KYC upload failed');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put('/users/profile', {
        companyName, website, industry, bio: brandBio, location: brandLocation
      });
      alert('Profile updated successfully!');
      loadBrandData();
      setActiveTab('campaigns');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleUploadAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('profileImage', file);
    try {
      await api.post('/users/upload-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Logo uploaded!');
      loadBrandData();
    } catch (err) {
      alert('Upload failed');
    }
  };

  const chartData = campaigns.map(c => ({
    name: c.title.substring(0, 12) + '...',
    budget: c.budget,
  }));

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center space-x-4">
            {user?.profileImage ? (
              <img src={`http://localhost:5001${user.profileImage}`} alt="" className="h-14 w-14 rounded-full object-cover border border-neutral-200" />
            ) : (
              <div className="h-14 w-14 rounded-full bg-brand-50 flex items-center justify-center font-bold text-brand-600 text-lg">
                {profile?.companyName?.charAt(0) || 'B'}
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-neutral-800">Brand Portal: {profile?.companyName || 'Loading...'}</h2>
              <div className="flex items-center space-x-2 text-xs text-neutral-500 mt-1">
                <Calendar size={14} />
                <span>KYC Status: </span>
                <span className={`font-semibold capitalize ${profile?.kycStatus === 'verified' ? 'text-green-600' : 'text-amber-600'}`}>{profile?.kycStatus || 'unverified'}</span>
              </div>
            </div>
          </div>
          {profile?.kycStatus !== 'verified' && (
            <form onSubmit={handleUploadKyc} className="flex items-center space-x-2">
              <input
                type="text"
                required
                value={kycDocUrl}
                onChange={(e) => setKycDocUrl(e.target.value)}
                placeholder="KYC Document URL"
                className="rounded-xl border border-neutral-200 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none bg-neutral-50/50"
              />
              <button type="submit" className="rounded-xl bg-brand-600 px-3 py-2 text-xs font-semibold text-white hover:bg-brand-700">Submit KYC</button>
            </form>
          )}
        </div>

        <div className="flex border-b border-neutral-200 mb-6 space-x-4">
          <button onClick={() => setActiveTab('campaigns')} className={`pb-3 text-sm font-semibold border-b-2 transition-all ${activeTab === 'campaigns' ? 'border-brand-500 text-brand-600' : 'border-transparent text-neutral-500'}`}>My Campaigns</button>
          <button onClick={() => setActiveTab('create-campaign')} className={`pb-3 text-sm font-semibold border-b-2 transition-all ${activeTab === 'create-campaign' ? 'border-brand-500 text-brand-600' : 'border-transparent text-neutral-500'}`}>Create Campaign</button>
          <button onClick={() => setActiveTab('edit-profile')} className={`pb-3 text-sm font-semibold border-b-2 transition-all ${activeTab === 'edit-profile' ? 'border-brand-500 text-brand-600' : 'border-transparent text-neutral-500'}`}>Edit Profile</button>
          {activeCampaignId && (
            <button onClick={() => setActiveTab('applicants')} className={`pb-3 text-sm font-semibold border-b-2 transition-all ${activeTab === 'applicants' ? 'border-brand-500 text-brand-600' : 'border-transparent text-neutral-500'}`}>Review Applicants</button>
          )}
        </div>

        {activeTab === 'campaigns' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-base font-bold text-neutral-800">Campaign Overview</h3>
              <div className="space-y-4">
                {campaigns.length === 0 ? (
                  <div className="text-center py-12 text-sm text-neutral-400 bg-white border border-neutral-200 rounded-2xl">Create your first campaign to get started</div>
                ) : (
                  campaigns.map((c) => (
                    <div key={c._id} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm hover:border-neutral-300 transition-colors flex justify-between items-center gap-4">
                      <div>
                        <h4 className="font-bold text-neutral-800">{c.title}</h4>
                        <p className="text-xs text-neutral-400 mt-1">Category: {c.category} | Budget: ${c.budget.toLocaleString()}</p>
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase mt-2 ${
                          c.status === 'active' ? 'bg-green-50 text-green-600' :
                          c.status === 'pending_approval' ? 'bg-amber-50 text-amber-600' :
                          'bg-neutral-50 text-neutral-500'
                        }`}>{c.status.replace('_', ' ')}</span>
                      </div>
                      <button
                        onClick={() => handleViewApplicants(c._id)}
                        className="rounded-lg bg-neutral-100 px-3.5 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-200"
                      >
                        Applicants
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <h3 className="text-sm font-bold text-neutral-800 mb-4">Budget Distribution</h3>
                <div className="h-64">
                  {chartData.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-xs text-neutral-400">No campaigns created yet</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" fontSize={10} />
                        <YAxis fontSize={10} />
                        <Tooltip />
                        <Bar dataKey="budget" fill="#0e81ec" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'create-campaign' && (
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm max-w-2xl mx-auto">
            <h3 className="text-base font-bold text-neutral-800 mb-6">Launch New Campaign Proposal</h3>
            <form onSubmit={handleCreateCampaign} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Campaign Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-neutral-200 py-2.5 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50"
                  placeholder="Summer Product Review Blast"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Description & Guidelines</label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-neutral-200 py-2.5 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50"
                  rows={4}
                  placeholder="Outline content guidelines, format requirements, and brand values..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Target Audience</label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-neutral-200 py-2.5 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50"
                    placeholder="e.g. Gen Z, Fitness enthusiasts"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Location</label>
                  <input
                    type="text"
                    value={campaignLocation}
                    onChange={(e) => setCampaignLocation(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-neutral-200 py-2.5 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50"
                    placeholder="e.g. New York, Global"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Category</label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-neutral-200 py-2.5 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50"
                    placeholder="e.g. Beauty"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Budget ($)</label>
                  <input
                    type="number"
                    required
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-neutral-200 py-2.5 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50"
                    placeholder="2500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Min Followers</label>
                  <input
                    type="number"
                    value={requiredFollowers}
                    onChange={(e) => setRequiredFollowers(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-neutral-200 py-2.5 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50"
                    placeholder="5000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-neutral-200 py-2.5 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-neutral-200 py-2.5 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
              >
                Submit Campaign Proposal
              </button>
            </form>
          </div>
        )}

        {activeTab === 'edit-profile' && (
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm max-w-2xl mx-auto">
            <h3 className="text-base font-bold text-neutral-800 mb-6">Edit Brand Profile</h3>

            <div className="mb-6 pb-6 border-b border-neutral-100 flex items-center space-x-4">
              <label className="cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={handleUploadAvatar} />
                <div className="h-16 w-16 rounded-full bg-neutral-100 flex items-center justify-center overflow-hidden border border-neutral-200 hover:border-brand-500 transition-colors">
                  {user?.profileImage ? (
                    <img src={`http://localhost:5001${user.profileImage}`} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-neutral-400">+</span>
                  )}
                </div>
              </label>
              <div>
                <p className="text-sm font-semibold text-neutral-700">Company Logo</p>
                <p className="text-xs text-neutral-400">Click to upload a new logo</p>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Company Name</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-neutral-200 py-2.5 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Industry</label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-neutral-200 py-2.5 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50"
                    placeholder="e.g. Fashion, Tech"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Website</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-neutral-200 py-2.5 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50"
                  placeholder="https://company.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Bio / About</label>
                <textarea
                  value={brandBio}
                  onChange={(e) => setBrandBio(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-neutral-200 py-2.5 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50"
                  rows={3}
                  placeholder="Tell influencers about your brand..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Location</label>
                <input
                  type="text"
                  value={brandLocation}
                  onChange={(e) => setBrandLocation(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-neutral-200 py-2.5 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50"
                  placeholder="e.g. New York, US"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
              >
                Save Profile Updates
              </button>
            </form>
          </div>
        )}

        {activeTab === 'applicants' && (
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <h3 className="text-base font-bold text-neutral-800">Review Campaign Proposals</h3>
              <div className="flex items-center space-x-3 text-xs text-neutral-500 mt-1 sm:mt-0">
                <span>Total: <strong className="text-neutral-800">{selectedCampaignApps.length}</strong></span>
                <span>Shortlisted: <strong className="text-amber-600">{selectedCampaignApps.filter(a => a.status === 'shortlisted').length}</strong></span>
                <span>Approved: <strong className="text-green-600">{selectedCampaignApps.filter(a => a.status === 'approved').length}</strong></span>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex border-b border-neutral-200 mb-6 space-x-4">
              {['all', 'applied', 'shortlisted', 'approved', 'rejected'].map((f) => (
                <button
                  key={f}
                  onClick={() => setApplicantFilter(f)}
                  className={`pb-2 text-xs font-semibold border-b-2 transition-all capitalize ${
                    applicantFilter === f ? 'border-brand-500 text-brand-600' : 'border-transparent text-neutral-400 hover:text-neutral-600'
                  }`}
                >
                  {f}
                  {f !== 'all' && (
                    <span className="ml-1">({selectedCampaignApps.filter(a => a.status === f).length})</span>
                  )}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {filteredApps.length === 0 ? (
                <div className="text-center py-12 text-sm text-neutral-400">
                  {applicantFilter === 'all' ? 'No applications for this campaign yet' : `No ${applicantFilter} applications`}
                </div>
              ) : (
                filteredApps.map((app) => (
                  <div key={app._id} className="rounded-2xl border border-neutral-200 p-5 hover:border-neutral-300 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          {app.influencer?.profileImage ? (
                            <img src={`http://localhost:5001${app.influencer.profileImage}`} alt="" className="h-10 w-10 rounded-full object-cover border border-neutral-200" />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-brand-50 flex items-center justify-center font-bold text-brand-600">
                              {app.influencer?.name?.charAt(0)}
                            </div>
                          )}
                          <div>
                            <h4 className="font-bold text-neutral-800">{app.influencer?.name}</h4>
                            <p className="text-xs text-neutral-500">Proposed rate: <span className="font-semibold text-brand-600">${app.proposedRate}</span></p>
                          </div>
                        </div>

                        <div className="rounded-xl bg-neutral-50 p-3 border border-neutral-100 mb-3">
                          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Cover Message</span>
                          <p className="text-sm text-neutral-700 mt-1">{app.pitch}</p>
                        </div>

                        {/* Social Stats */}
                        {app.socialStats?.length > 0 && (
                          <div className="mb-3">
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Social Stats</span>
                            <div className="flex flex-wrap gap-2 mt-1.5">
                              {app.socialStats.map((s, i) => {
                                const Icon = platformIcons[s.platform] || Globe;
                                return (
                                  <div key={i} className="flex items-center space-x-1.5 rounded-lg bg-neutral-50 border border-neutral-100 px-2.5 py-1">
                                    <Icon size={13} className="text-neutral-500" />
                                    <span className="text-xs text-neutral-700">{s.followers?.toLocaleString()} followers</span>
                                    {s.engagementRate > 0 && (
                                      <span className="text-[10px] text-neutral-400">ER: {s.engagementRate}%</span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Portfolio */}
                        {app.portfolio?.length > 0 && (
                          <div>
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Portfolio ({app.portfolio.length} items)</span>
                            <div className="grid grid-cols-2 gap-2 mt-1.5">
                              {app.portfolio.map((item, i) => (
                                <div key={i} className="rounded-lg border border-neutral-200 p-2.5 bg-neutral-50/50">
                                  <p className="text-xs font-semibold text-neutral-800">{item.title || 'Untitled'}</p>
                                  {item.description && <p className="text-[10px] text-neutral-500 mt-0.5">{item.description}</p>}
                                  {item.fileUrl && (
                                    <a href={item.fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center space-x-0.5 text-[10px] text-brand-600 hover:underline mt-1">
                                      <ExternalLink size={10} />
                                      <span>View</span>
                                    </a>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {app.deliverablesUrl && (
                          <div className="mt-3">
                            <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs text-brand-600 font-semibold">Deliverables Submitted</span>
                            <a href={app.deliverablesUrl} target="_blank" rel="noreferrer" className="block text-xs font-semibold text-brand-600 hover:underline mt-1">View Post Url</a>
                          </div>
                        )}
                      </div>
                      <div className="flex md:flex-col items-center md:items-end space-x-2 md:space-x-0 md:space-y-2 shrink-0">
                        {app.status === 'applied' && (
                          <>
                            <button
                              onClick={() => handleUpdateAppStatus(app._id, 'shortlisted')}
                              className="rounded-lg bg-amber-50 text-amber-600 px-3 py-1.5 text-xs font-semibold hover:bg-amber-100 w-full"
                            >
                              Shortlist
                            </button>
                            <button
                              onClick={() => handleUpdateAppStatus(app._id, 'approved')}
                              className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 w-full"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleUpdateAppStatus(app._id, 'rejected')}
                              className="rounded-lg bg-red-50 text-red-600 px-3 py-1.5 text-xs font-semibold hover:bg-red-100 w-full"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {app.status === 'shortlisted' && (
                          <>
                            <button
                              onClick={() => handleUpdateAppStatus(app._id, 'approved')}
                              className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 w-full"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleUpdateAppStatus(app._id, 'rejected')}
                              className="rounded-lg bg-red-50 text-red-600 px-3 py-1.5 text-xs font-semibold hover:bg-red-100 w-full"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <span className={`text-xs font-semibold capitalize px-2 py-0.5 rounded-full ${
                          app.status === 'approved' ? 'bg-green-50 text-green-600' :
                          app.status === 'rejected' ? 'bg-red-50 text-red-600' :
                          app.status === 'shortlisted' ? 'bg-amber-50 text-amber-600' :
                          'bg-neutral-100 text-neutral-500'
                        }`}>{app.status}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BrandDashboard;
