import type { ServiceId } from "../content/pl";
import { HeroGlove } from "./HeroGlove";
import { QuickQuote } from "./QuickQuote";

/**
 * Шари (знизу вгору): білий фон → текст і «ravita.» → рукавичка → краплі/бульбашки → форма.
 * На desktop рукавичка й форма позиціонуються абсолютно, на телефоні — йдуть потоком.
 */
export function Hero({ onQuote }: { onQuote: (s: ServiceId, area: string) => void }) {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-white pt-24 lg:pt-28">
      {/* м'який сірий відблиск, як світло в студії */}
      <div aria-hidden="true" className="pointer-events-none absolute hidden lg:block -right-40 -top-40 -z-10 h-[46rem] w-[46rem] rounded-full bg-mist/70 blur-3xl" />

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-14">
        <div className="relative z-30 max-w-[40rem]">
          <p className="eyebrow text-ink">Racibórz / Clean Service</p>
          <h1 className="mt-5 text-[clamp(2.6rem,5.6vw,4.7rem)] font-extrabold leading-[0.98] tracking-[-0.045em]">
            Czystość na zupełnie nowym poziomie<span className="dot">.</span>
          </h1>
          <p className="mt-6 text-[clamp(1.05rem,1.5vw,1.3rem)] leading-relaxed text-ink-soft">
            Twoja przestrzeń. Nasza troska.
            <br />
            Więcej czasu na to, co naprawdę ważne.
          </p>
        </div>

        {/* Рукавичка: телефон — у потоці; desktop — притиснута до правого й верхнього краю вікна
            (рукав «виходить» за екран, як у макеті) і перекриває «ravita.». */}
        <div className={`relative z-20 -mx-4 mt-4 sm:mx-0 lg:absolute lg:-top-28 lg:right-[calc((100%-100vw)/2)] lg:mt-0 lg:w-[64vw] lg:max-w-[1180px]`}>
          <HeroGlove />
        </div>

        <p
          aria-hidden="true"
          className="giant-word relative -mt-[0.3em] select-none pb-6 lg:mt-[0.02em] lg:pb-8"
        >
          ravita.
        </p>

        <div className="relative z-40 pb-12 lg:absolute lg:right-14 lg:top-[34%] lg:w-[23rem] lg:pb-0">
          <QuickQuote onContinue={onQuote} />
        </div>
      </div>
    </section>
  );
}
