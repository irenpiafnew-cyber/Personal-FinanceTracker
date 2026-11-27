import type { ServiceId } from "../content/pl";

export type OrderForm = {
  service: ServiceId | "";
  area: string;
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

export function validate(f: OrderForm): Errors {
  const e: Errors = {};
  if (!f.service) e.service = "Wybierz rodzaj usługi.";
  const a = validateArea(f.area);
  if (a) e.area = a;
  if (f.city.trim().length < 2) e.city = "Podaj miejscowość.";
  if (!isPolishPhone(f.phone)) e.phone = "Podaj poprawny numer, np. 600 123 456.";
  if (!f.date) e.date = "Wybierz preferowany termin.";
  else if (f.date < todayISO()) e.date = "Termin nie może być w przeszłości.";
  if (f.notes.length > 500) e.notes = "Maksymalnie 500 znaków.";
  if (!f.consent) e.consent = "Zaznacz zgodę, aby kontynuować.";
  return e;
}
