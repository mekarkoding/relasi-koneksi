# Product Requirements Document
## RELASI — Village Tourism Website + KONEKSI — Integrated Content Management System (Sanity)
### Adat Dalem Tamblingan

| Field | Value |
|---|---|
| Program | KKN Mekar Banjar — Community Service Program |
| Document purpose | Master rulebook for AI coding assistants (Cursor / Antigravity). All instructions herein are binding. Where this document is silent, the AI developer MUST ask the human team before making assumptions. |
| Version | 2.0 (MVP scope — revised) |
| Date | 15 July 2026 |
| MVP deadline | Before end of July 2026 (hard deadline) |
| Status | Approved for development |

---

## How the AI Developer Must Use This Document

- This PRD is the single source of truth. Do not invent features, pages, fields, or libraries not specified here.
- Boxes marked **■ STRICT RULE** are non-negotiable constraints. Violating them is a failed implementation.
- If a requirement is ambiguous or missing, stop and ask the human team. Never guess.
- Scope discipline: anything labelled "Out of scope" must not be built, scaffolded, or stubbed, even partially.

---

## 1. Project Overview & Goals

### 1.1 Background

RELASI is a tourism promotion website for the villages of Adat Dalem Tamblingan served by the KKN Mekar Banjar community service program. It introduces village tourist attractions, the four villages (Gobleg, Munduk, Gesing, Umejero), and local nature (flora & fauna) to domestic and international visitors.

KONEKSI is the integrated content management layer, built on Sanity (headless CMS). It lets local villagers publish articles and manage wisata entries through a clean editor without writing any code.

The project starts from scratch. The previous team's website failed because it was poorly structured, slow (heavy unoptimized images), and built without planning. This PRD exists specifically to prevent a repeat of those failures. Content will be migrated from the previous website — the structure there is messy but the content is complete.

### 1.2 Goals

| # | Goal | How this PRD enforces it |
|---|---|---|
| G1 | Fast, lightweight website on any connection (rural mobile networks included). | Mandatory next/image usage, Lighthouse ≥ 90 mobile target (Section 7). |
| G2 | Villagers publish content independently, zero code. | KONEKSI CMS scoped to articles and wisata only (Sections 4.3, 6). |
| G3 | Reach both Indonesian and international audiences. | Bilingual ID/EN with subpath routing (Section 4.1). |
| G4 | Clean handover to the next KKN team after 1 year. | Shared-email account ownership and handover protocol (Section 7). |

### 1.3 Non-Goals (Out of Scope for MVP)

- No internal booking / payment / reservation system.
- No user accounts, login, comments, or membership on the public website.
- No villager CMS access beyond articles and wisata entries (no page editing, no file management, no desa data editing beyond the CMS schema provided).
- No self-hosted video. All video embedded from YouTube.
- No native mobile app. Responsive web only.
- **No homestay feature. Removed entirely from v2.0.**

---

## 2. Target Audience

| User type | Who they are | Primary needs | Device / context |
|---|---|---|---|
| Tourist — domestic | Indonesian travelers researching the village before visiting. | Attraction info, articles/news, village info, booklet, maps, downloadable guidebook. | Mostly mobile, variable connection. Default language: Indonesian. |
| Tourist — international | Foreign travelers discovering the village online. | Same as above, in English. Clear visuals compensating for language gaps. | Mobile + desktop. Switches to English via language switcher. |
| Villager (KONEKSI CMS user) | Local residents with no coding skills, possibly limited digital literacy. | Write and publish articles (4 types) and wisata entries through a simple editor only. | Shared computers or phones. Uses Sanity Studio; never touches code or hosting. |
| KKN team / next team (maintainer) | Students who deploy, maintain, and eventually hand over the project. | Clean codebase, documented setup, easy content editing via CMS and code files. | Developer environment (VS Code / Cursor). |

---

## 3. Tech Stack & Architecture Rules

### 3.1 Approved Stack (exhaustive — do not add without approval)

