import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';

const InfluencersDirectory = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const creators = [
    { name: 'Sarah Vance', handle: '@sarah_v', location: 'London, UK', category: 'Design', fans: '142K', engagement: '5.6%', color: 'bg-blue-50 text-blue-600' },
    { name: 'Leo Dubois', handle: '@tech_leo', location: 'Paris, FR', category: 'Tech', fans: '52K', engagement: '7.2%', color: 'bg-indigo-50 text-indigo-600' },
    { name: 'Aria Cross', handle: '@aria_travels', location: 'New York, US', category: 'Travel', fans: '210K', engagement: '4.8%', color: 'bg-violet-50 text-violet-600' },
  ];

  const filtered = creators.filter(c => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (category && c.category !== category) return false;
    return true;
  });

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
              <option value="Design">Design</option>
              <option value="Tech">Tech</option>
              <option value="Travel">Travel</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c, idx) => (
            <div key={idx} className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm hover:shadow-md hover:border-neutral-350 transition-all flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`h-10 w-10 rounded-full ${c.color} flex items-center justify-center font-bold font-display border border-neutral-100 text-sm`}>
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-sm text-neutral-900">{c.name}</h3>
                      <span className="text-xs text-neutral-450 font-medium">{c.handle}</span>
                    </div>
                  </div>
                  <span className="rounded-full bg-neutral-105 px-2.5 py-0.5 text-[10px] font-semibold text-neutral-600">{c.category}</span>
                </div>

                <div className="space-y-2.5 text-xs border-t border-neutral-100 pt-4">
                  <div className="flex items-center text-neutral-500">
                    <MapPin size={14} className="mr-1.5" />
                    <span>{c.location}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600 font-medium">
                    <span>Est. Reach:</span>
                    <span className="font-bold text-neutral-800">{c.fans}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600 font-medium">
                    <span>Engagement:</span>
                    <span className="font-bold text-brand-500">{c.engagement}</span>
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
          ))}
        </div>
      </main>
    </div>
  );
};

export default InfluencersDirectory;
