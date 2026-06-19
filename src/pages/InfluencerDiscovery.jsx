import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Search, MessageSquare, Sparkles } from 'lucide-react';

const InfluencerDiscovery = () => {
  const navigate = useNavigate();
  const [influencers, setInfluencers] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [platform, setPlatform] = useState('');

  const loadInfluencers = async () => {
    try {
      const res = await api.get('/admin/users');
      const creatorsOnly = res.data.filter(u => u.role === 'influencer');
      setInfluencers(creatorsOnly);
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    loadInfluencers();
  }, []);

  const handleStartChat = async (creatorId) => {
    try {
      const res = await api.post('/chats', { participantId: creatorId });
      navigate('/chat', { state: { activeChatId: res.data._id } });
    } catch (err) {
      alert('Failed to initialize conversation');
    }
  };

  const filteredInfluencers = influencers.filter((c) => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <h2 className="text-xl font-bold text-neutral-800 mb-6 flex items-center space-x-2">
          <Sparkles className="text-brand-500" />
          <span>Discover Content Creator Talent</span>
        </h2>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search creators by name..."
              className="w-full rounded-xl border border-neutral-200 py-2.5 pl-10 pr-4 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50"
            />
          </div>

          <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border border-neutral-200 py-2 px-3 text-xs bg-white focus:outline-none"
            >
              <option value="">All Categories</option>
              <option value="tech">Tech</option>
              <option value="beauty">Beauty</option>
              <option value="lifestyle">Lifestyle</option>
            </select>

            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="rounded-xl border border-neutral-200 py-2 px-3 text-xs bg-white focus:outline-none"
            >
              <option value="">All Platforms</option>
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
            </select>

            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              className="rounded-xl border border-neutral-200 py-2 px-3 text-xs focus:border-brand-500 bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInfluencers.length === 0 ? (
            <div className="col-span-full text-center py-12 text-sm text-neutral-400">No influencers match your search filters</div>
          ) : (
            filteredInfluencers.map((c) => (
              <div key={c._id} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm hover:border-neutral-300 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-4 mb-4">
                    {c.profileImage ? (
                      <img src={`http://localhost:5001${c.profileImage}`} alt="" className="h-12 w-12 rounded-full object-cover" />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-brand-100 flex items-center justify-center font-bold text-brand-600">
                        {c.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-neutral-800">{c.name}</h4>
                      <p className="text-xs text-neutral-400">Verified Platform Creator</p>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500 mt-2 line-clamp-3">
                    Professional content creator focused on delivering high engagement rates and bespoke product reviews.
                  </p>
                </div>

                <div className="mt-6 border-t border-neutral-100 pt-4 flex justify-between items-center">
                  <span className="text-xs font-semibold rounded-full bg-brand-50 text-brand-600 px-2.5 py-0.5">MERN Creator</span>
                  <button
                    onClick={() => handleStartChat(c._id)}
                    className="rounded-lg bg-brand-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-brand-700 transition-colors flex items-center space-x-1.5"
                  >
                    <MessageSquare size={14} />
                    <span>Chat Now</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default InfluencerDiscovery;