| Layer | Technology | Notes / constraints |
|---|---|---|
| Framework | Next.js (App Router, latest stable) | TypeScript required. App Router only — do not use Pages Router. |
| Styling | Tailwind CSS | No other CSS frameworks. No styled-components, no CSS-in-JS libraries. |
| CMS | Sanity (headless) — branded "KONEKSI" | Sanity Studio deployed for villager access. Free tier. |
| Internationalization | next-intl | Subpath routing /id and /en. See Section 4.1. |
| Rich text rendering | @portabletext/react | Official Portable Text renderer. See STRICT RULE in Section 4.3. |
| Video | YouTube embeds only | Lazy-loaded embeds (lite-youtube-embed pattern or next/dynamic). |
| Flip-book | react-pageflip (or equivalent lightweight page-flip library) | For the flora & fauna booklet. Content is hardcoded. |
| Instagram feed | Instagram Graph API (Meta) | Long-lived token stored in env vars. Manual refresh every 60 days. Free, no third-party service. See Section 4.8. |
| Hosting | Vercel (free/hobby tier) | Automatic deploys from Git main branch. |
| Dev tools | Cursor / Antigravity (AI assistants) | This PRD is their master rulebook. |

### 3.2 Architecture Rules

- **Rendering strategy:** Static Site Generation (SSG) with Incremental Static Regeneration (ISR) for article and wisata pages (revalidate ≤ 60s or on-demand via Sanity webhook). Do not use client-side data fetching for primary page content.
- **Content split:** Article and wisata content lives in Sanity. Flora/fauna booklet, and downloads are hardcoded in the repository as typed data files (TypeScript objects or JSON). Desa pages are CMS-managed (see Section 6.7).
- **Folder structure:** conventional Next.js App Router layout — `app/[locale]/...` for routes, `components/`, `lib/` (Sanity client, queries), `data/` (hardcoded content), `messages/` (translation JSON for next-intl).
- **Environment variables:** Sanity project ID, dataset, API version, and Instagram Graph API token go in `.env.local`; never hardcode credentials.
- **Dependencies:** keep minimal. Every new npm package beyond Section 3.1 requires human approval.

---

> ### ■ STRICT RULE — NEXT.JS IMAGE OPTIMIZATION (mandatory, zero exceptions)
>
> 1. Every image on the public website MUST be rendered through the `next/image` `<Image>` component. Plain `<img>` tags are forbidden anywhere in the frontend.
> 2. Every `<Image>` MUST define `width`/`height` (or `fill` with a sized container) and a meaningful `alt` text.
> 3. Above-the-fold hero images use `priority`; all other images lazy-load (default behavior — do not disable it).
> 4. Provide `sizes` on responsive images so mobile devices never download desktop-sized files.
> 5. Sanity images MUST be served through the Sanity image CDN URL builder (`@sanity/image-url`) combined with `next/image`.
> 6. Local/static images (booklet, hardcoded content) MUST be imported statically so Next.js can optimize them at build time.
> 7. **Rationale:** the previous website died because of heavy unoptimized images. Any code that bypasses image optimization is an automatic implementation failure.

---

## 4. Feature Breakdown & Requirements

### 4.1 Bilingual Support (Indonesian / English)

- **Routing:** subpath-based — `/id/...` and `/en/...` — implemented with next-intl.
- **Default locale:** Indonesian (id). The root `/` serves/redirects to Indonesian. No automatic browser-language detection.
- A visible language switcher (ID | EN) sits in the top navigation on every page. Switching preserves the current page where a translation exists.
- All UI strings (nav, buttons, labels, footer) live in translation JSON files (`messages/id.json`, `messages/en.json`). No hardcoded UI strings in components.
- **Articles:** bilingual at the field level (title/body per language, Section 6). Berita articles: if English content is empty, English site shows Indonesian content with a small "Available in Indonesian only" note. Sejarah and Partnership follow the same fallback rule. Liputan: title and excerpt are bilingual fields; external URL is single (locale-agnostic).
- **Wisata:** bilingual required on both fields — no Indonesian-only fallback. Both languages must be filled before publishing.
- **Desa pages:** title and description are bilingual. Data fields (dynamic key-value) have a bilingual label per entry.
- **SEO:** each page emits correct hreflang alternates and locale-aware metadata.

### 4.2 Performance

- Target: Lighthouse Performance ≥ 90 on mobile for Home, one article detail page, and one Wisata detail page.
- Follow the STRICT RULE image box in Section 3.2.
- YouTube embeds must be lazy/facade-loaded: render a thumbnail + play button first; load the iframe player only on click.
- Fonts: use `next/font` with self-hosted Google fonts (max 2 font families). No render-blocking font links.
- Instagram feed: fetch server-side at build/ISR time where possible; do not block page render on feed load.
- No heavy client libraries for content pages. Client components only where interactivity requires them (language switcher, flip-book, mobile menu, Instagram carousel).

