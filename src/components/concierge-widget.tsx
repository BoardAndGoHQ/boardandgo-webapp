'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { MessageCircle, Send, Loader2, CheckCircle2, X } from 'lucide-react';
import { api, type ConciergeActionProposal, type ConciergeChatMessage } from '@/lib/api';
import { useAuth } from '@/context/auth';

type UiMessage = ConciergeChatMessage & {
  pendingAction?: ConciergeActionProposal | null;
};

function extractAction(message: ConciergeChatMessage): ConciergeActionProposal | null {
  const metadata = message.metadata;
  if (!metadata || typeof metadata !== 'object') return null;

  const actionId = metadata.actionId;
  const actionType = metadata.actionType;
  const actionSummary = metadata.actionSummary;
  const actionPayload = metadata.actionPayload;

  if (
    typeof actionId === 'string' &&
    typeof actionType === 'string' &&
    typeof actionSummary === 'string' &&
    typeof actionPayload === 'object' &&
    actionPayload !== null
  ) {
    return {
      id: actionId,
      type: actionType,
      summary: actionSummary,
      payload: actionPayload as Record<string, unknown>,
    };
  }

  return null;
}

export function ConciergeWidget() {
  const { token, user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const lastAction = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      const action = messages[i]?.pendingAction;
      if (action) return action;
    }
    return null;
  }, [messages]);

  useEffect(() => {
    if (!open || !token || !user) return;
    let cancelled = false;

    const bootstrap = async () => {
      setLoading(true);
      try {
        const sessions = await api.concierge.listSessions(token, 10);
        let activeSession = sessions.sessions[0];
        if (!activeSession) {
          const created = await api.concierge.createSession(token, { title: 'Concierge' });
          activeSession = created.session;
        }
        if (!cancelled) {
          setSessionId(activeSession.id);
        }

        const messageResponse = await api.concierge.listMessages(activeSession.id, token, 100);
        if (!cancelled) {
          setMessages(
            messageResponse.messages.map(msg => ({
              ...msg,
              pendingAction: extractAction(msg),
            }))
          );
        }
      } catch {
        if (!cancelled) {
          setMessages([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [open, token, user]);

  useEffect(() => {
    if (!open) return;
    const node = scrollRef.current;
    if (node) {
      node.scrollTop = node.scrollHeight;
    }
  }, [messages, open]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!token || !sessionId || sending) return;
    const content = input.trim();
    if (!content) return;

    const userMessage: UiMessage = {
      id: `local-user-${Date.now()}`,
      sessionId,
      role: 'user',
      content,
      metadata: null,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSending(true);

    try {
      const response = await api.concierge.sendMessage(sessionId, content, token);
      setMessages(prev => [
        ...prev.filter(msg => msg.id !== userMessage.id),
        {
          ...userMessage,
          id: `user-${Date.now()}`,
        },
        {
          ...response.message,
          pendingAction: response.action,
        },
      ]);
    } catch {
      setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
    } finally {
      setSending(false);
    }
  };

  const onConfirmAction = async (actionId: string) => {
    if (!token) return;
    try {
      const result = await api.concierge.confirmAction(actionId, token);
      const followUp = result.followUp;
      if (followUp) {
        const followUpMessage: UiMessage = {
          ...followUp,
          pendingAction: null,
        };
        setMessages(prev => {
          const normalized = prev.map<UiMessage>(msg => ({
            ...msg,
            pendingAction: msg.pendingAction?.id === actionId ? null : msg.pendingAction,
          }));
          return [...normalized, followUpMessage];
        });
      }
    } catch {
      // noop
    }
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="w-[360px] max-w-[95vw] h-[520px] max-h-[75vh] glass-card border border-border-subtle rounded-2xl shadow-xl flex flex-col overflow-hidden mb-3">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
            <div>
              <div className="text-sm font-semibold text-text-primary">Amberlyn Concierge</div>
              <div className="text-xs text-text-muted">Post-booking assistant</div>
            </div>
            <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-black/5 transition-colors">
              <X className="w-4 h-4 text-text-muted" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {loading ? (
              <div className="h-full flex items-center justify-center text-text-muted">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-sm text-text-muted">
                Ask me to adjust channels, update numbers, set delay thresholds, create share links, or summarize your journey.
              </div>
            ) : (
              messages.map(message => (
                <div key={message.id}>
                  {message.role === 'user' ? (
                    <div className="flex justify-end">
                      <div className="px-3 py-2 rounded-xl bg-accent-blue text-white text-sm max-w-[85%]">
                        {message.content}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="px-3 py-2 rounded-xl glass-card border border-border-subtle text-sm text-text-primary">
                        {message.content}
                      </div>
                      {message.pendingAction && (
                        <div className="px-3 py-2 rounded-xl border border-accent-blue/30 bg-accent-blue/8">
                          <div className="text-xs text-accent-blue font-medium">Action proposal</div>
                          <div className="text-sm text-text-primary mt-1">{message.pendingAction.summary}</div>
                          <button
                            onClick={() => onConfirmAction(message.pendingAction!.id)}
                            className="mt-2 inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-accent-blue text-white hover:bg-accent-blue/90"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Confirm
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {lastAction && (
            <div className="px-4 py-2 border-t border-border-subtle text-xs text-text-muted">
              Waiting confirmation: {lastAction.summary}
            </div>
          )}

          <form onSubmit={onSubmit} className="px-4 py-3 border-t border-border-subtle flex items-center gap-2">
            <input
              value={input}
              onChange={event => setInput(event.target.value)}
              placeholder="Ask Amberlyn..."
              className="flex-1 px-3 py-2 rounded-xl glass-input text-sm text-text-primary placeholder:text-text-muted"
            />
            <button
              type="submit"
              disabled={sending || input.trim().length === 0}
              className="p-2 rounded-xl bg-accent-blue text-white disabled:opacity-40"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen(value => !value)}
        className="w-12 h-12 rounded-full bg-accent-blue text-white shadow-lg shadow-accent-blue/30 flex items-center justify-center hover:bg-accent-blue/90 transition-colors"
      >
        <MessageCircle className="w-5 h-5" />
      </button>
    </div>
  );
}
