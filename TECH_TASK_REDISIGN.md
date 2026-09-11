# FULL REDESIGN — AKMAL.DEV

## Creative 3D / Abstract Digital Art Direction

Ты работаешь над существующим Django-проектом моего personal portfolio.

Я хочу полностью переработать визуальный дизайн сайта.

Это не косметический redesign.

Не нужно просто поменять:

* цвета;
* шрифты;
* border-radius;
* animation duration;
* расположение существующих карточек.

Нужно создать **новую визуальную систему и новый UX**, используя существующий проект, существующий контент, реальные проекты и рабочую backend-логику.

---

# 1. СНАЧАЛА — АУДИТ ПРОЕКТА

Перед любыми изменениями полностью изучи существующий проект.

Открой и проанализируй:

* `TECH_TASK_REDIZGN.md`, если он существует;
* `index.html`;
* все Django templates;
* `views.py`;
* `urls.py`;
* `/order`;
* Telegram lead logic;
* существующие models, если они связаны с заявками;
* static;
* media;
* dependencies;
* settings;
* deployment configuration;
* frontend assets;
* существующие JS/CSS.

Также открой live:

https://develop.pythonanywhere.com/

Сопоставь live-версию с кодом.

Не делай выводы о backend по одному `index.html`.

Особенно нужно найти реальную цепочку:

```text
frontend
↓
POST /order
↓
Django
↓
existing lead processing
↓
Telegram notification
```

Эта цепочка должна продолжить работать после redesign.

---

# 2. ЧТО СЕЙЧАС ЕСТЬ

Текущая версия сайта использует:

* светлую и тёмную тему;
* кислотно-зелёный accent;
* `Unbounded`;
* `Onest`;
* Canvas aurora;
* hero text + technology cards;
* About;
* skills;
* portfolio grid;
* project carousels;
* video projects;
* lightbox;
* process;
* order form;
* Telegram CTA;
* RU / UZ / EN;
* success/error modal.

Не нужно сохранять эту визуальную систему.

Функциональность необходимо сохранить, но visual language заменить практически полностью.

---

# 3. НОВАЯ КОНЦЕПЦИЯ

Главная концепция:

# CREATIVE DIGITAL OBJECTS

Название направления:

**Abstract Digital Art / Creative Engineering**

Сайт должен выглядеть не как обычное portfolio developer.

Он должен ощущаться как digital art-directed experience, созданный разработчиком, который умеет работать одновременно с:

* engineering;
* interfaces;
* backend;
* motion;
* 3D;
* visual systems.

Главное ощущение:

```text
clean
premium
art-directed
experimental
technical
calm
fluid
modern
```

Это НЕ cyberpunk.

Это НЕ gaming website.

Это НЕ generic SaaS landing page.

Это НЕ neon developer portfolio.

---

# 4. ОСНОВНОЕ ВИЗУАЛЬНОЕ НАПРАВЛЕНИЕ

Базовый фон:

```text
warm white / ivory / very soft gray
```

Примерная база:

```text
#F4F3EE
#F7F7F4
#EFEFE9
```

Но не использовать абсолютно белый фон везде.

Нужна глубина через:

* очень мягкие gradients;
* subtle noise;
* soft shadows;
* diffuse light;
* transparent layers;
* большие цветовые пятна;
* 3D objects.

Основная идея:

**white / warm neutral canvas + spectral light + abstract 3D object.**

---

# 5. ЦВЕТОВАЯ ПАЛИТРА

Полностью отказаться от старого кислотно-зелёного как главного цвета.

Новая палитра:

### Foundation

```text
Warm White
#F4F3EE
```

### Primary text

```text
Almost Black
#111214
```

### Secondary text

```text
#65676B
```

### Accent 1

```text
Electric Indigo
#5B5FEF
```

### Accent 2

```text
Soft Cyan
#63D9FF
```

### Accent 3

```text
Lavender
#A88BFF
```

### Accent 4

