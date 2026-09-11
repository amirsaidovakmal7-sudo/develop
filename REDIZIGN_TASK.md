# REVISION 02 — MOTION, 3D PERFORMANCE & PORTFOLIO STORYTELLING

Текущий redesign уже реализован, но результат требует серьёзной доработки.

Сейчас не нужно заново полностью переделывать весь сайт с нуля.

Нужно провести второй этап работы:

1. исправить текущий 3D / WebGL performance;
2. полностью переработать hero animation;
3. сделать гораздо более интересную типографическую motion system;
4. сделать portfolio section полноценным scroll-driven visual experience;
5. улучшить transitions между секциями;
6. убрать ощущение «однократных fade-in анимаций»;
7. сохранить текущую visual direction: light / abstract / creative 3D;
8. сохранить весь существующий контент и backend functionality.

Очень важно:

НЕ просто добавляй больше анимаций.

Сначала пойми существующую motion architecture и причину лагов.

---

# 1. СНАЧАЛА ПРОВЕДИ PERFORMANCE AUDIT

Перед изменением animation code внимательно изучи текущую реализацию React / Three.js / R3F / GSAP / Motion.

Найди:

- главный 3D scene;
- canvas;
- render loop;
- postprocessing;
- materials;
- lights;
- shadows;
- textures;
- environment maps;
- particles;
- geometry;
- animation loops;
- pointer tracking;
- scroll listeners;
- GSAP timelines;
- Motion animations;
- requestAnimationFrame;
- resize handlers;
- scroll handlers;
- event listeners;
- компоненты, которые постоянно перерисовываются;
- места, где меняется React state при каждом animation frame;
- места, где происходит unnecessary React re-render;
- слишком тяжёлые effects.

Особенно проверь:

- pixel ratio;
- canvas resolution;
- devicePixelRatio;
- количество lights;
- shadow map;
- postprocessing;
- transparent materials;
- refraction;
- transmission;
- bloom;
- particles;
- geometry complexity.

---

# 2. ГЛАВНАЯ ПРОБЛЕМА — 3D ЛАГАЕТ

Сейчас при открытии страницы и во время взаимодействия 3D scene вызывает заметные подвисания.

Это неприемлемо.

Потенциальный пользователь не должен чувствовать:

- frame drops;
- stutter;
- freezing;
- input delay;
- delayed scroll;
- tearing;
- резкие скачки объекта.

Сначала найди реальную причину.

Не маскируй проблему тем, что просто уменьшишь animation speed.

Нужно улучшить именно render architecture.

---

# 3. PERFORMANCE ПРАВИЛА ДЛЯ THREE.JS / R3F

Используй оптимальный подход для текущей сцены.

Проверить возможность использования:

frameloop="demand"

там, где continuous rendering не требуется.

Если continuous animation действительно необходима — сделать animation loop максимально дешёвым.

Не использовать React state внутри animation frame для значений, которые могут храниться в refs.

Плохой подход:

setState(...)
каждый frame

Вместо этого:

useRef
+
direct object mutation
+
three.js refs

где это подходит.

---

# 4. DEVICE PIXEL RATIO

Не рендерить canvas с чрезмерно высоким DPR.

Настроить разумный диапазон:

desktop:
1–1.5

mobile:
1–1.25

или другой оптимальный adaptive value после profiling.

Обязательно учитывать:

window.devicePixelRatio

и ограничивать его.

Главное:

не позволить retina / 4K display автоматически превратить scene в чрезмерно дорогой render target.

---

# 5. MOBILE 3D

На mobile 3D должно автоматически упрощаться.

Проверять:

mobile
tablet
desktop

На mobile:

- меньше particles;
- ниже DPR;
- проще geometry;
- меньше lights;
- без тяжёлого postprocessing;
- без unnecessary shadows;
- без дорогих transmission effects, если они вызывают lag.

Если устройство слабое:

использовать simplified scene или static fallback.

---

# 6. УБРАТЬ ТЯЖЁЛЫЕ EFFECTS, ЕСЛИ ОНИ НЕОПРАВДАННЫ

Особенно проверить:

