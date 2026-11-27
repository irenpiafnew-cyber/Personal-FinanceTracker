import { MARQUEE_WORDS } from "../content/pl";
import { Asterisk } from "./Logo";

/** Дві однакові половини: анімація зсуває трек рівно на -50%, тому петля без стрибка */
export function Marquee() {
  const half = Array.from({ length: 3 }, () => MARQUEE_WORDS).flat();
  return (
    <div className="relative overflow-hidden bg-sun py-4 sm:py-5" role="presentation">
      <p className="sr-only">Czystość, świeżość, komfort — Ravita.</p>
      <div className="marquee-track flex w-max" aria-hidden="true">
        {[0, 1].map((k) => (
          <ul key={k} className="flex shrink-0 items-center">
            {half.map((w, i) => (
              <li key={i} className="eyebrow flex items-center gap-4 pr-10 text-[1rem] tracking-[0.16em] text-ink sm:text-[1.15rem]">
                <Asterisk className="h-5 w-5 text-ink" />
                {w}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
