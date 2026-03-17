# PCT Church Website

The Pillar of Cloud Tabernacle — church website built with Astro, React, Sanity CMS, and deployed on Vercel.

## Stack

| Layer | Tech |
|---|---|
| Framework | Astro 5 + React 18 |
| Styling | Tailwind CSS + Radix UI |
| CMS | Sanity (headless) |
| File storage | Cloudflare R2 (sermon PDFs) |
| Video | YouTube embeds only |
| Hosting | Vercel |

---

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/thanujnelapudi/PCT.git
cd PCT
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in all values. You need:
- `SANITY_PROJECT_ID` — from https://sanity.io/manage
- `SANITY_DATASET` — usually `production`
- `SANITY_API_TOKEN` — a **Viewer** token (read-only)
- `SANITY_WRITE_TOKEN` — an **Editor** token (for form submissions)

### 3. Create the Sanity project

```bash
cd sanity
npm install
npx sanity init   # Follow prompts — choose "Create new project"
```

Note the project ID shown, and update `SANITY_PROJECT_ID` in `.env`.

### 4. Deploy the Sanity schemas

```bash
# Still inside /sanity
npx sanity deploy
```

This publishes the Studio at `https://pct-church.sanity.studio`.

### 5. Seed initial data from CSVs

Copy your exported CSV files to the project root:
- `Service_Schedule.csv`
- `Worship_Songs.csv`

Then run:

```bash
cd sanity
npx tsx scripts/seed-from-csv.ts
```

### 6. Start the development server

```bash
# From project root
npm run dev
```

Open http://localhost:4321

---

## Adding content

Open the Sanity Studio:

```bash
cd sanity && npm run dev
# → http://localhost:3333
```

### Adding a sermon

1. Click **Sermons → New Sermon**
2. Fill in: Title, Speaker, Date, Topic, Tags
3. Paste the **YouTube Video ID** (11-char ID from the URL)
4. Upload the PDF to Cloudflare R2, paste the public URL into **Sermon Notes PDF**
5. Publish

### Adding a worship song

1. Click **Worship Songs → New Song**
2. Paste lyrics — Telugu Unicode is fully supported
3. Optionally add an Audio Link (YouTube or SoundCloud URL)
4. Publish

### Daily verse

1. Click **Daily Verse → New Daily Verse**
2. Set today's date
3. Either type the verse text OR upload a pre-designed verse image
4. Publish — it will appear on the home page automatically

---

## Uploading sermon PDFs to Cloudflare R2

1. Log in to https://dash.cloudflare.com → R2 Object Storage
2. Open your bucket (`pct-sermons`)
3. Upload the PDF file
4. Click the file → copy the **Public URL**
5. Paste that URL into the **Sermon Notes PDF** field in Sanity

---

## Updating visual assets

All background images, logos, and placeholder images are configured in **`config/design.json`**.

To change the hero background:
1. Add your new image to `public/backgrounds/`
2. Update `backgrounds.hero` in `config/design.json`

No code changes needed.

---

## Deploying to Vercel

```bash
# Install Vercel CLI if needed
npm i -g vercel

# From project root
vercel
```

Set these environment variables in the Vercel dashboard (Settings → Environment Variables):
- `SANITY_PROJECT_ID`
- `SANITY_DATASET`
- `SANITY_API_TOKEN`
- `SANITY_WRITE_TOKEN`
- `PUBLIC_YOUTUBE_CHANNEL_ID`

---

## Project structure

```
PCT/
├── config/
│   └── design.json          ← Visual assets & brand config (edit here)
├── integrations/
│   ├── cms/
│   │   ├── service.ts       ← BaseCrudService backed by Sanity
│   │   └── types.ts
│   └── members/             ← Auth stubs (for future use)
├── public/
│   ├── backgrounds/         ← Hero & section backgrounds
│   ├── fonts/               ← Self-hosted Playfair Display + Open Sans
│   ├── icons/               ← Favicon, app icons
│   └── images/              ← Logos, placeholders, verse images
├── sanity/
│   ├── schemaTypes/         ← All Sanity content schemas
│   └── scripts/
│       └── seed-from-csv.ts ← Import CSV data → Sanity
├── src/
│   ├── components/
│   │   ├── pages/           ← One React component per page
│   │   ├── ui/              ← Radix UI component library
│   │   ├── Header.tsx       ← Smart scroll-hide header + dark mode
│   │   └── Footer.tsx
│   ├── entities/            ← TypeScript interfaces (Wix-compat)
│   ├── lib/
│   │   └── sanity.ts        ← Sanity client + all GROQ query helpers
│   ├── pages/
│   │   └── [...slug].astro  ← Single Astro entry point
│   └── styles/
│       └── global.css       ← Tailwind + dark mode overrides
├── astro.config.mjs
├── tailwind.config.mjs
└── vercel.json
```

---

## Phase roadmap

- [x] **Phase 1** — Wix removed, Sanity schemas, Vercel config, data layer ← *current*
- [ ] **Phase 2** — True Astro pages (SSG), React Router removed
- [ ] **Phase 3** — Sermon system, PDF viewer, Fuse.js search
- [ ] **Phase 4** — Dark mode polish, scroll animations, daily verse fallback
- [ ] **Phase 5** — Production deployment, performance audit