### 4.3 KONEKSI — Content Management (Sanity)

- Villagers access Sanity Studio (branded "KONEKSI", Indonesian labels where Sanity allows) to create and publish four article types and wisata entries.
- Publishing flow: villager writes → clicks Publish → site updates automatically via ISR/webhook within ≤ 60 seconds. No developer involvement.

---

> ### ■ STRICT RULE — VILLAGER CMS SCOPE (hard permission boundary)
>
> 1. Villagers can ONLY create/edit/publish documents of types: `artikel_berita`, `artikel_sejarah`, `artikel_partnership`, `artikel_liputan`, `wisata`, and `desa`.
> 2. Villagers CANNOT edit the flora/fauna booklet, downloads, site settings, or any page structure — those do not exist in Sanity at all (they are hardcoded in the repository).
> 3. `kategori` documents are used exclusively by `artikel_berita`. The other three article types do not use categories — their category is fixed in the frontend to the article type.
> 4. Do not create any additional Sanity document types beyond Section 6 without human approval.

---

> ### ■ STRICT RULE — SANITY PORTABLE TEXT RENDERING (mandatory)
>
> 1. Article bodies are stored as Sanity Portable Text, NOT HTML and NOT Markdown. Never treat the body as a string.
> 2. The frontend MUST render bodies with `@portabletext/react` (`<PortableText value={body} components={...} />`) and a custom components map.
> 3. The components map MUST implement: block styles (`h2`, `h3`, `normal`, `blockquote`), marks (`strong`, `em`, `link` — external links get `rel="noopener noreferrer"` and `target="_blank"`), lists (bullet, number), an `image` type rendered through `next/image` + `@sanity/image-url` (with caption/alt), and a `youtube` type rendered as a lazy embed.
> 4. Unknown block types must render nothing (fail silently with a console warning in dev), never crash the page.
> 5. Never use `dangerouslySetInnerHTML` for article content.

---

### 4.4 Article System — Four Types

Four distinct article types replace the single previous "artikel" type. Each has its own listing page, its own Sanity document type, and its own navbar entry under the Artikel dropdown.

#### 4.4.1 Berita (News)

- Inherits the original article structure: `title_id`, `title_en`, `slug`, `coverImage`, `category` (reference to `kategori`), `excerpt_id`, `excerpt_en`, `body_id` (Portable Text), `body_en` (Portable Text), `publishedAt`, `authorName`.
- Categories are managed through the `kategori` document type. Villagers select existing categories or create new ones. In KONEKSI Studio, **Kategori is nested under Artikel → Berita** (not a top-level sidebar item), so it is clearly scoped to Berita only.
- Listing page at `/articles/berita` with category filter.
- Detail page at `/articles/berita/[slug]` renders full Portable Text body.
- Back button at top of detail page links back to `/articles/berita` listing.

#### 4.4.2 Sejarah (History)

- Fields: `title_id`, `title_en`, `slug` (from `title_id`), `coverImage` (with alt), `excerpt_id`, `excerpt_en`, `body_id` (Portable Text), `body_en` (Portable Text), `publishedAt`, `authorName`.
- No category field. Frontend displays fixed category label "Sejarah".
- Listing page at `/articles/sejarah`.
- Detail page at `/articles/sejarah/[slug]`.
- Back button at top of detail page links back to `/articles/sejarah` listing.

#### 4.4.3 Partnership

- Fields: `title_id`, `title_en`, `slug` (from `title_id`), `coverImage` (with alt), `excerpt_id`, `excerpt_en`, `body_id` (Portable Text), `body_en` (Portable Text), `publishedAt`, `authorName`.
- No category field. Frontend displays fixed category label "Partnership".
- Listing page at `/articles/partnership`.
- Detail page at `/articles/partnership/[slug]`.
- Back button at top of detail page links back to `/articles/partnership` listing.

#### 4.4.4 Liputan (External Coverage)

- **Purpose:** showcase articles written about the village by external sources. Clicking a Liputan card goes to the external source — there is no internal detail page.
- Fields: `title_id`, `title_en`, `slug` (generated, used for list key only), `coverImage` (with alt), `excerpt_id`, `excerpt_en`, `externalUrl` (string, required, validated as URL), `publishedAt`, `sourceName` (string — name of external publication/source).
- **NO body/rich text field. No internal detail page.**
- Listing page at `/articles/liputan`. Each card has a "Read Article" button that opens `externalUrl` in a new tab (`rel="noopener noreferrer"`).
- No back button needed (no detail page).

