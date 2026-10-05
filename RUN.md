# Можно ли вынести `frontend` рядом с `project`?

**Да, можно.** Фронтенд собирается сам по себе, а с Django его связывают всего три строки с путём. Переезд безопасен, если поправить эти три места.

Сейчас: `PycharmProjectsMyOwnSite/project/frontend`. После переезда: `PycharmProjectsMyOwnSite/frontend` (рядом с `project/`, внутри того же git-репозитория).

## Что нужно поправить

Django ищет сборку фронтенда в `<project>/frontend/...`. После переезда эти пути станут неверными, и сайт покажет пустую страницу без стилей и скриптов.

| Файл | Что сейчас | Что сделать |
|---|---|---|
| `project/project/settings.py` (`STATICFILES_DIRS`) | `BASE_DIR / 'frontend' / 'dist'` | указать на новое место сборки |
| `project/app/templatetags/vite_assets.py` (`MANIFEST_PATH`) | `BASE_DIR / 'frontend' / 'dist' / '.vite' / 'manifest.json'` | то же |
| `project/app/seo.py` (`BUILD`) | `BASE_DIR / 'frontend' / 'dist-seo'` | то же (здесь лежат мета-теги и снимки страниц для поисковиков) |

Лучше вынести путь в одну настройку, чтобы не менять его в трёх местах:

```python
# settings.py
FRONTEND_DIR = Path(os.environ.get('FRONTEND_DIR', BASE_DIR.parent / 'frontend'))
STATICFILES_DIRS = [FRONTEND_DIR / 'dist']
```

В `vite_assets.py` и `seo.py` тогда использовать `settings.FRONTEND_DIR`. В Docker путь можно задать переменной окружения.

## Что менять не нужно

- Скрипты сборки (`gen-seo.ts`, `prerender.mjs`, `gen-og.mjs`), `vite.config.ts`, `package.json` и `src/` считают пути от своей папки, поэтому переезд их не затрагивает.
- `.env` остаётся в `project/` (на него указывает `BASE_DIR`).

## Как переехать

1. Остановить dev-сервер и IDE-задачи, которые держат папку.
2. Перенести: `git mv project/frontend frontend`. Так история файлов сохранится. `node_modules` в git не входит, поэтому после переноса запустить `npm ci` (или перенести папку целиком).
3. Поправить пути по таблице выше.
4. В `project/.gitignore` есть строка `frontend/node_modules`. Она действует только внутри `project/`. Добавить `node_modules` в `frontend/.gitignore` или в корневой `.gitignore`, иначе `node_modules` попадёт в `git status`.
5. Проверить: `cd frontend && npm run build`, затем `cd ../project && python manage.py check` и открыть сайт. В исходном коде страницы должны быть `<title>` и текст.
6. Обновить упоминания `frontend/…` в документации: `PRODUCT.md`, `CURRENT_STATE.md`, `SEO_AUDIT.md`. Это косметика.

## Что учесть для Docker

- **Контекст сборки.** Если `Dockerfile` лежит в `project/`, он не увидит `../frontend`. Положить `Dockerfile` и `docker-compose.yml` в корень репозитория (рядом с `project/` и `frontend/`) и вести сборку от корня. Ради этого переезд и имеет смысл.
- **Двухэтапная сборка.** Первый этап на `node:24` делает `npm ci && npm run build`. Второй этап на `python:3.14` копирует `project/` и результат первого этапа: `frontend/dist` и `frontend/dist-seo` (из `dist` нужен весь `dist`, из `dist-seo` — `meta.json` и `prerender/`).
- **Chrome для снимков страниц.** Последний шаг `npm run build` (`prerender.mjs`) запускает Chrome и по умолчанию ищет его по пути Windows. В Docker-образе Chrome нет, поэтому шаг тихо пропустится с предупреждением. Сайт при этом работает, но поисковики без JavaScript не увидят текст страниц. Два варианта:
  1. поставить в Node-образ `chromium` и задать `CHROME_PATH=/usr/bin/chromium`;
  2. собирать фронтенд на своём компьютере и коммитить `dist` и `dist-seo` (как сейчас), тогда в Docker сборка фронтенда не нужна и достаточно скопировать готовые папки.
- **Версия Node.** Скрипты `*.ts` запускаются напрямую, нужен Node 24.
- **Переменные окружения** (в `docker-compose.yml` или `.env`, не в образе): `DJANGO_DEBUG=False`, `DJANGO_ALLOWED_HOSTS`, `SITE_ORIGIN=https://akmal.dev`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_GROUP_ID`, при необходимости `GOOGLE_SITE_VERIFICATION` и `YANDEX_VERIFICATION`. Если за Docker стоит nginx или другой прокси с HTTPS, он должен передавать заголовок `X-Forwarded-Proto: https` (настройка `SECURE_PROXY_SSL_HEADER` уже есть).
- **Статика.** Docker-образ нужно запускать через gunicorn (или другой WSGI-сервер) и перед запуском выполнять `collectstatic`. `runserver` для продакшена не подходит. Для раздачи `/static/` нужен nginx, WhiteNoise или аналог, потому что при `DEBUG=False` Django сам статику не отдаёт.
- **База.** `db.sqlite3` лежит в `project/` и в образ попадать не должна (добавить в `.dockerignore`). Сайт её практически не использует (нет моделей, кроме админки).

## Если не хочешь править код

Можно оставить `frontend` внутри `project/`, а Dockerfile положить в корень репозитория и копировать `project/` целиком. Тогда ничего менять не придётся. Выносить папку нужно, только если хочется иметь `frontend` и `project` как два равноправных сервиса.

Скажи, если нужно, чтобы я сам сделал переезд и поправил пути, или подготовил `Dockerfile` и `docker-compose.yml`.
