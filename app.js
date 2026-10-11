import { SITE, WELCOME, ENTRY, DIRECTIONS, PRICE_NOTE, STEPS, BUTTONS, FORM } from './content.js';

const app = document.getElementById('app');

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ───────── Иконки ───────── */
const chevron = `<svg class="chev" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const backIcon = `<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="20" fill="#f9f9f9"/><path d="M23.5 11.5L15 20l8.5 8.5" fill="none" stroke="#232733" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const smiley = `<svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke="#232733" stroke-width="1.8" stroke-linecap="round"><circle cx="16" cy="16" r="13"/><circle cx="11.8" cy="13" r="1.1" fill="#232733" stroke="none"/><circle cx="20.2" cy="13" r="1.1" fill="#232733" stroke="none"/><path d="M10.5 18.6c1.2 2.6 3.2 3.9 5.5 3.9s4.3-1.3 5.5-3.9"/></svg>`;

// рукописный синий овал вокруг «3 лет»
const scribble = `<svg viewBox="0 0 93 52" preserveAspectRatio="none" aria-hidden="true"><path d="M10 30C8 15 34 4 62 6c22 2 31 12 28 24-3 12-26 19-52 18C16 47 3 38 7 26 10 16 30 9 54 8" fill="none" stroke="#1e5bd8" stroke-width="1.6" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg>`;

/* ───────── Блоки ───────── */
const link = (cls, href, label) => `<a class="btn ${cls}" href="${href}">${esc(label)}</a>`;
const bar = (...items) => `<div class="bar">${items.join('')}</div>`;
const back = (href) => `<a class="back" href="${href}" aria-label="Назад">${backIcon}</a>`;

function cover(images, shadeSlot = '') {
  const imgs = images
    .map((src, i) => `<img src="${esc(src)}" alt="" decoding="async"${i ? ' loading="lazy"' : ' fetchpriority="high"'}>`)
    .join('');
  return `<div class="cover"><div class="cover__track"${images.length > 1 ? ' data-carousel' : ''}>${imgs}</div><div class="cover__shade"></div>${shadeSlot}</div>`;
}

const dots = (n) => (n > 1 ? `<div class="dots" aria-hidden="true">${Array.from({ length: n }, (_, i) => `<i${i ? '' : ' class="is-active"'}></i>`).join('')}</div>` : '');

function accordion({ id, title, body, open = false, extraClass = '' }) {
  return `<div class="acc${open ? ' is-open' : ''}${extraClass}">
    <button class="acc__head" type="button" id="${id}-h" aria-expanded="${open}" aria-controls="${id}">
      <span class="acc__title">${esc(title)}</span>${chevron}
    </button>
    <div class="acc__body" id="${id}" role="region" aria-labelledby="${id}-h"${open ? '' : ' inert'}>
      <div class="acc__clip"><div class="acc__inner">${body}</div></div>
    </div>
  </div>`;
}

const applyHref = (dir) => `#/apply?dir=${dir}`;

/* ───────── Экраны ───────── */
function welcomeView() {
  const lines = WELCOME.titleLines
    .map((line) => `<span>${esc(line).replace(/\{(.+?)\}/, (_, t) => `<span class="circled">${t}${scribble}</span>`)}</span>`)
    .join('');
  const text = WELCOME.text
    .map((p) => `<p>${p.map(([t, dark]) => (dark ? `<b>${esc(t)}</b>` : esc(t))).join('')}</p>`)
    .join('');
  return {
    title: 'Елизавета — дизайнер',
    html: `<section class="page welcome">
      <div class="welcome__photo"><img src="img/welcome.webp" alt="Елизавета" fetchpriority="high"></div>
      <div class="welcome__panel">
        <div class="welcome__top">
          <h1 class="display hero-title">${lines}</h1>
          <div>
            <ul class="chips">${WELCOME.chips.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
            <div class="welcome__text">${text}</div>
          </div>
        </div>
        <div class="welcome__bottom">
          ${link('btn--dark', '#/start', WELCOME.cta)}
          <p class="welcome__mail"><span>Email</span><a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a></p>
        </div>
      </div>
    </section>`,
  };
}

