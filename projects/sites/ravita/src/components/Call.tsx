import { useState } from "react";
import { CONTACT } from "../content/pl";

const NO_PHONE = "Numer telefonu pojawi się po potwierdzeniu przez firmę.";

function PhoneIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
    </svg>
  );
}

/**
 * «Zadzwoń»: з номером — звичайне посилання tel:, без номера (демо) — пояснення замість дзвінка.
 * Номер задається в одному місці: CONTACT у src/content/pl.ts.
 */
export function CallButton({ className = "", label = "Zadzwoń" }: { className?: string; label?: string }) {
  const [note, setNote] = useState(false);
  if (CONTACT) {
    return (
      <a href={`tel:${CONTACT.phone}`} className={className}>
        <PhoneIcon /> {label} <span className="font-semibold opacity-80">{CONTACT.display}</span>
      </a>
    );
  }
  return (
    <span className="relative inline-flex">
      <button type="button" className={className} onClick={() => setNote((v) => !v)} aria-expanded={note}>
        <PhoneIcon /> {label}
      </button>
      {note && (
        <span role="status" className="absolute bottom-full left-0 z-50 mb-2 w-60 rounded-xl bg-ink px-3 py-2 text-xs font-medium text-white shadow-lg">
          {NO_PHONE}
        </span>
      )}
    </span>
  );
}

/** Мобільна нижня панель: дзвінок і заявка завжди під пальцем */
export function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur md:hidden">
      <div className="grid grid-cols-2 gap-3">
        <CallButton className="btn-ghost w-full bg-white" />
        <a href="#kontakt" className="btn-sun w-full">Wycena</a>
      </div>
    </div>
  );
}
