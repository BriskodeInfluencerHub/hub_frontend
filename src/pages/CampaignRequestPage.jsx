import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { ClipboardList, Send, CheckCircle, MapPin, Calendar, Building, Mail, Phone } from 'lucide-react';

const LOCATIONS = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'All India', 'Global'];
const CATEGORIES = ['Fashion', 'Tech', 'Food', 'Travel', 'Fitness', 'Beauty', 'Music', 'Gaming', 'Education', 'Lifestyle', 'Finance', 'Health', 'Sports', 'Photography', 'Comedy'];

const CampaignRequestPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !title || !description) return;
    setSubmitting(true);
    try {
      await api.post('/campaign-requests/public', {
        name, email, phone, companyName,
        title, description, requirements, location,
        budget: Number(budget) || 0, timeline,
        categories: selectedCategories,
      });
      setSubmitted(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        <Navbar />
        <main className="flex-1 mx-auto max-w-2xl w-full px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
          <div className="rounded-2xl border border-neutral-200 bg-white p-10 shadow-sm text-center">
            <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
            <h2 className="text-xl font-bold text-neutral-800 mb-2">Request Submitted!</h2>
            <p className="text-sm text-neutral-500 mb-6">Thank you, {name}. Our team will review your campaign request and get back to you at <strong>{email}</strong> within 2-3 business days.</p>
            <button onClick={() => { setSubmitted(false); setName(''); setEmail(''); setPhone(''); setCompanyName(''); setTitle(''); setDescription(''); setRequirements(''); setLocation(''); setBudget(''); setTimeline(''); setSelectedCategories([]); }} className="rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">Submit Another Request</button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto max-w-3xl w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <div className="text-center mb-8">
          <ClipboardList className="mx-auto text-brand-500" size={36} />
          <h2 className="text-2xl font-bold text-neutral-800 mt-3">Start Your Campaign</h2>
          <p className="text-sm text-neutral-400 mt-1 max-w-lg mx-auto">Tell us about your campaign needs. Our team will review and get back to you within 2-3 business days.</p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-neutral-700 mb-4 flex items-center space-x-2">
                <Building size={16} className="text-brand-500" />
                <span>Your Contact Information</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Full Name <span className="text-red-400">*</span></label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full rounded-xl border border-neutral-200 py-2.5 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Email <span className="text-red-400">*</span></label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full rounded-xl border border-neutral-200 py-2.5 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Phone</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 block w-full rounded-xl border border-neutral-200 py-2.5 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50" placeholder="+1 234 567 890" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Company / Brand Name</label>
                  <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="mt-1 block w-full rounded-xl border border-neutral-200 py-2.5 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50" placeholder="Acme Inc." />
                </div>
              </div>
            </div>

            <hr className="border-neutral-100" />

            <div>
              <h3 className="text-sm font-bold text-neutral-700 mb-4">Campaign Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Campaign Title <span className="text-red-400">*</span></label>
                  <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full rounded-xl border border-neutral-200 py-2.5 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50" placeholder="e.g. Summer Product Launch" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Description & Goals <span className="text-red-400">*</span></label>
                  <textarea required value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full rounded-xl border border-neutral-200 py-2.5 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50" rows={3} placeholder="What are you looking for? What are your campaign goals?" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Specific Requirements</label>
                  <textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} className="mt-1 block w-full rounded-xl border border-neutral-200 py-2.5 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50" rows={2} placeholder="Number of influencers, content format, posting schedule, etc." />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Target Location</label>
                    <select value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1 block w-full rounded-xl border border-neutral-200 py-2.5 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50">
                      <option value="">Select location</option>
                      {LOCATIONS.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Budget ($)</label>
                    <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} className="mt-1 block w-full rounded-xl border border-neutral-200 py-2.5 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50" placeholder="e.g. 5000" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Timeline</label>
                  <input type="text" value={timeline} onChange={(e) => setTimeline(e.target.value)} className="mt-1 block w-full rounded-xl border border-neutral-200 py-2.5 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50" placeholder="e.g. 2 weeks, Starting next month" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Categories</label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button key={cat} type="button" onClick={() => toggleCategory(cat)} className={`rounded-full px-3 py-1 text-xs font-semibold border transition-all ${selectedCategories.includes(cat) ? 'bg-brand-600 text-white border-brand-600' : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-neutral-300'}`}>{cat}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" disabled={submitting} className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white hover:bg-brand-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2">
              <Send size={16} />
              <span>{submitting ? 'Submitting...' : 'Submit Campaign Request'}</span>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CampaignRequestPage;
