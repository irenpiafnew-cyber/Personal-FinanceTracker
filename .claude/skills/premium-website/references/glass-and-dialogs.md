# Скло (glassmorphism) і модальні вікна — веб-рецепти

> Принципи взято з Apple Liquid Glass (скіл `liquid-glass-design` з everything-claude-code) і перекладено з SwiftUI на CSS.
> Патерн модалки — з `frontend-patterns` (React), спрощено до нативного `<dialog>`.

## 1. Скляна панель
```css
.glass {
  background: color-mix(in oklab, var(--bg) 55%, transparent);
  -webkit-backdrop-filter: blur(16px) saturate(160%);
  backdrop-filter: blur(16px) saturate(160%);
  border: 1px solid color-mix(in oklab, var(--fg) 12%, transparent);
  border-radius: 20px;
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / .35),   /* «відблиск» по верхньому краю */
    0 10px 30px rgb(0 0 0 / .12);
}
/* Браузер без blur або людина просить менше прозорості — суцільний фон */
@supports not (backdrop-filter: blur(1px)) { .glass { background: var(--bg); } }
@media (prefers-reduced-transparency: reduce) { .glass { background: var(--bg); backdrop-filter: none; } }
```

## 2. «Рідкий» відблиск, що йде за курсором
```css
.glass-btn { position: relative; overflow: hidden; }
.glass-btn::after {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(120px circle at var(--x, 50%) var(--y, 50%), rgb(255 255 255 / .35), transparent 60%);
  opacity: 0; transition: opacity .3s;
}
.glass-btn:hover::after { opacity: 1; }
```
```js
document.querySelectorAll('.glass-btn').forEach(b => b.addEventListener('pointermove', e => {
  const r = b.getBoundingClientRect();
  b.style.setProperty('--x', `${e.clientX - r.left}px`);
  b.style.setProperty('--y', `${e.clientY - r.top}px`);
}));
```

## 3. Правила скла (з Apple, адаптовано)
| ✅ Роби | ❌ Не роби |
|---|---|
| Скло тільки на **керуючих елементах**: навбар, кнопки, плаваючі картки | Скло на всьому підряд |
| Під склом — **кольоровий або фото-фон**, інакше ефекту не видно | Скло на однотонному фоні |
| Максимум **2–3 шари** скла на екрані | Скло в склі в склі |
| Текст на склі з контрастом **≥ 4.5:1**, перевір у світлій і темній темі | Сірий тонкий текст на склі |
| Анімуй `transform` і `opacity` | Анімувати сам `blur()`, бо на телефонах це гальмує |

## 4. Модальне вікно (доступне, без бібліотек)
Нативний `<dialog>` + `showModal()` сам ловить фокус усередині, закривається клавішею Esc і повертає фокус на кнопку, яка його відкрила.
```html
<button data-open="m1">Записатися</button>
<dialog id="m1" class="glass" aria-labelledby="m1-title">
  <h2 id="m1-title">Запис на консультацію</h2>
  <form method="dialog"><button>Закрити</button></form>
</dialog>
```
```css
dialog::backdrop { background: rgb(0 0 0 / .4); backdrop-filter: blur(4px); }
dialog[open] { animation: pop .3s cubic-bezier(.16,1,.3,1); }
@keyframes pop { from { opacity: 0; transform: translateY(20px) scale(.96); } }
@media (prefers-reduced-motion: reduce) { dialog[open] { animation: none; } }
```
```js
document.querySelectorAll('[data-open]').forEach(b =>
  b.addEventListener('click', () => document.getElementById(b.dataset.open).showModal()));
```

## 5. Debounce для resize/input
```js
const debounce = (fn, ms = 200) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
addEventListener('resize', debounce(() => ScrollTrigger.refresh()));
```
