# Бриф: фотореалістична рукавичка для hero Ravita

## Що має бути на картинці (як у затвердженому макеті)

- Рука в **глянцевій жовтій гумовій рукавичці** (колір близький до `#FFD128`) **входить у кадр справа зверху**, передпліччя йде за край кадру.
- Пальці **стискають чорну мокру губку** (поролон, видно пори).
- **Натуральна біла піна** на губці, стікає вниз-ліворуч; кілька **крапель** відриваються знизу.
- 2–4 **мильні бульбашки** з райдужним відблиском (не обов'язково, бо їх малює код).
- Світло студійне, м'яке, зверху-ліворуч. **Без тексту, без логотипів.**

## Технічні вимоги

| Параметр | Значення |
|---|---|
| Формат | PNG з **прозорим фоном** (потім я сама перетворю у WebP) |
| Розмір | мінімум **2000 px** по ширині |
| Пропорції | горизонтальні, близько **3:2** або 16:10 |
| Обрізання | рука може торкатися правого й верхнього краю, а губка й піна мають бути цілими, **не обрізаними** |
| Анатомія | 5 пальців, природні суглоби, без «злиплих» чи зайвих пальців |

## Варіант A (найшвидший): ChatGPT / GPT-image

Завантаж у ChatGPT **свій макет** (скріншот головного екрана) і напиши:

> Recreate only the yellow rubber glove holding the black wet sponge with soap foam from this design, as a standalone high-resolution photorealistic product photo. Same angle and composition: the hand enters from the top-right, the sponge is in the lower-left, foam drips down. Transparent background, no text, no letters, no other objects. Anatomically correct fingers. Landscape 3:2, 2048 px wide.

Якщо фон вийде не прозорим, у наступному повідомленні напиши: *«Make the background fully transparent and export as PNG.»*

## Варіант B: Midjourney

> photorealistic commercial product photo, a hand wearing a glossy bright yellow rubber cleaning glove entering the frame from the top right, firmly squeezing a wet black porous cleaning sponge, thick natural white soap foam dripping down from the sponge, a few water droplets falling, two small iridescent soap bubbles, isolated on pure white seamless background, soft studio light from the top left, crisp macro detail, anatomically correct five fingers, high-end advertising photography --ar 3:2 --style raw --v 7

- Можна додати свій макет як **референс стилю**: `--sref <посилання на картинку>`.
- Midjourney не вміє прозорий фон, тож білий фон потім прибираєш (див. нижче).

## Варіант C: Flux (Krea, fal.ai, Freepik)

Той самий промпт, що для Midjourney, без параметрів `--…`. Наприкінці додай: `aspect ratio 3:2, ultra detailed, 4k`.

**Негативний промпт** (якщо сервіс його підтримує):
> text, letters, logo, watermark, extra fingers, deformed hand, cartoon, illustration, blurry, cropped sponge

## Як прибрати фон

1. **remove.bg** або **Photoroom**: завантажити, скачати PNG.
2. Перевір **краї піни на збільшенні 200%**. Піна напівпрозора, і автоматика іноді «з'їдає» її або лишає сірий ореол. Якщо так, спробуй інший сервіс або Photoshop → *Select Subject* + *Refine Edge*.

## Чекліст перед тим, як надіслати мені

- [ ] 5 пальців, нічого дивного з анатомією
- [ ] губка чорна й мокра, видно пори
- [ ] піна природна, не «пластикова»
- [ ] фон прозорий (у перегляді видно «шахівницю»)
- [ ] ширина ≥ 2000 px

Надсилай **2–3 найкращі варіанти**: я подивлюся на сайті, який краще лягає з написом `ravita.` і формою.
