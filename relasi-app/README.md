# RELASI — Village Tourism Website (KKN Mekar Banjar)

RELASI is the public tourism website for the villages served by the KKN Mekar
Banjar community service program. Content publishing is handled by **KONEKSI**,
a Sanity Studio in the sibling `koneksi-cms/` folder.

Built per the PRD (v2.0): Next.js App Router + TypeScript, Tailwind CSS,
next-intl (bilingual `/id` + `/en`), Sanity (articles + wisata + desa), an
Instagram feed, and Vercel hosting.

> For the full handover guide (both apps, env vars, Instagram token, migrations),
> see the root [`../README.md`](../README.md).

## Local setup

```bash
npm install
copy .env.local.example .env.local   # then fill in the Sanity project values
node scripts/generate-placeholders.mjs   # only if placeholder images are missing
npm run dev
```

The site runs at http://localhost:3000 and redirects to `/id` (default locale).
Without Sanity credentials the article sections render an empty state — every
other page works fully offline.

## Project structure

| Path | Purpose |
|------|---------|
| `app/[locale]/` | The 6 nav sections (beranda, wisata, articles/[type], desa/[village], media/{galeri,buklet,peta}, about/*) |
| `components/` | UI components (navbar dropdowns, footer, cards, Portable Text renderer, lazy YouTube embed, flip-book, Instagram feed) |
| `lib/sanity/` | Sanity client, GROQ queries, image CDN URL builder |
| `lib/instagram.ts` | Instagram Graph API fetch (server-side, ISR, graceful fallback) |
| `data/` | **Hardcoded content** — booklet, gallery photos, maps, downloads |
| `messages/` | UI translation strings (`id.json`, `en.json`) |
| `public/images/` | Static photos (placeholder PNGs until real photos are added) |
| `public/files/` | Booklet PDFs and the downloadable guidebook (replace before launch) |

## How to edit hardcoded content

Each file in `data/` exports a TypeScript interface, so malformed entries fail
the build with a type error. (Wisata and Desa are NOT here — they live in Sanity.)

1. **Booklets** — edit `data/booklet.ts`. Cover + flip-book pages + a PDF under
   `public/files/booklets/`.
2. **Gallery photos** — edit `data/gallery.ts` (static-import from
   `public/images/gallery/`).
3. **Maps** — edit `data/maps.ts` (starts empty; add `public/files/maps/` assets).
4. **Downloads** — edit `data/downloads.ts` (after-movie YouTube URL + guidebook)
   and replace `public/files/guidebook.pdf`.

Commit and push to `main`; Vercel redeploys automatically.

## KONEKSI (Sanity Studio)

The studio lives in `../koneksi-cms`. Villagers manage six document types —
**Berita, Sejarah, Partnership, Liputan, Wisata, Desa** (plus **Kategori** for
Berita) — nothing else exists in Sanity by design.

```bash
cd ../koneksi-cms
npm install
copy .env.example .env    # fill in the same project ID
npm run dev                # local studio
npm run deploy             # deploy to <name>.sanity.studio
```

### Inviting / removing villager editors

In [sanity.io/manage](https://sanity.io/manage) → project → Members, invite the
villager's email with the **most restricted practical role** (Editor). The
shared KKN team email keeps the Administrator role.

### Publish latency (ISR)

Article pages revalidate every 60 seconds. For instant updates, add a Sanity
webhook (project → API → Webhooks) pointing at a Vercel deploy hook or an
on-demand revalidation endpoint.

## Deployment (Vercel)

1. Import the Git repository in Vercel using the **shared KKN team email**.
2. Set the root directory to `relasi-app`.
3. Add the environment variables from `.env.local.example`.
4. Every push to `main` deploys automatically.

## Handover checklist (PRD 7.2)

- Shared-email credentials + 2FA recovery codes
- Repository access
- This README
- Informal training session for the next team and villager editors

## Before launch

- Replace all placeholder PNGs in `public/images/` with real photos
- Replace `public/files/guidebook.pdf` (and the booklet PDFs) with real files
- Fill in the real after-movie URL in `data/downloads.ts`
- Configure `INSTAGRAM_ACCESS_TOKEN` + `NEXT_PUBLIC_INSTAGRAM_HANDLE`
- Update the village address/socials in `messages/*.json`
- Seed the 4 Desa documents and initial Wisata entries in KONEKSI
- Run Lighthouse (mobile) on Home, one article, and a wisata page — target ≥ 90