```text
Soft Coral / Peach
#FFB59E
```

Использовать accent colors не как плоские blocks, а преимущественно как:

* reflections;
* gradients;
* light sources;
* 3D materials;
* subtle text accents;
* interactive states.

Никаких цветных элементов «ради галочки».

---

# 6. ЦВЕТОВАЯ ЛОГИКА

Цвет должен иметь роль.

Например:

```text
Indigo = technology / intelligence
Cyan = motion / data
Lavender = creativity
Peach = human / communication
Black = information
```

Таким образом цвет становится частью визуальной архитектуры сайта.

---

# 7. 3D — ГЛАВНЫЙ ВИЗУАЛЬНЫЙ ЭЛЕМЕНТ

Главный hero должен строиться вокруг большого абстрактного 3D объекта.

Использовать:

```text
Three.js
React Three Fiber
@react-three/drei
```

Объект должен выглядеть как:

```text
liquid digital sculpture
```

или

```text
soft geometric organism
```

или

```text
abstract glass / gel / ceramic digital object
```

Но не использовать банальный:

* cube;
* sphere;
* torus;
* spinning logo;
* generic low-poly object.

Форма должна быть необычной.

Лучше:

```text
irregular smooth shape
+
multiple internal layers
+
translucency
+
refraction
+
soft reflections
+
spectral highlights
```

---

# 8. HERO COMPOSITION

Hero должен быть approximately:

```text
------------------------------------------------

AKMAL.DEV

small label

I BUILD
DIGITAL
PRODUCTS.

short supporting text

[ VIEW WORK ]   [ START A PROJECT ]

                         3D OBJECT

------------------------------------------------
```

Но композиция должна быть asymmetric.

Текст занимает примерно:

```text
45% viewport
```

3D scene:

```text
55% viewport
```

3D object может немного выходить за container.

---

# 9. HERO TYPOGRAPHY

Отказаться от текущего тяжёлого `Unbounded`.

Headline должен быть editorial и premium.

Рассмотреть:

```text
Inter Tight
Manrope
Geist
Satoshi
Space Grotesk
```

или комбинацию:

```text
clean grotesk
+
expressive display font
```

Headline:

очень крупный.

Например:

```text
I BUILD
DIGITAL
PRODUCTS.
```

Визуально:

```text
I BUILD
```

среднего размера;

```text
DIGITAL
```

огромный;

```text
PRODUCTS.
```

немного меньший или выполнен accent treatment.

Не делать всё одинакового размера.

---

# 10. HERO TEXT

Основная идея текста:

Не продавать «я знаю Python».

Продавать:

**я создаю цифровые продукты от интерфейса до backend и deployment.**

Русская версия должна быть естественной.

Возможная концепция:

```text
Создаю цифровые продукты
от интерфейса до сервера.
```

Но Claude Code должен проверить существующий контент и сохранить фактическую информацию.

Основной смысл:

* websites;
* web applications;
* Telegram bots;
* backend;
* APIs;
* databases;
* automation;
* deployment.

---

# 11. HERO 3D INTERACTION

3D object должен реагировать на:

### Pointer

```text
mouse position
→
object rotation
→
light direction
→
material response
```

### Mouse velocity

Быстрое движение курсора:

```text
→ stronger light movement
→ subtle object distortion
→ particle displacement
```

### Scroll

На scroll:

```text
hero object
→ rotate
→ scale
→ move
→ eventually transition into next visual state
```

Главное:

animation должна быть плавной.

Никаких резких rotations.

---

# 12. 3D OBJECT MATERIAL

Попробовать material system:

```text
glass
+
gel
+
pearlescent
+
subtle iridescent reflection
```

Использовать:

* environment lighting;
* soft shadows;
* subtle refraction;
* fresnel;
* smooth reflections.

Но не перегружать материал.

Object должен быть дорогим и минимальным.

---

# 13. LIGHTING

Очень важная часть.

У 3D объекта должны быть:

