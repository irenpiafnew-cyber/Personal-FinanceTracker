import { useEffect, useState } from "react";
import { NAV } from "../content/pl";
import { ArrowUpRight, Logo } from "./Logo";

export function Header({ paused, onTogglePause }: { paused: boolean; onTogglePause: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background,box-shadow] duration-500 ${
        scrolled || open ? "bg-white/90 shadow-[0_1px_0_rgb(32_43_54/0.08)] backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded-lg focus:bg-sun focus:px-4 focus:py-2 focus:font-bold">
        Przejdź do treści
      </a>
      <div className="mx-auto flex h-18 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-8 lg:px-14">
        <a href="#top" aria-label="Ravita — strona główna">
          <Logo />
        </a>

        <nav aria-label="Główna nawigacja" className="hidden md:block">
          <ul className="flex items-center gap-9 text-[1.02rem] font-medium">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="relative py-2 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-sun after:transition-transform after:duration-500 hover:after:scale-x-100">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onTogglePause}
            aria-pressed={paused}
            title={paused ? "Wznów animacje" : "Wstrzymaj animacje"}
            className="hidden h-11 w-11 place-items-center rounded-full border border-ink/15 bg-white/70 transition hover:border-ink sm:grid"
          >
            <span className="sr-only">{paused ? "Wznów animacje" : "Wstrzymaj animacje"}</span>
            {paused ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z" /></svg>
            )}
          </button>
          <a href="#kontakt" className="btn-sun hidden min-h-11! sm:inline-flex">
            Zamów <ArrowUpRight />
          </a>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full bg-ink text-white md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? "Zamknij menu" : "Otwórz menu"}</span>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 8h16M4 16h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Menu mobilne" className="border-t border-ink/10 bg-white px-4 pb-6 pt-2 md:hidden">
          <ul className="flex flex-col">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} onClick={() => setOpen(false)} className="block border-b border-ink/8 py-4 text-2xl font-bold tracking-tight">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <a href="#kontakt" onClick={() => setOpen(false)} className="btn-sun mt-5 w-full">
            Zamów <ArrowUpRight />
          </a>
        </nav>
      )}
    </header>
  );
}
