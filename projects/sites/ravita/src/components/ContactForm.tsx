import { useState, type FormEvent } from "react";
import { GALLERY_PHOTOS, SERVICES, type ServiceId } from "../content/pl";
import { useReveal } from "../hooks/useMotion";
import { countsWindows, todayISO, validate, type Errors, type OrderForm } from "../lib/validation";
import { CallButton } from "./Call";
import { LEADS_ENABLED, sendLead } from "../lib/leads";
import { ArrowRight } from "./Logo";

type Props = {
  form: OrderForm;
  setForm: React.Dispatch<React.SetStateAction<OrderForm>>;
  onPrivacy: () => void;
};

/**
 * Два режими:
 * - демо (LEADS_ENABLED = false): дані нікуди не надсилаються і не зберігаються;
 * - робочий: заявка йде на /api/lead → e-mail компанії (див. api/lead.ts).
 */
export function ContactForm({ form, setForm, onPrivacy }: Props) {
  const ref = useReveal<HTMLElement>();
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [honeypot, setHoneypot] = useState(""); // пастка для ботів, людина поля не бачить
  const sent = status === "sent";

  const set = <K extends keyof OrderForm>(k: K, v: OrderForm[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    const errs = validate(form);
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    if (LEADS_ENABLED) {
      setStatus("sending");
      try {
        await sendLead(form, honeypot);
      } catch {
        setStatus("error"); // дані лишаються у формі — можна спробувати ще раз
        return;
      }
    }
    setStatus("sent");
    setForm((f) => ({ ...f, phone: "", notes: "", consent: false })); // персональні дані одразу стираємо
  };

  const err = (k: keyof OrderForm) =>
    errors[k] ? { "aria-invalid": true as const, "aria-describedby": `${k}-err` } : {};
  const msg = (k: keyof OrderForm) => errors[k] && <p id={`${k}-err`} className="error-text">{errors[k]}</p>;

  return (
    <section id="kontakt" ref={ref} className="scroll-mt-20 bg-mist py-20 lg:py-28" aria-labelledby="contact-title">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-4 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-14">
        <div className="reveal">
          <p className="eyebrow">{GALLERY_PHOTOS.length ? "07" : "06"} / Kontakt</p>
          <h2 id="contact-title" className="mt-4 text-[clamp(2.2rem,4vw,3.4rem)] font-extrabold leading-[1.02] tracking-[-0.04em]">
            Zapytaj o wycenę<span className="dot">.</span>
          </h2>
          <p className="mt-5 max-w-md text-ink-soft">
            Wypełnij formularz — skontaktujemy się, aby potwierdzić zakres prac, termin i cenę.
          </p>
          {!LEADS_ENABLED && (
            <div className="mt-8 rounded-[1.2rem] border border-ink/10 bg-white p-5 text-sm text-ink-soft">
              <strong className="text-ink">Tryb demonstracyjny.</strong> Formularz sprawdza poprawność danych, ale niczego nie wysyła ani nie zapisuje.
            </div>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <p className="font-semibold">Wolisz porozmawiać?</p>
            <CallButton className="btn-ghost bg-white" />
          </div>
        </div>

        <div className="reveal rounded-[1.6rem] bg-white p-6 shadow-[0_30px_60px_-36px_rgb(32_43_54/0.35)] sm:p-9" style={{ "--delay": "120ms" } as React.CSSProperties}>
          {sent ? (
            <div role="status" className="py-10 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-sun text-3xl">✓</div>
              <h3 className="mt-6 text-2xl font-extrabold tracking-[-0.03em]">Dziękujemy!</h3>
              <p className="mx-auto mt-3 max-w-sm text-ink-soft">
                {LEADS_ENABLED
                  ? "Otrzymaliśmy Twoje zapytanie. Oddzwonimy, aby potwierdzić zakres prac, termin i cenę."
                  : "To wersja demonstracyjna — dane nie zostały wysłane ani zapisane. W wersji produkcyjnej w tym miejscu klient otrzyma potwierdzenie zgłoszenia."}
              </p>
              <button type="button" className="btn-ghost mt-8" onClick={() => setStatus("idle")}>Wypełnij ponownie</button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="relative grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="f-service" className="label">Rodzaj usługi</label>
                <select id="f-service" name="service" className="field" value={form.service} onChange={(e) => set("service", e.target.value as ServiceId)} {...err("service")}>
                  {SERVICES.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
                </select>
                {msg("service")}
              </div>
              {countsWindows(form.service) ? (
                <>
                  <div>
                    <label htmlFor="f-windows" className="label">Ile okien jest do umycia?</label>
                    <input id="f-windows" name="windows" inputMode="numeric" className="field" placeholder="np. 6" value={form.windows} onChange={(e) => set("windows", e.target.value)} {...err("windows")} />
                    {msg("windows")}
                  </div>
                  <div>
                    <label htmlFor="f-doors" className="label">Drzwi balkonowe lub tarasowe <span className="font-normal text-ink-soft">(opcjonalnie)</span></label>
                    <input id="f-doors" name="balconyDoors" inputMode="numeric" className="field" placeholder="np. 1" value={form.balconyDoors} onChange={(e) => set("balconyDoors", e.target.value)} {...err("balconyDoors")} />
                    {msg("balconyDoors")}
                  </div>
                </>
              ) : (
                <div>
                  <label htmlFor="f-area" className="label">Powierzchnia (m²)</label>
                  <input id="f-area" name="area" inputMode="decimal" className="field" value={form.area} onChange={(e) => set("area", e.target.value)} {...err("area")} />
                  {msg("area")}
                </div>
              )}
              <div>
                <label htmlFor="f-city" className="label">Miejscowość</label>
                <input id="f-city" name="city" autoComplete="address-level2" className="field" placeholder="np. Racibórz" value={form.city} onChange={(e) => set("city", e.target.value)} {...err("city")} />
                {msg("city")}
              </div>
              <div>
                <label htmlFor="f-phone" className="label">Numer telefonu</label>
                <input id="f-phone" name="phone" type="tel" autoComplete="tel" className="field" placeholder="600 123 456" value={form.phone} onChange={(e) => set("phone", e.target.value)} {...err("phone")} />
                {msg("phone")}
              </div>
              <div className={countsWindows(form.service) ? "sm:col-span-2" : ""}>
                <label htmlFor="f-date" className="label">Preferowany termin</label>
                <input id="f-date" name="date" type="date" min={todayISO()} className="field" value={form.date} onChange={(e) => set("date", e.target.value)} {...err("date")} />
                {msg("date")}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="f-notes" className="label">Dodatkowe informacje <span className="font-normal text-ink-soft">(opcjonalnie)</span></label>
                <textarea id="f-notes" name="notes" rows={4} maxLength={600} className="field py-3" value={form.notes} onChange={(e) => set("notes", e.target.value)} {...err("notes")} />
                <div className="flex justify-between">{msg("notes") || <span />}<span className="mt-1 text-xs text-ink-soft">{form.notes.length}/500</span></div>
              </div>
              <div className="sm:col-span-2">
                <label className="flex cursor-pointer items-start gap-3 text-sm text-ink-soft">
                  <input name="consent" type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-ink" checked={form.consent} onChange={(e) => set("consent", e.target.checked)} {...err("consent")} />
                  <span>
                    Wyrażam zgodę na kontakt w sprawie wyceny. Zapoznałem/am się z{" "}
                    <button type="button" onClick={onPrivacy} className="font-semibold text-ink underline decoration-sun decoration-2 underline-offset-2">polityką prywatności</button>.
                  </span>
                </label>
                {msg("consent")}
              </div>
              {/* Пастка для ботів: прихована від людей і скрінрідерів */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label htmlFor="f-company">Firma</label>
                <input id="f-company" name="company" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
              </div>
              {status === "error" && (
                <div role="alert" className="rounded-xl border border-[#b42318]/30 bg-[#fef3f2] p-4 text-sm text-[#7a1a12] sm:col-span-2">
                  <strong>Nie udało się wysłać zapytania.</strong> Sprawdź połączenie i spróbuj ponownie albo zadzwoń do nas.
                  <div className="mt-3"><CallButton className="btn-ghost min-h-11! bg-white" /></div>
                </div>
              )}
              <button type="submit" className="btn-sun disabled:opacity-60 sm:col-span-2" disabled={status === "sending"} aria-busy={status === "sending"}>
                {status === "sending" ? "Wysyłanie…" : <>Wyślij zapytanie <ArrowRight /></>}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
