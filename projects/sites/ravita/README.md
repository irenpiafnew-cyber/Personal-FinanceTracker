# Ravita Clean Service — демо-сайт (MolfarWeb)

Концепт комерційного сайту для клінінгової компанії з Рацибужа (Польща). Мова інтерфейсу — польська.
**Статус: демонстраційна версія.** Сторінка не є офіційним сайтом компанії, а форма нічого не надсилає й не зберігає.

## Запуск

```bash
cd projects/sites/ravita
npm install
npm run dev       # http://localhost:5173 — розробка
npm run build     # збірка в dist/
npm run preview   # перегляд зібраної версії
```

Стек: Vite + React + TypeScript + Tailwind CSS 4. Шрифт Plus Jakarta Sans підключено **локально** (а не з Google Fonts) через RODO/GDPR.
Анімаційних бібліотек немає: використано CSS keyframes, `requestAnimationFrame` і Canvas API.

## Структура

| Файл | Що робить |
|---|---|
| `src/content/pl.ts` | усі тексти: послуги, кроки, меню |
| `src/components/Hero.tsx`, `HeroGlove.tsx` | головний екран, рукавичка, краплі, бульбашки |
| `src/components/QuickQuote.tsx` | міні-форма в hero → передзаповнює повну форму |
| `src/components/Marquee.tsx` | жовтий рядок, що біжить |
| `src/components/Services.tsx` | 4 картки послуг |
| `src/components/CleaningDemo.tsx` | інтерактивне очищення вікна (Canvas) |
| `src/components/ContactForm.tsx` | повна форма, валідація, демо-режим |
| `src/components/Sections.tsx` | Jak to działa, O nas, Cennik, Galeria, Footer, Polityka |
| `src/lib/validation.ts` | правила перевірки (польський телефон, m², дата) |
| `src/index.css` | дизайн-токени, кнопки, поля, усі анімації, reduced-motion |

## Графічні ресурси, які треба замінити

| Ресурс | Куди покласти | Що змінити в коді |
|---|---|---|
| ✅ Рукавичка (готово, AI-згенерована, варіант 2) | `public/assets/hero-glove.webp` + `hero-glove-960.webp` | для заміни: об'єкт `GLOVE` у `HeroGlove.tsx` |
| 4 фото послуг, 4:5, ≥ 900×1125 | `public/assets/service-<id>.webp` (`domy`, `okna`, `biura`, `generalne`) | у `content/pl.ts`: `image: "assets/service-domy.webp"` |
| Чисте вікно / вид за склом, 16:9, ≥ 2000 px | `public/assets/window-clean.webp` | у `CleaningDemo.tsx`: `CLEAN_PHOTO` |
| Реальні роботи компанії | галерея | лише справжні фото від Ravita, **без AI** |

Рукавичку очищено від рожевого ореолу (артефакт видалення фону) і обрізано по контуру. Це ілюстрація, а не фото реальної роботи компанії.

### Промпти (Midjourney / Flux)

**Рукавичка (hero):**
> Photorealistic commercial product photo, a hand in a glossy bright yellow rubber cleaning glove (#FFD128) squeezing a wet black cleaning sponge, thick natural white soap foam dripping from the sponge, small water droplets falling, a few iridescent soap bubbles, isolated on pure white background, soft studio lighting from top-left, crisp detail, anatomically correct fingers, glove entering frame from the right side, 3/4 view, high-end advertising style --ar 4:3 --style raw

Після генерації прибрати фон (remove.bg, Photoshop або Photoroom), а краї піни перевірити на 200 %.

**Картки послуг** (спільна основа + варіант):
> Bright minimal editorial interior photo, white and light grey tones with a single yellow accent, soft daylight, clean, calm, premium cleaning service advertising, no people, no text --ar 4:5 --style raw

- `domy`: light grey sofa with one yellow cushion, tidy living room
- `okna`: close-up of a window pane with water droplets and warm yellow light behind
- `biura`: dark graphite modern office desk with black chair, evening light
- `generalne`: floor polishing machine with yellow body on a glossy white floor, foam

**Вікно для демо:**
> Photorealistic view through a perfectly clean window, sunny day, soft blurred green trees and light buildings of a small European town, gentle sun flare in the upper right corner, high-end real estate photo --ar 16:9 --style raw

## Що свідомо НЕ зроблено (потрібне підтвердження від компанії)

- ціни, рейтинги, відгуки, кількість клієнтів, років досвіду;
- номер телефону й точна територія обслуговування;
- реальне надсилання форми (наступний крок: Vercel Function + email і повна політика RODO);
- пункт меню «Opinie» з макета, бо відгуків поки немає.
