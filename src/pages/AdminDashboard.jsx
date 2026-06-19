import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { UserCheck, ShieldAlert, CheckCircle, XCircle, Database, LayoutGrid } from 'lucide-react';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({});
  const [users, setUsers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [activeTab, setActiveTab] = useState('users');

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

  const handleUpdateUser = async (userId, isVerified, status) => {
    try {
      await api.patch(`/admin/users/${userId}/status`, { isVerified, status });
      alert('User status updated successfully');
      loadAdminData();
    } catch (err) {
      alert('Failed to update user status');
    }
  };

  const handleApproveCampaign = async (campaignId, approve) => {
    try {
      await api.patch(`/admin/campaigns/${campaignId}/approve`, { approve });
      alert(approve ? 'Campaign approved!' : 'Campaign rejected');
      loadAdminData();
    } catch (err) {
      alert('Action failed');
    }
  };

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
          <button onClick={() => setActiveTab('users')} className={`pb-3 text-sm font-semibold border-b-2 transition-all ${activeTab === 'users' ? 'border-brand-500 text-brand-600' : 'border-transparent text-neutral-500'}`}>Users Management</button>
          <button onClick={() => setActiveTab('approvals')} className={`pb-3 text-sm font-semibold border-b-2 transition-all ${activeTab === 'approvals' ? 'border-brand-500 text-brand-600' : 'border-transparent text-neutral-500'}`}>Campaign Approvals ({campaigns.length})</button>
          <button onClick={() => setActiveTab('analytics')} className={`pb-3 text-sm font-semibold border-b-2 transition-all ${activeTab === 'analytics' ? 'border-brand-500 text-brand-600' : 'border-transparent text-neutral-500'}`}>User Signups Analytics</button>
        </div>

        {activeTab === 'users' && (
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200 text-sm text-left">
              <thead>
                <tr className="text-xs font-semibold text-neutral-400 uppercase tracking-wider bg-neutral-50">
                  <th className="px-6 py-3">User Details</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">KYC Status</th>
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
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${u.isVerified ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                        {u.isVerified ? 'Verified' : 'Unverified'}
                      </span>
                    </td>
                    <td className="px-6 py-4 capitalize">{u.status}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {!u.isVerified && (
                        <button
                          onClick={() => handleUpdateUser(u._id, true, 'active')}
                          className="rounded-lg bg-green-50 text-green-600 px-2.5 py-1 text-xs font-semibold hover:bg-green-100"
                        >
                          Verify User
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
                        onClick={() => handleApproveCampaign(c._id, true)}
                        className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 flex items-center space-x-1"
                      >
                        <CheckCircle size={14} />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleApproveCampaign(c._id, false)}
                        className="rounded-lg bg-red-50 text-red-600 px-3 py-1.5 text-xs font-semibold hover:bg-red-100 flex items-center space-x-1"
                      >
                        <XCircle size={14} />
                        <span>Reject</span>
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
    </div>
  );
};

export default AdminDashboard;