function entryView() {
  const cards = Object.values(DIRECTIONS)
    .map(
      (d) => `<article class="card">
        <div class="card__top"><h2>${esc(d.name)}</h2><p>${esc(d.cardText)}</p></div>
        <div class="card__pics" aria-hidden="true"><i></i><i></i><i></i></div>
        ${link('btn--dark', `#/${d.id}`, ENTRY.cta)}
      </article>`
    )
    .join('');
  return {
    title: ENTRY.title,
    html: `<section class="page entry">
      <header class="entry__head"><h1>${esc(ENTRY.title)}</h1><p>${ENTRY.subtitle.map(esc).join('<br>')}</p></header>
      <div class="entry__cards">${cards}</div>
    </section>`,
  };
}

function serviceView(dir) {
  const d = DIRECTIONS[dir];
  const items = d.services
    .map((s, i) =>
      accordion({
        id: `${dir}-svc-${i}`,
        title: s.title,
        body: `<div class="acc__copy">
            <p>${s.description.map(esc).join('<br>')}</p>
            <dl>${s.extras.map((x) => `<div><dt>${esc(x.label)}</dt><dd>${esc(x.text)}</dd></div>`).join('')}</dl>
          </div>
          <div class="prices">
            <div class="price"><span>${esc(PRICE_NOTE.priceLabel)}</span><b>${esc(s.price)}</b></div>
            <div class="price"><span>${esc(PRICE_NOTE.termLabel)}</span><b>${esc(s.term)}</b></div>
          </div>`,
      })
    )
    .join('');
  return {
    title: d.name,
    carousel: d.covers.length > 1,
    html: `<section class="page service">
      ${cover(d.covers)}
      ${back('#/start')}
      <div class="panel">
        <div class="panel__title"><h1 class="display">${esc(d.coverTitle)}</h1>${dots(d.covers.length)}</div>
        <div class="panel__intro">
          <p class="note"><b>${esc(PRICE_NOTE.bold)}</b><span>${esc(PRICE_NOTE.rest)}</span></p>
          <div class="circles" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
        </div>
        <div class="acc-list">${items}</div>
      </div>
      ${bar(link('btn--primary', applyHref(dir), BUTTONS.book), link('btn--ghost', `#/${dir}/steps`, BUTTONS.steps))}
    </section>`,
  };
}

function stepsView(dir) {
  const d = DIRECTIONS[dir];
  const items = STEPS.items
    .map((s, i) =>
      accordion({
        id: `${dir}-step-${i}`,
        title: s.title,
        open: i === 0,
        extraClass: ' acc--step',
        body: `<div class="acc__copy"><p>${esc(s.text)}</p></div>`,
      })
    )
    .join('');
  return {
    title: STEPS.title,
    html: `<section class="page steps">
      ${cover([d.stepsCover])}
      ${back(`#/${dir}`)}
      <div class="panel">
        <div class="panel__title"><h1 class="display">${esc(STEPS.title)}</h1></div>
        <div class="acc-list">${items}</div>
      </div>
      ${bar(link('btn--primary', applyHref(dir), BUTTONS.book), link('btn--ghost', `#/${dir}/cases`, BUTTONS.cases))}
    </section>`,
  };
}

function casesView(dir) {
  const d = DIRECTIONS[dir];
  return {
    title: d.case.title,
    html: `<section class="page cases">
      ${cover([d.casesCover])}
      ${back(`#/${dir}/steps`)}
      <div class="panel">
        <div class="cases__text"><h1>${esc(d.case.title)}</h1><p>${esc(d.case.text)}</p></div>
        <div class="cases__buttons">
          ${link('btn--primary', applyHref(dir), BUTTONS.book)}
          ${link('btn--ghost', '#/', BUTTONS.home)}
        </div>
      </div>
    </section>`,
  };
}

function applyView(query) {
  const dir = DIRECTIONS[query.get('dir')] ? query.get('dir') : '';
  const opts = Object.values(DIRECTIONS)
    .map((d) => `<label><input type="radio" name="direction" value="${d.id}"${d.id === dir ? ' checked' : ''}><span>${esc(d.name)}</span></label>`)
    .join('');
  return {
    title: FORM.title,
    html: `<form class="page apply" novalidate>
      <div class="apply__top">
        <header class="apply__head"><h1>${esc(FORM.title)}</h1><p>${esc(FORM.subtitle)}</p></header>
        <fieldset class="fields" data-fields>
          <fieldset class="seg" data-field="direction">
            <legend>${esc(FORM.directionLabel)}</legend>
            <div class="seg__opts">${opts}</div>
            <p class="field__error" hidden></p>
          </fieldset>
          <div class="fields__pair">
            <div class="field" data-field="name">
              <input name="name" type="text" placeholder="${esc(FORM.namePlaceholder)}" aria-label="${esc(FORM.namePlaceholder)}" autocomplete="name" maxlength="100" enterkeyhint="next">
              <p class="field__error" hidden></p>
            </div>
            <div class="field" data-field="contact">
              <input name="contact" type="text" placeholder="${esc(FORM.contactPlaceholder)}" aria-label="${esc(FORM.contactPlaceholder)}" autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false" maxlength="100" enterkeyhint="next">
              <p class="field__error" hidden></p>
            </div>
          </div>
          <div class="field" data-field="comment">
            <label class="label" for="comment">${esc(FORM.commentLabel)}</label>
            <textarea id="comment" name="comment" placeholder="${esc(FORM.commentPlaceholder)}" maxlength="1500"></textarea>
          </div>
          <div class="hp" aria-hidden="true"><label>Website <input name="website" type="text" tabindex="-1" autocomplete="off"></label></div>
        </fieldset>
        <p class="form-error" role="alert" hidden></p>
      </div>
      <div class="apply__bottom" data-actions>
        <button class="btn btn--primary" type="submit">${esc(BUTTONS.book)}</button>
        ${link('btn--ghost', '#/', BUTTONS.home)}
      </div>
      <div class="sent" data-sent hidden>
        <div class="sent__head">${smiley}<h2 tabindex="-1">${esc(FORM.sent)}</h2></div>
        ${link('btn--ghost', '#/', BUTTONS.home)}
      </div>
    </form>`,
    mount: mountApply,
  };
}

/* ───────── Форма заявки ───────── */
function mountApply(root) {
  const form = root.querySelector('form.apply');
  const submit = form.querySelector('[type=submit]');
  const globalError = form.querySelector('.form-error');

  const setError = (name, msg) => {
    const box = form.querySelector(`[data-field="${name}"]`);
    if (!box) return;
    const p = box.querySelector('.field__error');
    box.classList.toggle('has-error', Boolean(msg));
    if (p) { p.textContent = msg || ''; p.hidden = !msg; }
  };

  form.addEventListener('input', (e) => {
    const box = e.target.closest('[data-field]');
    if (box) setError(box.dataset.field, '');
    globalError.hidden = true;
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const payload = {
      direction: data.direction || '',
      name: String(data.name || '').trim(),
      contact: String(data.contact || '').trim(),
      comment: String(data.comment || '').trim(),
      website: String(data.website || ''),
    };

    const errors = {};
    if (!DIRECTIONS[payload.direction]) errors.direction = FORM.errors.direction;
    if (!payload.name) errors.name = FORM.errors.name;
    if (payload.contact.length < 3) errors.contact = FORM.errors.contact;
    ['direction', 'name', 'contact'].forEach((k) => setError(k, errors[k]));
    const firstBad = Object.keys(errors)[0];
    if (firstBad) {
      form.querySelector(`[data-field="${firstBad}"] input`)?.focus({ preventScroll: false });
      return;
    }

    const label = submit.textContent;
    submit.classList.add('is-loading');
    submit.textContent = FORM.sending;
    globalError.hidden = true;

    try {
      const res = await fetch('/api/request', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      form.classList.add('is-sent');
      form.querySelector('[data-fields]').disabled = true;
      form.querySelector('[data-actions]').hidden = true;
      const sent = form.querySelector('[data-sent]');
      sent.hidden = false;
      sent.querySelector('h2').focus({ preventScroll: true });
    } catch (err) {
      globalError.textContent = FORM.errors.send;
      globalError.hidden = false;
      submit.classList.remove('is-loading');
      submit.textContent = label;
    }
  });
}

/* ───────── Аккордеоны и слайдер ───────── */
function setAcc(item, open) {
  item.classList.toggle('is-open', open);
  item.querySelector('.acc__head').setAttribute('aria-expanded', String(open));
  const body = item.querySelector('.acc__body');
  if (open) body.removeAttribute('inert');
  else body.setAttribute('inert', '');
}

app.addEventListener('click', (e) => {
  const head = e.target.closest('.acc__head');
  if (!head) return;
  const item = head.closest('.acc');
  const willOpen = !item.classList.contains('is-open');
  item.parentElement.querySelectorAll('.acc.is-open').forEach((a) => setAcc(a, false));
  if (willOpen) {
    setAcc(item, true);
    setTimeout(() => item.scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 300);
  }
});

function mountCarousel(root) {
  const track = root.querySelector('[data-carousel]');
  if (!track) return;
  const items = root.querySelectorAll('.dots i');
  track.addEventListener(
    'scroll',
    () => {
      const idx = Math.round(track.scrollLeft / track.clientWidth);
      items.forEach((d, i) => d.classList.toggle('is-active', i === idx));
    },
    { passive: true }
  );
}

/* ───────── Роутер (hash: работает на Netlify без настроек) ───────── */
const routes = [
  [/^\/$/, welcomeView],
  [/^\/start$/, entryView],
  [/^\/(web|graf)$/, (m) => serviceView(m[1])],
  [/^\/(web|graf)\/steps$/, (m) => stepsView(m[1])],
  [/^\/(web|graf)\/cases$/, (m) => casesView(m[1])],
  [/^\/apply$/, (m, q) => applyView(q)],
];

function render() {
  const raw = location.hash.replace(/^#/, '') || '/';
  const [path, qs = ''] = raw.split('?');
  const query = new URLSearchParams(qs);
  for (const [re, view] of routes) {
    const m = path.match(re);
    if (!m) continue;
    const v = view(m, query);
    app.innerHTML = v.html;
    document.title = v.title;
    window.scrollTo(0, 0);
    mountCarousel(app);
    v.mount?.(app);
    return;
  }
  location.replace('#/');
}

window.addEventListener('hashchange', render);
render();
