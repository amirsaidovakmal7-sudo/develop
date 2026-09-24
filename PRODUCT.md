# Product

<!-- impeccable:product-schema 1 -->

<!-- Inferred from repository + REDIZIGN_TASK.md; the owner ordered "do not ask, decide yourself", so no interview round ran. -->

## Platform

web

## Stack
Django 6 backend serving a Vite-built React 19 + TypeScript bundle (frontend/dist via manifest, template tag `vite_asset_tags`). The frontend has no runtime dependencies beyond React: the girih lantern is hand-written WebGL2 (three.js, @react-three/fiber, GSAP and Motion were all removed — together they cost ~275 kB gzipped to draw two line meshes and one fade), fonts are self-hosted, and there are no third-party requests at runtime. Keep Django as the source of business logic.

## Users
Small and mid-size business owners in Tashkent / Uzbekistan and Russian-speaking markets (learning centers, music schools, cafes, shops, communities) deciding whether to hire a solo developer. Secondary: other developers and recruiters judging craft. They arrive from a Telegram link, a search, or a recommendation, on a phone more often than a desktop.

## Product Purpose
Personal portfolio of Akmal, a solo full-stack developer (websites, web apps, Telegram bots, backend, automation). Success = a visitor believes the work is real and well-built and leaves a lead: the /order form (name + phone) or a message to @akm0028 on Telegram. The site itself is also proof of craft.

## Positioning
One person owns the whole path from interface to server to deploy, works directly with the client, no agency or subcontractors. Shown through 12 real shipped or completed projects, several live on the web.

## Operating Context
- Django routes: `/` (shell template), `POST /order` (fields `name`, `phone_number`; CSRF via `X-CSRFToken` header or meta tag; AJAX header `X-Requested-With: XMLHttpRequest` returns JSON `{ok}` or 400 `missing_fields` / 502 `telegram_failed`). Delivery is a Telegram bot message to a group (env `TELEGRAM_BOT_TOKEN`, `TELEGRAM_GROUP_ID`).
- Phone is an Uzbek number: `+998` + 9 digits, masked client-side.
- Languages: ru (default), uz, en; switcher persists in localStorage; dictionaries in `frontend/src/i18n/{ru,uz,en}.ts`.
- Telegram: https://t.me/akm0028.
- Contact/CTA flow: project links open the live sites; two projects are video-only (Sonata Bot, Akkord) hosted on Uploadcare.

## Capabilities and Constraints
- Do not change the `/order` contract, remove CSRF, or rewrite Django views without need.
- Deploy target: PythonAnywhere (develop.pythonanywhere.com) serving built static files from `frontend/dist`; the build must be committed / reproducible with `npm run build`.
- Media: 12 projects, 2–7 stills each under `frontend/src/assets/projects/<id>/NN.webp`. Sonata Bot and Akkord exist only as remote Uploadcare recordings (38 MB+), so each has a frame captured into `frontend/src/assets/posters/<id>.webp` for the index; the video itself loads only when someone opens the case and presses play.
- Undecided / not to invent: prices, years of experience, client counts, testimonials, awards, statistics.

## Brand Commitments
Name: Akmal, wordmark `akmal.dev`. Domain https://akmal.dev/. Tone: direct, plain, business-oriented, no hype. Full ru/uz/en copy already exists and is authoritative.

## Evidence on Hand
- 12 projects with real screenshots (frontend/src/assets/projects) and live URLs: cashflowtashkent.uz, sonataschool.uz, flexcamp.uz, aysdrums.uz, b4lerman.pythonanywhere.com.
- Stack facts: Python, Django, FastAPI, Aiogram, Telebot, SQLAlchemy, PostgreSQL, SQLite, React, HTML, CSS, JavaScript, VPS, SEO, deploy on VPS/PythonAnywhere.
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
