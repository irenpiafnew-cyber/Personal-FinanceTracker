---
name: avatar-prompt
description: Створює паспорт персонажа і набір узгоджених промптів для генерації аватара (Midjourney, Flux, Leonardo) та говорячого AI-аватара (HeyGen, Hedra, D-ID). Використовуй, коли просять «аватар», «аватарку», «персонажа», «AI-ведучого».
---

# Аватар за 4 кроки

## 1. Призначення
Аватарка для соцмереж / ведучий для відео / маскот бренду — від цього залежить кадр (портрет 1:1, по пояс 9:16, повний зріст).

## 2. Паспорт персонажа (якір узгодженості)
```
Name:
Age / vibe:
Face: (форма, очі, брови, губи, особливі прикмети)
Hair:
Outfit (signature):
Palette: 3 HEX
Personality in 3 words:
```

## 3. Промпти (англійською), 3 стилі
Шаблон:
`portrait of [паспорт: age, face, hair], [expression], wearing [outfit], [background], [lighting], [style], [camera/lens], high detail --ar 1:1`

Стилі на вибір: photorealistic editorial • 3D stylized (soft clay, Pixar-like) • flat vector illustration • anime cel-shading.

Negative: `blurry, extra fingers, distorted face, text, watermark`.

## 4. Узгодженість серії
- Повторюй ключові фрази паспорта **дослівно**.
- Використовуй reference image / character reference (Midjourney `--cref`, Flux/Leonardo — image reference).
- Фіксуй seed для варіацій.
- Для говорячого аватара: фронтальний портрет, нейтральний вираз, рівне світло, рот закритий.

Зберігай у `projects/avatars/<name>.md`.
Не копіюй реальних людей без їхньої згоди.
