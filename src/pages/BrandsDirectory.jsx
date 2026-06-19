import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { Search, Calendar, DollarSign } from 'lucide-react';

const BrandsDirectory = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/campaigns?status=active').then((res) => {
      setCampaigns(res.data);
    }).catch(console.warn);
  }, []);

  const filtered = campaigns.filter(c => {
    if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
        <div className="mb-10">
          <span className="font-utility text-xs text-brand-500 uppercase tracking-wider font-bold">Campaign Roster</span>
          <h1 className="text-3xl font-bold font-display text-neutral-900 mt-2">Active Brand Briefs</h1>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-neutral-50/50 p-5 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-neutral-450" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search active campaigns by title..."
              className="w-full rounded-full border border-neutral-200 py-2.5 pl-10 pr-4 text-sm focus:border-brand-500 focus:outline-none bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-12 text-sm text-neutral-400">No active brand campaigns found</div>
          ) : (
            filtered.map((c) => (
              <div key={c._id} className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm hover:shadow-md hover:border-neutral-350 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-display font-bold text-sm text-neutral-900">{c.title}</h3>
                    <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[10px] font-semibold text-neutral-600">{c.category}</span>
                  </div>
                  <p className="text-xs text-neutral-500 line-clamp-3 leading-relaxed mt-2">{c.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-450 flex items-center"><Calendar size={14} className="mr-1" /> End date:</span>
                    <span className="font-semibold text-neutral-700">{new Date(c.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-450 flex items-center font-bold uppercase"><DollarSign size={14} /> Payout:</span>
                    <span className="font-display font-bold text-sm text-brand-500">${c.budget.toLocaleString()}</span>
                  </div>
                  <div className="pt-2 flex justify-end">
                    <Link
                      to={`/campaign/${c._id}`}
                      className="rounded-full bg-neutral-900 text-white px-4 py-2 text-xs font-semibold hover:bg-brand-500 transition-all"
                    >
                      Apply to Brief
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default BrandsDirectory;
