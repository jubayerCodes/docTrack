'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, User, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect immediately to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (name.trim().length < 2) {
      setErrorMessage('Full name must be at least 2 characters long.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter both passwords.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const result = await register(email, password, name);
      if (!result.success) {
        setErrorMessage(result.error || 'Registration failed. Please try again.');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred during registration.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f9] flex flex-col justify-center items-center p-3.5 sm:p-6 relative overflow-hidden">
      {/* Background Decorative Ambient Blobs */}
      <div className="absolute -top-32 -left-32 w-72 sm:w-96 h-72 sm:h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-72 sm:w-96 h-72 sm:h-96 bg-[#2c9a8b]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-[460px] z-10 space-y-5 sm:space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-1.5 sm:space-y-2">
          <div className="inline-flex items-center gap-2 mb-1">
            <div className="flex items-center gap-1 flex-shrink-0 -rotate-12">
              <span className="w-3.5 h-8 rounded-full bg-primary block shadow-sm" />
              <span className="w-3.5 h-8 rounded-full bg-[#2c9a8b] block shadow-sm" />
            </div>
            <span className="font-heading font-extrabold text-2xl text-ink tracking-tight">
              DocTrack
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-ink">Create Clinical Account</h1>
          <p className="text-xs text-textSecondary max-w-sm mx-auto">
            Register new authorized credentials to join the DocTrack healthcare network.
          </p>
        </div>

        {/* Registration Card */}
        <div className="bg-white rounded-modal border border-border shadow-modal p-5 sm:p-8 space-y-4 sm:space-y-5">
          {/* Error Alert */}
          {errorMessage && (
            <div className="bg-semantic-dangerBg border border-semantic-danger/30 rounded-control p-3 flex items-start gap-2.5 text-semantic-danger text-xs animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="leading-snug">{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                label="Full Name"
                type="text"
                placeholder="Dr. Jordan Hayes or Alex Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={<User className="w-4 h-4" />}
                required
                autoComplete="name"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Input
                label="Staff Email Address"
                type="email"
                placeholder="practitioner@doctrack.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                required
                autoComplete="email"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-ink">
                  Security Password <span className="text-semantic-danger ml-0.5">*</span>
                </label>
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  required
                  autoComplete="new-password"
                  className="w-full h-10 rounded-control border border-border bg-surface pl-9 pr-10 text-xs text-ink placeholder:text-textSubtle transition-all duration-150 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-ink transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-ink">
                  Confirm Password <span className="text-semantic-danger ml-0.5">*</span>
                </label>
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isSubmitting}
                  required
                  autoComplete="new-password"
                  className="w-full h-10 rounded-control border border-border bg-surface pl-9 pr-10 text-xs text-ink placeholder:text-textSubtle transition-all duration-150 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-ink transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isSubmitting}
            >
              <span>Register Account</span>
              {!isSubmitting && <ArrowRight className="w-4 h-4 ml-1.5" />}
            </Button>
          </form>

          {/* Navigation to Login */}
          <div className="pt-3 text-center border-t border-border">
            <p className="text-xs text-textSecondary">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-semibold text-primary hover:text-primary-hover transition-colors underline underline-offset-2"
              >
                Sign in to portal
              </Link>
            </p>
          </div>
        </div>

        {/* Security & Compliance Footer */}
        <div className="flex items-center justify-center gap-2 text-textMuted text-[11px]">
          <ShieldCheck className="w-4 h-4 text-semantic-success flex-shrink-0" />
          <span>HIPAA & HITECH Compliant Clinical Access</span>
        </div>
      </div>
    </div>
  );
}
