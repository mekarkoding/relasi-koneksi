# RELASI + KONEKSI — Handover Guide

RELASI is the public tourism website for the **Adat Dalem Tamblingan** region
(villages Gobleg, Munduk, Gesing, Umejero), built by the KKN Mekar Banjar team.
Content is published through **KONEKSI**, a Sanity Studio.

Built per **PRD v2.0**: Next.js App Router + TypeScript, Tailwind CSS, next-intl
(bilingual `/id` + `/en`), Sanity CMS, an Instagram feed, and Vercel hosting.

## Repository layout

| Folder | What it is |
|--------|------------|
| `relasi-app/` | The Next.js website (RELASI) |
| `koneksi-cms/` | The Sanity Studio (KONEKSI) villagers use to publish |

## Content model (v2.0)

| Content | Managed in | Editable by villagers |
|---------|-----------|-----------------------|
| Articles: Berita / Sejarah / Partnership / Liputan | Sanity | ✅ |
| Categories (Kategori) | Sanity | ✅ (Berita only) |
| Wisata (attractions) | Sanity | ✅ |
| Desa (4 fixed villages) | Sanity | ✅ (content only) |
| Booklets | `relasi-app/data/booklet.ts` | ❌ (code) |
| Gallery photos | Sanity (`galeri`) | ✅ |
| Beranda backgrounds | Sanity (`beranda` singleton) | ✅ |
| Maps | `relasi-app/data/maps.ts` | ❌ (code) |
| After-movie + guidebook | `relasi-app/data/downloads.ts` | ❌ (code) |
| Instagram feed | Instagram Graph API (read-only) | ❌ |

## Local setup

### Website (RELASI)

```bash
cd relasi-app
npm install
copy .env.local.example .env.local   # then fill in the values below
npm run dev                           # http://localhost:3000  (redirects to /id)
```

Environment variables (`relasi-app/.env.local`):

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project id |
| `NEXT_PUBLIC_SANITY_DATASET` | Usually `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | e.g. `2026-07-01` |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (for SEO/sitemap) |
| `INSTAGRAM_ACCESS_TOKEN` | Long-lived Instagram Graph API token (server-only) |
| `NEXT_PUBLIC_INSTAGRAM_HANDLE` | Handle without `@` (follow button + fallback) |

Without Sanity credentials the CMS-driven sections render an empty state, and
without an Instagram token the feed falls back to a "Follow us" button — every
page still builds and works.

### Studio (KONEKSI)

```bash
cd koneksi-cms
npm install
copy .env.example .env    # SANITY_STUDIO_PROJECT_ID + SANITY_STUDIO_DATASET
npm run dev               # local studio
npm run deploy            # deploy to <name>.sanity.studio
```

## Editing hardcoded content

Each file in `relasi-app/data/` exports a TypeScript interface, so
malformed entries fail the build. After editing, commit and push to `main`;
Vercel redeploys automatically.

1. **Booklets** — `data/booklet.ts`. Cover + flip-book pages + a PDF under
   `public/files/booklets/`.
2. **Maps** — `data/maps.ts`. Add `public/files/maps/` assets, static-import
   image maps, then add entries (`fileType: 'image' | 'pdf'`). Starts empty.
3. **After-movie + guidebook** — `data/downloads.ts`. Set the YouTube URL and
   replace `public/files/guidebook.pdf`.

Gallery photos are published in **KONEKSI → Galeri** (one document per photo),
not in code.

## KONEKSI (Sanity) admin

Villagers manage: **Berita, Sejarah, Partnership, Liputan, Wisata, Desa, Galeri**,
plus **Latar Beranda** (singleton backgrounds) and **Kategori** for Berita.
Booklets, maps, and downloads remain code.

- **Desa** must be seeded once as four documents (Gobleg, Munduk, Gesing,
  Umejero); do not create extras or change a `villageName`.
- **Wisata** and **Galeri** only appear on the site after **Publish** in Sanity
  Studio (native draft/publish — same as articles).
- **Latar Beranda** is a single document (Hero / Instagram / Wisata / Desa /
  After-movie backgrounds). Article pages are not included — leave them as-is.
- **Inviting editors:** [sanity.io/manage](https://sanity.io/manage) → project →
  Members → invite with the **Editor** role. Keep the shared KKN email as Admin.
- **Publish latency:** CMS pages revalidate every 60s (ISR). For instant
  updates, add a Sanity webhook → Vercel deploy hook.

### Legacy article migration

If migrating from v1 `article` documents to `artikel_berita`:

```bash
cd koneksi-cms
npm run migrate:article-blocks        # only if legacy docs still use body_id/body_en
npm run migrate:article-to-berita     # converts article -> artikel_berita
```

## Refreshing the Instagram token

The Graph API long-lived token expires after ~60 days.

1. In the Meta developer app, generate/refresh a **long-lived** Instagram token.
2. Update `INSTAGRAM_ACCESS_TOKEN` in Vercel (Project → Settings → Environment
   Variables) and redeploy.
3. Set a calendar reminder ~every 50 days. If the token lapses, the feed simply
   falls back to the follow button — it never breaks the page.

## Deployment (Vercel)

1. Import the Git repo in Vercel using the **shared KKN team email**.
2. Set the root directory to `relasi-app`.
3. Add the environment variables above.
4. Every push to `main` deploys automatically.

## Handover checklist (PRD 7.3)

- Shared-email credentials + 2FA recovery codes (Vercel, Sanity, Meta/Instagram)
- Repository access
- This README + an informal training session for the next team and editors
- Seed the 4 Desa documents and initial Wisata entries
- Replace placeholder images/PDFs, set the real after-movie URL, and configure
  the Instagram token before launch
- Run Lighthouse (mobile) on Home, an article, and a wisata page — target ≥ 90
