'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabaseClient();
    
    // Handle the OAuth callback
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      if (session) {
        // Restore redirect target saved before OAuth redirect
        const savedRedirect = localStorage.getItem('boardandgo_redirect');
        localStorage.removeItem('boardandgo_redirect');
        router.replace(savedRedirect || '/dashboard');
      } else {
        // Auth failed
        router.replace('/login?error=auth_failed');
      }
    });
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-accent-teal border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-text-muted">Completing sign in...</p>
      </div>
    </div>
  );
}