- Bloom;
- Chromatic Aberration;
- Depth of Field;
- Motion Blur;
- Screen Space effects;
- heavy refraction;
- excessive transparency.

Не использовать postprocessing только потому, что он выглядит красиво.

Если visual quality можно получить дешевле — использовать более дешёвое решение.

---

# 7. 3D OBJECT СЕЙЧАС ВЫГЛЯДИТ НЕПРАВИЛЬНО

Сейчас hero object визуально выглядит как большой круглый / шарообразный объект.

Это не та art direction, которую мы хотим.

Нужно заменить его.

Не использовать:

- обычную сферу;
- ball;
- generic orb;
- glass ball.

Нужна форма ближе к:

abstract liquid sculpture

или

soft irregular digital object

с ощущением дизайнерского 3D art object.

---

# 8. НОВАЯ 3D ФОРМА

Новая форма должна быть:

- асимметричной;
- мягкой;
- текучей;
- слегка вытянутой;
- irregular;
- premium;
- похожей на abstract digital sculpture.

Идея:

как будто это физический объект из:

glass
+
gel
+
liquid metal
+
pearlescent material

но без ощущения дешёвого CGI.

---

# 9. РАЗМЕЩЕНИЕ 3D В HERO

Сейчас объект слишком сильно вторгается в текст.

Это нужно исправить.

Новая композиция:

LEFT:
large typography

RIGHT:
3D sculpture

но с controlled overlap.

Object:

- не закрывает основные буквы;
- не перекрывает CTA;
- не мешает чтению;
- имеет достаточное empty space вокруг;
- сохраняет визуальный баланс.

На desktop object может немного выходить за container.

На mobile object должен находиться ниже текста.

---

# 10. 3D НЕ ДОЛЖЕН ПОСТОЯННО БЕШЕНО ВРАЩАТЬСЯ

Не делать:

object rotates endlessly

Это одна из причин ощущения дешёвой 3D-анимации.

Вместо этого:

### Idle

очень медленное плавное движение:

micro rotation
+
micro floating
+
light movement

### Mouse

Mouse слегка влияет на:

rotation
position
lighting

### Scroll

Scroll управляет основным transformation state.

Пользователь должен чувствовать:

> я двигаюсь по странице, и объект меняет состояние.

а не:

> рядом просто постоянно крутится 3D модель.

---

# 11. HERO 3D ANIMATION

Создать несколько состояний.

### STATE 1 — ENTRY

При загрузке:

3D object появляется не мгновенно.

Например:

scale 0.82
opacity 0

↓

становится:

scale 1
opacity 1

Но transition должен быть очень плавным.

Не использовать дешёвый scale + fade.

Object должен как будто «собраться» из нескольких layers.

---

# 12. HERO ENTRY ANIMATION

Одновременно с 3D должен появляться текст.

Но не обычным:

fade up

---

# 13. НОВАЯ TEXT ANIMATION SYSTEM

Сейчас текстовые блоки слишком статичны.

Нужна полноценная typography motion system.

Headline должен появляться по уровням.

Например:

FULL-STACK DEVELOPER

появляется первым.

После:

Я СОЗДАЮ

↓

потом:

ЦИФРОВЫЕ

↓

потом:

ПРОДУКТЫ.

Причём каждая строка должна иметь собственное motion behavior.

---

# 14. TEXT REVEAL — НЕ ПРОСТО FADE

Использовать разные типы reveal.

### Mask reveal

Текст находится внутри clip container.

При появлении:

translateY(100%)
→
translateY(0)

### Word reveal

Каждое слово появляется с небольшой задержкой.

### Line reveal

Каждая строка появляется последовательно.

### Highlight reveal

Accent word проходит через light sweep.

Но НЕ использовать всё одновременно.

---

# 15. HERO HEADLINE

Главный headline должен иметь motion hierarchy.

Например:

Я СОЗДАЮ

обычный.

ЦИФРОВЫЕ

большой.

ПРОДУКТЫ.

ещё больше + accent.

Во время появления:

- line 1;
- line 2;
- line 3

имеют разные timing.

Это должно выглядеть как editorial title sequence.

---

# 16. HERO SUPPORTING CONTENT

