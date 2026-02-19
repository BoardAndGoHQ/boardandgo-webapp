'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth';
import {
  api,
  type GmailStatus,
  type NotificationChannel,
  type NotificationPreferences,
} from '@/lib/api';
import {
  Mail as IconMail,
  Loader2 as IconLoader,
  Check as IconCheck,
  Settings,
  RefreshCw,
  Unlink,
  MessageCircle,
  Bell,
  Smartphone,
  Save,
} from 'lucide-react';

type PushPermissionState = 'unsupported' | 'default' | 'granted' | 'denied';

const CHANNELS: Array<{ id: NotificationChannel; label: string }> = [
  { id: 'email', label: 'Email' },
  { id: 'telegram', label: 'Telegram' },
  { id: 'sms', label: 'SMS' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'in_app', label: 'In-App' },
  { id: 'web_push', label: 'Browser Push' },
];

function toPushPermissionState(): PushPermissionState {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
  return Notification.permission;
}

function urlBase64ToArrayBuffer(base64String: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = window.atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) output[i] = raw.charCodeAt(i);
  return output.buffer;
}

export default function SettingsPage() {
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();

  const [gmailStatus, setGmailStatus] = useState<GmailStatus | null>(null);
  const [gmailLoading, setGmailLoading] = useState(true);
  const [gmailConnecting, setGmailConnecting] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [prefsLoading, setPrefsLoading] = useState(true);
  const [savingPrefs, setSavingPrefs] = useState(false);

  const [telegramConnecting, setTelegramConnecting] = useState(false);
  const [pushPermission, setPushPermission] = useState<PushPermissionState>(() => toPushPermissionState());
  const [pushBusy, setPushBusy] = useState(false);

  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const telegramPollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const telegramTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopTelegramPolling = useCallback(() => {
    if (telegramPollRef.current) clearInterval(telegramPollRef.current);
    if (telegramTimeoutRef.current) clearTimeout(telegramTimeoutRef.current);
    telegramPollRef.current = null;
    telegramTimeoutRef.current = null;
  }, []);

  const loadPreferences = useCallback(async () => {
    if (!token) return;
    setPrefsLoading(true);
    try {
      const response = await api.notifications.getPreferences(token);
      setPreferences(response.preferences);
    } catch {
      setError('Failed to load notification preferences.');
    } finally {
      setPrefsLoading(false);
    }
  }, [token]);

  const loadGmail = useCallback(async () => {
    if (!token) return;
    setGmailLoading(true);
    try {
      const status = await api.gmail.getStatus(token);
      setGmailStatus(status);
    } catch {
      setGmailStatus(null);
    } finally {
      setGmailLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    loadGmail();
    loadPreferences();
  }, [token, loadGmail, loadPreferences]);

  useEffect(() => () => stopTelegramPolling(), [stopTelegramPolling]);

  if (!authLoading && !user) {
    router.push('/login');
    return null;
  }

  const hasTelegram = Boolean(preferences?.telegramChatId);

  const savePreferences = async (partial: Partial<NotificationPreferences>) => {
    if (!token || !preferences) return;
    setSavingPrefs(true);
    setError('');
    try {
      const response = await api.notifications.updatePreferences(partial, token);
      setPreferences(response.preferences);
      setInfo('Preferences saved.');
      setTimeout(() => setInfo(''), 1800);
    } catch {
      setError('Failed to save preferences.');
    } finally {
      setSavingPrefs(false);
    }
  };

  const toggleChannel = (channel: NotificationChannel) => {
    if (!preferences) return;
    const enabled = new Set(preferences.enabledChannels);
    if (enabled.has(channel)) enabled.delete(channel);
    else enabled.add(channel);
    const next = Array.from(enabled) as NotificationChannel[];
    if (next.length === 0) next.push('in_app');
    void savePreferences({ enabledChannels: next });
  };

  const connectTelegram = async () => {
    if (!token) return;
    setTelegramConnecting(true);
    setError('');
    stopTelegramPolling();

    try {
      const response = await api.notifications.getTelegramLink(token);
      window.open(response.link, '_blank');
      setInfo('Telegram opened. Press START in the bot and return here.');

      telegramPollRef.current = setInterval(async () => {
        try {
          const data = await api.notifications.getPreferences(token);
          if (data.preferences.telegramChatId) {
            setPreferences(data.preferences);
            setTelegramConnecting(false);
            stopTelegramPolling();
            setInfo('Telegram connected.');
          }
        } catch {
          // noop
        }
      }, 2000);

      telegramTimeoutRef.current = setTimeout(() => {
        setTelegramConnecting(false);
        stopTelegramPolling();
      }, 120000);
    } catch {
      setTelegramConnecting(false);
      setError('Failed to open Telegram connect flow.');
    }
  };

  const connectGmail = async () => {
    if (!token) return;
    setGmailConnecting(true);
    setError('');
    try {
      const data = await api.gmail.getAuthUrl(token);
      const popup = window.open(data.authUrl, 'gmail-auth', 'width=600,height=700,popup=yes');
      const interval = setInterval(() => {
        if (popup?.closed) {
          clearInterval(interval);
          setGmailConnecting(false);
          void loadGmail();
        }
      }, 1000);
    } catch {
      setError('Failed to start Gmail connect.');
      setGmailConnecting(false);
    }
  };

  const disconnectGmail = async () => {
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

  const scanGmail = async () => {
    if (!token) return;
    setScanning(true);
    setError('');
    try {
      const result = await api.gmail.scan(token);
      setInfo(result.message || 'Scan started.');
      setTimeout(() => setInfo(''), 2200);
    } catch {
      setError('Failed to trigger Gmail scan.');
    } finally {
      setScanning(false);
    }
  };

  const handlePushToggle = async (enabled: boolean) => {
    if (!token || !preferences) return;
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setError('Browser push is not supported in this browser.');
      return;
    }

    setPushBusy(true);
    setError('');
    try {
      if (enabled) {
        if (toPushPermissionState() === 'default') {
          const permission = await Notification.requestPermission();
          setPushPermission(permission);
          if (permission !== 'granted') {
            throw new Error('Notification permission denied');
          }
        }
        const key = await api.notifications.getWebPushPublicKey(token);
        const registration = await navigator.serviceWorker.register('/sw.js');
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToArrayBuffer(key.publicKey),
        });
        const json = subscription.toJSON();
        if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
          throw new Error('Invalid push subscription');
        }
        await api.notifications.subscribeWebPush(
          {
            endpoint: json.endpoint,
            keys: {
              p256dh: json.keys.p256dh,
              auth: json.keys.auth,
            },
          },
          token
        );
        await savePreferences({
          webPushEnabled: true,
          enabledChannels: Array.from(new Set([...preferences.enabledChannels, 'web_push'])) as NotificationChannel[],
        });
      } else {
        const registration = await navigator.serviceWorker.getRegistration();
        const subscription = await registration?.pushManager.getSubscription();
        await api.notifications.unsubscribeWebPush(token, subscription?.endpoint);
        if (subscription) await subscription.unsubscribe();

        const nextChannels = preferences.enabledChannels.filter(channel => channel !== 'web_push');
        await savePreferences({
          webPushEnabled: false,
          enabledChannels: (nextChannels.length > 0 ? nextChannels : ['in_app']) as NotificationChannel[],
        });
      }
    } catch {
      setError('Failed to update browser push settings.');
    } finally {
      setPushBusy(false);
      setPushPermission(toPushPermissionState());
    }
  };

  if (authLoading || prefsLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <IconLoader className="w-6 h-6 text-accent-blue animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-2xl bg-accent-blue/10 flex items-center justify-center">
          <Settings className="w-5 h-5 text-accent-blue" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
      </div>
      <p className="text-text-muted mb-8">Concierge channels, intelligence profile, and integrations</p>

      {error && <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">{error}</div>}
      {info && <div className="mb-4 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-sm text-green-400">{info}</div>}

      <section className="glass-card rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Bell className="w-4 h-4 text-accent-blue" />
          Notification Channels
        </h2>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {CHANNELS.map(channel => (
            <label key={channel.id} className="flex items-center gap-2 text-sm text-text-primary">
              <input
                type="checkbox"
                checked={preferences?.enabledChannels.includes(channel.id)}
                onChange={() => toggleChannel(channel.id)}
                disabled={savingPrefs}
                className="accent-accent-blue"
              />
              {channel.label}
            </label>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            value={preferences?.smsNumber ?? ''}
            onChange={event => setPreferences(prev => (prev ? { ...prev, smsNumber: event.target.value } : prev))}
            onBlur={() => void savePreferences({ smsNumber: preferences?.smsNumber ?? null })}
            placeholder="SMS number (+15551234567)"
            className="glass-input rounded-xl px-3 py-2 text-sm"
          />
          <input
            value={preferences?.whatsappNumber ?? ''}
            onChange={event => setPreferences(prev => (prev ? { ...prev, whatsappNumber: event.target.value } : prev))}
            onBlur={() => void savePreferences({ whatsappNumber: preferences?.whatsappNumber ?? null })}
            placeholder="WhatsApp number (+15551234567)"
            className="glass-input rounded-xl px-3 py-2 text-sm"
          />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
          <button
            onClick={connectTelegram}
            disabled={telegramConnecting || hasTelegram}
            className="px-3 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 disabled:opacity-50 inline-flex items-center gap-2"
          >
            {telegramConnecting ? <IconLoader className="w-4 h-4 animate-spin" /> : <MessageCircle className="w-4 h-4" />}
            {hasTelegram ? 'Telegram Linked' : 'Link Telegram'}
          </button>
          <button
            onClick={() => void handlePushToggle(!(preferences?.webPushEnabled ?? false))}
            disabled={pushBusy}
            className="px-3 py-2 rounded-xl bg-accent-blue/10 border border-accent-blue/20 text-accent-blue disabled:opacity-50 inline-flex items-center gap-2"
          >
            {pushBusy ? <IconLoader className="w-4 h-4 animate-spin" /> : <Smartphone className="w-4 h-4" />}
            {preferences?.webPushEnabled ? 'Disable Browser Push' : 'Enable Browser Push'}
          </button>
          <span className="text-xs text-text-muted">Browser permission: {pushPermission}</span>
        </div>
      </section>

      <section className="glass-card rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Intelligence Profile</h2>
        <div className="space-y-2">
          {(['minimal', 'balanced', 'deep'] as const).map(mode => (
            <label key={mode} className="flex items-center gap-2 text-sm text-text-primary">
              <input
                type="radio"
                name="intelligenceMode"
                checked={preferences?.intelligenceMode === mode}
                onChange={() => void savePreferences({ intelligenceMode: mode })}
                className="accent-accent-blue"
              />
              <span className="capitalize">{mode}</span>
            </label>
          ))}
        </div>
        <div className="mt-4">
          <label className="text-sm text-text-muted">Delay alert threshold (minutes)</label>
          <input
            type="number"
            min={0}
            max={300}
            value={preferences?.delayThresholdMinutes ?? 30}
            onChange={event =>
              setPreferences(prev =>
                prev ? { ...prev, delayThresholdMinutes: Number(event.target.value || 0) } : prev
              )
            }
            onBlur={() =>
              void savePreferences({
                delayThresholdMinutes: Math.max(0, Math.min(300, preferences?.delayThresholdMinutes ?? 30)),
              })
            }
            className="mt-1 w-32 glass-input rounded-xl px-3 py-2 text-sm"
          />
        </div>
      </section>

      <section className="glass-card rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
          <IconMail className="w-4 h-4 text-red-400" />
          Gmail Integration
        </h2>
        {gmailLoading ? (
          <div className="text-text-muted text-sm inline-flex items-center gap-2">
            <IconLoader className="w-4 h-4 animate-spin" />
            Checking Gmail connection...
          </div>
        ) : gmailStatus?.connected ? (
          <div className="space-y-3">
            <div className="text-sm text-green-400 inline-flex items-center gap-2">
              <IconCheck className="w-4 h-4" />
              Connected ({gmailStatus.email})
            </div>
            <div className="flex gap-2">
              <button
                onClick={scanGmail}
                disabled={scanning}
                className="px-3 py-2 rounded-xl bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-sm inline-flex items-center gap-2"
              >
                {scanning ? <IconLoader className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                Scan Now
              </button>
              <button
                onClick={disconnectGmail}
                disabled={disconnecting}
                className="px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm inline-flex items-center gap-2"
              >
                {disconnecting ? <IconLoader className="w-4 h-4 animate-spin" /> : <Unlink className="w-4 h-4" />}
                Disconnect
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={connectGmail}
            disabled={gmailConnecting}
            className="px-3 py-2 rounded-xl bg-bg-elevated border border-border-subtle text-text-primary text-sm inline-flex items-center gap-2"
          >
            {gmailConnecting ? <IconLoader className="w-4 h-4 animate-spin" /> : <IconMail className="w-4 h-4" />}
            Connect Gmail
          </button>
        )}
      </section>

      <div className="text-xs text-text-muted inline-flex items-center gap-2">
        <Save className="w-3.5 h-3.5" />
        Changes are saved immediately.
      </div>
    </div>
  );
}
