# YesBroker — AI Estate OS (Frontend Prototype)

A luxury, AI-first real estate operating system frontend built on top of your existing backend (Vapi, n8n, Gemini, Qdrant, Supabase, Twilio). This is the **frontend only** — no backend logic was rebuilt or modified.

## Tech Stack
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4
- Framer Motion (animations, aurora background, floating cards)
- Lucide React (icons)
- Recharts (analytics dashboard)
- Supabase JS client (wired to your existing project)

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000

To build for production:
```bash
npm run build
npm start
```

## Project Structure

```
app/
  page.tsx                  Homepage (hero, AI search, featured properties, stats)
  marketplace/page.tsx      Property marketplace with filters
  property/[id]/page.tsx    Property detail page (AI investment score, booking)
  search/page.tsx           ChatGPT-style AI Property Discovery (RAG)
  voice-agent/page.tsx      Vapi AI Voice Agent center (live call demo, transcript, lead capture)
  negotiation/page.tsx      AI Negotiation Center (counter-offer engine)
  crm/page.tsx               CRM Dashboard (leads, calls, visits)
  analytics/page.tsx         Analytics Dashboard (Recharts: trends, funnel, sentiment)
  site-visits/page.tsx       Site Visit Dashboard (upcoming/completed/cancelled)
  whatsapp/page.tsx          WhatsApp Dashboard (Twilio conversation view)
  deal-room/page.tsx         Deal Room (timeline, documents — demo data)
  admin/page.tsx             Admin Panel (users, system status, activity log)
  api/                       API routes (properties, leads, ai/search, ai/negotiate, analytics, calls, site-visit)
lib/
  supabase.ts                Supabase client (pre-wired to your project URL)
  utils.ts                   Helpers + demo/fallback data
components/
  layout/Navbar.tsx          Main navigation with dashboard dropdown
```

## Connecting to Your Real Backend

### 1. Supabase
`lib/supabase.ts` already points at your Supabase project (from your screenshot: `whatsapp_messages`, `leads`, `call_logs`, `site_visits`, `properties`, `call_analytics`). API routes in `app/api/*` query Supabase first and fall back to demo data if a table is empty or the query fails — so the UI never looks broken during a live demo, but shows real data the moment your tables are populated.

To use your own keys via environment variables instead of the hardcoded fallback:
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```
Then update `lib/supabase.ts` to read from `process.env`.

### 2. Vapi Voice Agent (/voice-agent)
The page currently simulates a call with a scripted transcript so it looks great in demos with zero setup. To wire it to your real Vapi assistant:
- `npm install @vapi-ai/web`
- In `app/voice-agent/page.tsx`, replace the simulated `startCall`/`endCall` logic with real Vapi SDK calls (`vapi.start(assistantId)`, listen to `vapi.on('message', ...)` for live transcript events instead of the scripted array).
- Your n8n webhook ("Vapi Webhook" node) already handles call-started, lead-capture, property-query, negotiate, book-visit, handoff, and call-end events.

### 3. AI Property Search (/search)
`app/api/ai/search/route.ts` does simple keyword matching on demo properties. To connect to your real RAG pipeline (Gemini Embed -> Qdrant -> Gemini Property Answer), point this route at your n8n webhook URL for the property-query branch of your workflow.

### 4. AI Negotiation (/negotiation)
`app/api/ai/negotiate/route.ts` runs a ratio-based heuristic so the demo always returns sensible results instantly. To connect to your real Gemini Negotiate workflow, replace the heuristic with a fetch call to your n8n negotiate webhook branch.

### 5. WhatsApp (/whatsapp)
Currently shows demo conversation data. Wire a new `app/api/whatsapp/route.ts` to query your `whatsapp_messages` Supabase table, and use Twilio (or your existing n8n WhatsApp nodes) for sending.

## Design System
- Colors: Ivory/champagne gold palette over a near-black obsidian background (tailwind.config.ts)
- Glassmorphism: `.glass` and `.glass-strong` utility classes in globals.css
- Effects: Aurora background gradients, floating animated cards, gradient gold text, shimmer loading states
- All demo/mock data lives in `lib/utils.ts` — replace or extend as needed.

## Notes
- Every dashboard/API route gracefully falls back to realistic demo data if your Supabase tables are empty — the prototype is always demo-ready, and will automatically "go live" as you populate real data with zero frontend code changes required.
- No backend workflows, Supabase schema, or n8n logic were modified — this is purely the frontend layer described in your spec.
