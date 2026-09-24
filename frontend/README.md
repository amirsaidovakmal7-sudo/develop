# akmal.dev — frontend

React 19 + TypeScript, built by Vite into `dist/` and served by Django.
There is no frontend server in production: `app/templatetags/vite_assets.py`
reads `dist/.vite/manifest.json` and renders the hashed `<link>`/`<script>`
tags (plus the font preloads) into `app/templates/index.html`.

```bash
npm run build     # what Django serves — commit the result
npm run dev       # Vite dev server; /order and /admin proxy to :8000
npm run lint
npm run check-i18n
```

`npm run dev` needs `manage.py runserver` running alongside it for the order
form to reach the real endpoint.

## Design system

The visual language is **"Ornament & Engine"**: a developer assembles
systems the way girih masters assembled ornament — a small set of exact
rules, repeated. That is not a metaphor bolted on afterwards; the pattern
behind the page is a real girih tiling computed from Lu & Steinhardt's five
tiles, and the same geometry supplies the wordmark, the section marks and
the reduced-motion poster.

- `src/styles/tokens.css` — the whole system: one cool blue-black ink scale,
  one brand accent (brass), two semantic signals, two radii, three type
  roles. Read this first; nothing else invents a colour or a size.
- `src/styles/global.css` — resets plus the layout primitives (`.shell`,
  `.section`, `.page-grid`, `.band`, `.skip-link`). See **Layout** below.
- `src/components/Motion/` — the entire reveal vocabulary: `Lines` (display
  type rising from behind its baseline), `Rule` (a hairline drawing itself),
  `Settle` (the quiet one, for reading text) and `Scramble` (mono labels
  resolving). Motion has hierarchy on purpose — body copy does not get the
  same treatment as a headline.
- `src/components/Armature/` — the fixed hairline grid every section aligns
  to, which is what makes the page read as one drawing rather than a stack
  of bands. Past 1600px two further lines are drawn *outside* the column, so
  the armature belongs to the screen instead of framing a box in the middle
  of it.

## Layout

The column is fluid — `--col-max: clamp(1280px, 78vw, 1760px)` — so a wide
display gets a wider page rather than more empty margin. Line length is
protected separately by `--measure: 68ch` on running text, because those are
two different problems: a 1760px page is good, a 1760px paragraph is not.

Sections that should reach the edge use `.page-grid`, a named-line grid:

```css
[full-start] minmax(var(--gutter), 1fr)
[content-start] minmax(0, <column>) [content-end]
minmax(var(--gutter), 1fr) [full-end]
```

A child on `content-start / content-end` sits in the column; a child on
`split / full-end` bleeds to the edge of the screen. This is deliberately
not `100vw`, which overshoots by the width of the scrollbar, and not a
measured pixel value from JS, which would need a resize observer and would
be wrong for one frame after every resize. The work section's stage is the
main user of it: the index holds the column while the lantern stage runs off
the right edge, which is what stops the page reading as a boxed document.

The header bar spans the full width; only its contents are aligned to the
column. Below 1025px the language switcher moves into the mobile menu rather
than competing with the brand for the bar. Every interactive target on a
phone is at least 44×44px, verified at 360/390/430px in all three
languages — Uzbek is the widest copy and sets the real constraints.

## The girih lantern

`src/lib/girih.ts` turns the generated tiling into *strapwork*: two lines
leave the midpoint of every tile edge at 54°, cross the tile, and continue
into its neighbour. Pure geometry, no renderer dependency.

`src/lib/lantern.ts` closes that flat rule into a body: a dodecahedron
whose twelve pentagonal panels each carry a rosette, clipped exactly to the
panel with a solid border left around it. The panels are real geometry —
face normals are derived from the vertices, not assumed from the dual, and
each one carries its own normal (so it can move outward when the body
opens), its radius from the panel centre (so light can run outward through
the strapwork) and a phase (so the twelve rosettes pulse in sequence rather
than together).

`src/scenes/GirihField/webglScene.ts` renders it with plain WebGL2 — two
programs, a hand-rolled perspective matrix, ~2 kB. The panels are opaque
and depth-buffered, so near panels genuinely occlude far ones and the body
reads as solid; facet shading is computed per vertex because it is constant
across a flat panel.

The choreography is the point, not the pointer parallax: closed and large
over the hero, withdrawn into the top-right corner while the reading
sections hold the column, opened up through the middle, closed again for
the order form. Placement is expressed as a fraction of what the camera can
see at the object's own depth, so it keeps its position and size on any
viewport; phones get a smaller, dimmer object in the corner.

### What it responds to

Scroll alone would make it scenery. `src/lib/sceneStore.ts` is a plain
mutable object the render loop reads each frame — not React state, because
pointing down a list of twelve projects would otherwise re-render the whole
section on every row — and it carries four signals:

| Signal | Set by | What the lantern does |
| --- | --- | --- |
| `panel` | hovering or focusing a project in the work index; on a phone, the card scrolled into view | Turns that project's panel to face the reader and lights its rosette. Twelve panels, twelve projects — the index *is* the mapping. |
| `opened` | opening a case | The aimed panel lifts away from the body. |
| `gathering` | focus inside the order form | The body squares up to the reader. An earlier version only reversed the direction of the light, which measured as no change at all against the body's own rotation; an interaction nobody notices is not an interaction. |
| `flareAt` | a successful order | One bright ring sweeps out through the strapwork. Its brightness holds for the whole journey and fades only at the end — multiplying it by the decaying clock made the wave dim exactly as fast as it travelled, so the outer rosettes never lit. |

The aim is released when the work section leaves the viewport, not only on
`mouseleave`: scrolling away with the wheel or the keyboard never moves the
pointer off the list, and the lantern would otherwise stay locked to one
project for the rest of the page — including over the order form, where it
has its own job to do.

Touch devices cap DPR at 1 and render at 30fps; a hidden tab stops
entirely; reduced motion composes a single frame and redraws it on scroll,
so the object stays and only the movement goes. That frame is drawn at a
frozen timestamp, so a redraw shows the *same* frame — using the live clock
meant the light kept travelling across every scroll-triggered repaint, which
is precisely what the setting asks us not to do. Only a device without
WebGL2 falls back to the flat SVG poster.

## Generators

Committed output, re-run only when the inputs change:

| Script | Writes | Why |
| --- | --- | --- |
| `gen-girih.mjs` | `src/scene/girihPatch.generated.ts` | The tiling itself. Takes `--max=` and `--r=`; the committed patch is `--max=360 --r=15` and takes about ten minutes. |
| `gen-fonts.mjs` | `src/assets/fonts/`, `src/styles/fonts.css` | Self-hosts the three OFL families. Loading them from Google cost a 0.07 layout shift on every first visit and a third-party connection. |
| `gen-media-sizes.mjs` | `src/data/mediaSizes.generated.ts` | Intrinsic size of every screenshot, so every `<img>` reserves its box. |
| `gen-video-posters.mjs` | `src/assets/posters/` | A real frame from each of the two video-only projects. Needs Chrome on `--remote-debugging-port=9333`. Without it the work index would start a 38 MB download to draw a thumbnail. |
| `fetch-media.mjs` | `src/assets/projects/` | Original import of the project stills. |

## What must not break

The order form is the site's reason for existing. `useOrderForm` posts
`name` and `phone_number` to Django's `/order` with the CSRF token and the
`X-Requested-With: XMLHttpRequest` header that makes it answer JSON. The
contract lives in `app/views.py` and nothing in here may change it.

`src/i18n/` is authoritative for all copy in three languages. `ru.ts`
defines the key set and the other two are type-checked against it, so an
added key is a compile error until every language has it.
