import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Send, CheckCircle, Globe, Instagram, Youtube, Music, Twitter } from 'lucide-react';

const platformIcons = { instagram: Instagram, youtube: Youtube, twitter: Twitter, tiktok: Music };

const CampaignDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [profile, setProfile] = useState(null);

  const [pitch, setPitch] = useState('');
  const [proposedRate, setProposedRate] = useState('');
  const [selectedPortfolio, setSelectedPortfolio] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [campaignRes, profileRes] = await Promise.all([
          api.get(`/campaigns/${id}`),
          api.get('/users/profile').catch(() => null),
        ]);
        setCampaign(campaignRes.data);
        setProfile(profileRes?.data?.profile || null);
      } catch (err) {
        console.warn('Failed to load data', err);
      }
    };
    fetchData();
  }, [id]);

  const togglePortfolio = (item) => {
    setSelectedPortfolio((prev) =>
      prev.some((p) => p.title === item.title && p.fileUrl === item.fileUrl)
        ? prev.filter((p) => !(p.title === item.title && p.fileUrl === item.fileUrl))
        : [...prev, item]
    );
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/applications/campaign/${id}/apply`, {
        pitch,
        proposedRate: Number(proposedRate),
        portfolio: selectedPortfolio,
        socialStats: profile?.socialAccounts || [],
      });
      setAppliedSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        alert(data.errors.map(e => e.message).join('\n'));
      } else {
        alert(data?.message || 'Failed to submit application');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!campaign) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto max-w-5xl w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <Link to="/brands" className="inline-flex items-center text-sm font-semibold text-neutral-500 hover:text-brand-500 mb-6">
          <ArrowLeft size={16} className="mr-1.5" />
          <span>Back to Brand Briefs</span>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-3 space-y-6">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-neutral-800">{campaign.title}</h2>
              <div className="flex flex-wrap gap-2.5 mt-3.5">
                <span className="rounded-full bg-brand-50 text-brand-600 px-3 py-0.5 text-xs font-semibold">{campaign.category}</span>
                {campaign.requiredFollowers > 0 && (
                  <span className="rounded-full bg-neutral-100 text-neutral-600 px-3 py-0.5 text-xs font-semibold">Min Fans: {campaign.requiredFollowers.toLocaleString()}</span>
                )}
              </div>
              <p className="text-sm text-neutral-650 mt-6 leading-relaxed whitespace-pre-line">{campaign.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-neutral-200 bg-white p-4">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Target Audience</span>
                <p className="text-sm font-semibold text-neutral-700 mt-1">{campaign.targetAudience || 'Any'}</p>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-white p-4">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Campaign Budget</span>
                <p className="text-sm font-bold text-brand-600 mt-1">${campaign.budget.toLocaleString()}</p>
              </div>
              {campaign.location && (
                <div className="rounded-xl border border-neutral-200 bg-white p-4">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Location</span>
                  <p className="text-sm font-semibold text-neutral-700 mt-1">{campaign.location}</p>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-neutral-800 mb-4 flex items-center space-x-1.5">
                <Sparkles size={18} className="text-brand-500" />
                <span>Submit Proposal</span>
              </h3>

              {appliedSuccess ? (
                <div className="rounded-lg bg-green-50 p-4 text-xs font-semibold text-green-600 border border-green-200 text-center">
                  Proposal submitted! Redirecting...
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Cover Message <span className="text-neutral-400 font-normal normal-case">(min 10 characters)</span></label>
                    <textarea
                      required
                      minLength={10}
                      value={pitch}
                      onChange={(e) => setPitch(e.target.value)}
                      className="mt-1 block w-full rounded-xl border border-neutral-200 py-2 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50"
                      rows={4}
                      placeholder="Why are you a great fit for this project?"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Proposed Rate ($)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={proposedRate}
                      onChange={(e) => setProposedRate(e.target.value)}
                      className="mt-1 block w-full rounded-xl border border-neutral-200 py-2.5 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50"
                      placeholder="e.g. 350"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Send Application'} <Send size={14} className="ml-1.5" />
                  </button>
                </form>
              )}
            </div>

            {/* Portfolio Selection */}
            {profile?.portfolio?.length > 0 && (
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <h3 className="text-base font-bold text-neutral-800 mb-3">Your Portfolio</h3>
                <p className="text-xs text-neutral-400 mb-3">Select portfolio items to include with your application</p>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {profile.portfolio.map((item, i) => {
                    const isSelected = selectedPortfolio.some(
                      (p) => p.title === item.title && p.fileUrl === item.fileUrl
                    );
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => togglePortfolio(item)}
                        className={`w-full text-left rounded-xl border p-3 transition-colors ${
                          isSelected
                            ? 'border-brand-500 bg-brand-50'
                            : 'border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-semibold text-neutral-800">{item.title || 'Untitled'}</p>
                            {item.description && (
                              <p className="text-xs text-neutral-500 mt-0.5">{item.description}</p>
                            )}
                          </div>
                          {isSelected && <CheckCircle size={18} className="text-brand-500 shrink-0" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Social Stats */}
            {profile?.socialAccounts?.length > 0 && (
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <h3 className="text-base font-bold text-neutral-800 mb-3">Your Social Stats</h3>
                <p className="text-xs text-neutral-400 mb-3">These will be included with your application</p>
                <div className="space-y-2">
                  {profile.socialAccounts.map((acc, i) => {
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
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CampaignDetails;