Маленькие элементы тоже должны иметь motion.

Например:

САЙТЫ · WEB APPS · TELEGRAM · BACKEND

может:

- fade;
- slide;
- letter spacing transition.

Description появляется после headline.

CTA появляется последним.

Последовательность:

label
↓
headline
↓
supporting text
↓
CTA
↓
3D settles

---

# 17. CTA ANIMATION

Кнопки не должны просто:

scale(1.02)

При hover:

arrow moves
+
background shifts
+
subtle light moves
+
text transitions

Например:

START A PROJECT →

↓

hover:

START A PROJECT →→

Но аккуратно.

---

# 18. SCROLL-BASED HERO TRANSITION

Когда пользователь начинает scroll:

hero не должен просто исчезать.

Нужно сделать transition:

headline
↓
slightly scales
↓
moves
↓
opacity decreases

3D:

changes position
↓
slightly rotates
↓
moves toward edge

Background:

subtle color transition

И следующий section появляется как continuation.

---

# 19. ТЕКСТОВЫЕ БЛОКИ НИЖЕ HERO

Сейчас ниже hero слишком много обычных статичных text blocks.

Нужно добавить motion в следующие sections:

- About;
- Stack;
- Services;
- Process;
- Contact.

Но каждый блок должен иметь собственную animation identity.

Не копировать одну и ту же reveal animation.

---

# 20. ABOUT TEXT ANIMATION

При появлении About:

ОБО МНЕ

маленький label.

После:

Я СОЗДАЮ

появляется.

↓

САЙТЫ
WEB-ПРИЛОЖЕНИЯ
TELEGRAM-БОТЫ

слова могут появляться с stagger.

Большой statement должен иметь subtle mask reveal.

---

# 21. TEXT SCROLL PARALLAX

Для некоторых крупных текстовых блоков использовать very subtle parallax.

Например:

scroll
→
large typography moves slightly slower

Но буквально на несколько pixels.

Не делать aggressive parallax.

---

# 22. TEXT COLOR TRANSITION

Некоторые слова могут менять цвет при прохождении viewport.

Например:

DIGITAL

начинает black.

При scroll:

black
→
indigo
→
soft violet
→
black

Очень subtle.

Это должно восприниматься как light passing through typography.

---

# 23. STACK SECTION

Technology graph не должен просто fade-in.

При scroll:

PYTHON

появляется первым.

Затем:

DJANGO
FASTAPI

подключаются линиями.

Затем:

POSTGRESQL
SQLALCHEMY

Затем:

AIROGRAM
TELEBOT

Каждый node физически появляется и соединяется с предыдущим.

Можно использовать Motion / SVG lines.

---

# 24. SERVICES ANIMATION

При hover service:

01 BUSINESS WEBSITES

не просто меняет цвет.

Нужно:

text expands
+
visual stage changes
+
3D / graphic object moves
+
description appears

Transition между services:

old state
→
morph-like movement
→
new state

---

# 25. PORTFOLIO — ГЛАВНОЕ ИЗМЕНЕНИЕ

Сейчас portfolio ощущается как список отдельных карточек.

Это нужно полностью изменить.

Не делать:

card
card
card
card

в традиционной grid.

---

# 26. НОВАЯ PORTFOLIO EXPERIENCE

Сделать scroll-driven case study sequence.

Идея:

Один project занимает visual stage.

Когда пользователь scroll:

PROJECT 01

появляется.

Он удерживается некоторое время.

Потом scroll вызывает:

PROJECT 01
→
moves away
→
PROJECT 02
enters

Далее:

PROJECT 02
→
PROJECT 03
→
PROJECT 04

и так далее.

Пользователь должен чувствовать, что он листает не карточки, а последовательность презентаций.

---

# 27. PORTFOLIO SECTION ARCHITECTURE

Использовать примерно:

sticky viewport
+
scroll progress
+
project stages

Например:

<section class="projects-scroll">
   <div class="projects-sticky">
       <ProjectStage />
   </div>
</section>

Высота scroll container может быть значительно больше viewport.

Например:

number of projects × viewport height

Но не обязательно ровно 100vh на каждый project.

