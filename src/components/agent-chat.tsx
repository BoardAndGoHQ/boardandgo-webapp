'use client';

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth';
import { api } from '@/lib/api';
import type { AgentChatMessage, SearchIntent } from '@/lib/api';
import {
  IconSend,
  IconBot,
  IconSparkles,
  IconPlane,
  IconArrowRight,
  IconLoader,
  IconSearch,
  IconCalendar,
  IconUsers,
} from './icons';

interface DisplayMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  searchIntent?: SearchIntent | null;
}

const STORAGE_KEY = 'boardandgo_agent_conversation';

function loadConversation(): DisplayMessage[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // ignore
  }
  return [];
}

function saveConversation(messages: DisplayMessage[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // ignore
  }
}

export function AgentChat() {
  const router = useRouter();
  const { token } = useAuth();
  const [messages, setMessages] = useState<DisplayMessage[]>(() => loadConversation());
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    // Scroll only the chat container, not the whole page
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    saveConversation(messages);
  }, [messages]);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !token || isTyping) return;

    const userMessage: DisplayMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    try {
      // Build chat history for API (only role + content)
      const chatHistory: AgentChatMessage[] = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const result = await api.agent.chat(chatHistory, token);

      const assistantMessage: DisplayMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: result.message,
        searchIntent: result.searchIntent,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: DisplayMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: "Sorry, I couldn't process that. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  const handleConfirmSearch = (intent: SearchIntent) => {
    const params = new URLSearchParams({
      tripType: intent.tripType,
      origin: intent.origin,
      destination: intent.destination,
      departureDate: intent.departureDate,
      adults: intent.adults.toString(),
      cabin: intent.cabin,
    });
    if (intent.returnDate && intent.tripType === 'return') {
      params.set('returnDate', intent.returnDate);
    }
    if (intent.children > 0) {
      params.set('children', intent.children.toString());
    }
    if (intent.infants > 0) {
      params.set('infants', intent.infants.toString());
    }
    router.push(`/search?${params.toString()}`);
  };

  const handleClearChat = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const totalPassengers = (intent: SearchIntent) =>
    intent.adults + intent.children + intent.infants;

  const cabinLabel = (cabin: string) =>
    cabin.charAt(0) + cabin.slice(1).toLowerCase().replace('_', ' ');

  return (
    <div className="bg-bg-card border border-border-subtle rounded-xl overflow-hidden flex flex-col" style={{ height: '520px' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-subtle bg-bg-elevated/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent-teal/10 flex items-center justify-center">
            <IconSparkles className="w-4 h-4 text-accent-teal" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-text-primary">AI Flight Assistant</h3>
            <p className="text-xs text-text-muted">Powered by Gemini</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={handleClearChat}
            className="text-xs text-text-muted hover:text-text-secondary transition-colors px-2 py-1 rounded hover:bg-bg-elevated"
          >
            Clear chat
          </button>
        )}
      </div>

      {/* Messages */}
      <div ref={chatScrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-accent-teal/10 flex items-center justify-center">
              <IconBot className="w-7 h-7 text-accent-teal" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-text-primary mb-1">Where are you flying?</h4>
              <p className="text-xs text-text-muted max-w-xs">
                Tell me your travel plans and I'll find the best flights for you.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {[
                'Cheapest flight to Nairobi',
                'Business class to Dubai',
                'Round trip London next month',
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setInput(suggestion);
                    inputRef.current?.focus();
                  }}
                  className="px-3 py-1.5 text-xs bg-bg-elevated border border-border-subtle rounded-full text-text-secondary hover:border-accent-teal/30 hover:text-text-primary transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id}>
            {msg.role === 'user' ? (
              /* User message */
              <div className="flex justify-end">
                <div className="max-w-[80%] px-4 py-2.5 bg-accent-teal text-bg-primary rounded-2xl rounded-br-md text-sm">
                  {msg.content}
                </div>
              </div>
            ) : (
              /* Assistant message */
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-bg-elevated flex items-center justify-center shrink-0 mt-0.5">
                  <IconBot className="w-3.5 h-3.5 text-accent-teal" />
                </div>
                <div className="max-w-[85%] space-y-3">
                  <div className="px-4 py-2.5 bg-bg-elevated rounded-2xl rounded-bl-md text-sm text-text-primary leading-relaxed">
                    {msg.content}
                  </div>

                  {/* Confirmation Card */}
                  {msg.searchIntent && (
                    <div className="bg-bg-secondary border border-accent-teal/20 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-2 text-xs text-accent-teal font-medium uppercase tracking-wide">
                        <IconPlane className="w-3.5 h-3.5" />
                        Trip Summary
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-semibold text-text-primary">
                            {msg.searchIntent.origin}
                          </span>
                          <IconArrowRight className="w-4 h-4 text-accent-teal" />
                          <span className="text-lg font-semibold text-text-primary">
                            {msg.searchIntent.destination}
                          </span>
                          {msg.searchIntent.tripType === 'return' && (
                            <span className="px-2 py-0.5 text-xs bg-accent-teal/10 text-accent-teal rounded">
                              Round trip
                            </span>
                          )}
                          {msg.searchIntent.tripType === 'oneway' && (
                            <span className="px-2 py-0.5 text-xs bg-accent-amber/10 text-accent-amber rounded">
                              One way
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-secondary">
                          <span className="flex items-center gap-1.5">
                            <IconCalendar className="w-3 h-3 text-text-muted" />
                            {msg.searchIntent.departureDate}
                            {msg.searchIntent.returnDate && ` — ${msg.searchIntent.returnDate}`}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <IconUsers className="w-3 h-3 text-text-muted" />
                            {totalPassengers(msg.searchIntent)} traveler{totalPassengers(msg.searchIntent) > 1 ? 's' : ''}
                          </span>
                          <span className="capitalize">{cabinLabel(msg.searchIntent.cabin)}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => handleConfirmSearch(msg.searchIntent!)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-accent-teal text-bg-primary text-sm font-medium rounded-lg hover:bg-accent-teal/90 transition-colors"
                        >
                          <IconSearch className="w-4 h-4" />
                          Confirm & Search
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-bg-elevated flex items-center justify-center shrink-0 mt-0.5">
              <IconBot className="w-3.5 h-3.5 text-accent-teal" />
            </div>
            <div className="px-4 py-3 bg-bg-elevated rounded-2xl rounded-bl-md">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="px-4 py-3 border-t border-border-subtle bg-bg-elevated/30">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell me where you want to fly..."
            disabled={isTyping}
            className="flex-1 px-4 py-2.5 bg-bg-elevated border border-border-subtle rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:border-accent-teal/50 transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="px-3.5 py-2.5 bg-accent-teal text-bg-primary rounded-xl hover:bg-accent-teal/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {isTyping ? (
              <IconLoader className="w-4 h-4 animate-spin" />
            ) : (
              <IconSend className="w-4 h-4" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
