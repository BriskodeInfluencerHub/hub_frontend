import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Send, MapPin, Mail } from 'lucide-react';

const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setSubmitted(false);
      alert('Support ticket logged successfully! Our team will reach out within 2 hours.');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 mx-auto max-w-4xl w-full px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
        <div className="grid md:grid-cols-12 gap-12">
          
          <div className="md:col-span-5 space-y-6">
            <span className="font-utility text-xs text-brand-500 uppercase tracking-wider font-bold">Get in Touch</span>
            <h1 className="text-3xl font-extrabold font-display leading-[1.2]">
              Let's build something creative.
            </h1>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Have questions about escrow wallets, custom enterprise integration, or API metrics connections? Get in touch with our team directly.
            </p>

            <div className="space-y-4 pt-4 text-xs font-semibold text-neutral-600">
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-brand-500" />
                <span>partners@odishainfluencermarket.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin size={16} className="text-brand-500" />
                <span>London Creative Hub, E1 6PX</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-7">
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-neutral-200 py-2.5 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50"
                    placeholder="Jane Doe"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-neutral-200 py-2.5 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50"
                    placeholder="name@company.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Message</label>
                  <textarea
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-neutral-200 py-2.5 px-3 text-sm focus:border-brand-500 focus:outline-none bg-neutral-50/50"
                    rows={4}
                    placeholder="Briefly describe your request..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitted}
                  className="w-full flex items-center justify-center rounded-full bg-gradient-to-r from-brand-500 to-indigo-500 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-colors disabled:opacity-50"
                >
                  {submitted ? 'Sending...' : 'Send Message'} <Send size={14} className="ml-1.5" />
                </button>
              </form>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ContactPage;
