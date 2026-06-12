# Vouch CC — Lead Intelligence for Service Businesses

**Stop losing leads in WhatsApp.**

Vouch helps interior designers, architects, studios, and consultants capture, qualify, track,
and follow up on every enquiry before it goes cold.

---

## Quick Start

### Prerequisites
- Node.js 18 or higher
- npm 9 or higher

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/shivasricharan/vouchcc.git
cd vouchcc

# 2. Install dependencies
npm install

# 3. Copy env template
cp .env.example .env.local

# 4. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Project Structure

```
vouchcc/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout + SEO metadata
│   ├── page.tsx            # Homepage
│   ├── globals.css         # Global styles + Tailwind
│   └── api/leads/          # Lead form API route
├── components/             # Page sections
│   ├── Navbar.tsx
│   ├── HeroSection.tsx
│   ├── ProblemSection.tsx
│   ├── ForensicsSection.tsx
│   ├── HowItWorksSection.tsx
│   ├── DashboardSection.tsx
│   ├── PilotSection.tsx
│   ├── TrustSection.tsx
│   ├── LeadForm.tsx
│   └── Footer.tsx
├── public/                 # Static assets
├── CLAUDE.md               # AI context + project docs
├── netlify.toml            # Netlify deployment config
└── .env.example            # Environment variables template
```

---

## Lead Form API

The form at `/api/leads` currently stores submissions in memory (resets on restart).

**To persist leads, connect one of:**
- **Google Sheets** — add the `googleapis` package and service account credentials
- **Supabase** — free Postgres with REST API
- **Airtable** — no-code database with API
- **Webhook** — send to Zapier, Make.com, or any endpoint

See `CLAUDE.md` for detailed integration steps.

---

## Deploy on Netlify

1. Push to GitHub
2. Go to [Netlify](https://netlify.com) → Add new site → Import from GitHub
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Add environment variables from `.env.example`
6. Deploy

The `netlify.toml` and `@netlify/plugin-nextjs` handle the Next.js adapter automatically.

---

## Tech Stack

- **Next.js 14** — App Router
- **TypeScript** — type safety
- **Tailwind CSS** — utility-first styling
- **Inter** — font

---

## License

Private. All rights reserved — Vouch CC.
