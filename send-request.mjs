// Принимает заявку из приложения и отправляет её тебе в Telegram через бота.
// Токен и chat_id берутся из переменных окружения Netlify — в код сайта они не попадают.

const DIRECTIONS = {
  web: 'Веб-дизайн',
  graf: 'Графический дизайн',
};

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

const escapeHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const clean = (v, max) => (typeof v === 'string' ? v.replace(/\u0000/g, '').trim().slice(0, max) : '');

export default async (req) => {
  if (req.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405);

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error('TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не заданы в переменных окружения Netlify');
    return json({ ok: false, error: 'not_configured' }, 500);
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, error: 'bad_json' }, 400);
  }

  // Скрытое поле-ловушка для ботов: люди его не заполняют.
  if (clean(body?.website, 200)) return json({ ok: true });

  const direction = DIRECTIONS[clean(body?.direction, 20)];
  const name = clean(body?.name, 100);
  const contact = clean(body?.contact, 100);
  const comment = clean(body?.comment, 1500);

  if (!direction || !name || contact.length < 3) return json({ ok: false, error: 'invalid' }, 400);

  const lines = [
    '🆕 <b>Новая заявка</b>',
    '',
    `<b>Направление:</b> ${escapeHtml(direction)}`,
    `<b>Имя:</b> ${escapeHtml(name)}`,
    `<b>Телеграм:</b> ${escapeHtml(contact)}`,
  ];
  if (comment) lines.push('', `<b>Комментарий:</b>\n${escapeHtml(comment)}`);

  let res;
  try {
    res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: lines.join('\n'),
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });
  } catch (err) {
    console.error('Telegram недоступен:', err);
    return json({ ok: false, error: 'telegram_unreachable' }, 502);
  }

  if (!res.ok) {
    console.error('Telegram вернул ошибку:', res.status, await res.text().catch(() => ''));
    return json({ ok: false, error: 'telegram_error' }, 502);
  }

  return json({ ok: true });
};

export const config = { path: '/api/request' };