### 4.5 Wisata (Attractions)

- **Data source:** KONEKSI (Sanity). Moved from hardcoded to CMS-managed in v2.0.
- Schema: `name_id` (required), `name_en` (required — bilingual required, no fallback), `slug` (auto-generated from `name_id`), `mainImage` (with alt, required), `description_id` (Portable Text, required), `description_en` (Portable Text, required), `gallery` (array of images with alt, min 0 max 10), `publishedAt`. Visibility uses Sanity’s native Draft / Publish (same as articles) — no custom `status` field.
- Listing page at `/wisata`: responsive card grid. Card shows `mainImage`, name (locale), short excerpt from description.
- Detail page at `/wisata/[slug]`: name, mainImage, full description (Portable Text), image gallery carousel.
- Back button at top of detail page links back to `/wisata` listing.
- ISR revalidate ≤ 60s or on-demand via webhook.

### 4.6 Desa (Villages)

- Four fixed villages: Gobleg, Munduk, Gesing, Umejero. CMS-managed documents (Sanity) but the four villages themselves are fixed — no adding/removing villages from the CMS.
- Each desa page structure (top to bottom):
  1. Village name (h1)
  2. Main picture (hero image)
  3. Main description (bilingual)
  4. Dynamic data table — key-value pairs with bilingual labels (e.g. Jumlah Penduduk, Jumlah KK, Luas Wilayah, Mayoritas Pekerjaan). Villager can add/remove/reorder rows.
  5. Photo carousel (multiple images)
  6. Cross-links to the other 3 villages (main picture + name, above the footer)
- CMS fields per desa document: `villageName` (fixed enum, not editable — used for routing), `mainImage` (with alt), `description_id`, `description_en`, `dataFields` (array of `{ label_id, label_en, value }`), `gallery` (array of images with alt).
- Routes: `/desa/gobleg`, `/desa/munduk`, `/desa/gesing`, `/desa/umejero`. Slugs are fixed — do not derive from CMS.
- Back button at top of each desa page uses `router.back()` with `/` (beranda) as fallback for direct URL access.
- Data fields left empty initially. Villager populates them over time via KONEKSI.

### 4.7 Interactive Flora & Fauna Booklet

- Presentation: interactive flip-book with page-turn animation (react-pageflip or equivalent).
- Content: hardcoded; booklet pages/species data provided by the KKN team as static assets (`data/booklet.ts` + images). Villagers cannot edit it.
- Each page/species: photo, common name (ID + EN), scientific name, short description (ID + EN).
- Must be usable on mobile: swipe/tap to turn pages; graceful fallback to a simple sequential viewer if the flip library fails to load.
- All booklet images go through `next/image` static imports (see STRICT RULE 3.2).

### 4.8 Instagram Feed

- **Location:** Beranda (Home), second section after the landing hero.
- **Content:** 6–9 most recent posts from the official Instagram account.
- **Implementation:** Instagram Graph API with a long-lived access token (valid 60 days). Token stored in environment variable (`INSTAGRAM_ACCESS_TOKEN`). Developer must manually refresh the token before expiry or implement an automated refresh endpoint.
- **Fetching strategy:** fetch server-side during ISR build (revalidate ≤ 3600s — hourly). Do not fetch on client side for the initial render.
- **Display:** responsive grid/carousel of post thumbnails (images only — Reels thumbnail acceptable). Each thumbnail links to the Instagram post URL in a new tab. A "Follow us on Instagram" button below the grid links to the account page.
- **Graceful degradation:** if API call fails or token is expired, section renders a static fallback message ("Follow us on Instagram @[handle]") and the follow button — never a broken/empty section.
- No comments, like counts, or captions displayed — thumbnails + follow button only.

### 4.9 Public File Showcase (Media — Galeri)

- After-movie: embedded YouTube video (lazy facade embed), with a short bilingual description.
- Digital guidebook: a static PDF file stored in the repository (`public/files/guidebook.pdf`), presented with a preview cover image and a Download button. Updating it requires a code commit + redeploy — intentional; not CMS-managed.
- Section may list additional KKN outputs later using the same hardcoded pattern.

### 4.10 Media — Buklet Flora & Fauna

