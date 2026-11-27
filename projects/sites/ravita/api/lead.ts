/**
 * POST /api/lead — приймає заявку з форми і надсилає її на e-mail компанії через Resend.
 *
 * Змінні середовища (Vercel → Settings → Environment Variables):
 *   RESEND_API_KEY   — секретний ключ Resend (ніколи не в коді й не в браузері)
 *   LEAD_TO_EMAIL    — куди слати заявки (можна кілька через кому)
 *   LEAD_FROM_EMAIL  — від кого (необов'язково). Без власного домену в Resend — лише
 *                      "Ravita <onboarding@resend.dev>", і тоді лист дійде тільки на e-mail
 *                      власника акаунта Resend.
 *
 * Персональні дані не логуються і ніде не зберігаються — тільки пересилаються листом.
 */
import { SERVICES, type ServiceId } from "../src/content/pl";
import { countsWindows, validate, type OrderForm } from "../src/lib/validation";

const MAX_BODY = 10_000;
const DEFAULT_FROM = "Ravita <onboarding@resend.dev>";

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

/** Перетворює довільний JSON на форму: тільки відомі поля, тільки рядки, обрізані за довжиною */
export function parseLead(input: unknown): { form: OrderForm; honeypot: string } {
  const d = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const str = (k: string, max = 120) => (typeof d[k] === "string" ? (d[k] as string).slice(0, max) : "");
  const service = SERVICES.some((s) => s.id === d.service) ? (d.service as ServiceId) : "";
  return {
    honeypot: str("company"),
    form: {
      service,
      area: str("area", 20),
      windows: str("windows", 10),
      balconyDoors: str("balconyDoors", 10),
      city: str("city"),
      phone: str("phone", 30),
      date: str("date", 10),
      notes: str("notes", 600),
      consent: d.consent === true,
    },
  };
}

/** Тіло листа: текстова і HTML-версії */
export function buildEmail(f: OrderForm, sentAt = new Date()) {
  const title = SERVICES.find((s) => s.id === f.service)?.title ?? f.service;
  const scope = countsWindows(f.service)
    ? `${f.windows} okien${f.balconyDoors.trim() ? `, ${f.balconyDoors} drzwi balkonowych/tarasowych` : ""}`
    : `${f.area} m²`;
  const rows: [string, string][] = [
    ["Usługa", title],
    ["Zakres", scope],
    ["Miejscowość", oneLine(f.city)],
    ["Telefon", oneLine(f.phone)],
    ["Preferowany termin", f.date],
    ["Dodatkowe informacje", f.notes.trim() || "—"],
    ["Zgoda na kontakt", "tak"],
    ["Wysłano", sentAt.toLocaleString("pl-PL", { timeZone: "Europe/Warsaw" })],
  ];
  const subject = oneLine(`Nowe zapytanie: ${title} — ${f.city}`).slice(0, 150);
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  const html =
    `<h2 style="font-family:Arial,sans-serif">Nowe zapytanie ze strony</h2>` +
    `<table style="font-family:Arial,sans-serif;font-size:15px;border-collapse:collapse">` +
    rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:6px 16px 6px 0;color:#4a5560;vertical-align:top">${esc(k)}</td>` +
          `<td style="padding:6px 0;white-space:pre-wrap"><b>${esc(v)}</b></td></tr>`,
      )
      .join("") +
    `</table>`;
  return { subject, text, html };
}

export async function POST(request: Request): Promise<Response> {
  const key = process.env.RESEND_API_KEY;
  const to = (process.env.LEAD_TO_EMAIL ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  if (!key || to.length === 0) return json(503, { ok: false, error: "not_configured" });

  if (!(request.headers.get("content-type") ?? "").includes("application/json")) {
    return json(415, { ok: false, error: "unsupported_type" });
  }
  const raw = await request.text();
  if (raw.length > MAX_BODY) return json(413, { ok: false, error: "too_large" });

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return json(400, { ok: false, error: "bad_json" });
  }

  const { form, honeypot } = parseLead(data);
  // Пастка для ботів: людина цього поля не бачить. Відповідаємо «ок», але нічого не шлемо.
  if (honeypot.trim()) return json(200, { ok: true });

  const errors = validate(form);
  if (Object.keys(errors).length) return json(400, { ok: false, error: "invalid", fields: Object.keys(errors) });

  const { subject, text, html } = buildEmail(form);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: process.env.LEAD_FROM_EMAIL || DEFAULT_FROM, to, subject, text, html }),
  });
  if (!res.ok) {
    console.error("lead: email provider error", res.status); // без персональних даних
    return json(502, { ok: false, error: "send_failed" });
  }
  return json(200, { ok: true });
}
