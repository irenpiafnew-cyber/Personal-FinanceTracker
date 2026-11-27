# Бриф: 4 фото для карток послуг Ravita

Картки в макеті: **Domy i mieszkania**, **Mycie okien**, **Biura i lokale**, **Sprzątanie generalne**.
Фото мають виглядати як **одна серія**: те саме світло, мінімалізм, біло-сірі тони, жовтий акцент `#FFD128`.

## Технічні вимоги

| Параметр | Значення |
|---|---|
| Пропорції | **вертикальні 4:5** |
| Розмір | мінімум **1200 × 1500 px** |
| Фон | звичайний, **прозорість НЕ потрібна** |
| Формат | PNG або JPG, я сама переведу у WebP |
| Композиція | **нижня третина спокійна** (без дрібних деталей): там лежить текст картки |
| Без | людей з обличчями, тексту, логотипів, водяних знаків |

## Спільна основа (додай на початок кожного промпту)

> Minimal editorial interior photograph, soft natural daylight, clean white and light grey tones with a single bright yellow accent, calm premium cleaning service advertising, shallow depth of field, no people, no text, no logos, empty calm lower third of the frame for text overlay

**Midjourney:** у кінці додай `--ar 4:5 --style raw --v 7`
**ChatGPT:** у кінці допиши «Vertical 4:5, 1200×1500 px».

## Чотири картки

**1. `domy`: Domy i mieszkania** (світла картка)
> …a light grey modern sofa with one bright yellow cushion, tidy bright living room, white wall, fresh and airy

**2. `okna`: Mycie okien** (жовта картка)
> …close-up of a clean window glass covered with fresh water droplets, warm golden-yellow light behind the glass, bokeh, overall yellow tone

**3. `biura`: Biura i lokale** (темна, графітова картка)
> …a modern dark graphite office desk with a black ergonomic chair and a small green plant, evening light, dark moody tones, very clean

**4. `generalne`: Sprzątanie generalne** (світла картка)
> …a yellow floor polishing machine on a glossy white floor with soft white foam, top-down angle, spotless and bright

## Чекліст перед відправкою
- [ ] усі 4 виглядають як одна серія (світло, тон)
- [ ] у нижній третині немає дрібних деталей
- [ ] жодного тексту чи букв на зображенні
- [ ] вертикальні 4:5

**Важливо:** це ілюстрації послуг, не «наші роботи». У футері сайту вже є примітка «Zdjęcia mają charakter poglądowy».
Справжні фото робіт компанії підуть у **галерею**: вона з'явиться автоматично, щойно додамо їх у `GALLERY_PHOTOS` у файлі `src/content/pl.ts`.
