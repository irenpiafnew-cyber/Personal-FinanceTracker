# Аватар: Ірина (фотореалізм, схожий на оригінал)

## 1. Паспорт персонажа
| | Опис | EN-ключ для промптів |
|---|---|---|
| Волосся | Довге пряме, темно-русе з освітленими кінчиками, проділ посередині | `long straight dark-blonde hair with lighter blonde ends, center part` |
| Очі | Сіро-зелені | `grey-green eyes` |
| Обличчя | Світла шкіра, виразні повні губи, м'які риси | `fair skin, full lips, soft features` |
| ⭐ **Фірмова деталь** | Великі шестикутні окуляри: чорна оправа, червоно-коралові дужки | `oversized hexagonal black glasses with red and coral temples` |
| Стиль | Casual-chic: oversize світлий денім, чорна міді-сукня, леопардові лофери, чорна сумка crossbody | `light acid-wash oversized denim jacket` / `black off-shoulder midi dress` |
| Палітра бренду | Лаванда `#7C5CFF` · чорний `#1A1528` · корал з окулярів `#FF5A4E` | `lavender and soft violet tones, coral accent` |
| Враження | Стильна, впевнена, тепла | `confident, warm, stylish` |

> 💡 **Ідея:** корал з окулярів можна додати на сайт як другий акцент, і бренд «зшиється» з твоїм образом.

**Ключова фраза (вставляй у кожен промпт дослівно):**
```
woman with long straight dark-blonde hair with lighter ends and center part, grey-green eyes, fair skin, full lips, wearing oversized hexagonal black glasses with red and coral temples
```

---

## 2. Промпти

### A. Аватарка для соцмереж (1:1)
```
Close-up editorial portrait of a woman with long straight dark-blonde hair with lighter ends and center part, grey-green eyes, fair skin, full lips, wearing oversized hexagonal black glasses with red and coral temples, gentle confident smile, looking at camera, light acid-wash denim jacket, soft lavender gradient studio background, soft key light from the left, subtle violet rim light, photorealistic, shot on 85mm lens f/1.8, natural skin texture, high detail
```
Midjourney: додай `--ar 1:1 --style raw`.

### Б. Портрет для сайту, hero (4:5, по пояс)
```
Waist-up portrait of a woman with long straight dark-blonde hair with lighter ends and center part, grey-green eyes, fair skin, full lips, wearing oversized hexagonal black glasses with red and coral temples, elegant black off-shoulder midi dress, arms relaxed, three-quarter pose, looking slightly off camera with a calm confident expression, minimal background with blurred lavender and pink light orbs, soft diffused daylight, premium fashion editorial photography, 50mm lens, shallow depth of field, photorealistic
```
Midjourney: `--ar 4:5 --style raw`.

### В. Кадр ведучої для роликів (9:16)
```
Vertical medium shot of a woman with long straight dark-blonde hair with lighter ends and center part, grey-green eyes, fair skin, full lips, wearing oversized hexagonal black glasses with red and coral temples, light denim jacket over black top, sitting at a minimal desk with a laptop showing a lavender website, talking to camera with an open friendly expression, cozy modern studio, soft window light, lavender LED accent light in background, photorealistic, 35mm lens, natural skin texture
```
Midjourney: `--ar 9:16 --style raw`. Лиши зверху й знизу «повітря» під текст ролика.

### Г. Lifestyle / місто (16:9, обкладинки й банери)
```
Full-body lifestyle photo of a woman with long straight dark-blonde hair with lighter ends and center part, wearing oversized hexagonal black glasses with red and coral temples, black off-shoulder midi dress, leopard print loafers, black crossbody bag, leaning on a bridge railing in a modern European city, golden hour, looking into the distance, cinematic color grading with soft violet shadows, editorial street-style photography, 35mm lens, photorealistic
```
Midjourney: `--ar 16:9 --style raw`.

### Negative prompt (для Flux, Leonardo, Stable Diffusion)
```
cartoon, 3d render, plastic skin, over-smoothed face, distorted glasses, asymmetric lenses, extra fingers, deformed hands, text, watermark, logo, oversaturated
```

---

## 3. Як зберегти схожість (найважливіше!)
Без референсу генератор намалює «схожу жінку в таких самих окулярах», а не тебе.

| Інструмент | Як додати своє фото |
|---|---|
| **Midjourney v7** | Перетягни фото в поле **Omni Reference** (`--oref <url>`), вага `--ow 100–200`. Для v6 — `--cref <url> --cw 100` |
| **Flux Kontext / Flux Pro** | Завантаж фото як input image + промпт «keep the same face, change background and outfit…» |
| **Leonardo** | Image Guidance → **Character Reference**, сила Mid або High |
| **Gemini (Nano Banana) / ChatGPT** | Завантаж фото і напиши: «Зроби студійний портрет цієї жінки…» + промпт. Найпростіший старт: добре тримає схожість |

**Найкраще фото-референс** — перше (крупний план). Друге, у повний зріст, бери для промпту Г.

---

## 4. Говорячий аватар (цифровий двійник) — HeyGen
1. **Запиши 2 хвилини відео:**
   - на телефон 4K, вертикально;
   - камера на рівні очей, світло з вікна спереду-збоку;
   - ⚠️ **окуляри:** став світло збоку під кутом 45°, щоб не було відблисків у лінзах (або вибери лінзи з антиблиском);
   - говори спокійно, з легкою усмішкою, роби природні паузи; руки нижче кадру;
   - фон рівний, однотонний або лавандовий.
2. HeyGen → **Avatars → Create Instant Avatar / Digital Twin** → завантаж відео → запиши відео-згоду (так платформа перевіряє, що це справді ти).
3. **Голос:** клонуй свій (Voice Clone, 1–2 хвилини чистого запису) або вибери готовий.
4. Тестовий ролик: встав сценарій з `/short-video`, формат 9:16.

Альтернативи: Hedra (оживляє одне фото), Synthesia, D-ID.

---

## 5. Чекліст
- [ ] Окуляри на кожному зображенні однакові: шестикутні, чорні, з червоно-кораловими дужками
- [ ] Колір волосся й проділ збігаються з оригіналом
- [ ] Шкіра з природною текстурою, без «пластику»
- [ ] Руки без зайвих пальців
- [ ] На фоні є лавандовий акцент бренду
