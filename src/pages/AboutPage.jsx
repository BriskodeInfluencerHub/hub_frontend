import React from 'react';
import Navbar from '../components/Navbar';
import { Target, ShieldCheck } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 mx-auto max-w-4xl w-full px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-utility text-xs text-brand-500 uppercase tracking-wider font-bold">Our Mission</span>
          <h1 className="text-4xl font-extrabold tracking-tight font-display text-neutral-900 mt-2 sm:text-5xl">
            Slaying payment delays & follower inflation.
          </h1>
          <p className="mt-4 text-sm text-neutral-500 leading-relaxed">
            BRISKODE was born out of a simple observation: brands struggle to find creators who drive actual conversions, and creators struggle to get paid on time. We built a unified platform to fix both.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-all">
            <ShieldCheck className="text-brand-500 h-8 w-8 mb-4" />
            <h3 className="text-lg font-bold font-display text-neutral-850">Escrow Security First</h3>
            <p className="mt-2 text-xs text-neutral-550 leading-relaxed font-sans">
              No more chasing invoices for 90 days. We hold campaign budgets securely before work starts, releasing payments automatically the moment post links are verified.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-all">
            <Target className="text-brand-500 h-8 w-8 mb-4" />
            <h3 className="text-lg font-bold font-display text-neutral-850">Metrics over Hype</h3>
            <p className="mt-2 text-xs text-neutral-550 leading-relaxed font-sans">
              Followers can be bought; engagement can be faked. Our discovery filters calculate real conversion performance metrics directly from API feeds.
            </p>
          </div>
        </div>

        <div className="mt-16 rounded-2xl bg-gradient-to-r from-brand-50 to-indigo-50 border border-brand-100 p-8 text-center">
          <p className="font-display font-semibold text-lg text-brand-900 leading-relaxed">
            "We aren't building a B2B middleware platform. We are building the commercial framework that supports creator culture."
          </p>
          <p className="text-xs text-brand-600 mt-4 uppercase font-bold tracking-wider font-display">— BRISKODE Collective</p>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;
