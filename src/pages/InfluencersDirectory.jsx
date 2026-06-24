import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Search, MapPin, User as UserIcon } from 'lucide-react';

const categoryOptions = [
  'Tech', 'Fashion', 'Travel', 'Food', 'Fitness', 'Design',
  'Music', 'Gaming', 'Lifestyle', 'Beauty', 'Finance', 'Education'
];

const InfluencersDirectory = () => {
  const [creators, setCreators] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (category) params.category = category;
    if (search) params.search = search;
    api.get('/users/influencers', { params }).then((res) => {
      setCreators(res.data);
    }).catch(console.warn).finally(() => setLoading(false));
  }, [category]);

  const filtered = creators.filter(c => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalFollowers = (accounts) => {
    return accounts?.reduce((sum, a) => sum + (a.followers || 0), 0) || 0;
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
        <div className="mb-10">
          <span className="font-utility text-xs text-brand-500 uppercase tracking-wider font-bold">Public Roster</span>
          <h1 className="text-3xl font-bold font-display text-neutral-900 mt-2">Verified Platform Creators</h1>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-neutral-50/50 p-5 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search creators by name..."
              className="w-full rounded-full border border-neutral-200 py-2.5 pl-10 pr-4 text-sm focus:border-brand-500 focus:outline-none bg-white"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border border-neutral-200 py-2 px-3 text-xs bg-white focus:outline-none"
            >
              <option value="">All Niches</option>
              {categoryOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12 text-sm text-neutral-400">Loading creators...</div>
          ) : filtered.length === 0 ? (
            <div className="col-span-full text-center py-12 text-sm text-neutral-400">No verified creators found.</div>
          ) : (
            filtered.map((c) => (
              <div key={c._id} className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm hover:shadow-md hover:border-neutral-350 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      {c.profileImage ? (
                        <img src={`http://localhost:5001${c.profileImage}`} alt="" className="h-10 w-10 rounded-full object-cover border border-neutral-100" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-brand-50 flex items-center justify-center font-bold font-display border border-neutral-100 text-sm text-brand-600">
                          {c.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h3 className="font-display font-bold text-sm text-neutral-900">{c.name}</h3>
                        <span className="text-xs text-neutral-450 font-medium">{c.handle}</span>
                      </div>
                    </div>
                    {c.categories?.[0] && (
                      <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[10px] font-semibold text-neutral-600">{c.categories[0]}</span>
                    )}
                  </div>

                  <div className="space-y-2.5 text-xs border-t border-neutral-100 pt-4">
                    <div className="flex items-center text-neutral-500">
                      <MapPin size={14} className="mr-1.5" />
                      <span>{c.location || 'Location not set'}</span>
                    </div>
                    <div className="flex justify-between text-neutral-600 font-medium">
                      <span>Est. Reach:</span>
                      <span className="font-bold text-neutral-800">{totalFollowers(c.socialAccounts).toLocaleString()} fans</span>
                    </div>
                    <div className="flex justify-between text-neutral-600 font-medium">
                      <span>Profile:</span>
                      <span className="font-bold text-brand-500">{c.profileCompletion}% complete</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 flex justify-end">
                  <Link
                    to="/register"
                    className="rounded-full bg-neutral-900 text-white px-4 py-2 text-xs font-semibold hover:bg-brand-500 transition-all"
                  >
                    Contact Creator
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default InfluencersDirectory;
