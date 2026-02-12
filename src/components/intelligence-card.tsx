'use client';

import { useState } from 'react';
import type { DelayPrediction } from '@/lib/insights/delay-risk';
import type { ConnectionRiskResult } from '@/lib/insights/connection-risk';
import type { TravelInsight } from '@/lib/insights/personal-insights';

/* ── Color mapping ── */
const levelColors = {
  low:      { text: 'text-emerald-400', bg: 'bg-emerald-400/10', dot: 'bg-emerald-400' },
  medium:   { text: 'text-amber-400',   bg: 'bg-amber-400/10',   dot: 'bg-amber-400' },
  high:     { text: 'text-red-400',     bg: 'bg-red-400/10',     dot: 'bg-red-400' },
  critical: { text: 'text-red-500',     bg: 'bg-red-500/10',     dot: 'bg-red-500' },
};

/* ── Delay Prediction Card ── */
export function DelayPredictionCard({ prediction }: { prediction: DelayPrediction }) {
  const [expanded, setExpanded] = useState(false);
  const colors = levelColors[prediction.level];

  return (
    <button
      onClick={() => setExpanded(!expanded)}
      className="w-full text-left bg-white/5 rounded-lg p-3 hover:bg-white/[0.07] transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm">⏳</span>
          <span className="text-xs text-text-secondary">Delay Probability</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold ${colors.text}`}>
            {prediction.probability}%
          </span>
          <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
          <svg
            className={`w-3 h-3 text-text-muted transition-transform ${expanded ? 'rotate-180' : ''}`}
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>

      {expanded && (
        <div className="mt-2.5 pt-2.5 border-t border-white/5 space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="flex items-center gap-1.5 text-[10px] text-text-muted uppercase tracking-wider">
            <span className={`px-1.5 py-0.5 rounded ${colors.bg} ${colors.text} font-semibold`}>
              {prediction.level}
            </span>
            <span>Confidence: {prediction.confidence}</span>
          </div>
          {prediction.factors.slice(0, 4).map((f, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <span className="text-text-muted">{f.label}</span>
              <span className={f.impact > 0 ? 'text-red-400/80' : 'text-emerald-400/80'}>
                {f.impact > 0 ? '+' : ''}{f.impact}%
              </span>
            </div>
          ))}
        </div>
      )}
    </button>
  );
}

/* ── Connection Risk Card ── */
export function ConnectionRiskCard({ risk }: { risk: ConnectionRiskResult }) {
  const [expanded, setExpanded] = useState(false);
  const colors = levelColors[risk.level];

  return (
    <button
      onClick={() => setExpanded(!expanded)}
      className="w-full text-left bg-white/5 rounded-lg p-3 hover:bg-white/[0.07] transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm">🔗</span>
          <span className="text-xs text-text-secondary">Connection Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold ${colors.text}`}>
            {risk.score}%
          </span>
          <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
          <svg
            className={`w-3 h-3 text-text-muted transition-transform ${expanded ? 'rotate-180' : ''}`}
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>

      {expanded && (
        <div className="mt-2.5 pt-2.5 border-t border-white/5 space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="flex items-center gap-1.5 text-[10px] text-text-muted uppercase tracking-wider">
            <span className={`px-1.5 py-0.5 rounded ${colors.bg} ${colors.text} font-semibold`}>
              {risk.label}
            </span>
            <span>{risk.effectiveMinutes} min layover</span>
          </div>
          <p className="text-xs text-text-muted">{risk.explanation}</p>
          {risk.factors.map((f, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs text-text-muted">
              <span className={`w-1 h-1 rounded-full ${colors.dot}`} />
              {f}
            </div>
          ))}
        </div>
      )}
    </button>
  );
}

/* ── Personal Insight Card ── */
export function InsightCard({ insight }: { insight: TravelInsight }) {
  return (
    <div className="bg-white/5 rounded-lg p-3">
      <div className="flex items-start gap-2.5">
        <span className="text-base mt-0.5">{insight.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-text-primary mb-0.5">{insight.title}</div>
          <p className="text-xs text-text-muted leading-relaxed">{insight.description}</p>
        </div>
      </div>
    </div>
  );
}

/* ── Section wrapper with "Flight Intelligence (Beta)" header ── */
export function IntelligenceSection({
  children,
  compact = false,
}: {
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div className={compact ? '' : 'bg-white/5 rounded-lg p-3'}>
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-[10px] font-medium text-text-muted uppercase tracking-wider">
          Flight Intelligence
        </span>
        <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-accent-teal/10 text-accent-teal rounded">
          Beta
        </span>
      </div>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
}