See Section 4.7. Accessible via the Media dropdown in the navbar at `/media/buklet`.

### 4.11 Media — Peta-Peta (Maps)

- **Purpose:** display static map images or PDFs of the area, created by other KKN sub-teams.
- **Implementation:** hardcoded. Map files stored in the repository (`public/files/maps/`). Each map entry in `data/maps.ts` has: `title_id`, `title_en`, `description_id`, `description_en`, `fileType` (`image | pdf`), `filePath` (string pointing to `public/files/maps/`).
- Image maps rendered via `next/image`. PDF maps presented with a preview thumbnail and a Download/View button.
- Villagers cannot edit maps — update requires a code commit.

### 4.12 General UI Requirements

- Fully responsive (mobile-first). Test at 360px, 768px, 1280px widths.
- Sticky top navigation with logo, 6 nav buttons (see Section 5.2), and language switcher; collapses to hamburger menu on mobile.
- Every article detail page, wisata detail page, and desa page has a back button at the top that links to the parent listing page (explicit href, not browser history — exception: desa pages use `router.back()` with `/` fallback).
- Footer: village address, social links, KKN Mekar Banjar credit, sponsor logo space (static hardcoded placeholders for now — no CMS). **Quick links removed from footer.**
- Accessibility: semantic HTML, alt text on all images, visible focus states, sufficient color contrast (WCAG AA).

---

## 5. Information Architecture

### 5.1 Sitemap

Routes shown for `/id`; mirror under `/en`. URL path segments stay in English for simplicity and consistency.

| # | Nav label (ID / EN) | Route | Content source |
|---|---|---|---|
| 1 | Beranda / Home | `/id` | Landing hero → Instagram feed → Destinasi Wisata (3 featured) → Four Desa showcase → After-movie embed. |
| 2 | Wisata / Attractions | `/id/wisata` | Sanity. Full listing. Detail at `/wisata/[slug]`. |
| 3 | Artikel / Articles | `/id/articles/[type]` | Sanity. Four sub-pages: `/sejarah`, `/berita`, `/partnership`, `/liputan`. Detail pages for Sejarah, Berita, Partnership at `/articles/[type]/[slug]`. Liputan has no detail page. |
| 4 | Desa / Villages | `/id/desa/[village]` | Sanity. Four fixed pages: `/gobleg`, `/munduk`, `/gesing`, `/umejero`. |
| 5 | Media | `/id/media` | Sub-pages: `/media/galeri` (after-movie + guidebook), `/media/buklet` (flip-book), `/media/peta` (maps). All hardcoded. |
| 6 | Tentang / About | `/id/about` | Sub-pages: `/about/adat-dalem-tamblingan` (village/adat profile), `/about/kkn-mekar-banjar` (KKN program info, contact, map embed). |

Additionally: 404 page (bilingual), `sitemap.xml`, `robots.txt`.

**Do not create any route not listed here without human approval.**

### 5.2 Navbar Structure

Navbar order left to right: Beranda, Wisata, Artikel, Desa, Media, Tentang.

| Button | Type | Dropdown items |
|---|---|---|
| Beranda | Direct link | — (no dropdown) |
| Wisata | Direct link | — (no dropdown) |
| Artikel | Dropdown | Sejarah → `/articles/sejarah`; Berita → `/articles/berita`; Partnership → `/articles/partnership`; Liputan → `/articles/liputan` |
| Desa | Dropdown | Gobleg → `/desa/gobleg`; Munduk → `/desa/munduk`; Gesing → `/desa/gesing`; Umejero → `/desa/umejero` |
| Media | Dropdown | Galeri → `/media/galeri`; Buklet → `/media/buklet`; Peta → `/media/peta` |
| Tentang | Dropdown | Adat Dalem Tamblingan → `/about/adat-dalem-tamblingan`; KKN Mekar Banjar → `/about/kkn-mekar-banjar` |

### 5.3 Beranda (Home) Section Structure

Exact top-to-bottom section order:

| Order | Section | Content |
|---|---|---|
| 1 | Landing / Hero | Unchanged from v1.0 PRD. Full-viewport hero, site name, tagline. |
| 2 | Instagram Feed | Live feed grid (Section 4.8) + Follow button. |
| 3 | Destinasi Wisata | Show 3 featured wisata entries (from Sanity). Section title: "Destinasi Wisata". CTA button to full `/wisata` listing. |
| 4 | Empat Desa | Always show all 4 desa cards simultaneously (2×2 on mobile, 4-across on desktop). Each card: main picture + desa name. Links to respective desa page. No carousel — all 4 must be visible at once. |
| 5 | After-Movie | Lazy YouTube embed with bilingual description. Unchanged from v1.0. |

