import type { CSSProperties } from "react";

/**
 * Рукавичка + губка + піна, краплі та бульбашки.
 *
 * ТИМЧАСОВИЙ РЕСУРС: hero-glove-temp.webp вирізано з референсу (на білому фоні).
 * Фінальний файл — PNG/WebP з прозорим фоном: покладіть у public/assets/hero-glove.webp,
 * змініть GLOVE_SRC і вимкніть TEMP_BLEND — анімації лишаться без змін.
 */
export const GLOVE_SRC = "assets/hero-glove-temp.webp";
// Тимчасове фото має білий фон → mix-blend-mode: multiply робить білий «прозорим».
// Для фінального PNG з альфа-каналом: TEMP_BLEND = false.
export const TEMP_BLEND = true;
// М'яко гасимо краї тимчасового фото, щоб не було видно прямокутника
const TEMP_MASK =
  "linear-gradient(to right, transparent, #000 14%, #000 90%, transparent), linear-gradient(to bottom, transparent, #000 12%, #000 82%, transparent)";

// Краплі під губкою: x/y у % контейнера, тривалість і затримка різні — щоб не падали «хором»
const DROPS = [
  { x: 33, y: 78, d: 3.2, l: 0.2, s: 9, f: 220 },
  { x: 44, y: 84, d: 3.8, l: 1.4, s: 12, f: 260 },
  { x: 55, y: 81, d: 2.9, l: 2.3, s: 8, f: 200 },
  { x: 62, y: 86, d: 4.2, l: 0.8, s: 10, f: 240 },
  { x: 39, y: 82, d: 3.5, l: 3.1, s: 7, f: 180 },
];

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
    // Корінь БЕЗ transform/z-index: інакше multiply змішувався б лише сам із собою.
    // Фото й краплі — два шари з однаковою анімацією, тож рухаються синхронно.
    <div className="relative aspect-[1066/588] w-full" aria-hidden="true">
      <div className="glove-enter absolute inset-0" style={TEMP_BLEND ? { mixBlendMode: "multiply" } : undefined}>
        <div className="glove-float h-full w-full">
          <img
            src={GLOVE_SRC}
            alt=""
            width={1066}
            height={588}
            fetchPriority="high"
            decoding="async"
            className="pointer-events-none h-full w-full select-none object-contain"
            style={TEMP_BLEND ? { maskImage: TEMP_MASK, WebkitMaskImage: TEMP_MASK, maskComposite: "intersect", WebkitMaskComposite: "source-in" } : undefined}
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
