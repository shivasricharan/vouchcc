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

# 4. Add your Google Apps Script URL to .env.local (see below)

# 5. Start development server
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
├── app/                         # Next.js App Router
│   ├── layout.tsx               # Root layout + SEO metadata
│   ├── page.tsx                 # Homepage
│   ├── globals.css              # Global styles + Tailwind
│   └── api/leads/               # Fallback API route (dev only)
├── components/                  # Page sections
│   ├── Navbar.tsx
│   ├── HeroSection.tsx
│   ├── ProblemSection.tsx
│   ├── ForensicsSection.tsx
│   ├── HowItWorksSection.tsx
│   ├── DashboardSection.tsx
│   ├── PilotSection.tsx
│   ├── TrustSection.tsx
│   ├── WhatsAppSection.tsx
│   ├── LeadForm.tsx
│   └── Footer.tsx
├── data/
│   ├── sample-leads.csv         # 30 sample leads for dashboard preview
│   └── sampleLeads.ts           # Typed export + computed dashboard stats
├── google-apps-script/
│   └── code.gs                  # Paste into Google Apps Script editor
├── public/                      # Static assets
├── CLAUDE.md                    # AI context + project docs
├── netlify.toml                 # Netlify deployment config
└── .env.example                 # Environment variables template
```

---

## Google Sheets Backend Setup

The lead form submits directly to a Google Apps Script web app which appends each row to a Google Sheet. No server needed — runs entirely on Google's infrastructure.

### Steps

1. Create a new Google Sheet at [sheets.google.com](https://sheets.google.com).
2. Open **Extensions → Apps Script**.
3. Delete any default code in the editor.
4. Paste the contents of `google-apps-script/code.gs` from this repo.
5. Click **Save** (Ctrl+S / Cmd+S).
6. Click **Deploy → New deployment**.
7. Click the gear icon next to "Select type" and choose **Web app**.
8. Set **Execute as**: Me.
9. Set **Who has access**: Anyone.
10. Click **Deploy**.
11. Copy the **Web App URL** shown after deployment.
12. Add it to Netlify: **Site settings → Environment variables → Add variable**:
    - Key: `NEXT_PUBLIC_GOOGLE_SCRIPT_URL`
    - Value: *(paste the Web App URL)*
13. Trigger a **Redeploy** on Netlify (or push a new commit).

### Sheet columns (auto-created on first submission)

| Column | Field |
|--------|-------|
| Timestamp | Submission date/time |
| Name | Lead's name |
| Business Name | Company or studio |
| Phone / WhatsApp | Contact number |
| Email | Email address |
| Business Type | e.g. Interior Designer |
| City | Location |
| Current Lead Source | WhatsApp / Instagram / etc. |
| Biggest Lead Problem | Free text |
| Interested in Pilot | Yes / Maybe / No |
| Source Page | Always "VouchCC Website" |
| Status | Always "New" on entry |

### Local development without the URL

If `NEXT_PUBLIC_GOOGLE_SCRIPT_URL` is not set in `.env.local`, the form falls back to the local `/api/leads` API route (in-memory, resets on restart). Submissions won't persist but the form UI works end-to-end for testing.

---

## Deploy on Netlify

1. Push repo to GitHub.
2. Go to [Netlify](https://netlify.com) → **Add new site → Import from GitHub**.
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Add `NEXT_PUBLIC_GOOGLE_SCRIPT_URL` in **Site settings → Environment variables**.
6. Click **Deploy**.

The `netlify.toml` and `@netlify/plugin-nextjs` handle the Next.js adapter automatically.

---

## Tech Stack

- **Next.js 14** — App Router
- **TypeScript** — type safety
- **Tailwind CSS** — utility-first styling
- **Inter** — font
- **Google Apps Script** — form submission backend (no external dependencies)

---

## License

Private. All rights reserved — Vouch CC.
