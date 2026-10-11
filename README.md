# Мобильное приложение-визитка

Статичный сайт без сборки (HTML + CSS + JS) и одна Netlify Function, которая отправляет заявки в Telegram.

## Что где лежит

- `public/` — сам сайт. Netlify раздаёт эту папку как есть.
  - `content.js` — **все тексты, услуги, этапы, цены**. Правь здесь, вёрстку трогать не нужно.
  - `img/` — картинки (webp). Чтобы заменить, положи файл с тем же именем.
  - `styles.css` — стили и цвета (переменные в начале файла).
  - `app.js` — экраны и логика.
- `netlify/functions/send-request.mjs` — приём заявки и отправка в Telegram.
- `netlify.toml` — настройки Netlify.

## 1. Telegram-бот (5 минут)

1. В Telegram напиши @BotFather, команда `/newbot`, получи токен вида `123456789:AA...`.
2. Напиши своему новому боту любое сообщение (иначе он не сможет тебе писать).
3. Узнай свой chat_id: напиши боту @userinfobot, он ответит числом.

## 2. Публикация на Netlify

**Через Git (рекомендуется, обновления подтягиваются сами):**
1. Залей папку проекта в репозиторий на GitHub.
2. Netlify → Add new site → Import an existing project → выбери репозиторий. Настройки подтянутся из `netlify.toml`.
3. Site configuration → Environment variables → добавь две переменные:
   - `TELEGRAM_BOT_TOKEN` — токен бота
   - `TELEGRAM_CHAT_ID` — твой chat_id
4. Deploys → Trigger deploy, чтобы переменные применились.

**Через консоль:** `npm i -g netlify-cli`, затем `netlify deploy --prod` в папке проекта. Переменные добавляются в панели Netlify так же.

Простое перетаскивание папки в Netlify Drop не подойдёт: функция отправки заявок при этом не публикуется.

## 3. Проверка

Открой сайт, пройди до формы, отправь тестовую заявку. Она должна прийти в Telegram. Если не пришла, смотри Netlify → Logs → Functions.

## Шрифт заголовков

В макете заголовки набраны шрифтом Measure. Пока подключён похожий узкий шрифт Fira Sans Extra Condensed. Чтобы использовать Measure: положи `Measure-Regular.woff2` в `public/fonts/` и раскомментируй блок `@font-face` в начале `styles.css`.

## Локальный просмотр

`python3 -m http.server 8000 --directory public` и открой http://localhost:8000. Форма локально не отправит заявку, для этого нужен `netlify dev`.
