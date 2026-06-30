import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/authContext';
import { ArrowRight, ShieldCheck } from 'lucide-react';

const OtpPage = () => {
  const { verifyOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const initialEmail = location.state?.email || '';
  const otpCode = location.state?.otpCode || '';
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      await verifyOtp(email, code);
      setSuccess('Account verified successfully! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Invalid or expired OTP.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-theme-bg px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-theme-border bg-theme-surface p-8 shadow-xl">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600 mb-4">
            <ShieldCheck size={28} />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-theme-text">OTP Verification</h2>
          <p className="mt-2 text-xs text-theme-text-secondary">
            Enter the verification code sent to your email.
          </p>
          {otpCode && (
            <div className="mt-4 rounded-xl bg-brand-50 border border-brand-200 p-4 text-center">
              <span className="text-[10px] font-bold text-brand-500 uppercase tracking-wider">Dev OTP Code</span>
              <p className="text-2xl font-extrabold tracking-widest text-brand-700 mt-1 select-all">{otpCode}</p>
            </div>
          )}
        </div>

        {error && (
          <div className="rounded-lg bg-red-950/40 border border-red-800/60 p-3 text-xs font-semibold text-red-400 animate-fade-in">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-lg bg-green-950/40 border border-green-800/60 p-3 text-xs font-semibold text-green-400 animate-fade-in">
            {success}
          </div>
        )}

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {!initialEmail && (
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-theme-text-secondary uppercase tracking-wider">Email Address</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-theme-border py-3 px-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10 bg-theme-surface"
                  placeholder="name@company.com"
                />
              </div>
            )}

            <div>
              <label htmlFor="code" className="block text-xs font-semibold text-theme-text-secondary uppercase tracking-wider">6-Digit Verification Code</label>
              <input
                id="code"
                type="text"
                maxLength={6}
                required
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                className="mt-1 block w-full text-center tracking-widest text-lg font-bold rounded-xl border border-theme-border py-3 px-3 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10 bg-theme-surface"
                placeholder="000000"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Verifying...' : 'Verify Code'} <ArrowRight size={16} className="ml-2" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OtpPage;
