# Products Hub — Frontend

A modern Product Hunt clone built with Next.js 16, React 19, and TypeScript. Discover, share, and upvote the best new products — with real-time updates, optimistic interactions, and server-side rendering.

---

## 🔗 Links

- 🌐 **Live Site:** [products-hub.vercel.app](https://products-hunt-frontend.vercel.app)
- ⚙️ **Backend API:** [api.products-hub.com](https://github.com/Tanvir4312/products-hub-backend)

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16.2.3 (App Router) |
| Language | TypeScript |
| Runtime | Bun |
| UI | React 19, Tailwind CSS v4, shadcn/ui |
| Animation | Framer Motion |
| Data Fetching | TanStack Query v5 |
| Forms | TanStack Form, React Hook Form, Zod |
| Tables | TanStack Table |
| Charts | Recharts |
| Auth | Better Auth, JWT |
| HTTP Client | Axios |
| AI Assistant | Google Generative AI (AI SDK) |
| Real-time | Server-Sent Events (SSE) |
| Icons | Lucide React, React Icons |

---

## Key Features

### 1. Server Components with ISR Caching
The products listing page is a Next.js Server Component that fetches data directly on the server with `revalidate: 60` — meaning the page is cached and refreshed every 60 seconds automatically. This gives:
- Faster initial page load
- Better SEO (Google sees full HTML content)
- Reduced client-side JavaScript

The interactive parts (filters, sorting, pagination) are split into a separate Client Component (`ProductsClient.tsx`) that receives the initial data as props.

### 2. Optimistic UI for Upvoting
Upvoting a product updates the count **instantly** in the UI — before the server responds. Built with TanStack Query's `useMutation`:
- `onMutate` — immediately updates the vote count
- `onError` — rolls back to the original count if the API fails
- `onSettled` — syncs with the real server data
- Prevents double-clicking via `isPending` state

### 3. Real-time Activity Feed (SSE)
A live activity feed on the homepage shows community activity in real time — no page refresh needed. When any user upvotes a product, all connected users see it instantly.

Built with Server-Sent Events (SSE):
- `GET /api/feed` — clients connect and listen for events
- `POST /api/feed` — server broadcasts events to all connected clients
- 30-second heartbeat to keep connections alive
- Auto-reconnects if the connection drops

---

## Project Structure

```
src/
├── app/
│   ├── (authLayout)/          # Login, Register pages
│   ├── (commonLayout)/        # Public pages (Home, Products, Tags)
│   │   ├── page.tsx           # Homepage (Server Component)
│   │   └── products/
│   │       └── page.tsx       # Products page (Server Component + ISR)
│   ├── (dashboardLayout)/     # Admin, Moderator, User dashboards
│   └── api/
│       └── feed/
│           └── route.ts       # SSE endpoint for real-time feed
├── components/
│   ├── modules/
│   │   ├── Home_Page/
│   │   │   ├── ActivityFeed/  # Real-time activity feed widget
│   │   │   ├── FeaturedProducts/
│   │   │   ├── MostVotedProducts/
│   │   │   ├── NewReleases/
│   │   │   └── Leaderboard/
│   │   ├── Products/
│   │   │   └── ProductsClient.tsx  # Client Component for filters/pagination
│   │   ├── auth/              # Login, Register forms
│   │   ├── Chat/              # AI Chat Assistant
│   │   └── Dasboard/          # Dashboard components (Admin/Moderator/User)
│   ├── shared/
│   │   └── ProductCard/       # Reusable product card with upvote
│   └── ui/                    # shadcn/ui components
├── hooks/                     # TanStack Query hooks
│   ├── useProducts.ts
│   ├── useVote.ts             # Optimistic upvote logic
│   └── ...
├── services/                  # API call functions
├── lib/
│   ├── axios/httpClient.ts    # Axios instance with auth headers
│   └── sse/broadcast.ts      # SSE broadcast helper
├── providers/
│   ├── QueryProvider.tsx      # TanStack Query provider
│   └── ThemeProvider.tsx      # Dark/light theme
└── types/                     # TypeScript type definitions
```

---

## Getting Started

### Prerequisites
- [Bun](https://bun.sh) installed
- Backend API running (see environment variables)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd products-hunt-frontend

# Install dependencies
bun install
```

### Environment Variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_API_BASE_URL=your_api_base_url
NEXT_PUBLIC_BACKEND_API=your_backend_url
```

### Running Locally

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
bun build
bun start
```

---

## Testing the 3 Key Features

### Feature 1 — Server Components
1. Go to `localhost:3000/products`
2. Right-click → **View Page Source**
3. You should see full product HTML in the source (not an empty div)
4. ✅ Server Components working

### Feature 2 — Optimistic UI
1. Login to your account
2. Click upvote on any product
3. The count should increase **instantly** before the API responds
4. To test rollback: disconnect internet, click upvote — count reverts
5. ✅ Optimistic UI working

### Feature 3 — Real-time Activity Feed
1. Open two browser tabs: both on `localhost:3000`
2. In Tab 2, go to any product and upvote it
3. In Tab 1, the Live Activity section should update instantly
4. To verify SSE connection: DevTools → Network → find `feed` request → Type should be `eventsource`, Status `200`
5. ✅ Real-time feed working

---

## User Roles

| Role | Access |
|---|---|
| Guest | Browse products, view details |
| User | Upvote, submit products, manage profile |
| Moderator | Review & approve submitted products |
| Admin | Full dashboard — users, tags, coupons, reports |

---

## Image Hosting

Images are served from:
- [Cloudinary](https://cloudinary.com) — product images
- [Unsplash](https://unsplash.com) — placeholder images
- Google (for OAuth profile pictures)

---

## Deployment

Deployed on [Vercel](https://vercel.com). The `next.config.ts` includes API rewrites:

```
/api/auth/*  →  Backend auth routes
/api/v1/*    →  Main backend API
```
