import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Check, Star, ArrowRight, Shield, Award, Zap, Users, BarChart3 } from 'lucide-react';

const LandingPage = () => {
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  const stats = [
    { label: 'Total Creators', value: '10K+', desc: 'Active niche influencers' },
    { label: 'Active Brands', value: '500+', desc: 'Leading global agencies' },
    { label: 'Campaign Volume', value: '$12M+', desc: 'Funds safely processed in escrow' },
    { label: 'Audience Reach', value: '150M+', desc: 'Combined social impressions' },
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: billingPeriod === 'monthly' ? '$49' : '$39',
      period: '/mo',
      desc: 'Perfect for growing brands looking to launch their first campaign.',
      features: [
        'Up to 3 active campaigns',
        'Direct chat with influencers',
        'Standard filter discovery',
        'Basic campaign reporting',
        '5% platform transaction fee',
      ],
      cta: 'Start Free Trial',
      popular: false,
    },
    {
      name: 'Professional',
      price: billingPeriod === 'monthly' ? '$149' : '$119',
      period: '/mo',
      desc: 'For brands scaling up creator matching and campaign reach.',
      features: [
        'Unlimited active campaigns',
        'Advanced discovery filters',
        'AI influencer recommendation access',
        'Escrow payment automation',
        'Priority support',
        '2.5% platform transaction fee',
      ],
      cta: 'Get Started',
      popular: true,
    },
    {
      name: 'Agency Enterprise',
      price: billingPeriod === 'monthly' ? '$399' : '$319',
      period: '/mo',
      desc: 'Tailored for multi-client representation agencies and large firms.',
      features: [
        'Multi-user team dashboards',
        'Dedicated account manager',
        'Unified billing & custom invoicing',
        'Custom contracts integration',
        'API analytics export options',
        '1.5% platform transaction fee',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  const faqs = [
    { q: 'How does the escrow payment system work?', a: 'When a brand approves an influencer application, the campaign budget is held securely in our system. Once the creator submits their deliverables and the brand reviews the work, the funds are released directly to the creator\'s wallet.' },
    { q: 'Can agencies manage multiple influencers?', a: 'Yes! Agency accounts can onboard and represent multiple influencers under a single unified dashboard, manage their active applications, and track collective payout revenues.' },
    { q: 'Are there long-term contracts?', a: 'No, all plans are month-to-month and you can upgrade, downgrade, or cancel your subscription at any time without extra fees.' },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <Navbar />

      <section className="relative overflow-hidden bg-white py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:mx-auto md:max-w-2xl lg:col-span-6 lg:text-left">
              <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600 ring-1 ring-inset ring-brand-500/10">
                New: AI-Driven Creator Matching
              </span>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
                Scale Your Brand via{' '}
                <span className="bg-gradient-to-r from-brand-600 to-brand-500 bg-clip-text text-transparent">
                  Influencer Marketing
                </span>
              </h1>
              <p className="mt-4 text-base text-neutral-500 sm:mt-5 sm:text-xl lg:text-lg">
                BRISKODE Influencer Hub connects top-tier content creators, agencies, and brands. Launch verified escrow campaigns, coordinate deliverables, and measure real-time ROI.
              </p>
              <div className="mt-8 sm:mx-auto sm:max-w-lg lg:mx-0">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/register"
                    className="flex items-center justify-center rounded-xl bg-brand-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-brand-700 transition-all hover:scale-[1.02]"
                  >
                    Get Started Free <ArrowRight size={16} className="ml-2" />
                  </Link>
                  <a
                    href="#how-it-works"
                    className="flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-6 py-3.5 text-base font-semibold text-neutral-700 hover:bg-neutral-50 transition-all"
                  >
                    How it Works
                  </a>
                </div>
              </div>
            </div>

            <div className="relative mt-12 sm:mx-auto sm:max-w-lg lg:col-span-6 lg:mx-0 lg:mt-0 lg:flex lg:max-w-none lg:items-center">
              <div className="relative mx-auto w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl ring-1 ring-neutral-900/5">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-brand-500 flex items-center justify-center font-bold text-white">B</div>
                    <div>
                      <h4 className="text-sm font-bold text-neutral-800">Summer Launch Campaign</h4>
                      <p className="text-xs text-neutral-400">Targeting Tech & Lifestyle</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-600">Active</span>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between text-xs text-neutral-500">
                    <span>Est. Reach</span>
                    <span className="font-semibold text-neutral-800">1.2M impressions</span>
                  </div>
                  <div className="flex justify-between text-xs text-neutral-500">
                    <span>Active Influencers</span>
                    <span className="font-semibold text-neutral-800">8 creators</span>
                  </div>
                  <div className="flex justify-between text-xs text-neutral-500">
                    <span>Escrow Budget</span>
                    <span className="font-semibold text-brand-600">$4,500 Held</span>
                  </div>
                </div>
                <div className="mt-6 rounded-xl bg-neutral-50 p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield size={16} className="text-green-500" />
                    <span className="text-xs font-medium text-neutral-600">KYC Verified Brand</span>
                  </div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase">Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-neutral-900 py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((s, idx) => (
              <div key={idx} className="text-center">
                <p className="text-3xl font-extrabold text-brand-400 sm:text-4xl">{s.value}</p>
                <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-neutral-400">{s.label}</p>
                <p className="mt-1 text-xs text-neutral-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">Built for Seamless Creator Partnerships</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-neutral-500">
              BRISKODE makes campaign discovery, content tracking, and payout clearances effortless.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-neutral-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500 text-white">
                <Users size={24} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-neutral-800">1. Onboard & Discover</h3>
              <p className="mt-2 text-sm text-neutral-500">
                Influencers complete profiles and link social feeds. Brands search using filters for location, category, and followers.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm border border-neutral-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500 text-white">
                <Shield size={24} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-neutral-800">2. Apply & Hold Escrow</h3>
              <p className="mt-2 text-sm text-neutral-500">
                Creators pitch rates. Upon approval, budgets are placed in secure escrow wallets so payment is guaranteed.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm border border-neutral-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500 text-white">
                <BarChart3 size={24} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-neutral-800">3. Release & Track</h3>
              <p className="mt-2 text-sm text-neutral-500">
                After post validation, escrow is automatically credited to creator wallets. Live analytics track reach and ROI performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900">What Our Partners Say</h2>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl bg-neutral-50 p-6 border border-neutral-100">
              <div className="flex items-center space-x-1 text-amber-500">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="mt-4 text-sm italic text-neutral-600">
                "BRISKODE has transformed how we execute influencer programs. The escrow safety feature makes working with global creators completely risk-free."
              </p>
              <div className="mt-6 flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-brand-200"></div>
                <div>
                  <h5 className="text-xs font-bold text-neutral-800">Sarah Jenkins</h5>
                  <p className="text-[10px] text-neutral-400">Marketing Lead, Aura Beauty</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-neutral-50 p-6 border border-neutral-100">
              <div className="flex items-center space-x-1 text-amber-500">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="mt-4 text-sm italic text-neutral-600">
                "As a lifestyle creator, getting timely payouts used to be a challenge. With BRISKODE, once I submit my links, payments are instantly cleared!"
              </p>
              <div className="mt-6 flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-brand-200"></div>
                <div>
                  <h5 className="text-xs font-bold text-neutral-800">Leo Dubois</h5>
                  <p className="text-[10px] text-neutral-400">Tech Content Creator</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-neutral-50 p-6 border border-neutral-100">
              <div className="flex items-center space-x-1 text-amber-500">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="mt-4 text-sm italic text-neutral-600">
                "Managing 40+ micro-influencers was a spreadsheet nightmare. The agency team dashboard handles communications, contracts, and splits beautifully."
              </p>
              <div className="mt-6 flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-brand-200"></div>
                <div>
                  <h5 className="text-xs font-bold text-neutral-800">Marcus Chen</h5>
                  <p className="text-[10px] text-neutral-400">Director, Chen PR Agency</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">Transparent, Scale-Ready Pricing</h2>
            <p className="mt-4 text-sm text-neutral-500">Choose the level that meets your brand growth plans.</p>
            <div className="mt-6 flex justify-center items-center space-x-3">
              <span className={`text-sm ${billingPeriod === 'monthly' ? 'font-semibold text-neutral-900' : 'text-neutral-500'}`}>Monthly</span>
              <button
                onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
                className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-neutral-200 transition-colors duration-200 ease-in-out focus:outline-none"
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${billingPeriod === 'yearly' ? 'translate-x-5' : 'translate-x-0'}`}></span>
              </button>
              <span className={`text-sm ${billingPeriod === 'yearly' ? 'font-semibold text-neutral-900' : 'text-neutral-500'}`}>Yearly (Save 20%)</span>
            </div>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {pricingPlans.map((plan, idx) => (
              <div
                key={idx}
                className={`relative rounded-2xl bg-white p-8 shadow-sm border transition-all ${plan.popular ? 'border-brand-500 ring-2 ring-brand-500/20 scale-[1.03]' : 'border-neutral-200 hover:border-neutral-300'}`}
              >
                {plan.popular && (
                  <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600 px-3 py-0.5 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                )}
                <h4 className="text-lg font-bold text-neutral-800">{plan.name}</h4>
                <p className="mt-2 text-xs text-neutral-500">{plan.desc}</p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-extrabold text-neutral-900">{plan.price}</span>
                  <span className="text-sm font-semibold text-neutral-500">{plan.period}</span>
                </div>

                <ul className="mt-8 space-y-3.5 border-t border-neutral-100 pt-6">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start space-x-2.5 text-sm text-neutral-600">
                      <Check size={16} className="text-brand-500 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Link
                    to="/register"
                    className={`block text-center rounded-xl py-3 text-sm font-semibold shadow-sm transition-colors ${plan.popular ? 'bg-brand-600 text-white hover:bg-brand-700' : 'bg-neutral-50 text-neutral-700 border border-neutral-200 hover:bg-neutral-100'}`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900">Frequently Asked Questions</h2>
          </div>
          <div className="mt-12 space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="rounded-2xl border border-neutral-200 p-6">
                <h4 className="text-base font-bold text-neutral-800">{faq.q}</h4>
                <p className="mt-2 text-sm text-neutral-500">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-950 py-16 text-center text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold sm:text-4xl">Ready to Launch Your Next Campaign?</h2>
          <p className="mx-auto mt-4 max-w-xl text-neutral-300 text-sm">
            Sign up as a Brand to source top content talent, or onboard as a Creator to unlock guaranteed escrow payouts.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <Link
              to="/register"
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-brand-950 hover:bg-neutral-100 transition-colors"
            >
              Sign Up For Free
            </Link>
            <a
              href="mailto:support@briskode.com"
              className="rounded-xl border border-neutral-700 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-900 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-neutral-50 border-t border-neutral-200 py-12 text-center text-xs text-neutral-400">
        <p>&copy; {new Date().getFullYear()} BRISKODE. All Rights Reserved. Terms & Conditions | Privacy Policy</p>
      </footer>
    </div>
  );
};

export default LandingPage;