Главное — добиться комфортного scroll experience.

---

# 28. PROJECT TRANSITION

Каждый transition между проектами должен быть уникальным, но принадлежать одной motion system.

Например:

### Project A

media scales down.

### Project B

enters from right.

### Project C

image expands from center.

### Project D

text moves while media fades in.

### Project E

video expands.

Но transition должен быть плавным.

Никаких резких карточных переключений.

---

# 29. PROJECT MEDIA

Не обязательно показывать всю информацию сразу.

Сначала:

Project number
Project title
category
hero visual

После:

stack
description
live link

может появляться как часть transition.

---

# 30. PROJECT TITLE ANIMATION

Каждый title должен появляться через mask.

Например:

AYSDRUMS

↓

letters emerge slightly offset.

Можно использовать:

translateY
opacity
clip-path
letter-spacing

Но не excessive.

---

# 31. PROJECT VISUAL ANIMATION

Screenshot должен быть не просто static image.

Во время scroll:

image scale
+
small parallax
+
crop change
+
subtle perspective

Можно использовать очень лёгкое:

rotateX
rotateY

чтобы image чувствовался физическим объектом.

Но не превращать screenshot в вращающийся card.

---

# 32. PROJECT DEPTH

Сделать:

background
+
project image
+
metadata
+
decorative 3D layer

Например:

3D abstract fragment может проходить позади screenshot.

Это связывает portfolio с общей 3D visual language.

---

# 33. PROJECT PROGRESS

Добавить visual progress indicator.

Например:

01 / 12

или:

● ○ ○ ○ ○

или vertical progress line.

При scroll:

01
↓
02
↓
03

Это поможет пользователю понимать положение внутри portfolio.

---

# 34. SCROLL CONTROL

Не блокировать scroll агрессивно.

Не делать ситуацию:

пользователь пытается scroll → сайт слишком долго удерживает section.

Scroll должен оставаться естественным.

Pinned section использовать только там, где он реально улучшает storytelling.

---

# 35. МЫШЬ И SCROLL НЕ ДОЛЖНЫ КОНФЛИКТОВАТЬ

Очень важно:

pointer animation + scroll animation должны работать совместно.

Не должно быть:

mouse moves object one way
+
scroll instantly changes object another way

Использовать interpolation / damping.

Например:

currentRotation
→
lerp
→
targetRotation

А scroll state также должен быть interpolated.

---

# 36. MOTION ARCHITECTURE

Не делать огромный хаос из:

GSAP
+
Motion
+
CSS
+
requestAnimationFrame
+
setTimeout

для одного элемента.

Для каждого animation system определить owner.

Например:

### CSS

simple hover / focus.

### Motion

component interactions.

### GSAP ScrollTrigger

scroll storytelling.

### R3F / Three.js

3D object itself.

Это делает код предсказуемым.

---

# 37. CLEANUP

Очень внимательно проверить event listeners.

При unmount обязательно cleanup:

scroll listeners
resize listeners
pointer listeners
RAF
GSAP timelines
observers

Не должно быть memory leaks.

---

# 38. USE RAF INTELLIGENTLY

Не создавать несколько независимых requestAnimationFrame loops.

Нужно проверить весь проект.

Если существуют несколько loops:

объединить или оптимизировать там, где это возможно.

---

# 39. AVOID REACT STATE PER FRAME

Это критически важно.

Не делать:

setState(mouseX)

каждый frame.

Использовать:

refs
motion values
three object refs

где это подходит.

---

# 40. PERFORMANCE MONITORING

После оптимизации реально проверить performance.

Использовать browser DevTools:

- Performance;
- FPS;
- CPU;
- GPU;
- memory;
- React Profiler.

Проверить:

initial load
idle
mouse movement
scroll
portfolio transition
mobile

---

# 41. TARGET

На нормальном desktop:

стараться удерживать ~60 FPS

во время обычного взаимодействия.

На mobile цель:

stable and smooth

а не максимальная visual complexity.

Если конкретный 3D effect невозможно сохранить без lag:

УПРОСТИТЬ EFFECT.

Нельзя жертвовать плавностью ради красивой реализации.