```text
soft white key light
+
lavender rim light
+
cyan secondary reflection
+
subtle peach highlight
```

Свет не должен выглядеть как gaming RGB.

Это должно ощущаться как studio photography / premium product render.

---

# 14. HERO BACKGROUND

Вместо Canvas aurora из старого сайта сделать:

```text
warm white
+
very subtle gradient field
+
fine grain
+
soft radial light
```

Не использовать огромные neon blobs.

Фон должен быть почти статичным.

Движение происходит через:

* 3D object;
* reflections;
* mouse;
* scroll;
* typography.

---

# 15. CUSTOM CURSOR

Desktop:

маленький minimal cursor.

Не делать огромный декоративный круг.

Normal:

```text
tiny dot
```

Interactive:

```text
dot expands
+
context label
```

Например:

```text
VIEW
OPEN
EXPLORE
DRAG
```

На mobile custom cursor отключить.

---

# 16. NAVIGATION

Navigation сделать очень лёгкой.

Например:

```text
AKMAL.DEV

ABOUT
WORK
PROCESS

RU
UZ
EN

CONTACT
```

Но не превращать navigation в bulky header.

Header:

* transparent;
* minimal;
* elegant;
* fixed.

При scroll можно менять opacity / background / blur.

---

# 17. LANGUAGE SWITCHER

Сохранить:

```text
RU
UZ
EN
```

Но визуально интегрировать в новую систему.

Важно:

Все тексты должны иметь полноценный перевод.

Проверить:

* nav;
* hero;
* buttons;
* about;
* services;
* stack;
* projects;
* process;
* form;
* errors;
* success;
* cursor labels;
* modal;
* footer;
* SEO text;
* metadata.

Не оставить ни одного visible hardcoded string без translation.

---

# 18. ABOUT SECTION

Не делать старую двухколоночную структуру.

Сделать editorial section.

Например:

```text
ABOUT

I'm Akmal.

I build websites,
web applications
and Telegram automation
for business.
```

Затем короткая paragraph.

После:

```text
I handle the entire development cycle:
frontend
backend
database
deployment
```

Большая типографика.

---

# 19. ABOUT VISUAL

Использовать вторичный 3D object или fragment первого hero object.

Идея:

Hero object постепенно трансформируется.

На About section он становится:

```text
smaller
simpler
more transparent
```

Таким образом создаётся continuity.

Не создавать полностью независимый 3D object.

---

# 20. TECHNOLOGY SYSTEM

Создать modern interactive stack section.

Не делать список:

```text
Python
Django
FastAPI
...
```

как cards.

Сделать визуальную map.

Центр:

```text
PYTHON
```

Связанные nodes:

```text
Django
FastAPI
Aiogram
Telebot
SQLAlchemy
PostgreSQL
SQLite
```

Другой branch:

```text
Frontend
React
HTML
CSS
JavaScript
```

И:

```text
Infrastructure
VPS
Deployment
SEO
```

При hover:

```text
node
→
highlight related nodes
→
subtle light connection
→
description appears
```

Но визуально всё должно оставаться clean.

---

# 21. SERVICES

Создать section:

```text
WHAT I BUILD
```

Большой список:

```text
01  Business websites
02  Web applications
03  Telegram bots
04  Backend & APIs
05  Automation
```

При hover выбранная услуга становится dominant.

Visual object справа меняется.

Например:

Business website:

```text
floating browser
```

Web app:

```text
interactive UI structure
```

Telegram bot:

```text
message flow
```

Backend:

```text
abstract nodes
```

Automation:

```text
flow / connected system
```

Но это должен быть один visual system, а не пять абсолютно разных scenes.

---

# 22. SERVICES ANIMATION

При переходе между services:

```text
old visual
→
morph
→
new visual
```

а не:

```text
fade out
fade in
```

Использовать:

```text
scale
position
opacity
morph-like motion
```

где это уместно.

---

# 23. PORTFOLIO

