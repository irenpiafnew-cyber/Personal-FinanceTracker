import type { CSSProperties } from "react";

/**
 * Рукавичка + губка + піна, краплі та бульбашки.
 *
 * Фото — PNG з прозорим фоном (AI-згенероване, ілюстративне), очищене від рожевого ореолу
 * та стиснуте у WebP. Щоб замінити: покласти новий файл у public/assets і оновити GLOVE (src, w, h, drops).
 */
// Обраний варіант (v2). x/y крапель — кінчики патьоків піни у % картинки: звідти падають анімовані краплі.
const GLOVE = {
  src: "assets/hero-glove.webp",
  srcSmall: "assets/hero-glove-960.webp", // для телефонів — у 3 рази легший
  w: 1841,
  h: 1365,
  drops: [{ x: 20, y: 88 }, { x: 32, y: 84 }, { x: 39, y: 87 }],
};

// Анімовані краплі: різна тривалість і затримка — щоб не падали «хором»
const DROPS = GLOVE.drops.map((p, i) => ({ ...p, d: [3.2, 3.8, 2.9][i % 3], l: [0.2, 1.4, 2.3][i % 3], s: [9, 12, 8][i % 3], f: [220, 260, 200][i % 3] }));

// Мильні бульбашки
const BUBBLES = [
  { x: 18, y: 40, r: 34, d: 11, l: 0, dx: -18 },
  { x: 30, y: 62, r: 18, d: 9, l: 2.5, dx: 14 },
  { x: 70, y: 22, r: 46, d: 13, l: 1.2, dx: 22 },
  { x: 84, y: 48, r: 24, d: 10, l: 4, dx: -12 },
  { x: 52, y: 30, r: 14, d: 8, l: 5.5, dx: 10 },
  { x: 10, y: 70, r: 22, d: 12, l: 7, dx: 16 },
];

export function HeroGlove() {
  return (
    // Фото й краплі — два шари з однаковою анімацією, тож рухаються синхронно.
    <div className="relative w-full" style={{ aspectRatio: `${GLOVE.w} / ${GLOVE.h}` }} aria-hidden="true">
      <div className="glove-enter absolute inset-0">
        <div className="glove-float h-full w-full">
          <img
            src={GLOVE.src}
            srcSet={`${GLOVE.srcSmall} 960w, ${GLOVE.src} ${GLOVE.w}w`}
            sizes="(min-width: 1024px) 64vw, 100vw"
            alt=""
            width={GLOVE.w}
            height={GLOVE.h}
            fetchPriority="high"
            decoding="async"
            className="pointer-events-none h-full w-full select-none object-contain"
          />
        </div>
      </div>
      <div className="glove-enter absolute inset-0">
        <div className="glove-float relative h-full w-full">
        {DROPS.map((p, i) => (
          <span
            key={i}
            className="drop absolute block rounded-[50%_50%_50%_50%/60%_60%_40%_40%]"
            style={
              {
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.s,
                height: p.s * 1.35,
                background:
                  "radial-gradient(circle at 35% 30%, #fff 0 18%, rgb(220 232 240 / 0.75) 40%, rgb(120 140 160 / 0.45) 100%)",
                boxShadow: "inset -1px -2px 3px rgb(32 43 54 / 0.25), 0 2px 4px rgb(32 43 54 / 0.12)",
                "--dur": `${p.d}s`,
                "--delay": `${p.l}s`,
                "--fall": `${p.f}px`,
              } as CSSProperties
            }
          />
        ))}
        </div>
      </div>

      {BUBBLES.map((b, i) => (
        <span
          key={i}
          className="bubble pointer-events-none absolute block rounded-full"
          style={
            {
              left: `${b.x}%`,
              top: `${b.y}%`,
              width: b.r,
              height: b.r,
              background:
                "radial-gradient(circle at 30% 28%, rgb(255 255 255 / 0.95) 0 9%, transparent 14%), conic-gradient(from 210deg, rgb(255 209 40 / 0.28), rgb(140 200 255 / 0.3), rgb(255 150 220 / 0.22), rgb(160 255 200 / 0.25), rgb(255 209 40 / 0.28))",
              boxShadow: "inset 0 0 0 1px rgb(255 255 255 / 0.7), inset -3px -4px 8px rgb(32 43 54 / 0.12)",
              "--dur": `${b.d}s`,
              "--delay": `${b.l}s`,
              "--drift": `${b.dx}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
