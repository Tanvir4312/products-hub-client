# Products Hub — Frontend

A modern Product Hunt clone built with Next.js 16, React 19, and TypeScript. Discover, share, and upvote the best new products — with real-time updates, optimistic interactions, and server-side rendering.

## About The Project

In today's AI-driven world, thousands of products — especially AI tools — are scattered across the internet. Finding the right tool at the right time is nearly impossible for most people.

**Products Hub** solves this problem by bringing everything into one place. It is a community-driven product discovery platform where users can explore, share, and upvote the best products available on the internet — with direct links to their official websites.

Whether you are a developer, a startup founder, or someone who simply works with AI tools every day — Products Hub gives you a single destination to discover what's trending, what's useful, and what's new.

**Key highlights:**
- Users can add any product (especially AI tools) with a link to the original website
- Browse and discover products across categories — all in one platform
- Upvote your favorites to help others find the best tools
- Affordable subscription to access **Featured Products** — handpicked top tools
- Affordable subscription to **publish your own product** and reach a wider audience
- Built for everyone — from AI enthusiasts to everyday users

---

## 🔗 Links

- 🌐 **Live Site:** [Products Hunt](https://products-hunt-frontend.vercel.app)
- 🖥️ **Backend:** [Products Hunt Backend](https://github.com/Tanvir4312/products-hub-backend)

---

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
| AI Provider | Groq (LLaMA 3.3 70B) |
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
A live activity feed on the admin dashboard shows community activity in real time — no page refresh needed. When any user upvotes a product, the admin sees it instantly without reloading the page.

Built with Server-Sent Events (SSE):
- `GET /api/feed` — clients connect and listen for events
- `POST /api/feed` — server broadcasts events to all connected clients
- 30-second heartbeat to keep connections alive
- Auto-reconnects if the connection drops

---

## AI Features

All AI features use **Groq** (LLaMA 3.3 70B) with structured JSON outputs, loading states, and error handling.

### 1. AI Chat Assistant
A context-aware chatbot embedded in the app. Users can ask questions about products, get recommendations, or get help navigating the platform.
- Powered by Groq (LLaMA 3.3 70B) via backend API (`/api/v1/chat`)
- Maintains conversation context
- Located in `src/components/modules/Chat/`

### 2. AI Product Description Generator
When submitting a new product, users can click **"Generate with AI"** next to the description field. After filling in the product name and category, Gemini generates a professional description and tagline instantly.
- Structured output: `{ description: string, tagline: string }`
- Loading spinner while generating
- Error handling with toast notification
- Located in `src/app/(dashboardLayout)/user/dashboard/add-product/`

### 3. AI Smart Recommendations
On the homepage, the app analyzes the current user's upvote history and sends it to Gemini to recommend similar product categories and keywords. Those are then used to fetch relevant products from the API.
- Structured output: `{ recommendedCategories: string[], keywords: string[] }`
- Loading skeleton while fetching
- Falls back to most-voted products on error
- Located in `src/components/shared/RecommendedContent.tsx`

### 4. AI Auto Tagging
When submitting a product, users can click **"Suggest Tags with AI"** after filling in the name and description. Gemini suggests 3–5 relevant tags, matched against existing tags in the system. Each suggestion appears as a clickable chip — accept or reject individually.
- Structured output: `{ suggestedTags: string[] }`
- Matched against existing tags from the database
- Located in `src/app/(dashboardLayout)/user/dashboard/add-product/`

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
GROQ_API_KEY=your_groq_api_key
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

## Testing the AI Features

### AI Chat Assistant
1. Open any page — click the chat icon
2. Ask: "What are the best AI products?"
3. Should respond with context-aware answer
4. ✅ Working if response appears without errors

### AI Product Description Generator
1. Login → User Dashboard → Add Product
2. Fill in product name and category
3. Click **"Generate with AI"** next to description
4. Should show loading spinner, then fill the description field
5. ✅ Working if description auto-fills

### AI Smart Recommendations
1. Upvote a few products first
2. Go to Homepage — scroll to Recommended section
3. Should show products related to your upvote history
4. ✅ Working if recommendations match your interests

### AI Auto Tagging
1. Login → User Dashboard → Add Product
2. Fill in product name and description
3. Click **"Suggest Tags with AI"** next to tags field
4. Should show 3–5 clickable tag chips
5. Click to accept tags, click again to reject
6. ✅ Working if relevant tags appear as chips

---

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
