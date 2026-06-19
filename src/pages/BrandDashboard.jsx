import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, Check, X, ShieldAlert, Sparkles, ClipboardList, Wallet, UserCheck, Calendar } from 'lucide-react';

const BrandDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaignApps, setSelectedCampaignApps] = useState([]);
  const [activeTab, setActiveTab] = useState('campaigns');
  const [activeCampaignId, setActiveCampaignId] = useState(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [budget, setBudget] = useState('');
  const [requiredFollowers, setRequiredFollowers] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [kycDocUrl, setKycDocUrl] = useState('');
  const [payments, setPayments] = useState([]);

  const loadBrandData = async () => {
    try {
      const profileRes = await api.get('/users/profile');
      setProfile(profileRes.data.profile);

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

  const chartData = campaigns.map(c => ({
    name: c.title.substring(0, 12) + '...',
    budget: c.budget,
  }));

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold text-neutral-800">Brand Portal: {profile?.companyName}</h2>
            <div className="flex items-center space-x-2 text-xs text-neutral-500 mt-1">
              <Calendar size={14} />
              <span>KYC Status: </span>
              <span className={`font-semibold capitalize ${profile?.kycStatus === 'verified' ? 'text-green-600' : 'text-amber-600'}`}>{profile?.kycStatus}</span>
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

        {activeTab === 'applicants' && (
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-neutral-800 mb-6">Review Campaign Proposals</h3>
            <div className="space-y-4">
              {selectedCampaignApps.length === 0 ? (
                <div className="text-center py-12 text-sm text-neutral-400">No active applications for this campaign yet</div>
              ) : (
                selectedCampaignApps.map((app) => (
                  <div key={app._id} className="rounded-2xl border border-neutral-200 p-5 hover:border-neutral-300 transition-colors flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-neutral-800">{app.influencer?.name}</h4>
                      <p className="text-xs text-neutral-500 mt-1">Proposed rate: ${app.proposedRate} | Pitch: "{app.pitch}"</p>
                      {app.deliverablesUrl && (
                        <div className="mt-3">
                          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs text-brand-600 font-semibold">Deliverables Submitted</span>
                          <a href={app.deliverablesUrl} target="_blank" rel="noreferrer" className="block text-xs font-semibold text-brand-600 hover:underline mt-1">View Post Url</a>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {app.status === 'applied' && (
                        <>
                          <button
                            onClick={() => handleUpdateAppStatus(app._id, 'approved')}
                            className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdateAppStatus(app._id, 'rejected')}
                            className="rounded-lg bg-red-50 text-red-600 px-3 py-1.5 text-xs font-semibold hover:bg-red-100"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <span className="text-xs font-semibold capitalize text-neutral-400">{app.status}</span>
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
