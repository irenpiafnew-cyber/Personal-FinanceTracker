import type { CSSProperties } from "react";
import { SERVICES, type ServiceId } from "../content/pl";
import { useReveal } from "../hooks/useMotion";
import { ArrowUpRight } from "./Logo";

type Tone = (typeof SERVICES)[number]["tone"];

// Плейсхолдери у фірмових кольорах (без мультяшних ілюстрацій) — до появи фото
const PLACEHOLDER: Record<ServiceId, string> = {
  domy:
    "radial-gradient(40% 30% at 62% 58%, rgb(255 209 40 / 0.85), transparent 70%), radial-gradient(70% 45% at 40% 70%, #e4e4e4, transparent 70%), linear-gradient(160deg, #fafafa, #e9e9e9)",
  okna:
    "radial-gradient(circle at 20% 30%, rgb(255 255 255 / 0.55) 0 3px, transparent 4px), radial-gradient(circle at 70% 60%, rgb(255 255 255 / 0.5) 0 2px, transparent 3px), radial-gradient(circle at 45% 15%, rgb(255 255 255 / 0.45) 0 5px, transparent 6px), linear-gradient(180deg, #f6dc6c, #ffd128 60%, #f2bf00)",
  biura:
    "radial-gradient(50% 40% at 65% 35%, rgb(255 255 255 / 0.12), transparent 70%), linear-gradient(180deg, #2b3743, #202b36 55%, #161e26)",
  generalne:
    "radial-gradient(28% 18% at 55% 30%, rgb(255 209 40 / 0.9), transparent 75%), radial-gradient(60% 40% at 50% 60%, #ffffff, transparent 70%), linear-gradient(170deg, #f4f4f4, #dedede)",
};

const TONE: Record<Tone, string> = {
  light: "bg-mist text-ink",
  yellow: "bg-sun text-ink",
  dark: "bg-ink text-white",
};

export function Services({ onPick }: { onPick: (id: ServiceId) => void }) {
  const ref = useReveal<HTMLElement>();
  return (
    <section id="uslugi" ref={ref} className="mx-auto max-w-[1440px] scroll-mt-20 px-4 py-20 sm:px-8 lg:px-14 lg:py-28">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,2.2fr)] lg:items-end">
        <div className="reveal">
          <p className="eyebrow">01 / Nasza oferta</p>
          <h2 className="mt-4 text-[clamp(2.2rem,4vw,3.4rem)] font-extrabold leading-[1.02] tracking-[-0.04em]">
            Robimy miejsce na lepsze życie<span className="dot">.</span>
          </h2>
          <p className="mt-5 max-w-sm text-ink-soft">
            Wybierz usługę — przeniesiemy ją od razu do formularza wyceny.
          </p>
        </div>

        <ul className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 xl:grid-cols-4">
          {SERVICES.map((s, i) => (
            <li key={s.id} className="reveal w-[78%] shrink-0 snap-start sm:w-auto" style={{ "--delay": `${i * 110}ms` } as CSSProperties}>
              <a
                href="#kontakt"
                onClick={() => onPick(s.id)}
                className={`service-card group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-[1.4rem] p-6 ${TONE[s.tone]}`}
              >
                {s.image ? (
                  <img src={s.image} alt="" loading="lazy" className="absolute inset-0 -z-0 h-full w-full object-cover" />
                ) : (
                  <span aria-hidden="true" className="ph absolute inset-0" style={{ background: PLACEHOLDER[s.id] }} />
                )}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 bottom-0 h-1/2 ${
                    s.tone === "dark" ? "bg-gradient-to-t from-ink/80" : s.tone === "yellow" ? "bg-gradient-to-t from-sun/90" : "bg-gradient-to-t from-white/85"
                  } to-transparent`}
                />
                <span className="relative">
                  <span className="flex items-end gap-2 text-[clamp(1.25rem,1.6vw,1.55rem)] font-extrabold leading-[1.05] tracking-[-0.03em]">
                    {s.title} <ArrowUpRight className="mb-1 h-5 w-5 shrink-0" />
                  </span>
                  <span className={`mt-2 block text-sm leading-snug ${s.tone === "dark" ? "text-white/80" : "text-ink-soft"}`}>{s.lead}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-6 text-xs text-ink-soft/80">Zakres usług ma charakter poglądowy i zostanie potwierdzony przez firmę.</p>
    </section>
  );
}