Полностью убрать нынешний одинаковый 2-column card grid.

Сейчас portfolio состоит из повторяющихся:

```text
carousel
tag
title
description
button
```

и это нужно изменить.

Новая секция:

# SELECTED WORK

Проекты представлены как visual stories.

---

# 24. FEATURED PROJECTS

Особенно подчеркнуть:

```text
Cashflow Tashkent
Sonata School
AysDrums
Sonata Bot
```

Потому что они хорошо демонстрируют реальные business-задачи.

Остальные проекты не удалять.

---

# 25. PROJECT STORY

Каждый проект должен занимать значительную площадь.

Пример:

```text
01

AYSDRUMS

Music studio website

[large screenshot]
```

Metadata:

```text
Website
SEO
Lead generation
Responsive
```

и CTA:

```text
OPEN PROJECT ↗
```

---

# 26. PROJECT LAYOUTS

Не использовать один layout.

Чередовать:

```text
image left / text right
```

затем:

```text
full-width visual
```

затем:

```text
text left / image right
```

затем:

```text
collage
```

затем:

```text
video-focused
```

Таким образом portfolio становится editorial.

---

# 27. PROJECT IMAGE INTERACTION

При scroll:

```text
image
→
slight scale
→
crop shift
→
depth
```

При hover:

```text
image
→
subtle parallax
```

Cursor:

```text
VIEW CASE
```

Никаких чрезмерных effects.

---

# 28. PROJECT VIEWER

При клике на project:

открывать immersive viewer.

Показывать:

```text
Project title
Description
Category
Technology
Features
Screenshots
Video
Live URL
```

Opening:

```text
thumbnail
→
expand into viewer
```

Это должно выглядеть как продолжение страницы.

---

# 29. PROCESS

Сохранить реальные 5 этапов:

```text
01 Technical brief / PRD
02 Timeline & payment
03 Development
04 Testing & revisions
05 Deployment & handover
```

Старые тексты использовать как source content.

Но visual presentation:

не cards.

Сделать horizontal / diagonal process line.

Например:

```text
01
BRIEF
──────
02
PLAN
──────
03
BUILD
──────
04
TEST
──────
05
DEPLOY
```

При scroll активная линия подсвечивается.

---

# 30. CONTACT

Contact должен быть одним из самых сильных visual moments.

Например:

```text
LET'S
BUILD
SOMETHING
REAL.
```

огромная typography.

Под ней:

```text
Tell me what you're building.
```

и:

```text
Telegram
```

и форма.

---

# 31. CONTACT FORM

Backend сохранить.

Frontend сделать minimal/editorial.

Например:

```text
What's your name?

[____________]

Phone number

[____________]

[ START A PROJECT → ]
```

Без старого bulky white card.

---

# 32. TELEGRAM

Основной CTA:

```text
LET'S TALK ↗
```

или:

```text
MESSAGE ME ON TELEGRAM ↗
```

Telegram:

https://t.me/akm0028

Ссылка должна продолжить работать.

Не использовать старую bouncing Telegram bubble animation.

---

# 33. FORM SUBMISSION

Не менять backend contract без необходимости.

Существующую цепочку:

```text
POST /order
```

сохранить.

Сохранить:

* CSRF;
* AJAX submission;
* validation;
* success;
* error;
* Telegram notification.

Существующая phone mask:

```text
+998 90 123 45 67
```

тоже должна продолжить работать.

---

# 34. SUCCESS ANIMATION

После отправки:

```text
button
→
loading
→
success
```

Success UI:

```text
MESSAGE RECEIVED
I'll get back to you soon.
```

Анимация:

```text
small visual wave
+
light pulse
+
minimal check
```

Не использовать старую большую green modal icon.

---

# 35. ERROR STATE

Не делать красный generic error modal.

Сделать:

```text
Something went wrong.

Try again or contact me on Telegram.
```

минимально и спокойно.

---

# 36. TYPOGRAPHY SYSTEM

