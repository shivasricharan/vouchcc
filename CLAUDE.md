# Vouch CC — Project Context for Claude

## What is Vouch CC?

Vouch Customer Capture is a sales-forensics and lead-intelligence system built for service
businesses. The core insight: most businesses don't need more leads — they need to stop
losing the enquiries they already have.

Vouch captures, qualifies, tracks, and follows up on every lead that currently dies in
WhatsApp threads, phone calls, Instagram DMs, and manual notes.

---

## Brand Positioning

**Primary headline:** Stop losing leads in WhatsApp.

**Secondary framing:** Vouch turns scattered enquiries into a clear lead pipeline with
follow-up intelligence, drop-off visibility, and owner-level control.

**Tone:** Sharp, premium, founder-led, practical, business-first.
- Not generic SaaS.
- No excessive AI buzzwords.
- Speak directly to business owners, not marketing personas.

**Target users:**
- Interior designers
- Architects
- Design studios
- Consultants
- Service businesses with long sales cycles
- Businesses where enquiries come through WhatsApp, calls, Instagram, referrals, websites

---

## Tech Stack

| Layer         | Choice              |
|---------------|---------------------|
| Framework     | Next.js 14 (App Router) |
| Language      | TypeScript          |
| Styling       | Tailwind CSS v3     |
| Fonts         | Inter (Google Fonts) |
| Deployment    | Netlify             |
| Lead storage  | In-memory (API route placeholder — to be replaced) |

---

## Folder Structure

```
vouchcc/
├── app/
│   ├── globals.css          # Tailwind base + custom utilities
│   ├── layout.tsx           # Root layout with SEO metadata
│   ├── page.tsx             # Homepage — assembles all sections
│   └── api/
│       └── leads/
│           └── route.ts     # POST /api/leads — lead form handler
├── components/
│   ├── Navbar.tsx           # Fixed top nav with mobile hamburger
│   ├── HeroSection.tsx      # Hero with headline + CTAs + stats
│   ├── ProblemSection.tsx   # 6-card problem grid + stat callout
│   ├── ForensicsSection.tsx # Sales forensics value prop
│   ├── HowItWorksSection.tsx # 5-step process
│   ├── DashboardSection.tsx # Mock dashboard UI
│   ├── PilotSection.tsx     # Pilot offer + 3-feature cards
│   ├── TrustSection.tsx     # Privacy/trust section
│   ├── LeadForm.tsx         # Lead capture form (submits to /api/leads)
│   └── Footer.tsx           # Footer with links
├── public/                  # Static assets (add OG image, favicon here)
├── CLAUDE.md                # This file
├── README.md                # Developer setup instructions
├── .env.example             # Env vars template
├── netlify.toml             # Netlify build config
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Design System

**Colors (Tailwind custom):**
- `navy-900` (#0a0f1e) — page background
- `navy-800` (#0d1530) — card/section backgrounds
- `accent` (#2563eb) — primary CTA blue
- `accent-hover` (#1d4ed8) — hover state

**Key CSS utilities (defined in globals.css):**
- `.gradient-text` — blue-to-violet gradient text
- `.card-glow` — subtle blue glow on cards

---

## Lead Form

The form at `/components/LeadForm.tsx` submits to `/api/leads` via `POST`.

**Current storage:** In-memory array (resets on server restart — for demo only).

**To connect Google Sheets (recommended next step):**
1. Create a Google Sheet with columns: name, businessName, phone, email, businessType, city, leadSource, biggestProblem, interestedInPilot, submittedAt
2. Create a Google Cloud Service Account
3. Add credentials to `.env.local` (see `.env.example`)
4. Install `googleapis` package
5. Replace the in-memory push in `app/api/leads/route.ts` with a call to the Sheets API

**Alternative:** Connect to Supabase, Airtable, or a webhook to Zapier/Make.

---

## SEO

Metadata is set in `app/layout.tsx`:
- Title: `Vouch CC — Stop Losing Leads in WhatsApp`
- Description covers lead management, WhatsApp leads, interior design CRM
- Open Graph and Twitter card metadata included

**To add more:**
- Create `/app/sitemap.ts` for a dynamic sitemap
- Add `favicon.ico` and `og-image.png` to `/public`

---

## Build Rules

1. **No unnecessary dependencies.** Only add packages when absolutely needed.
2. **Mobile-first.** Every section must work on 375px screens.
3. **No fake data labelled as real.** Dashboard mock is clearly a preview, not live data.
4. **API route is a placeholder.** Clearly marked with TODO comments for real integrations.
5. **No comments explaining "what" code does.** Only "why" comments if non-obvious.
6. **App Router only.** Do not use `pages/` directory.

---

## Future Roadmap

### Phase 1 — Lead capture (current)
- Landing page live on Netlify
- Lead form submitting to API route
- Connect Google Sheets or Supabase for persistence

### Phase 2 — Lead management dashboard
- Auth (Next.js + Supabase or Auth.js)
- Real dashboard for business owners
- Lead CRUD: create, edit, stage changes, notes
- Team member assignment

### Phase 3 — Follow-up intelligence
- Follow-up due reminders (daily digest email)
- Lead age tracking (days since last contact)
- Source conversion analytics
- Stage drop-off funnel view

### Phase 4 — Integrations
- WhatsApp Business API for inbound capture
- Instagram DM capture (via Meta webhook)
- Google Sheets sync
- Zapier / Make webhook support

---

## Deployment (Netlify)

**Config file:** `netlify.toml`

**Steps:**
1. Push repo to GitHub
2. Connect repo in Netlify (Import project → GitHub)
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Install the `@netlify/plugin-nextjs` plugin (already in `netlify.toml`)
6. Add env vars from `.env.example` in Netlify dashboard → Site settings → Environment variables
7. Deploy

**Node version:** 20 (set in `netlify.toml`)

---

## Contact / Ownership

Built for Vouch CC. All lead data belongs to the business owner.