**Removed from Beranda:** Homestay teaser section. Do not include it.

---

## 6. Data Models (Sanity Schemas)

Exactly **six** Sanity document types exist. Nothing else without human approval.

### 6.1 Document: `artikel_berita` (News Article)

| Field | Type | Required | Notes |
|---|---|---|---|
| `title_id` | string | Yes | Indonesian title. |
| `title_en` | string | No | English title. Empty → fallback rule applies. |
| `slug` | slug (from `title_id`) | Yes | Unique, auto-generated, editable. |
| `coverImage` | image (with alt string) | Yes | Rendered via Sanity CDN + next/image. |
| `category` | reference → `kategori` | Yes | Single category per article. |
| `excerpt_id` | text (max ~200 chars) | Yes | Listing preview, Indonesian. |
| `excerpt_en` | text (max ~200 chars) | No | Listing preview, English. |
| `body_id` | Portable Text | Yes | Blocks: normal, h2, h3, blockquote; marks: strong, em, link; lists; custom image; custom youtube. |
| `body_en` | Portable Text | No | English body. |
| `publishedAt` | datetime | Yes | Defaults to now. |
| `authorName` | string | Yes | Free text. No author accounts. |

### 6.2 Document: `artikel_sejarah` (History Article)

| Field | Type | Required | Notes |
|---|---|---|---|
| `title_id` | string | Yes | |
| `title_en` | string | No | Fallback to ID if empty. |
| `slug` | slug (from `title_id`) | Yes | |
| `coverImage` | image (with alt string) | Yes | |
| `excerpt_id` | text | Yes | |
| `excerpt_en` | text | No | |
| `body_id` | Portable Text | Yes | Same block config as `artikel_berita`. |
| `body_en` | Portable Text | No | |
| `publishedAt` | datetime | Yes | |
| `authorName` | string | Yes | |

No category field. Frontend renders fixed label "Sejarah".

### 6.3 Document: `artikel_partnership`

Identical schema to `artikel_sejarah`. Frontend renders fixed label "Partnership". No category field.

### 6.4 Document: `artikel_liputan` (External Coverage)

| Field | Type | Required | Notes |
|---|---|---|---|
| `title_id` | string | Yes | |
| `title_en` | string | No | |
| `slug` | slug (from `title_id`) | Yes | Used as list key only — no detail page. |
| `coverImage` | image (with alt string) | Yes | |
| `excerpt_id` | text | Yes | |
| `excerpt_en` | text | No | |
| `externalUrl` | url (string, validated) | Yes | Opens in new tab with `rel="noopener noreferrer"`. No internal detail page. |
| `sourceName` | string | Yes | Name of external publication or source. |
| `publishedAt` | datetime | Yes | |

No body field. No internal detail page.

### 6.5 Document: `kategori`

| Field | Type | Required | Notes |
|---|---|---|---|
| `title_id` | string | Yes | e.g., Berita, Acara, Cerita Desa. |
| `title_en` | string | Yes | e.g., News, Events, Village Stories. |
| `slug` | slug | Yes | Used for filtering on the Berita listing page. |

Used exclusively by `artikel_berita`. No other document type references `kategori`. In the Studio desk, Kategori lives under **Artikel → Berita → Kategori** (villagers can still create additional categories there anytime).

### 6.6 Document: `wisata`

| Field | Type | Required | Notes |
|---|---|---|---|
| `name_id` | string | Yes | Indonesian name. |
| `name_en` | string | Yes | English name. REQUIRED — no fallback. Both languages must be filled. |
| `slug` | slug (from `name_id`) | Yes | Auto-generated, editable. |
| `mainImage` | image (with alt string) | Yes | |
| `description_id` | Portable Text | Yes | Full description, Indonesian. |
| `description_en` | Portable Text | Yes | Full description, English. REQUIRED. |
| `gallery` | array of images (with alt) | No | Min 0, max 10 images. |
| `publishedAt` | datetime | Yes | Display / sort date. Not a publish gate. |

> **Visibility:** Same as articles — use Sanity Studio’s native **Draft / Publish**. The public site queries with `perspective: "published"`, so only published documents appear. Do **not** add a custom `status` field.