Нужна typography hierarchy.

### Display

```text
clamp()
```

очень крупные headlines.

### Body

нейтральный readable font.

### Meta

маленький uppercase text.

Использовать:

```text
large
medium
small
micro
```

и играть размером.

Не делать все заголовки одного размера.

---

# 37. TYPOGRAPHY + 3D

Очень важно:

3D object должен пересекаться с typography композиционно.

Например:

```text
DIGITAL
PRODUCTS.
```

частично находится перед 3D object.

Часть object уходит за текст.

Это создаёт depth.

Не просто:

```text
text | object
```

---

# 38. DEPTH SYSTEM

Использовать:

```text
foreground typography
+
middle 3D
+
background light
```

Объекты могут:

* перекрывать друг друга;
* уходить за section boundary;
* менять z-depth.

Это должно быть controlled.

---

# 39. MOTION LANGUAGE

У проекта должна быть единая motion система.

Micro interaction:

```text
150–250ms
```

Content transition:

```text
400–700ms
```

Creative cinematic:

```text
800–1400ms
```

Не использовать всё одинаковое.

---

# 40. SCROLL EXPERIENCE

Scroll должен быть частью storytelling.

Не просто:

```text
element appears
```

А:

```text
scroll
↓
layout changes
↓
object moves
↓
typography transforms
↓
next visual state appears
```

Использовать GSAP ScrollTrigger там, где это действительно необходимо.

Motion использовать для component interactions.

---

# 41. HERO → ABOUT

Во время scroll:

Hero 3D object:

```text
large
```

↓

moves upward/right

↓

scale down

↓

partially dissolves

↓

becomes About visual.

---

# 42. ABOUT → STACK

Typography from About может:

```text
move
```

и превращаться в labels technology nodes.

Например:

```text
BUILD
```

→

```text
BACKEND
```

→

```text
DJANGO
```

Это optional, но если реализуется хорошо, будет сильным transition.

---

# 43. STACK → SERVICES

Technology nodes slowly rearrange.

Architecture:

```text
technology
```

↓

becomes:

```text
product/service
```

Так user понимает:

```text
skills
→
what I can build
```

---

# 44. SERVICES → PORTFOLIO

Selected service state:

```text
Business Website
```

↓

visual browser

↓

browser transforms into first portfolio screenshot.

Это один из главных transitions страницы.

---

# 45. PORTFOLIO → PROCESS

Project visuals уходят.

Остаётся:

```text
small nodes
+
line
```

которые превращаются в process pipeline.

---

# 46. PROCESS → CONTACT

Pipeline постепенно исчезает и превращается в одну glowing point.

Эта point становится CTA accent в Contact.

---

# 47. FINAL VISUAL MOMENT

Внизу страницы должно произойти:

```text
FROM IDEA
TO PRODUCTION.
```

Большой typography statement.

3D/light system собирается к центру.

Последний CTA:

```text
START A PROJECT ↗
```

---

# 48. NO GENERIC AI EFFECTS

Особенно важно не использовать:

* random floating spheres;
* random particles everywhere;
* generic glowing gradients;
* endless glass cards;
* random 3D cubes;
* excessive blur;
* 20 simultaneous hover effects;
* random GSAP animations.

Каждая animation должна иметь смысл.

---

# 49. PERFORMANCE

3D должен быть optimized.

Обязательно:

* lazy loading;
* low-poly where possible;
* reasonable DPR;
* limited particles;
* optimized textures;
* reduced quality on mobile;
* static fallback.

Mobile не должен нагружаться desktop-level WebGL.

---

# 50. MOBILE ART DIRECTION

Не просто сжать desktop.

Mobile layout должен быть отдельно art-directed.

Hero:

```text
headline
↓
3D object
↓
CTA
```

Project:

```text
title
↓
visual
↓
metadata
```

Services:

```text
vertical interactive list
```

Process:

```text
vertical timeline
```

Contact:

