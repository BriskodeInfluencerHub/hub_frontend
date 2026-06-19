import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Send } from 'lucide-react';

const CampaignDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  
  const [pitch, setPitch] = useState('');
  const [proposedRate, setProposedRate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await api.get(`/campaigns/${id}`);
        setCampaign(res.data);
      } catch (err) {
        console.warn('Failed to load campaign detail', err);
      }
    };
    fetchCampaign();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/applications/campaign/${id}/apply`, {
        pitch,
        proposedRate: Number(proposedRate),
      });
      setAppliedSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit application');
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

      <main className="flex-1 mx-auto max-w-4xl w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <Link to="/" className="inline-flex items-center text-sm font-semibold text-neutral-500 hover:text-brand-500 mb-6">
          <ArrowLeft size={16} className="mr-1.5" />
          <span>Back to Home</span>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-neutral-800">{campaign.title}</h2>
              <div className="flex flex-wrap gap-2.5 mt-3.5">
                <span className="rounded-full bg-brand-50 text-brand-600 px-3 py-0.5 text-xs font-semibold">{campaign.category}</span>
                <span className="rounded-full bg-neutral-100 text-neutral-600 px-3 py-0.5 text-xs font-semibold">Min Fans: {campaign.requiredFollowers.toLocaleString()}</span>
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
            </div>
          </div>

          <div className="space-y-6">
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
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Your Pitch</label>
                    <textarea
                      required
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default CampaignDetails;
