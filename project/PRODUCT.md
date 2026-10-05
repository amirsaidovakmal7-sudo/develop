# Product

<!-- impeccable:product-schema 1 -->

<!-- Inferred from repository + REDIZIGN_TASK.md; the owner ordered "do not ask, decide yourself", so no interview round ran. -->

## Platform

web

## Stack
Django 6 backend serving a Vite-built React 19 + TypeScript bundle (frontend/dist via manifest, template tag `vite_asset_tags`). No runtime dependencies beyond React: routing is a small History-API router (`src/lib/router.tsx`), the «Живая материя» particle scene is hand-written WebGL2 (`src/scene/`), fonts (Inter Tight, Inter, JetBrains Mono) are self-hosted. Design system: DESIGN_SYSTEM.md; copy: COPY.md. Keep Django as the source of business logic.

## Users
Small and mid-size business owners in Tashkent / Uzbekistan and Russian-speaking markets (learning centers, music schools, cafes, shops, communities) deciding whether to hire a solo developer. Secondary: other developers and recruiters judging craft. They arrive from a Telegram link, a search, or a recommendation, on a phone more often than a desktop.

## Product Purpose
Services site of Akmal, a developer who builds websites, Telegram bots, Telegram Mini Apps and CRM systems for businesses. It speaks about results, not technologies. Success = a visitor understands what they can order and leaves a lead: the request form (name, phone, optional Telegram, consent) or a message on Telegram.

## Positioning
One person owns the whole path from interface to server to deploy, works directly with the client, no agency or subcontractors. Shown through 12 real shipped or completed projects, several live on the web.

## Operating Context
- Django routes: 9 pages — `/`, `/about`, `/services`, `/services/websites`, `/services/telegram-bots`, `/services/telegram-mini-app`, `/services/crm`, `/projects`, `/contacts` — in Russian at the root and under `/uz/…`, `/en/…` (one shell template with server-rendered meta and a prerendered snapshot, see SEO_AUDIT.md; trailing slash → 301; unknown paths → 404 page), `/robots.txt`, `/sitemap.xml`, `POST /order` (fields `name`, `phone_number`, optional `telegram`; CSRF via `X-CSRFToken` header or meta tag; AJAX header `X-Requested-With: XMLHttpRequest` returns JSON `{ok}` or 400 `missing_fields` / 502 `telegram_failed`). Delivery is a Telegram bot message to a group (env `TELEGRAM_BOT_TOKEN`, `TELEGRAM_GROUP_ID`).
- Phone is an Uzbek number: `+998` + 9 digits, masked client-side.
- Languages: ru (default, at the root), uz, en (`/uz`, `/en` prefixes). The URL is the only source of the language; the switcher is plain links to the same page in another language. Dictionaries in `frontend/src/i18n/{ru,uz,en}.ts`; `npm run build` exports the meta to `frontend/dist-seo/meta.json` for Django.
- Telegram: https://t.me/akm0028.
- Contact/CTA flow: «Обсудить проект» scrolls to the form on Home, Contacts and the service pages, otherwise opens /contacts#request (same language). Contacts in `src/data/contacts.ts`: phone +998 97 777 28 09, Telegram @akm0028, email amirsaidovakmal7@gmail.com, Instagram @akm.028. Two projects are video-only (Sonata Bot, Akkord) hosted on Uploadcare.

## Capabilities and Constraints
- Do not change the `/order` contract, remove CSRF, or rewrite Django views without need.
- Deploy target: PythonAnywhere (develop.pythonanywhere.com) serving built static files from `frontend/dist`; the build must be committed / reproducible with `npm run build`.
- Media: 12 projects, 2–7 stills each under `frontend/src/assets/projects/<id>/NN.webp`. Sonata Bot and Akkord exist only as remote Uploadcare recordings (38 MB+), so each has a frame captured into `frontend/src/assets/posters/<id>.webp` for the index; the video itself loads only when someone opens the case and presses play.
- Undecided / not to invent: prices, years of experience, client counts, testimonials, awards, statistics.

## Brand Commitments
Name: Akmal, wordmark `akmal.dev`. Domain https://akmal.dev/. Tone: direct, plain, business-oriented, no hype. Copy for all pages in ru/uz/en lives in COPY.md and `src/i18n/`; no technology names in client-facing text.

## Evidence on Hand
- 12 projects with real screenshots (frontend/src/assets/projects) and live URLs: cashflowtashkent.uz, sonataschool.uz, flexcamp.uz, aysdrums.uz, b4lerman.pythonanywhere.com.
- Five-step process (brief, plan, development, test, deploy) with payment terms in copy.
- No testimonials, clients list, or numbers exist. None may be added.

## Product Principles
1. The work is the proof: real projects get real screen space.
2. One person, whole path: interface to server — the design should feel authored by a single hand.
3. The lead form must always work; nothing decorative may block it.
4. Three languages are first-class; layouts survive the longest string.
5. Never fabricate facts.

## Accessibility & Inclusion
Keyboard navigation, visible focus, `prefers-reduced-motion` calm alternative (the object stays, the movement goes, and the held frame does not drift), WCAG AA contrast, WebGL must degrade gracefully on weak devices. Mobile: no horizontal overflow and every interactive target at least 44x44px, checked at 360/390/430px in all three languages - Uzbek is the longest copy and sets the real constraint.
