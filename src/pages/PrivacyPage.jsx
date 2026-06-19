import React from 'react';
import Navbar from '../components/Navbar';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-raw-cotton text-deep-ink flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto max-w-2xl w-full px-4 sm:px-6 lg:px-8 py-16 animate-fade-in space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold font-display text-neutral-900">Privacy Policy</h1>
          <p className="text-xs text-neutral-400 mt-1 font-utility">Last Updated: June 19, 2026</p>
        </div>

        <section className="space-y-4 text-sm font-sans text-neutral-600 leading-relaxed">
          <h3 className="text-base font-bold text-neutral-800 font-display">1. Information Collection</h3>
          <p>
            We collect profile information including name, email, contact telephone numbers, and social network statistics (follower counts and engagement rates) directly linked via our discovery forms.
          </p>

          <h3 className="text-base font-bold text-neutral-800 font-display">2. Ledger Security</h3>
          <p>
            Financial records, withdrawal targets, and escrow transaction parameters are stored securely inside our MERN databases and are never shared with external advertising companies.
          </p>
        </section>
      </main>
    </div>
  );
};

export default PrivacyPage;
