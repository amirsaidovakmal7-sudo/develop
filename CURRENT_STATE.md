# Текущее состояние akmal.dev (до редизайна)

## Как устроено
- **Бэкенд:** Django 6. Маршруты `/` (шаблон `app/templates/index.html` с `{% vite_asset_tags %}`) и `POST /order` (поля `name`, `phone_number`, CSRF, JSON `{ok}` / 400 `missing_fields` / 502 `telegram_failed`, отправка в Telegram-группу через telebot).
- **Фронтенд:** React 19 + TypeScript + Vite 8, CSS Modules, без runtime-зависимостей кроме React. Одностраничник, навигация якорями.
- **3D:** самописный WebGL2 — плоская решётка гирих за всей страницей (`scenes/GirihField`, ~790 строк), реагирует на курсор и скролл.
- **i18n:** `src/i18n/{ru,uz,en}.ts`, тип выводится из `ru.ts`, язык задаётся адресом (`/`, `/uz/…`, `/en/…`), localStorage больше не используется.

## Блоки страницы и оценка

| Блок | Что там | Вердикт |
|---|---|---|
| Hero | «Я создаю продукт от интерфейса до сервера», таблица «Основной стек: Python · Django · React» | ✗ говорит о технологиях, а не о пользе |
| Work | 12 проектов, просмотр кейса с галереей | ✓ сами кейсы — главное доказательство, переносим |
| Approach / «Обо мне» | 5 строк Frontend / Backend / База данных / Автоматизация / Деплой с иконками 20 технологий | ✗ именно та «нагрузка», от которой уходим |
| Build | 5 направлений, одно из них «Backend и API на Django и FastAPI» | ✗ переписываем на язык клиента |
| Process | 5 шагов: Бриф, План, Разработка, Тест, Деплой | ~ смысл верный, тексты технические («PRD», «frontend и backend») |
| Terms | Оплата, права, домен, правки | ✓ полезная информация, переносим в «Обо мне» как ответы на вопросы |
| Contact | Форма: имя + телефон | ~ нужны поле Telegram и галочка согласия |
| 3D | Фоновая решётка за всем сайтом | ✗ читается как текстура, не как объект |

## Что переносим
- **Медиа проектов** — `frontend/src/assets/projects/<id>/NN.webp` (10 папок, 2–7 кадров, всего ~1.8 MB), постеры видео `assets/posters/{sonata-bot,akkord}.webp`, видео Sonata Bot и Akkord на Uploadcare (`data/videos.ts`), карта размеров `data/mediaSizes.generated.ts`.
- **Данные проектов** — `data/projects.ts` (12 шт., ссылки на живые сайты), тексты кейсов в словарях (переписываем: убираем стек, оставляем задачу и результат).
- **Рабочая инфраструктура** (не дизайн): `useOrderForm` + `lib/phone.ts` (маска +998), `useCsrfToken`, провайдер i18n, `templatetags/vite_assets.py`, скрипты `fetch-media`, `gen-media-sizes`, `gen-fonts`, `check-i18n`.

## Что делаем с нуля
Весь дизайн, токены, шрифты, раскладку, компоненты, секции, 3D-сцену, тексты.
Удаляем: `scenes/GirihField`, `lib/girih.ts`, `lib/lantern.ts`, `scene/girihPatch.generated.ts`, `scripts/gen-girih.mjs`, `components/{Armature,GirihMark,SectionMark}`, `data/skillIcons.ts`, `assets/skills/` (иконки технологий больше не нужны), старые `sections/*`.

## Что меняется в бэкенде
- `/order` принимает **необязательное** поле `telegram` и пишет его в сообщение. Старые поля и коды ответов не меняются — изменение обратно совместимое.
- Маршруты `/about`, `/services`, `/projects`, `/contacts` отдают тот же `index.html`, страницу выбирает клиентский роутер.