### 6.7 Document: `desa`

| Field | Type | Required | Notes |
|---|---|---|---|
| `villageName` | string (fixed enum) | Yes | One of: `gobleg`, `munduk`, `gesing`, `umejero`. Not editable by villager. Used for routing. |
| `mainImage` | image (with alt string) | Yes | |
| `description_id` | text / Portable Text | Yes | Main description, Indonesian. |
| `description_en` | text / Portable Text | Yes | Main description, English. |
| `dataFields` | array of `{ label_id, label_en, value }` | No | Dynamic key-value rows. Villager can add/remove/reorder. Initially empty. Example: `label_id="Jumlah Penduduk"`, `value="1.234"`. |
| `gallery` | array of images (with alt) | No | Photo carousel below data fields. |

Four `desa` documents are seeded by the KKN team. Villagers edit them but cannot create new desa documents or change `villageName`.

### 6.8 Hardcoded Data Files (repository, TypeScript)

| File | Contents |
|---|---|
| `data/booklet.ts` | Flora/fauna booklet pages (Section 4.7). Typed interface. |
| `data/downloads.ts` | After-movie YouTube URL + guidebook file metadata. |
| `data/maps.ts` | Map entries (Section 4.11). Typed interface. |
| `messages/id.json` | All UI translation strings (next-intl), Indonesian. |
| `messages/en.json` | All UI translation strings (next-intl), English. |

**Note:** `data/homestays.ts` is removed entirely. Wisata and desa data is now CMS-managed.

---

## 7. Success Metrics & Handover Protocol

### 7.1 Success Metrics (MVP acceptance)

| Metric | Target | How verified |
|---|---|---|
| Lighthouse Performance (mobile) | ≥ 90 on Home, one article detail, one Wisata detail page | Lighthouse in Chrome DevTools / PageSpeed Insights on production URL. |
| Image discipline | 0 plain `<img>` tags; all images via `next/image` | Codebase grep + visual audit before launch. |
| Bilingual completeness | 100% of UI strings translated; no missing-key warnings | next-intl runtime check + manual walkthrough of both locales. |
| CMS usability | A villager publishes a test article of each type (Berita, Sejarah, Partnership, Liputan) and a wisata entry end-to-end without developer help | Live onboarding session before handover. |
| Publish latency | Article / wisata visible on site ≤ 60s after Publish | Timed test with ISR/webhook. |
| Instagram feed | Feed renders on Beranda; graceful fallback shown when token is expired | Manual test on production + simulated token failure test. |
| Back buttons | All article detail, wisata detail, and desa pages have a functional back button at the top | Manual walkthrough of all end pages. |
| Deadline | MVP live on production domain before end of July 2026 | Vercel production deployment. |

### 7.2 Account Ownership & Handover Protocol

- Single shared email (already held by the KKN team) owns ALL accounts from day one: Vercel, domain registrar, Sanity, Git repository/organization, and the Meta developer app (for Instagram API).
- No account may be registered under a personal team-member email.
- Hosting and domain costs are covered for 1 year. Before expiry, the next KKN team (or village administration) renews using the same accounts — credentials are handed over as-is; no re-registration or ownership transfer required.
- **Instagram token refresh:** the handover package must include clear instructions for refreshing the long-lived token (60-day cycle) so the next team does not lose the feed.
- Handover package: (1) shared-email credentials + 2FA recovery codes, (2) repository access, (3) README covering local setup, deploy flow, how to edit each hardcoded data file, how to invite/remove Sanity users, and how to refresh the Instagram token, (4) an informal training session for the receiving team and villager editors.
- Villager Sanity accounts: invited as members with the most restricted practical role; the shared email retains admin.

### 7.3 Definition of Done (MVP checklist)

- [ ] All 6 navbar sections and all sub-pages in Section 5.1 implemented in both locales.
- [ ] KONEKSI Studio deployed; all 6 document type schemas live; villager test-publish passed for each article type and wisata.
- [ ] All STRICT RULE boxes (image optimization, Portable Text, CMS scope) verified.
- [ ] Success metrics table 7.1 fully passed.
- [ ] Handover README written and stored in the repository root.
- [ ] Content migrated from previous village website into the relevant CMS documents and hardcoded data files.

---

**End of document. Where this PRD is silent, ask the human team — do not assume.**
