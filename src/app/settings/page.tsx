'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth';
import { api, type GmailStatus } from '@/lib/api';
import { Mail as IconMail, Loader2 as IconLoader, Check as IconCheck, Settings, Layers, AlertTriangle, RefreshCw, Unlink, MessageCircle } from 'lucide-react';

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
  const [gmailStatus, setGmailStatus] = useState<GmailStatus | null>(null);
  const [gmailLoading, setGmailLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [error, setError] = useState('');
  const [scanMessage, setScanMessage] = useState('');
  const [intelligenceMode, setIntelligenceMode] = useState<IntelligenceMode>('balanced');
  
  // Telegram states
  const [telegramConnecting, setTelegramConnecting] = useState(false);
  const [telegramConnected, setTelegramConnected] = useState(false);
  const [telegramLoading, setTelegramLoading] = useState(true);

  // Load stored mode on mount
  useEffect(() => {
    setIntelligenceMode(getStoredMode());
  }, []);

  const fetchGmailStatus = useCallback(async () => {
    if (!token) return;
    try {
      const status = await api.gmail.getStatus(token);
      setGmailStatus(status);
    } catch {
      // Not critical — just means we can't determine status
    } finally {
      setGmailLoading(false);
    }
  }, [token]);

  const fetchTelegramStatus = useCallback(async () => {
    if (!token) return;
    try {
      const prefs = await api.notifications.getPreferences(token);
      // Check if telegramChatId exists in preferences
      const hasTelegram = !!(prefs.preferences as any)?.telegramChatId;
      setTelegramConnected(hasTelegram);
    } catch {
      // Not critical
    } finally {
      setTelegramLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchGmailStatus();
      fetchTelegramStatus();
    }
  }, [token, fetchGmailStatus, fetchTelegramStatus]);

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
      const data = await api.gmail.getAuthUrl(token);
      
      // Open Gmail OAuth in a popup
      const popup = window.open(data.authUrl, 'gmail-auth', 'width=600,height=700,popup=yes');
      
      // Poll for popup close
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          setGmailConnecting(false);
          // Refresh status from backend
          fetchGmailStatus();
        }
      }, 1000);
    } catch {
      setError('Failed to connect Gmail. Please try again.');
      setGmailConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!token) return;
    setDisconnecting(true);
    setError('');
    try {
      await api.gmail.disconnect(token);
      setGmailStatus({ connected: false, email: null, watchExpiration: null });
    } catch {
      setError('Failed to disconnect Gmail.');
    } finally {
      setDisconnecting(false);
    }
  };

  const handleScan = async () => {
    if (!token) return;
    setScanning(true);
    setScanMessage('');
    setError('');
    try {
      const result = await api.gmail.scan(token);
      setScanMessage(result.message || 'Scan started! Bookings will appear shortly.');
    } catch {
      setError('Failed to trigger email scan.');
    } finally {
      setScanning(false);
    }
  };

  const handleConnectTelegram = async () => {
    if (!token) return;
    
    setTelegramConnecting(true);
    setError('');
    
    try {
      // Get the deep link from the API
      const response = await api.notifications.getTelegramLink('boardandgo_bot', token);
      
      // Open the Telegram deep link
      window.open(response.link, '_blank');
      
      // Show instruction message
      setScanMessage('Opened Telegram! Please start the bot and return here to refresh.');
      
      // Poll for connection status
      const checkInterval = setInterval(async () => {
        try {
          const prefs = await api.notifications.getPreferences(token);
          const hasTelegram = !!(prefs.preferences as any)?.telegramChatId;
          if (hasTelegram) {
            setTelegramConnected(true);
            setScanMessage('✅ Telegram connected successfully!');
            clearInterval(checkInterval);
            setTimeout(() => setScanMessage(''), 5000);
          }
        } catch {
          // Continue polling
        }
      }, 2000);
      
      // Stop polling after 2 minutes
      setTimeout(() => {
        clearInterval(checkInterval);
        if (!telegramConnected) {
          setTelegramConnecting(false);
          setError('Telegram connection timed out. Please try again.');
        }
      }, 120000);
      
    } catch (err) {
      setError('Failed to connect Telegram. Please try again.');
      setTelegramConnecting(false);
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
      <div className="absolute -top-20 left-0 w-100 h-100 bg-accent-blue/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-2xl bg-accent-blue/10 flex items-center justify-center">
          <Settings className="w-5 h-5 text-accent-blue" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
      </div>
      <p className="text-text-muted ml-13 mb-8">Manage your account and integrations</p>

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

              {scanMessage && (
                <div className="mb-4 px-4 py-3 text-sm text-green-400 bg-green-400/10 border border-green-400/20 rounded-lg">
                  {scanMessage}
                </div>
              )}

              {gmailLoading ? (
                <div className="flex items-center gap-2 text-text-muted">
                  <IconLoader className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Checking connection...</span>
                </div>
              ) : gmailStatus?.connected ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-green-400">
                    <IconCheck className="w-5 h-5" />
                    <span className="text-sm">Gmail connected ({gmailStatus.email})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleScan}
                      disabled={scanning}
                      className="px-4 py-2 bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-sm rounded-lg hover:bg-accent-blue/20 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {scanning ? (
                        <IconLoader className="w-4 h-4 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4" />
                      )}
                      {scanning ? 'Scanning...' : 'Scan Emails Now'}
                    </button>
                    <button
                      onClick={handleDisconnect}
                      disabled={disconnecting}
                      className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {disconnecting ? (
                        <IconLoader className="w-4 h-4 animate-spin" />
                      ) : (
                        <Unlink className="w-4 h-4" />
                      )}
                      Disconnect
                    </button>
                  </div>
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

      {/* Telegram Integration Section */}
      <section className="mb-8">
        <h2 className="text-lg font-medium text-text-primary mb-4">Telegram Notifications</h2>
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center shrink-0">
              <MessageCircle className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-text-primary font-medium mb-1">
                Instant Flight Updates
              </h3>
              <p className="text-text-muted text-sm mb-4">
                Get real-time flight notifications directly in Telegram. No app installation needed.
              </p>
              
              {error && (
                <div className="mb-4 px-4 py-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg">
                  {error}
                </div>
              )}

              {scanMessage && (
                <div className="mb-4 px-4 py-3 text-sm text-green-400 bg-green-400/10 border border-green-400/20 rounded-lg">
                  {scanMessage}
                </div>
              )}

              {telegramLoading ? (
                <div className="flex items-center gap-2 text-text-muted">
                  <IconLoader className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Checking connection...</span>
                </div>
              ) : telegramConnected ? (
                <div className="flex items-center gap-2 text-green-400">
                  <IconCheck className="w-5 h-5" />
                  <span className="text-sm">Telegram connected</span>
                </div>
              ) : (
                <button
                  onClick={handleConnectTelegram}
                  disabled={telegramConnecting}
                  className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm rounded-lg hover:bg-blue-500/20 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {telegramConnecting ? (
                    <>
                      <IconLoader className="w-4 h-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-4 h-4" />
                      Connect Telegram
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