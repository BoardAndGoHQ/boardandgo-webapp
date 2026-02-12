/**
 * Behavioral Event Tracker — Retention instrumentation
 *
 * Fire-and-forget event logging. Non-blocking, swallows errors.
 * Events: search_started, search_completed, book_clicked,
 * gmail_connected, booking_created, flight_tracked, dashboard_viewed
 */

import { api } from '@/lib/api';

type EventName =
  | 'search_started'
  | 'search_completed'
  | 'book_clicked'
  | 'gmail_connected'
  | 'booking_created'
  | 'flight_tracked'
  | 'dashboard_viewed'
  | 'track_page_viewed'
  | 'intelligence_expanded';

/**
 * Log a behavioral event. Fire-and-forget — never throws.
 */
export function trackEvent(
  eventName: EventName,
  properties?: Record<string, unknown>,
  token?: string | null,
): void {
  if (!token) return; // Must be authenticated
  api.events.track(eventName, properties, token).catch(() => {});
}
