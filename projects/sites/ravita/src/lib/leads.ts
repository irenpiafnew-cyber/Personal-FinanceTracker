import type { OrderForm } from "./validation";

/**
 * Перемикач реальних заявок. Поки "false" (або не задано) — форма працює в демо-режимі
 * і нічого не надсилає. Вмикається змінною VITE_LEADS_ENABLED=true у Vercel перед збіркою.
 */
export const LEADS_ENABLED = import.meta.env.VITE_LEADS_ENABLED === "true";

/** Надсилає заявку на /api/lead. Кидає помилку, якщо сервер не прийняв заявку. */
export async function sendLead(form: OrderForm, honeypot: string): Promise<void> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 15_000);
  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, company: honeypot }),
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`lead_failed_${res.status}`);
  } finally {
    clearTimeout(timer);
  }
}
