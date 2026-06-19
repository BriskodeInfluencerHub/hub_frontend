import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Check, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingPage = () => {
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  const plans = [
    {
      name: 'Starter Brief',
      price: billingPeriod === 'monthly' ? '$49' : '$39',
      desc: 'Ideal for small brands launching simple, one-off post tests.',
      features: [
        'Up to 3 active Brief campaigns',
        'Direct chat with influencers',
        'Followers filter discovery',
        'Standard post URL check',
        '5% platform transaction fee',
      ],
      cta: 'Start Free Trial',
      popular: false,
    },
    {
      name: 'Escrow Pro',
      price: billingPeriod === 'monthly' ? '$149' : '$119',
      desc: 'For brands scaling up matching and campaign reach.',
      features: [
        'Unlimited campaign posts',
        'Advanced discovery filters',
        'AI matching recommendations',
        'Automated Escrow contract holds',
        'Priority support',
        '2.5% platform transaction fee',
      ],
      cta: 'Get Started Pro',
      popular: true,
    },
    {
      name: 'Agency Enterprise',
      price: billingPeriod === 'monthly' ? '$399' : '$319',
      desc: 'Unified team controls for multi-client representation.',
      features: [
        'Multi-influencer tracking dashboards',
        'Unified billing & custom invoicing',
        'Priority payment support channels',
        'Custom contracts integration',
        '1.5% platform transaction fee',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 mx-auto max-w-5xl w-full px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-utility text-xs text-brand-500 uppercase tracking-wider font-bold">Pricing Plans</span>
          <h1 className="text-4xl font-extrabold tracking-tight font-display text-neutral-900 mt-2">
            No hidden fees. Payouts locked in escrow.
          </h1>
          <p className="mt-4 text-xs text-neutral-500 leading-relaxed">
            Choose the subscription plan that fits your campaign volume. All plans include automated verified release triggers.
          </p>

          <div className="mt-6 flex justify-center items-center space-x-3">
            <span className={`text-xs ${billingPeriod === 'monthly' ? 'font-bold text-neutral-900' : 'text-neutral-500'}`}>Monthly</span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
              className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border border-neutral-200 bg-neutral-100 transition-colors"
            >
              <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-brand-500 transition-transform ${billingPeriod === 'yearly' ? 'translate-x-5' : 'translate-x-0'}`}></span>
            </button>
            <span className={`text-xs ${billingPeriod === 'yearly' ? 'font-bold text-neutral-900' : 'text-neutral-500'}`}>Yearly (Save 20%)</span>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto mb-16">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative rounded-2xl bg-white p-8 border border-neutral-200 shadow-sm transition-all hover:shadow-md ${plan.popular ? 'ring-2 ring-brand-500/20 border-brand-500' : ''}`}
            >
              {plan.popular && (
                <span className="absolute top-0 right-6 -translate-y-1/2 rounded-full bg-gradient-to-r from-brand-500 to-indigo-500 px-3 py-0.5 text-xs font-semibold text-white uppercase tracking-wider">
                  Popular
                </span>
              )}
              <h4 className="text-lg font-bold font-display text-neutral-850">{plan.name}</h4>
              <p className="mt-2 text-xs text-neutral-450 min-h-[32px]">{plan.desc}</p>
              
              <div className="mt-6 flex items-baseline">
                <span className="text-4xl font-extrabold text-neutral-900 font-display">{plan.price}</span>
                <span className="text-xs font-semibold text-neutral-405 ml-1">{billingPeriod === 'monthly' ? '/mo' : '/mo (billed yearly)'}</span>
              </div>

              <ul className="mt-8 space-y-3.5 border-t border-neutral-150 pt-6">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start space-x-2 text-xs text-neutral-600 font-sans">
                    <Check size={14} className="text-brand-500 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Link
                  to="/register"
                  className={`block text-center rounded-full py-3 text-sm font-semibold transition-all border ${plan.popular ? 'bg-gradient-to-r from-brand-500 to-indigo-500 text-white shadow-sm hover:opacity-90' : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border-neutral-200'}`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-6 max-w-2xl mx-auto flex items-start space-x-4">
          <HelpCircle className="text-brand-500 h-6 w-6 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-display font-bold text-sm text-neutral-850">What are platform transaction fees?</h4>
            <p className="text-xs text-neutral-500 leading-relaxed mt-1">
              Transaction fees apply to payouts processed from campaign escrow holdings. For example, on the Escrow Pro plan with a 2.5% fee, a $1,000 campaign payout will incur a platform charge of $25. This covers bank processing, real-time message support, and verified post tracking.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PricingPage;