---

# 42. 3D LOADING

Не блокировать initial render сайта ожиданием 3D.

Page content должен загрузиться независимо.

Правильная схема:

HTML / React content
        ↓
visible immediately

3D scene
        ↓
progressive initialize

---

# 43. 3D FALLBACK

Если WebGL unavailable:

показывать красивый static abstract shape.

Не пустой блок.

Например:

gradient blob
+
soft shadow
+
grain

---

# 44. 3D RESIZE

Очень внимательно обработать resize.

Не создавать дорогой recreate scene при каждом resize event.

Использовать debounced / optimized resize handling.

---

# 45. 3D ASSET OPTIMIZATION

Если используется GLTF/GLB:

- оптимизировать geometry;
- использовать Draco / Meshopt, если это действительно помогает;
- compress textures;
- не загружать ненужные assets;
- preload только необходимое.

Не загружать несколько тяжёлых 3D models одновременно.

---

# 46. NO UNNECESSARY SHADOWS

Проверить real need for shadows.

Если shadow expensive:

использовать:

baked shadow

или:

fake soft shadow

через CSS / plane texture.

---

# 47. MATERIAL OPTIMIZATION

Если transmission / refraction вызывает lag:

сделать визуально похожий материал проще.

Например вместо дорогого transmission:

transparent material
+
fresnel
+
soft gradient
+
reflection

Главное — визуальный результат.

---

# 48. HERO ANIMATION REFERENCE

Новая opening sequence должна выглядеть примерно так:

PAGE LOAD

small label appears
        ↓
headline line 1
        ↓
headline line 2
        ↓
headline line 3
        ↓
accent highlight
        ↓
description
        ↓
CTA
        ↓
3D object settles

Весь процесс:

примерно 1–2 секунды.

Не делать длинный cinematic loading screen.

---

# 49. HERO IDLE STATE

После opening animation сайт должен перейти в calm idle.

Не должна продолжаться бесконечная тяжёлая animation.

Idle:

very subtle object movement
+
light shift
+
tiny atmospheric motion

Пользователь должен чувствовать спокойствие.

---

# 50. SCROLL STORY

При scroll:

Hero
↓
3D transforms
↓
About typography
↓
Stack architecture
↓
Services
↓
Project 01
↓
Project 02
↓
Project 03
...
↓
Process
↓
Contact

Каждый переход должен быть плавным.

---

# 51. НЕ ДЕЛАТЬ ОДНОТИПНЫЙ REVEAL

Запрещено использовать один и тот же:

opacity: 0 → 1
transform: translateY(30px)

для 90% элементов сайта.

Это является одним из признаков generic AI design.

Нужно иметь несколько carefully designed motion patterns:

Pattern A — mask reveal
Pattern B — horizontal slide
Pattern C — scale reveal
Pattern D — stagger words
Pattern E — parallax
Pattern F — morph transition
Pattern G — clip reveal

Но использовать их по смыслу.

---

# 52. SECTION TRANSITIONS

Каждая секция должна иметь transition identity.

Hero → About:

3D object migration

About → Stack:

typography → nodes

Stack → Services:

nodes rearrange

Services → Portfolio:

visual stage becomes project

Portfolio → Process:

media collapses into line

Process → Contact:

line collapses into point

---

# 53. BACKGROUND TRANSITIONS

Фон не должен резко менять цвета.

Можно очень тонко использовать:

warm white
→
cool white
→
pale lavender
→
soft gray
→
warm white

Transition должен быть почти незаметным.

---

# 54. CONTACT ANIMATION

В конце страницы typography:

LET'S BUILD
SOMETHING REAL.

появляется большими строками.

При scroll:

letters settle

и 3D visual system собирается в небольшой abstract object.

Он может находиться рядом с CTA.

---

# 55. FINAL CTA

CTA:

START A PROJECT →

При hover:

- text shifts;
- arrow moves;
- soft light passes through button.

Не делать neon glow.

---

# 56. СОХРАНИТЬ EXISTING FUNCTIONALITY

Не потерять:

