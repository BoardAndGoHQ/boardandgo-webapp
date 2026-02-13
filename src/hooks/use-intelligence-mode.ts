/**
 * Intelligence Mode Hook — Read user's intelligence preference
 */

import { useState, useEffect } from 'react';

export type IntelligenceMode = 'minimal' | 'balanced' | 'deep';

const INTELLIGENCE_MODE_KEY = 'boardandgo_intelligence_mode';

export function getStoredIntelligenceMode(): IntelligenceMode {
  if (typeof window === 'undefined') return 'balanced';
  return (localStorage.getItem(INTELLIGENCE_MODE_KEY) as IntelligenceMode) || 'balanced';
}

export function setStoredIntelligenceMode(mode: IntelligenceMode) {
  localStorage.setItem(INTELLIGENCE_MODE_KEY, mode);
}

export function useIntelligenceMode(): [IntelligenceMode, (mode: IntelligenceMode) => void] {
  const [mode, setMode] = useState<IntelligenceMode>('balanced');

  useEffect(() => {
    setMode(getStoredIntelligenceMode());
  }, []);

  const updateMode = (newMode: IntelligenceMode) => {
    setMode(newMode);
    setStoredIntelligenceMode(newMode);
  };

  return [mode, updateMode];
}
