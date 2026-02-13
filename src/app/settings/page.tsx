'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth';
import { Mail as IconMail, Loader2 as IconLoader, Check as IconCheck, Settings, Layers, AlertTriangle } from 'lucide-react';

type IntelligenceMode = 'minimal' | 'balanced' | 'deep';

const INTELLIGENCE_MODE_KEY = 'boardandgo_intelligence_mode';

function getStoredMode(): IntelligenceMode {
  if (typeof window === 'undefined') return 'balanced';
  return (localStorage.getItem(INTELLIGENCE_MODE_KEY) as IntelligenceMode) || 'balanced';
}

function setStoredMode(mode: IntelligenceMode) {
  localStorage.setItem(INTELLIGENCE_MODE_KEY, mode);
}

export default function SettingsPage() {
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();
  const [gmailConnecting, setGmailConnecting] = useState(false);
  const [gmailConnected, setGmailConnected] = useState(false);
  const [error, setError] = useState('');
  const [intelligenceMode, setIntelligenceMode] = useState<IntelligenceMode>('balanced');

  // Load stored mode on mount
  useEffect(() => {
    setIntelligenceMode(getStoredMode());
  }, []);

  const handleModeChange = (mode: IntelligenceMode) => {
    setIntelligenceMode(mode);
    setStoredMode(mode);
  };

  // Redirect if not authenticated
  if (!authLoading && !user) {
    router.push('/login');
    return null;
  }

  const handleConnectGmail = async () => {
    if (!token) return;
    
    setGmailConnecting(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gmail/authorize`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get Gmail authorization URL');
      }

      const data = await response.json();
      
      // Open Gmail OAuth in a popup
      const popup = window.open(data.authUrl, 'gmail-auth', 'width=600,height=700,popup=yes');
      
      // Poll for popup close
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          setGmailConnecting(false);
          setGmailConnected(true);
        }
      }, 1000);
    } catch {
      setError('Failed to connect Gmail. Please try again.');
      setGmailConnecting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <IconLoader className="w-6 h-6 text-accent-blue animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-5 py-12 relative">
      <div className="absolute -top-20 left-0 w-[400px] h-[400px] bg-accent-blue/3 rounded-full blur-3xl pointer-events-none" />

      <div className="relative">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-2xl bg-accent-blue/10 flex items-center justify-center">
          <Settings className="w-5 h-5 text-accent-blue" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
      </div>
      <p className="text-text-muted ml-[52px] mb-8">Manage your account and integrations</p>

      {/* Account Section */}
      <section className="mb-8">
        <h2 className="text-lg font-medium text-text-primary mb-4">Account</h2>
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-accent-blue/10 rounded-full flex items-center justify-center">
              <span className="text-accent-blue text-xl font-semibold">
                {user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-text-primary font-medium">
                {user?.user_metadata?.full_name || 'User'}
              </p>
              <p className="text-text-muted text-sm">{user?.email}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gmail Integration Section */}
      <section className="mb-8">
        <h2 className="text-lg font-medium text-text-primary mb-4">Gmail Integration</h2>
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center shrink-0">
              <IconMail className="w-6 h-6 text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-text-primary font-medium mb-1">
                Automatic Booking Detection
              </h3>
              <p className="text-text-muted text-sm mb-4">
                Connect your Gmail to automatically import flight booking confirmations.
                We&apos;ll scan for booking emails and add them to your travel history.
              </p>
              
              {error && (
                <div className="mb-4 px-4 py-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg">
                  {error}
                </div>
              )}

              {gmailConnected ? (
                <div className="flex items-center gap-2 text-green-400">
                  <IconCheck className="w-5 h-5" />
                  <span className="text-sm">Gmail connected successfully!</span>
                </div>
              ) : (
                <button
                  onClick={handleConnectGmail}
                  disabled={gmailConnecting}
                  className="px-4 py-2 bg-bg-elevated border border-border-subtle text-text-primary text-sm rounded-lg hover:bg-bg-primary transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {gmailConnecting ? (
                    <>
                      <IconLoader className="w-4 h-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <IconMail className="w-4 h-4" />
                      Connect Gmail
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Flight Intelligence Mode */}
      <section className="mb-8">
        <h2 className="text-lg font-medium text-text-primary mb-4">Flight Intelligence</h2>
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-accent-blue/10 rounded-full flex items-center justify-center shrink-0">
              <Layers className="w-6 h-6 text-accent-blue" />
            </div>
            <div className="flex-1">
              <h3 className="text-text-primary font-medium mb-1">
                Intelligence Briefing Mode
              </h3>
              <p className="text-text-muted text-sm mb-4">
                Control how much detail Amberlyn provides in your briefings.
              </p>
              
              <div className="space-y-2">
                <label className="flex items-start gap-3 p-3 rounded-xl glass cursor-pointer hover:shadow-md transition-all">
                  <input
                    type="radio"
                    name="intelligenceMode"
                    checked={intelligenceMode === 'minimal'}
                    onChange={() => handleModeChange('minimal')}
                    className="mt-0.5 accent-accent-blue"
                  />
                  <div>
                    <div className="text-sm font-medium text-text-primary">Minimal</div>
                    <div className="text-xs text-text-muted">Only critical alerts: time to leave, gate changes, cancellations. No noise.</div>
                  </div>
                </label>
                
                <label className="flex items-start gap-3 p-3 rounded-xl glass cursor-pointer hover:shadow-md transition-all">
                  <input
                    type="radio"
                    name="intelligenceMode"
                    checked={intelligenceMode === 'balanced'}
                    onChange={() => handleModeChange('balanced')}
                    className="mt-0.5 accent-accent-blue"
                  />
                  <div>
                    <div className="text-sm font-medium text-text-primary">Balanced <span className="text-xs text-accent-blue">(Recommended)</span></div>
                    <div className="text-xs text-text-muted">Risk assessment, delay predictions, smart suggestions. Brief but informative.</div>
                  </div>
                </label>
                
                <label className="flex items-start gap-3 p-3 rounded-xl glass cursor-pointer hover:shadow-md transition-all">
                  <input
                    type="radio"
                    name="intelligenceMode"
                    checked={intelligenceMode === 'deep'}
                    onChange={() => handleModeChange('deep')}
                    className="mt-0.5 accent-accent-blue"
                  />
                  <div>
                    <div className="text-sm font-medium text-text-primary">Deep Ops</div>
                    <div className="text-xs text-text-muted">Full analysis: historical performance, congestion patterns, all contributing factors explained.</div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section>
        <h2 className="text-lg font-medium text-text-primary mb-4">Danger Zone</h2>
        <div className="glass-card rounded-2xl p-6 border border-red-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-text-primary font-medium mb-1">Delete Account</h3>
                <p className="text-text-muted text-sm">
                  Permanently delete your account and all associated data.
                </p>
              </div>
            </div>
            <button
              className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg hover:bg-red-500/20 transition-colors"
            >
              Delete Account
            </button>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}