import { useState, type FormEvent } from "react";
import { SERVICES, type ServiceId } from "../content/pl";
import { countsWindows, validateArea, validateDoors, validateWindows, type OrderForm } from "../lib/validation";
import { ArrowRight } from "./Logo";

/**
 * Міні-форма в hero: послуга + обсяг робіт, передає їх у повну форму в #kontakt.
 * Для «Mycie okien» питаємо кількість вікон і дверей — площу вікон люди не знають.
 */
export function QuickQuote({ onContinue }: { onContinue: (patch: Partial<OrderForm>) => void }) {
  const [service, setService] = useState<ServiceId>("domy");
  const [area, setArea] = useState("60");
  const [windows, setWindows] = useState("");
  const [doors, setDoors] = useState("");
  const [errors, setErrors] = useState<{ area?: string; windows?: string; doors?: string }>({});
  const isWindows = countsWindows(service);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next = isWindows
      ? { windows: validateWindows(windows), doors: validateDoors(doors) }
      : { area: validateArea(area) };
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;
    onContinue(isWindows ? { service, windows, balconyDoors: doors } : { service, area });
  };

  const described = (k: keyof typeof errors) =>
    errors[k] ? { "aria-invalid": true as const, "aria-describedby": `qq-${k}-err` } : {};
  const msg = (k: keyof typeof errors) => errors[k] && <p id={`qq-${k}-err`} className="error-text">{errors[k]}</p>;

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
      <select
        id="qq-service"
        className="field"
        value={service}
        onChange={(e) => {
          setService(e.target.value as ServiceId);
          setErrors({});
        }}
      >
        {SERVICES.map((s) => (
          <option key={s.id} value={s.id}>{s.title}</option>
        ))}
      </select>

      {isWindows ? (
        <div className="mt-4 grid grid-cols-[1.3fr_1fr] gap-3">
          <div>
            <label htmlFor="qq-windows" className="label">Ile okien jest do umycia?</label>
            <input id="qq-windows" className="field" inputMode="numeric" placeholder="np. 6" value={windows} onChange={(e) => setWindows(e.target.value)} {...described("windows")} />
            {msg("windows")}
          </div>
          <div>
            <label htmlFor="qq-doors" className="label">Drzwi balkonowe</label>
            <input id="qq-doors" className="field" inputMode="numeric" placeholder="np. 1" value={doors} onChange={(e) => setDoors(e.target.value)} {...described("doors")} />
            {msg("doors")}
          </div>
        </div>
      ) : (
        <>
          <label htmlFor="qq-area" className="label mt-4">Powierzchnia (m²)</label>
          <input id="qq-area" className="field" inputMode="decimal" value={area} onChange={(e) => setArea(e.target.value)} {...described("area")} />
          {msg("area")}
        </>
      )}

      <button type="submit" className="btn-sun mt-5 w-full">
        Zapytaj o wycenę <ArrowRight />
      </button>
    </form>
  );
}
