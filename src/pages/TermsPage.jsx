import React from 'react';
import Navbar from '../components/Navbar';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-raw-cotton text-deep-ink flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto max-w-2xl w-full px-4 sm:px-6 lg:px-8 py-16 animate-fade-in space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold font-display text-neutral-900">Terms & Conditions</h1>
          <p className="text-xs text-neutral-400 mt-1 font-utility">Last Updated: June 19, 2026</p>
        </div>

        <section className="space-y-4 text-sm font-sans text-neutral-600 leading-relaxed">
          <h3 className="text-base font-bold text-neutral-800 font-display">1. Escrow Payout Holds</h3>
          <p>
            Odisha Influencer Market provides a secure platform wallet mechanism. When a Brand hires a Creator, the campaign budget is immediately drawn from the Brand account and held in escrow. Payouts are released once post links are submitted and verified.
          </p>

          <h3 className="text-base font-bold text-neutral-800 font-display">2. Creator Deliverables</h3>
          <p>
            Creators must upload correct and live URLs matching the campaign brief guidelines. Failure to post verified links within agreed deadlines may trigger escrow refunds to the Brand.
          </p>
        </section>
      </main>
    </div>
  );
};

export default TermsPage;
