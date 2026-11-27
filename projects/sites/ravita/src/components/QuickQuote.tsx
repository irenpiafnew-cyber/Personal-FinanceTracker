import { useState, type FormEvent } from "react";
import { SERVICES, type ServiceId } from "../content/pl";
import { validateArea } from "../lib/validation";
import { ArrowRight } from "./Logo";

/** Міні-форма в hero: збирає 2 поля і передає їх у повну форму в #kontakt */
export function QuickQuote({ onContinue }: { onContinue: (service: ServiceId, area: string) => void }) {
  const [service, setService] = useState<ServiceId>("domy");
  const [area, setArea] = useState("60");
  const [error, setError] = useState<string>();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const err = validateArea(area);
    setError(err);
    if (!err) onContinue(service, area);
  };

  return (
    <form
      onSubmit={submit}
      noValidate
      aria-labelledby="qq-title"
      className="w-full rounded-[1.6rem] border border-ink/5 bg-white/95 p-6 shadow-[0_30px_60px_-30px_rgb(32_43_54/0.35)] backdrop-blur sm:p-7"
    >
      <h2 id="qq-title" className="text-[1.6rem] font-extrabold leading-[1.05] tracking-[-0.03em]">
        Zamów profesjonalne sprzątanie<span className="dot">.</span>
      </h2>

      <label htmlFor="qq-service" className="label mt-5">Rodzaj usługi</label>
      <select id="qq-service" className="field" value={service} onChange={(e) => setService(e.target.value as ServiceId)}>
        {SERVICES.map((s) => (
          <option key={s.id} value={s.id}>{s.title}</option>
        ))}
      </select>

      <label htmlFor="qq-area" className="label mt-4">Powierzchnia (m²)</label>
      <input
        id="qq-area"
        className="field"
        inputMode="decimal"
        value={area}
        onChange={(e) => setArea(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? "qq-area-err" : undefined}
      />
      {error && <p id="qq-area-err" className="error-text">{error}</p>}

      <button type="submit" className="btn-sun mt-5 w-full">
        Zapytaj o wycenę <ArrowRight />
      </button>
    </form>
  );
}
