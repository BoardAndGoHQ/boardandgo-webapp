'use client';

import { useState, type FormEvent, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/auth';
import { Mail, User, Lock, Loader2, Plane } from 'lucide-react';
import type { AuthError } from '@supabase/supabase-js';

function RegisterForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await signUpWithEmail(email, password, name || undefined);
      setSuccess('Check your email for a confirmation link!');
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message || 'Unable to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('boardandgo_redirect', redirectTo);
      }
      await signInWithGoogle();
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message || 'Unable to sign in with Google.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-5 py-16 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-accent-blue/6 rounded-full blur-3xl pointer-events-none animate-drift" />
      <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-accent-blue/4 rounded-full blur-3xl pointer-events-none animate-drift-reverse" />

      <div className="w-full max-w-md animate-fade-up">
        <div className="glass-card rounded-3xl p-8 md:p-10 shadow-lg">
          {/* Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent-blue/10 text-accent-blue mb-4">
              <Plane className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-1">Create an account</h1>
            <p className="text-sm text-text-muted">Start managing your travel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="px-4 py-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl animate-fade-in">
                {error}
              </div>
            )}

            {success && (
              <div className="px-4 py-3 text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl animate-fade-in">
                {success}
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-text-secondary mb-1.5 block">Name (optional)</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  className="w-full pl-11 pr-4 py-3 glass-input rounded-xl text-sm text-text-primary placeholder:text-text-muted"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-text-secondary mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full pl-11 pr-4 py-3 glass-input rounded-xl text-sm text-text-primary placeholder:text-text-muted"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-text-secondary mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full pl-11 pr-4 py-3 glass-input rounded-xl text-sm text-text-primary placeholder:text-text-muted"
                  placeholder="Min. 6 characters"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-accent-blue text-white font-semibold text-sm rounded-xl hover:bg-accent-blue/90 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 glow-primary"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-border-subtle" />
            <span className="text-xs text-text-muted font-medium">or</span>
            <div className="flex-1 h-px bg-border-subtle" />
          </div>

          {/* Google */}
          <button
            onClick={handleGoogleSignIn}
            type="button"
            className="w-full py-3 glass border border-border-subtle text-text-primary font-medium text-sm rounded-xl hover:shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-sm text-text-muted mt-6">
            Already have an account?{' '}
            <Link href={`/login${redirectTo !== '/dashboard' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`} className="text-accent-blue font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center"><Loader2 className="w-6 h-6 text-text-muted animate-spin" /></div>}>
      <RegisterForm />
    </Suspense>
  );
}
