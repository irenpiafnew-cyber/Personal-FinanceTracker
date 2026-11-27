import type { CSSProperties } from "react";
import { GALLERY_PHOTOS, STEPS } from "../content/pl";
import { useReveal } from "../hooks/useMotion";
import { LEADS_ENABLED } from "../lib/leads";
import { ArrowUpRight, Asterisk, Logo } from "./Logo";

const Title = ({ n, eyebrow, children, id, light }: { n: string; eyebrow: string; children: React.ReactNode; id?: string; light?: boolean }) => (
  <div className="reveal">
    <p className={`eyebrow ${light ? "text-white/70" : ""}`}>{n} / {eyebrow}</p>
    <h2 id={id} className="mt-4 text-[clamp(2.2rem,4vw,3.4rem)] font-extrabold leading-[1.02] tracking-[-0.04em]">
      {children}
      <span className="dot">.</span>
    </h2>
  </div>
);

export function HowItWorks() {
  const ref = useReveal<HTMLElement>();
  return (
    <section ref={ref} className="mx-auto max-w-[1440px] px-4 py-20 sm:px-8 lg:px-14 lg:py-28" aria-labelledby="how-title">
      <Title n="03" eyebrow="Jak to działa" id="how-title">Cztery kroki do czystości</Title>
      <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <li
            key={s.title}
            className="reveal group relative rounded-[1.4rem] border border-ink/10 bg-white p-7 transition-colors duration-500 hover:border-sun hover:bg-sun/10"
            style={{ "--delay": `${i * 100}ms` } as CSSProperties}
          >
            <span className="text-[3.6rem] font-extrabold leading-none tracking-[-0.06em] text-sun">0{i + 1}</span>
            <h3 className="mt-6 text-xl font-extrabold tracking-[-0.02em]">{s.title}</h3>
            <p className="mt-2 text-ink-soft">{s.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function About() {
  const ref = useReveal<HTMLElement>();
  const values = [
    ["Dokładność", "Sprzątamy tak, jakbyśmy robili to u siebie."],
    ["Punktualność", "Termin ustalamy razem i go dotrzymujemy."],
    ["Lokalnie", "Racibórz i okolice — blisko Ciebie."],
  ];
  return (
    <section id="o-nas" ref={ref} className="scroll-mt-20 bg-ink py-20 text-white lg:py-28" aria-labelledby="about-title">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-4 sm:px-8 lg:grid-cols-2 lg:px-14">
        <div>
          <Title n="04" eyebrow="O nas" id="about-title" light>Czysto, spokojnie, po ludzku</Title>
          <p className="reveal mt-6 max-w-lg text-lg leading-relaxed text-white/80">
            Ravita to serwis sprzątający z Raciborza. Bierzemy na siebie porządki, a Ty odzyskujesz czas — dla rodziny, pracy i odpoczynku.
          </p>
        </div>
        <ul className="grid gap-4">
          {values.map(([t, d], i) => (
            <li key={t} className="reveal flex gap-5 rounded-[1.4rem] bg-white/5 p-6 ring-1 ring-white/10" style={{ "--delay": `${i * 100}ms` } as CSSProperties}>
              <Asterisk className="mt-1 h-6 w-6 shrink-0 text-sun" />
              <div>
                <h3 className="text-xl font-extrabold">{t}</h3>
                <p className="mt-1 text-white/75">{d}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Без цін: компанія ще не підтвердила прайс → «wycena indywidualna» */
export function Pricing() {
  const ref = useReveal<HTMLElement>();
  const factors = ["Rodzaj usługi", "Powierzchnia w m²", "Stopień zabrudzenia", "Częstotliwość sprzątania"];
  return (
    <section id="cennik" ref={ref} className="mx-auto max-w-[1440px] scroll-mt-20 px-4 py-20 sm:px-8 lg:px-14 lg:py-28" aria-labelledby="price-title">
      <div className="grid gap-10 rounded-[2rem] bg-sun p-8 sm:p-12 lg:grid-cols-[1.1fr_1fr] lg:p-16">
        <div>
          <Title n="05" eyebrow="Cennik" id="price-title">Wycena dopasowana do Ciebie</Title>
          <p className="reveal mt-5 max-w-md text-ink/80">
            Każde wnętrze jest inne, dlatego cenę ustalamy indywidualnie. Wyślij zapytanie — oddzwonimy z wyceną.
          </p>
          <a href="#kontakt" className="reveal mt-8 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-ink px-6 font-bold text-white transition hover:-translate-y-0.5">
            Zapytaj o wycenę <ArrowUpRight />
          </a>
        </div>
        <div className="reveal">
          <p className="font-bold">Na cenę wpływają:</p>
          <ul className="mt-4 divide-y divide-ink/15 border-y border-ink/15">
            {factors.map((f) => (
              <li key={f} className="flex items-center gap-3 py-4 text-lg font-semibold">
                <Asterisk className="h-4 w-4" /> {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/** Галерея: лише реальні фото від компанії. Поки їх немає — секція не показується зовсім. */
export function Gallery() {
  const ref = useReveal<HTMLElement>();
  if (GALLERY_PHOTOS.length === 0) return null;
  return (
    <section ref={ref} className="mx-auto max-w-[1440px] px-4 pb-20 sm:px-8 lg:px-14 lg:pb-28" aria-labelledby="gallery-title">
      <Title n="06" eyebrow="Realizacje" id="gallery-title">Nasze prace</Title>
      <ul className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {GALLERY_PHOTOS.map((p, i) => (
          <li key={p.src} className={`reveal overflow-hidden rounded-[1.4rem] bg-mist ${i === 0 ? "col-span-2 row-span-2" : ""}`} style={{ "--delay": `${i * 80}ms` } as CSSProperties}>
            <img src={p.src} alt={p.alt} loading="lazy" className="h-full w-full object-cover" />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Footer({ onPrivacy }: { onPrivacy: () => void }) {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-[1440px] px-4 pb-28 pt-14 sm:px-8 md:pb-14 lg:px-14">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div>
            <Logo className="text-white [&_span]:text-white" />
            <p className="mt-4 max-w-xs text-white/70">Twoja przestrzeń. Nasza troska.</p>
          </div>
          <div className="grid gap-2 text-white/80">
            <p className="font-bold text-white">Kontakt</p>
            <p>Racibórz i okolice</p>
            <p>Telefon: zostanie podany po potwierdzeniu</p>
            <a href="#kontakt" className="underline decoration-sun decoration-2 underline-offset-4 hover:text-white">Formularz kontaktowy</a>
          </div>
          <div className="grid content-start gap-2 text-white/80">
            <button type="button" onClick={onPrivacy} className="text-left underline decoration-sun decoration-2 underline-offset-4 hover:text-white">
              Polityka prywatności
            </button>
          </div>
        </div>
        <p className="mt-12 border-t border-white/10 pt-6 text-sm text-white/60">
          Strona demonstracyjna przygotowana przez MolfarWeb jako koncepcja dla Ravita Clean Service. Nie jest oficjalną stroną firmy. Zdjęcia mają charakter poglądowy.
        </p>
      </div>
    </footer>
  );
}

export function PrivacyDialog({ dialogRef }: { dialogRef: React.RefObject<HTMLDialogElement | null> }) {
  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="privacy-title"
      className="m-auto w-[min(92vw,36rem)] rounded-[1.6rem] p-0 text-ink backdrop:bg-ink/60 backdrop:backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
    >
      <div className="p-7 sm:p-9">
        <h2 id="privacy-title" className="text-2xl font-extrabold tracking-[-0.03em]">Polityka prywatności<span className="dot">.</span></h2>
        {LEADS_ENABLED ? (
          <>
            <p className="mt-4 text-ink-soft">
              Dane z formularza (usługa, zakres prac, miejscowość, numer telefonu, termin i uwagi) wysyłamy e-mailem do firmy Ravita wyłącznie po to, aby przygotować wycenę i skontaktować się z Tobą. Strona nie zapisuje ich w żadnej bazie danych.
            </p>
            <p className="mt-3 text-ink-soft">
              Do wysyłki wiadomości używamy usługi Resend. Masz prawo do dostępu do swoich danych, ich poprawienia i usunięcia — skontaktuj się z nami. Strona nie używa plików cookie ani narzędzi analitycznych.
            </p>
          </>
        ) : (
          <>
            <p className="mt-4 text-ink-soft">
              To jest wersja demonstracyjna strony. Formularze nie wysyłają ani nie zapisują żadnych danych osobowych — wszystko zostaje w Twojej przeglądarce i znika po odświeżeniu strony.
            </p>
            <p className="mt-3 text-ink-soft">
              Pełna polityka prywatności (RODO) zostanie przygotowana przed uruchomieniem strony produkcyjnej. Strona nie używa plików cookie ani narzędzi analitycznych.
            </p>
          </>
        )}
        <form method="dialog" className="mt-6">
          <button className="btn-sun">Rozumiem</button>
        </form>
      </div>
    </dialog>
  );
}

export function DemoBadge() {
  return (
    <p className="pointer-events-none fixed bottom-3 left-3 z-40 hidden md:block rounded-full bg-ink/85 px-3 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-white backdrop-blur">
      Demo · MolfarWeb
    </p>
  );
}
