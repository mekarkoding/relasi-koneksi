# RELASI — Village Tourism Website (KKN Mekar Banjar)

RELASI is the public tourism website for the villages served by the KKN Mekar
Banjar community service program. Content publishing is handled by **KONEKSI**,
a Sanity Studio in the sibling `koneksi-studio/` folder.

Built per the PRD (v1.0, MVP): Next.js App Router + TypeScript, Tailwind CSS,
next-intl (bilingual `/id` + `/en`), Sanity (articles only), Vercel hosting.

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
| `app/[locale]/` | The 7 public routes (home, attractions, homestay, articles, booklet, downloads, about) |
| `components/` | UI components (navbar, footer, cards, Portable Text renderer, lazy YouTube embed, flip-book) |
| `lib/sanity/` | Sanity client, GROQ queries, image CDN URL builder |
| `data/` | **Hardcoded content** — edit these files to update homestays, attractions, booklet, downloads |
| `messages/` | UI translation strings (`id.json`, `en.json`) |
| `public/images/` | Static photos (placeholder PNGs until real photos are added) |
| `public/files/guidebook.pdf` | The downloadable guidebook (placeholder — replace before launch) |

## How to edit hardcoded content

Each file in `data/` exports a TypeScript interface, so malformed entries fail
the build with a type error.

1. **Homestays** — edit `data/homestays.ts`. Put photos in
   `public/images/homestays/`, import them at the top of the file, and add an
   entry to the array. The WhatsApp number uses international format without
   `+` (e.g. `6281234567890`).
2. **Attractions** — edit `data/attractions.ts` (same pattern; `slug` becomes
   the detail-page URL).
3. **Flora & fauna booklet** — edit `data/booklet.ts`.
4. **Downloads** — edit `data/downloads.ts` (after-movie YouTube URL) and
   replace `public/files/guidebook.pdf`.

Commit and push to `main`; Vercel redeploys automatically.

## KONEKSI (Sanity Studio)

The studio lives in `../koneksi-studio`. Villagers can only create **articles**
and select/create **categories** — nothing else exists in Sanity by design.

```bash
cd ../koneksi-studio
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
2. Set the root directory to `relasi-koneksi-app`.
3. Add the environment variables from `.env.local.example`.
4. Every push to `main` deploys automatically.

## Handover checklist (PRD 7.2)

- Shared-email credentials + 2FA recovery codes
- Repository access
- This README
- Informal training session for the next team and villager editors

## Before launch

- Replace all placeholder PNGs in `public/images/` with real photos
- Replace `public/files/guidebook.pdf` with the real guidebook
- Fill in the real after-movie URL in `data/downloads.ts`
- Update the village address/socials in `messages/*.json` and `components/Footer.tsx`
- Seed article categories in KONEKSI (e.g. Berita, Acara, Cerita Desa)
- Run Lighthouse (mobile) on Home, one article, and Homestay — target ≥ 90
