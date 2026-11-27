import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { useReducedMotion, useReveal } from "../hooks/useMotion";

/**
 * Animation B — інтерактивне очищення вікна (Canvas API).
 *
 * Принцип: під canvas лежить ЧИСТА сцена, на canvas процедурно намальовано БРУД.
 * Губка «стирає» бруд режимом destination-out → брудна й чиста версії завжди збігаються.
 * Прогрес рахуємо по легкій сітці 48×30 клітинок, а не через getImageData (швидко на телефоні).
 *
 * Фото: коли буде реальне чисте фото вікна — покладіть public/assets/window-clean.webp
 * і встановіть CLEAN_PHOTO. Бруд підлаштується сам.
 */
const CLEAN_PHOTO: string | null = null;
const GRID_W = 48;
const GRID_H = 30;
const DONE_AT = 0.82;

// Детермінований генератор випадкових чисел — бруд щоразу однаковий
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function paintDirt(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const r = rng(42);
  ctx.globalCompositeOperation = "source-over";
  ctx.clearRect(0, 0, w, h);

  // 1. Загальний сіро-коричневий наліт
  const haze = ctx.createLinearGradient(0, 0, 0, h);
  haze.addColorStop(0, "rgba(128,118,100,0.78)");
  haze.addColorStop(1, "rgba(105,96,80,0.88)");
  ctx.fillStyle = haze;
  ctx.fillRect(0, 0, w, h);

  // 2. Плями різної щільності
  for (let i = 0; i < 70; i++) {
    const x = r() * w, y = r() * h, rad = (0.04 + r() * 0.16) * w;
    const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
    const dark = r() > 0.5;
    g.addColorStop(0, dark ? `rgba(80,70,55,${0.18 + r() * 0.2})` : `rgba(170,160,140,${0.15 + r() * 0.2})`);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }

  // 3. Патьоки від дощу
  ctx.lineCap = "round";
  for (let i = 0; i < 46; i++) {
    const x = r() * w, y0 = r() * h * 0.5, len = (0.15 + r() * 0.5) * h;
    ctx.strokeStyle = `rgba(70,62,50,${0.12 + r() * 0.18})`;
    ctx.lineWidth = 1 + r() * 3.5;
    ctx.beginPath();
    ctx.moveTo(x, y0);
    ctx.bezierCurveTo(x + (r() - 0.5) * 8, y0 + len * 0.4, x + (r() - 0.5) * 10, y0 + len * 0.7, x + (r() - 0.5) * 6, y0 + len);
    ctx.stroke();
  }

  // 4. Висохлі краплі-кільця
  for (let i = 0; i < 90; i++) {
    const x = r() * w, y = r() * h, rad = 2 + r() * 9;
    ctx.strokeStyle = `rgba(215,205,185,${0.25 + r() * 0.3})`;
    ctx.lineWidth = 1 + r() * 1.5;
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 5. Пилові точки
  for (let i = 0; i < 1400; i++) {
    ctx.fillStyle = `rgba(${r() > 0.5 ? "60,52,40" : "190,180,160"},${0.2 + r() * 0.4})`;
    ctx.fillRect(r() * w, r() * h, 1 + r() * 2, 1 + r() * 2);
  }
}

export function CleaningDemo() {
  const sectionRef = useReveal<HTMLElement>();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<Uint8Array>(new Uint8Array(GRID_W * GRID_H));
  const lastRef = useRef<{ x: number; y: number } | null>(null);
  const autoRef = useRef<number | null>(null);
  const sizeRef = useRef({ w: 0, h: 0 });
  const reduced = useReducedMotion();

  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [sponge, setSponge] = useState({ x: 0.72, y: 0.62, active: false });
  const [touched, setTouched] = useState(false);

  const reset = useCallback(() => {
    const c = canvasRef.current, wrap = wrapRef.current;
    if (!c || !wrap) return;
    if (autoRef.current) cancelAnimationFrame(autoRef.current);
    autoRef.current = null;
    const { width, height } = wrap.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = Math.round(width * dpr);
    c.height = Math.round(height * dpr);
    sizeRef.current = { w: width, h: height };
    const ctx = c.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paintDirt(ctx, width, height);
    gridRef.current.fill(0);
    lastRef.current = null;
    setProgress(0);
    setDone(false);
    setTouched(false);
  }, []);

  // Перемальовуємо бруд лише коли змінилась ШИРИНА (на телефоні висота «стрибає» через адресний рядок)
  useEffect(() => {
    reset();
    const wrap = wrapRef.current!;
    let lastW = wrap.getBoundingClientRect().width;
    const ro = new ResizeObserver(() => {
      const w = wrap.getBoundingClientRect().width;
      if (Math.abs(w - lastW) > 2) {
        lastW = w;
        reset();
      }
    });
    ro.observe(wrap);
    return () => {
      ro.disconnect();
      if (autoRef.current) cancelAnimationFrame(autoRef.current);
    };
  }, [reset]);

  /** Стирає бруд м'яким пензлем у точці (x, y) — координати в px контейнера */
  const scrub = useCallback((x: number, y: number) => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    const { w, h } = sizeRef.current;
    const rad = Math.max(30, Math.min(w, h) * 0.11);
    const from = lastRef.current ?? { x, y };
    const dist = Math.hypot(x - from.x, y - from.y);
    const steps = Math.max(1, Math.ceil(dist / (rad * 0.25)));

    ctx.globalCompositeOperation = "destination-out";
    const grid = gridRef.current;
    for (let i = 1; i <= steps; i++) {
      const px = from.x + ((x - from.x) * i) / steps;
      const py = from.y + ((y - from.y) * i) / steps;
      const g = ctx.createRadialGradient(px, py, rad * 0.35, px, py, rad);
      g.addColorStop(0, "rgba(0,0,0,0.95)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(px, py, rad * 1.15, rad * 0.85, 0, 0, Math.PI * 2);
      ctx.fill();

      // позначаємо очищені клітинки сітки
      const cw = w / GRID_W, ch = h / GRID_H, rr = rad * 0.75;
      const gx0 = Math.max(0, Math.floor((px - rr) / cw)), gx1 = Math.min(GRID_W - 1, Math.floor((px + rr) / cw));
      const gy0 = Math.max(0, Math.floor((py - rr) / ch)), gy1 = Math.min(GRID_H - 1, Math.floor((py + rr) / ch));
      for (let gy = gy0; gy <= gy1; gy++)
        for (let gx = gx0; gx <= gx1; gx++)
          if (Math.hypot((gx + 0.5) * cw - px, (gy + 0.5) * ch - py) < rr) grid[gy * GRID_W + gx] = 1;
    }
    lastRef.current = { x, y };

    let n = 0;
    for (let i = 0; i < grid.length; i++) n += grid[i];
    const p = n / grid.length;
    setProgress(p);
    if (p >= DONE_AT) setDone(true);
  }, []);

  const local = (e: PointerEvent) => {
    const r = wrapRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top, w: r.width, h: r.height };
  };

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if (done) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = local(e);
    lastRef.current = null;
    setTouched(true);
    setSponge({ x: p.x / p.w, y: p.y / p.h, active: true });
    scrub(p.x, p.y);
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const p = local(e);
    // на desktop губка слідує за курсором навіть без натискання
    setSponge((s) => ({ x: p.x / p.w, y: p.y / p.h, active: s.active }));
    if (e.buttons & 1 && !done) scrub(p.x, p.y);
  };
  const onUp = () => {
    lastRef.current = null;
    setSponge((s) => ({ ...s, active: false }));
  };

  // Клавіатура: стрілки рухають губку і чистять
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = 0.05;
    const d: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      autoClean();
      return;
    }
    if (!d[e.key] || done) return;
    e.preventDefault();
    setTouched(true);
    setSponge((s) => {
      const nx = Math.min(1, Math.max(0, s.x + d[e.key][0]));
      const ny = Math.min(1, Math.max(0, s.y + d[e.key][1]));
      const { w, h } = sizeRef.current;
      lastRef.current = { x: s.x * w, y: s.y * h };
      scrub(nx * w, ny * h);
      return { x: nx, y: ny, active: true };
    });
  };

  // Доступна альтернатива жестам: губка сама проходить зигзагом
  const autoClean = () => {
    if (done || autoRef.current) return;
    setTouched(true);
    const { w, h } = sizeRef.current;
    if (reduced) {
      for (let row = 0; row <= 6; row++) {
        lastRef.current = null;
        for (let i = 0; i <= 20; i++) scrub((i / 20) * w, (row / 6) * h);
      }
      return;
    }
    const rows = 6, duration = 3200, start = performance.now();
    lastRef.current = null;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / duration);
      const pos = k * rows;
      const row = Math.min(rows - 1, Math.floor(pos));
      const f = pos - row;
      const xN = row % 2 === 0 ? f : 1 - f;
      const yN = (row + 0.5 + (f > 0.92 ? (f - 0.92) / 0.08 : 0)) / rows;
      const x = (0.04 + xN * 0.92) * w, y = yN * h;
      setSponge({ x: x / w, y: y / h, active: true });
      scrub(x, y);
      if (k < 1) autoRef.current = requestAnimationFrame(tick);
      else {
        autoRef.current = null;
        setSponge((s) => ({ ...s, active: false }));
      }
    };
    autoRef.current = requestAnimationFrame(tick);
  };

  const pct = Math.round(Math.min(1, progress / DONE_AT) * 100);

  return (
    <section ref={sectionRef} id="pokaz" className="scroll-mt-20 bg-mist py-20 lg:py-28" aria-labelledby="demo-title">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-14">
        <div className="reveal flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-xl">
            <p className="eyebrow">02 / Zobacz różnicę</p>
            <h2 id="demo-title" className="mt-4 text-[clamp(2.2rem,4vw,3.4rem)] font-extrabold leading-[1.02] tracking-[-0.04em]">
              Przetrzyj szybę. Poczuj efekt<span className="dot">.</span>
            </h2>
            <p className="mt-5 text-ink-soft">
              Przeciągnij gąbką palcem lub kursorem. Możesz też użyć strzałek na klawiaturze albo przycisku „Wyczyść automatycznie”.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className="btn-sun disabled:opacity-50" onClick={autoClean} disabled={done}>
              Wyczyść automatycznie
            </button>
            <button type="button" className="btn-ghost" onClick={reset}>
              Jeszcze raz
            </button>
          </div>
        </div>

        <div className="reveal mt-10" style={{ "--delay": "120ms" } as CSSProperties}>
          <div
            ref={wrapRef}
            tabIndex={0}
            role="group"
            aria-label="Interaktywna szyba do wyczyszczenia. Użyj strzałek, aby przesuwać gąbkę, lub Enter, aby wyczyścić automatycznie."
            aria-describedby="demo-status"
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            onPointerLeave={() => setSponge((s) => ({ ...s, active: false }))}
            onKeyDown={onKey}
            className="relative aspect-square w-full cursor-none [container-type:size] touch-none select-none overflow-hidden rounded-[1.6rem] bg-white shadow-[0_40px_80px_-40px_rgb(32_43_54/0.45)] sm:aspect-[16/10] lg:aspect-[16/8]"
          >
            {/* ЧИСТА сцена */}
            {CLEAN_PHOTO ? (
              <img src={CLEAN_PHOTO} alt="" className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <CleanScene />
            )}

            {/* Сонячний блиск після очищення */}
            {done && (
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="shine-sweep absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/70 to-transparent" />
                <div
                  className="flare-in absolute right-[10%] top-[8%] h-48 w-48 rounded-full"
                  style={{ background: "radial-gradient(circle, rgb(255 255 255 / 0.95) 0 8%, rgb(255 240 190 / 0.55) 22%, transparent 65%)" }}
                />
              </div>
            )}

            {/* БРУД */}
            <canvas
              ref={canvasRef}
              aria-hidden="true"
              className={`absolute inset-0 h-full w-full transition-opacity duration-[1200ms] ${done ? "opacity-0" : "opacity-100"}`}
            />

            {/* Рама вікна поверх скла */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[1.6rem] border-[14px] border-white shadow-[inset_0_0_0_1px_rgb(32_43_54/0.08),inset_0_8px_24px_rgb(32_43_54/0.15)]">
              <div className="absolute inset-y-0 left-1/2 w-3 -translate-x-1/2 bg-white shadow-[0_0_12px_rgb(32_43_54/0.18)]" />
            </div>

            {/* Підказка */}
            {!touched && !done && (
              <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center">
                <span className="rounded-full bg-white/90 px-5 py-2.5 text-sm font-bold shadow-lg">Przeciągnij gąbką po szybie</span>
              </div>
            )}

            {/* Губка */}
            {!done && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-0"
                style={{
                  transform: `translate3d(calc(${sponge.x * 100}cqw - 50%), calc(${sponge.y * 100}cqh - 50%), 0) rotate(${sponge.active ? -8 : -14}deg) scale(${sponge.active ? 0.96 : 1})`,
                  transition: "transform 0.08s linear",
                }}
              >
                <Sponge />
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink/10" aria-hidden="true">
              <div className="h-full rounded-full bg-sun transition-[width] duration-300" style={{ width: `${pct}%` }} />
            </div>
            <p id="demo-status" aria-live="polite" className="w-44 text-right text-sm font-bold">
              {done ? "Szyba lśni czystością ✨" : `Wyczyszczono ${pct}%`}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Губка: чорна мокра губка з піною (CSS, без картинок) */
function Sponge() {
  return (
    <div className="relative h-[58px] w-[86px] sm:h-[70px] sm:w-[104px]">
      <div className="absolute inset-0 rounded-[14px] bg-[radial-gradient(circle_at_30%_25%,#4b545e,#1c232b_60%,#0e1318)] shadow-[0_14px_24px_-8px_rgb(0_0_0/0.5),inset_0_-4px_8px_rgb(0_0_0/0.5)]" />
      <div className="absolute inset-0 rounded-[14px] opacity-60 [background:radial-gradient(circle,rgb(255_255_255/0.25)_1px,transparent_1.5px)_0_0/7px_7px]" />
      {/* піна */}
      {[
        [8, -8, 22], [24, -12, 28], [46, -10, 24], [66, -6, 20], [-6, 20, 18], [80, 22, 16], [30, 40, 14],
      ].map(([x, y, s], i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{ left: x, top: y, width: s, height: s, boxShadow: "inset -2px -3px 4px rgb(32 43 54 / 0.18)" }}
        />
      ))}
    </div>
  );
}

/** Тимчасова «фотографічна» сцена за склом — розмите місто й сонце (замінюється фото) */
function CleanScene() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden" style={{ background: "linear-gradient(180deg,#a9d3f2 0%,#d8ecf9 52%,#f3f8fb 100%)" }}>
      <div className="absolute right-[6%] top-[4%] h-[45%] w-[30%] rounded-full bg-[radial-gradient(circle,#fffbe8_0,#fff1b8_25%,transparent_70%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[55%] blur-[6px]">
        <div className="absolute bottom-0 left-[-5%] h-[70%] w-[38%] rounded-t-[40%] bg-[#7fae7a]" />
        <div className="absolute bottom-0 left-[22%] h-[55%] w-[18%] bg-[#c9c3b8]" />
        <div className="absolute bottom-0 left-[38%] h-[78%] w-[14%] bg-[#b7b1a6]" />
        <div className="absolute bottom-0 left-[50%] h-[62%] w-[20%] bg-[#d9d3c8]" />
        <div className="absolute bottom-0 right-[-4%] h-[66%] w-[36%] rounded-t-[45%] bg-[#6f9f6c]" />
        <div className="absolute inset-x-0 bottom-0 h-[18%] bg-[#5f8a5c]" />
      </div>
    </div>
  );
}
