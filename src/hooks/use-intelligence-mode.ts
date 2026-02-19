import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth';
import { api } from '@/lib/api';

export type IntelligenceMode = 'minimal' | 'balanced' | 'deep';

const INTELLIGENCE_MODE_KEY = 'boardandgo_intelligence_mode';

export function getStoredIntelligenceMode(): IntelligenceMode {
  if (typeof window === 'undefined') return 'balanced';
  const value = localStorage.getItem(INTELLIGENCE_MODE_KEY);
  return value === 'minimal' || value === 'deep' || value === 'balanced' ? value : 'balanced';
}

export function setStoredIntelligenceMode(mode: IntelligenceMode) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(INTELLIGENCE_MODE_KEY, mode);
}

export function useIntelligenceMode(): [IntelligenceMode, (mode: IntelligenceMode) => void] {
  const { token } = useAuth();
  const [mode, setMode] = useState<IntelligenceMode>(() => getStoredIntelligenceMode());

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    api.notifications
      .getPreferences(token)
      .then(({ preferences }) => {
        const nextMode = preferences.intelligenceMode;
        if (!cancelled && (nextMode === 'minimal' || nextMode === 'balanced' || nextMode === 'deep')) {
          setMode(nextMode);
          setStoredIntelligenceMode(nextMode);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [token]);

  const updateMode = (nextMode: IntelligenceMode) => {
    setMode(nextMode);
    setStoredIntelligenceMode(nextMode);
    if (token) {
      api.notifications.updatePreferences({ intelligenceMode: nextMode }, token).catch(() => {});
    }
  };

  return [mode, updateMode];
}