- RU / UZ / EN;
- projects;
- images;
- videos;
- lightbox/project viewer;
- Telegram links;
- form;
- phone validation;
- CSRF;
- `/order`;
- success/error;
- backend;
- Telegram notifications;
- SEO.

---

# 57. TRANSLATIONS

Все новые animation labels тоже переводятся.

Например:

VIEW
OPEN
EXPLORE
DRAG
SCROLL
NEXT
PREVIOUS

должны существовать в:

RU
UZ
EN

Не оставлять английский hardcoded text в русской версии.

---

# 58. ПОСЛЕ РЕАЛИЗАЦИИ ПРОВЕРЬ TRANSLATION KEYS

Требование:

RU === EN === UZ

по набору keys.

Результат:

missing = 0
undefined = 0
hardcoded visible strings = 0

---

# 59. FINAL PERFORMANCE CHECK

После реализации сравнить:

### Before

- initial load;
- FPS;
- scroll smoothness;
- CPU;
- memory.

### After

- initial load;
- FPS;
- scroll smoothness;
- CPU;
- memory.

Не считать optimization завершённой просто потому, что «вроде стало лучше».

Проверь реально.

---

# 60. FINAL QA CHECKLIST

### Hero

- [ ] no lag
- [ ] no oversized 3D
- [ ] no text overlap
- [ ] smooth opening
- [ ] strong typography animation
- [ ] 3D interaction works

### Text

- [ ] multiple animation patterns
- [ ] no generic reveal everywhere
- [ ] readable
- [ ] smooth transitions

### Portfolio

- [ ] no boring card grid
- [ ] scroll-driven presentation
- [ ] project-to-project transitions
- [ ] progress indicator
- [ ] metadata animation
- [ ] media movement

### 3D

- [ ] 60fps target desktop
- [ ] stable mobile
- [ ] adaptive DPR
- [ ] optimized render loop
- [ ] no state update per frame
- [ ] no unnecessary postprocessing
- [ ] fallback exists

### Functionality

- [ ] form works
- [ ] `/order` works
- [ ] Telegram notification works
- [ ] RU works
- [ ] UZ works
- [ ] EN works

---

# 61. ГЛАВНЫЙ ПРИНЦИП ЭТОЙ ДОРАБОТКИ

Мне НЕ нужно:

> «добавить больше анимаций».

Мне нужно:

> СОЗДАТЬ ПОЛНОЦЕННУЮ MOTION LANGUAGE ДЛЯ ВСЕГО САЙТА.

Animations должны быть связаны между собой.

Пользователь должен чувствовать, что сайт реагирует на его движение и scroll.

Сайт не должен просто показывать контент.

Он должен РАССКАЗЫВАТЬ ИСТОРИЮ ЧЕРЕЗ ДВИЖЕНИЕ.

---

# 62. ОСОБЕННО ВАЖНО

Сейчас текущая версия уже имеет красивую базовую art direction, но её motion implementation нужно существенно улучшить.

Поэтому:

НЕ ПЕРЕДЕЛЫВАЙ ВЕСЬ DESIGN SYSTEM БЕЗ НЕОБХОДИМОСТИ.

Сначала исправь:

1. 3D performance;
2. 3D visual quality;
3. typography motion;
4. section transitions;
5. portfolio storytelling.

Только потом вноси дополнительные visual refinements.

---

# 63. START WORKFLOW

Начни с:

1. Audit current animation architecture
2. Audit Three.js / R3F performance
3. Find causes of lag
4. Fix render architecture
5. Redesign hero 3D motion
6. Build typography motion system
7. Build scroll-driven portfolio
8. Connect section transitions
9. Optimize again
10. Test desktop/mobile
11. Verify all functionality

После каждого крупного этапа проверяй, что приложение продолжает запускаться.

Не ломай backend.

Не меняй `/order` contract без крайней необходимости.

---

# 64. FINAL QUALITY BAR

После завершения сайт должен ощущаться:

calm
premium
fluid
creative
interactive
fast
technical
art-directed

а не:

busy
laggy
overanimated
generic
template-like
AI-generated

Главное:

LESS EFFECTS.
BETTER MOTION.
BETTER PERFORMANCE.
STRONGER STORYTELLING.