```text
large type
↓
Telegram
↓
form
```

---

# 51. MOBILE 3D

На mobile:

* smaller canvas;
* simpler geometry;
* fewer particles;
* lower DPR;
* fewer post-processing effects.

Если WebGL плохо работает — static fallback.

---

# 52. I18N

Сохранить:

```text
RU
UZ
EN
```

Создать clean i18n architecture.

Например:

```text
src/i18n/
  ru.ts
  uz.ts
  en.ts
```

Не хранить переводы в огромном компоненте.

---

# 53. TRANSLATION COMPLETENESS

Проверить абсолютно каждый user-facing string:

* navigation;
* hero;
* descriptions;
* CTA;
* services;
* stack descriptions;
* projects;
* filters;
* process;
* contact;
* form;
* placeholder;
* errors;
* success;
* modal;
* cursor;
* footer;
* metadata.

Результат:

```text
missing translation keys = 0
hardcoded visible strings = 0
undefined translations = 0
```

---

# 54. CONTENT

Существующий контент — source of truth.

Проекты сохраняются.

Не выдумывать:

* клиентов;
* testimonials;
* metrics;
* awards;
* revenue;
* user counts;
* fake business results.

Тексты можно сделать короче и профессиональнее.

---

# 55. PROJECTS TO FEATURE

Главные:

```text
AysDrums
Sonata School
Sonata Bot
Cashflow Tashkent
```

Остальные сохранить как supporting projects.

---

# 56. CURRENT MEDIA

Использовать существующие screenshots/videos.

По возможности:

* скачать локально;
* оптимизировать;
* convert WebP/AVIF;
* lazy load;
* responsive sizes.

Не удалять существующие media, пока не подтверждено, что они не нужны.

---

# 57. PROJECT MEDIA

Использовать реальное количество screenshots/videos для каждого проекта.

Не нужно насильно превращать каждый project в одинаковый carousel.

Некоторые проекты могут использовать:

```text
hero screenshot
+
two supporting screenshots
```

Другие:

```text
video
+
single screenshot
```

Другие:

```text
collage
```

---

# 58. TECHNOLOGY

Предпочтительный стек:

```text
React
TypeScript
Vite
Three.js
React Three Fiber
@react-three/drei
Motion
GSAP / ScrollTrigger
```

Использовать инструменты только там, где они действительно нужны.

---

# 59. PROJECT ARCHITECTURE

Не создавать giant component.

Пример:

```text
src/
  components/
  sections/
  scenes/
  animations/
  data/
  i18n/
  hooks/
  styles/
  assets/
```

---

# 60. DESIGN TOKENS

Создать единый design system:

```text
colors
typography
spacing
radius
shadows
motion
z-index
breakpoints
```

Не раскидывать случайные values по components.

---

# 61. ACCESSIBILITY

Сохранить:

* semantic HTML;
* keyboard navigation;
* focus states;
* labels;
* aria;
* alt;
* readable contrast;
* reduced motion.

---

# 62. SEO

Не потерять:

* title;
* description;
* canonical;
* Open Graph;
* Twitter;
* JSON-LD;
* semantic headings;
* alt.

Текущий canonical и OG необходимо проверить относительно реального production domain.

Не оставлять неправильный canonical только потому, что он был в старом HTML.

---

# 63. THEME

В новой концепции не нужно обязательно сохранять старый manual light/dark theme.

Если dark mode не усиливает эту конкретную art direction — убрать toggle.

Основной visual identity должен быть:

```text
light / warm / abstract / premium
```

Но некоторые отдельные sections могут временно уходить в:

```text
soft gray
lavender
very pale indigo
```

или, если это действительно улучшает composition, в controlled dark segment.

Не возвращать старую зелёную dark mode design.

---

# 64. FOOTER

Footer сделать continuation visual system.

Например:

```text
AKMAL.DEV

WEB
APPS
BOTS
BACKEND

TASHKENT / UZBEKISTAN

Telegram
```

