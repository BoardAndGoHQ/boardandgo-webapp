'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Bell, CheckCheck, Loader2 } from 'lucide-react';
import { api, type NotificationItem } from '@/lib/api';
import { useAuth } from '@/context/auth';

function humanizeType(type: string): string {
  return type.replace(/_/g, ' ').replace(/\b\w/g, part => part.toUpperCase());
}

export function NotificationCenter() {
  const { token, user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const eventSourceRef = useRef<EventSource | null>(null);

  const unreadIds = useMemo(
    () => new Set(items.filter(item => item.readAt === null).map(item => item.id)),
    [items]
  );

  useEffect(() => {
    if (!token || !user) return;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const response = await api.notifications.list(token, { limit: 25 });
        if (cancelled) return;
        setItems(response.items);
        setUnreadCount(response.unreadCount);
      } catch {
        if (!cancelled) {
          setItems([]);
          setUnreadCount(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [token, user]);

  useEffect(() => {
    if (!token || !user) return;
    const source = new EventSource(api.notifications.streamUrl(token));
    eventSourceRef.current = source;

    source.onmessage = event => {
      try {
        const payload = JSON.parse(event.data) as {
          unreadCount?: number;
          notification?: NotificationItem | null;
          notificationId?: string | null;
        };
        if (typeof payload.unreadCount === 'number') {
          setUnreadCount(payload.unreadCount);
        }
        if (payload.notification && typeof payload.notification.id === 'string') {
          setItems(prev => {
            const without = prev.filter(item => item.id !== payload.notification!.id);
            return [payload.notification!, ...without].slice(0, 50);
          });
        }
      } catch {
        // noop
      }
    };

    source.onerror = () => {
      source.close();
      eventSourceRef.current = null;
    };

    return () => {
      source.close();
      eventSourceRef.current = null;
    };
  }, [token, user]);

  const markRead = async (id: string) => {
    if (!token || !unreadIds.has(id)) return;
    setItems(prev => prev.map(item => (item.id === id ? { ...item, readAt: new Date().toISOString() } : item)));
    setUnreadCount(count => Math.max(0, count - 1));
    try {
      await api.notifications.markRead(id, token);
    } catch {
      // noop
    }
  };

  const markAllRead = async () => {
    if (!token || unreadCount === 0) return;
    setItems(prev => prev.map(item => ({ ...item, readAt: item.readAt ?? new Date().toISOString() })));
    setUnreadCount(0);
    try {
      await api.notifications.markAllRead(token);
    } catch {
      // noop
    }
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(value => !value)}
        className="relative p-2 text-text-muted hover:text-text-primary hover:bg-black/4 dark:hover:bg-bg-elevated/50 rounded-full transition-all duration-200"
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-accent-blue text-white text-[10px] leading-4 text-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-96 max-w-[90vw] glass-card border border-border-subtle rounded-2xl shadow-xl z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
            <div className="text-sm font-semibold text-text-primary">Notifications</div>
            <button
              onClick={markAllRead}
              className="text-xs text-accent-blue hover:opacity-80 transition-opacity flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="px-4 py-10 flex items-center justify-center text-text-muted">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            ) : items.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-text-muted">No notifications yet.</div>
            ) : (
              <div className="divide-y divide-border-subtle">
                {items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => markRead(item.id)}
                    className={`w-full text-left px-4 py-3 hover:bg-black/3 dark:hover:bg-bg-elevated/40 transition-colors ${
                      item.readAt === null ? 'bg-accent-blue/5' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-accent-blue">
                        {humanizeType(item.notificationType)}
                      </span>
                      {item.readAt === null && <span className="w-1.5 h-1.5 rounded-full bg-accent-blue" />}
                    </div>
                    <div className="text-sm text-text-primary mt-1">
                      {item.subject || item.messageText}
                    </div>
                    <div className="text-xs text-text-muted mt-1 line-clamp-2">{item.messageText}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
