import type { ServiceId } from "../content/pl";

export type OrderForm = {
  service: ServiceId | "";
  area: string;
  /** Для «Mycie okien»: кількість вікон і (опційно) балконних/терасних дверей */
  windows: string;
  balconyDoors: string;
  city: string;
  phone: string;
  date: string;
  notes: string;
  consent: boolean;
};

export type Errors = Partial<Record<keyof OrderForm, string>>;

export const EMPTY_FORM: OrderForm = {
  service: "domy",
  area: "60",
  windows: "",
  balconyDoors: "",
  city: "",
  phone: "",
  date: "",
  notes: "",
  consent: false,
};

/** Польський номер: 9 цифр, опційно +48 / 0048 на початку. Пробіли й дефіси дозволені. */
export function isPolishPhone(raw: string) {
  const digits = raw.replace(/[\s-]/g, "").replace(/^(\+48|0048)/, "");
  return /^[1-9]\d{8}$/.test(digits);
}

export function todayISO() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

export function validateArea(area: string): string | undefined {
  const n = Number(area.replace(",", "."));
  if (!area.trim()) return "Podaj powierzchnię.";
  if (!Number.isFinite(n) || n < 5 || n > 5000) return "Podaj wartość od 5 do 5000 m².";
}

/** Для миття вікон людина знає кількість вікон, а не їхню площу */
export const countsWindows = (service: OrderForm["service"]) => service === "okna";

const isInt = (v: string) => /^\d+$/.test(v.trim());

export function validateWindows(v: string): string | undefined {
  if (!v.trim()) return "Podaj liczbę okien.";
  if (!isInt(v) || +v < 1 || +v > 100) return "Podaj liczbę od 1 do 100.";
}

export function validateDoors(v: string): string | undefined {
  if (!v.trim()) return;
  if (!isInt(v) || +v > 20) return "Podaj liczbę od 0 do 20.";
}

export function validate(f: OrderForm): Errors {
  const e: Errors = {};
  if (!f.service) e.service = "Wybierz rodzaj usługi.";
  if (countsWindows(f.service)) {
    const w = validateWindows(f.windows);
    if (w) e.windows = w;
    const d = validateDoors(f.balconyDoors);
    if (d) e.balconyDoors = d;
  } else {
    const a = validateArea(f.area);
    if (a) e.area = a;
  }
  if (f.city.trim().length < 2) e.city = "Podaj miejscowość.";
  if (!isPolishPhone(f.phone)) e.phone = "Podaj poprawny numer, np. 600 123 456.";
  if (!f.date) e.date = "Wybierz preferowany termin.";
  else if (f.date < todayISO()) e.date = "Termin nie może być w przeszłości.";
  if (f.notes.length > 500) e.notes = "Maksymalnie 500 znaków.";
  if (!f.consent) e.consent = "Zaznacz zgodę, aby kontynuować.";
  return e;
}