Минимум текста.

---

# 65. FINAL QA

Проверить:

### Desktop

```text
1440
1920
```

### Laptop

```text
1280
1024
```

### Tablet

```text
768
```

### Mobile

```text
430
390
360
```

Проверить:

* no horizontal overflow;
* no clipped type;
* no overlapping object;
* no broken 3D;
* no invisible CTA;
* no broken modal;
* no broken video;
* no broken form.

---

# 66. FUNCTIONAL QA

Проверить:

```text
navigation
language switching
all translations
project opening
project viewer
video
Telegram
form
phone mask
CSRF
success
error
/order
Telegram notification
```

---

# 67. BUILD QA

После implementation:

```bash
npm run build
```

и:

```bash
python manage.py check
```

Проверить runtime errors.

---

# 68. FINAL QUALITY BAR

Сайт должен выглядеть так, будто его разработали:

```text
creative developer
+
product designer
+
3D/motion designer
```

а не:

```text
AI website generator
```

Главная характеристика:

# RESTRAINED CREATIVITY

Не пытайся впечатлить пользователя количеством эффектов.

Впечатляй:

* формой;
* пространством;
* typography;
* transitions;
* 3D;
* цветом;
* interaction;
* деталями.

---

# 69. ГЛАВНЫЙ VISUAL PRINCIPLE

Представь, что у сайта есть один главный физический объект.

Он существует в разных состояниях на протяжении всей страницы:

```text
HERO
↓
ABOUT
↓
STACK
↓
SERVICES
↓
WORK
↓
CONTACT
```

Он может:

* менять форму;
* масштаб;
* прозрачность;
* материал;
* свет;
* позицию.

Но всё остаётся частью одной visual universe.

---

# 70. НЕ ДЕЛАЙ

Не делай:

```text
section
↓
cards
↓
section
↓
cards
↓
section
↓
cards
```

Не делай:

```text
gradient everywhere
```

Не делай:

```text
3D everywhere
```

Не делай:

```text
animation everywhere
```

Не делай:

```text
neon everywhere
```

Не делай:

```text
glassmorphism everywhere
```

---

# 71. ДЕЛАЙ

Делай:

```text
space
+
scale
+
typography
+
3D
+
light
+
motion
+
editorial composition
```

---

# 72. ФИНАЛЬНАЯ СТРУКТУРА

Итоговая page architecture:

```text
HEADER

HERO
    huge typography
    main 3D sculpture
    CTA

ABOUT
    personal statement
    short story
    secondary visual

STACK
    interactive technology architecture

SERVICES
    interactive capabilities

SELECTED WORK
    immersive case studies

PROCESS
    visual development pipeline

CONTACT
    large CTA
    Telegram
    form

SEO / editorial content
    naturally integrated

FOOTER
```

---

# 73. ГЛАВНЫЙ КРИТЕРИЙ

Когда пользователь откроет сайт, он должен подумать:

> «Это не обычный сайт программиста.»

Но через несколько секунд он должен очень ясно понять:

> «Этот человек создаёт реальные сайты, web applications и Telegram automation, и умеет довести проект от идеи до рабочего продукта.»

---

# 74. ПОСЛЕ АУДИТА

Перед активной реализацией:

1. изучи существующий проект;
2. проверь backend;
3. проверь `/order`;
4. проверь Telegram flow;
5. изучи текущие assets;
6. изучи весь существующий content;
7. создай архитектуру нового frontend;
8. только после этого начинай implementation.

Не спрашивай меня о том, какой конкретно layout выбрать для каждого блока, если решение можно принять из этой art direction.

Ты должен самостоятельно принимать сильные UX/UI решения в рамках этой концепции.

Если какой-то визуальный эффект ухудшает UX, readability или performance — не используй его.

Главный приоритет:

```text
1. UX
2. Visual quality
3. Performance
4. Accessibility
5. Engineering quality
```

Весь проект должен быть реализован как единая, целостная creative system.
