# BoardAndGo Web App

A modern flight search and booking management web application built with Next.js 16. Features real-time flight search, affiliate booking integration, automated Gmail booking sync, and a beautiful dark-themed UI.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Pages and Routes](#pages-and-routes)
- [Components](#components)
- [API Integration](#api-integration)
- [Authentication Flow](#authentication-flow)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Testing](#testing)

---

## Architecture Overview

```
                      BOARDANDGO FRONTEND
+----------------------------------------------------------+
|                                                          |
|   +--------------------------------------------------+   |
|   |              Next.js App Router                  |   |
|   +--------------------------------------------------+   |
|   |                                                  |   |
|   |   [Home]    [Search]    [Bookings]    [Auth]    |   |
|   |     |          |            |           |        |   |
|   |     +----------+------------+-----------+        |   |
|   |                     |                            |   |
|   |            +--------+--------+                   |   |
|   |            |  Auth Context   |                   |   |
|   |            | (JWT + State)   |                   |   |
|   |            +--------+--------+                   |   |
|   |                     |                            |   |
|   +---------------------|----------------------------+   |
|                         |                                |
|                         v                                |
|            +------------------------+                    |
|            |     API Client         |                    |
|            |   (src/lib/api.ts)     |                    |
|            +-----------+------------+                    |
|                        |                                 |
+------------------------|----------------------------------
                         |
                         v
              +--------------------+
              |  Backend Service   |
              |  (localhost:3000)  |
              +--------------------+
```

---

## Features

### Core Features

- **Flight Search**: Real-time search powered by Amadeus/Travelpayouts
- **Multi-trip Types**: One-way and round-trip support
- **Cabin Classes**: Economy, Premium Economy, Business, First
- **Passenger Selection**: Adults, children, infants
- **Price Comparison**: Multiple flight options with live pricing
- **Affiliate Booking**: Seamless redirect to Trip.com for booking
- **Booking History**: Track all your flight bookings
- **Gmail Sync**: Auto-import bookings from confirmation emails

### UI/UX Features

- **Dark Theme**: Modern dark color scheme with teal/amber accents
- **Responsive**: Optimized for desktop, tablet, and mobile
- **Real-time Loading**: Elegant loading states and spinners
- **Input Validation**: Client-side form validation
- **Error Handling**: User-friendly error messages

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State | React Context + useState |
| HTTP | Native fetch API |
| Auth | JWT (localStorage) |
| Testing | Playwright E2E |
| Package Manager | pnpm |

---

## Pages and Routes

### Public Routes

| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.tsx` | Home page with flight search form |
| `/login` | `app/login/page.tsx` | User login |
| `/register` | `app/register/page.tsx` | New user registration |

### Protected Routes

| Route | File | Description |
|-------|------|-------------|
| `/search` | `app/search/page.tsx` | Flight search results |
| `/bookings` | `app/bookings/page.tsx` | User booking history |
| `/bookings/[id]` | `app/bookings/[id]/page.tsx` | Booking details |

---

## Components

### Layout Components

**Header** (`components/header.tsx`)
- Logo and branding
- Navigation links
- Auth state (Login/Logout)
- Responsive mobile menu

**Footer** (`components/footer.tsx`)
- Company info
- Links
- Copyright

### Feature Components

**FlightSearch** (`components/flight-search.tsx`)
```
+--------------------------------------------------+
|  Trip Type: [One-way] [Round-trip]               |
+--------------------------------------------------+
|  From: [JFK]          To: [LHR]                  |
+--------------------------------------------------+
|  Depart: [2026-03-15]  Return: [2026-03-22]     |
+--------------------------------------------------+
|  Adults: [1]  Children: [0]  Infants: [0]       |
+--------------------------------------------------+
|  Cabin: [Economy v]                              |
+--------------------------------------------------+
|              [ Search Flights ]                  |
+--------------------------------------------------+
```

**Icons** (`components/icons.tsx`)
- Custom SVG icon components
- Plane, Calendar, Users, Arrow, Loader, etc.

---

## API Integration

All API calls go through `src/lib/api.ts`:

### Auth Endpoints

```typescript
api.auth.register(email, password, name)  // POST /api/auth/register
api.auth.login(email, password)           // POST /api/auth/login
```

### Flight Endpoints

```typescript
api.flights.search(params, token)         // POST /api/search/flights
api.flights.trackBookClick(params, token) // POST /api/search/track-book-click
```

### Booking Endpoints

```typescript
api.bookings.list(token)                  // GET /api/bookings
api.bookings.get(id, token)               // GET /api/bookings/:id
api.bookings.create(booking, token)       // POST /api/bookings/manual
```

### Gmail Endpoints

```typescript
api.gmail.getAuthUrl(token)               // GET /api/gmail/authorize
```

### TypeScript Interfaces

```typescript
interface FlightSearchParams {
  tripType: 'oneway' | 'return';
  origin: string;      // IATA code (JFK)
  destination: string; // IATA code (LHR)
  departureDate: string;
  returnDate?: string;
  adults: number;
  children?: number;
  infants?: number;
  cabin?: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
}

interface FlightOffer {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  returnDepartureTime?: string;
  returnArrivalTime?: string;
  price: number;
  currency: string;
  stops: number;
  duration: string;
  cabin: string;
  affiliateUrl: string;
}
```

---

## Authentication Flow

```
User visits protected page
         |
         v
+-------------------+
| Check AuthContext |
+-------------------+
         |
    +----+----+
    |         |
    v         v
[No Token]  [Has Token]
    |            |
    v            v
Redirect    Validate
to /login   JWT expiry
    |            |
    |       +----+----+
    |       |         |
    |       v         v
    |   [Valid]   [Expired]
    |       |         |
    |       v         |
    |   Render page   |
    |                 v
    +--------<--------+
             |
             v
        Clear token
        Redirect to /login
```

### Token Storage

```typescript
// On login/register
localStorage.setItem('token', response.token);
localStorage.setItem('user', JSON.stringify(response.user));

// On logout
localStorage.removeItem('token');
localStorage.removeItem('user');
```

---

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

For production:

```env
NEXT_PUBLIC_API_URL=https://api.boardandgo.com
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (recommended)
- Backend service running on port 3000

### Installation

```bash
# Clone the repo
git clone https://github.com/BoardAndGoHQ/boardandgo-webapp.git
cd boardandgo-webapp

# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

Open [http://localhost:3002](http://localhost:3002)

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm run dev` | Start dev server (port 3002) |
| `pnpm run build` | Production build |
| `pnpm run start` | Run production build |
| `pnpm run lint` | Run ESLint |
| `pnpm exec playwright test` | Run E2E tests |

---

## Project Structure

```
boardandgo-webapp/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout (providers)
│   │   ├── page.tsx            # Home page
│   │   ├── globals.css         # Global styles
│   │   ├── login/
│   │   │   └── page.tsx        # Login page
│   │   ├── register/
│   │   │   └── page.tsx        # Register page
│   │   ├── search/
│   │   │   └── page.tsx        # Search results
│   │   └── bookings/
│   │       ├── page.tsx        # Booking list
│   │       └── [id]/
│   │           └── page.tsx    # Booking detail
│   ├── components/
│   │   ├── header.tsx          # Site header
│   │   ├── footer.tsx          # Site footer
│   │   ├── flight-search.tsx   # Search form
│   │   └── icons.tsx           # SVG icons
│   ├── context/
│   │   └── auth-context.tsx    # Auth state provider
│   └── lib/
│       └── api.ts              # API client
├── tests/
│   └── e2e/
│       └── *.spec.ts           # Playwright tests
├── public/
├── tailwind.config.ts
├── next.config.ts
├── package.json
└── README.md
```

---

## Testing

### E2E Tests with Playwright

```bash
# Run all tests
pnpm exec playwright test

# Run with UI
pnpm exec playwright test --ui

# Run specific test file
pnpm exec playwright test tests/e2e/auth.spec.ts
```

### Test Coverage

| Test Suite | Coverage |
|------------|----------|
| Auth (login/register) | Registration, login, logout flow |
| Flight Search | Search form, results display |
| Navigation | Header links, protected routes |
| Error States | API errors, validation errors |

---

## Color Scheme

```css
/* Dark theme colors */
--bg-primary: #0d1117;      /* Main background */
--bg-card: #161b22;         /* Card backgrounds */
--text-primary: #f0f6fc;    /* Main text */
--text-secondary: #8b949e;  /* Secondary text */
--text-muted: #6e7681;      /* Muted text */
--accent-teal: #2dd4bf;     /* Primary accent */
--accent-amber: #fbbf24;    /* Warning/highlight */
--border-subtle: #30363d;   /* Borders */
```

---

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm run build
EXPOSE 3002
CMD ["pnpm", "start"]
```

---

## License

Proprietary - BoardAndGo HQ
