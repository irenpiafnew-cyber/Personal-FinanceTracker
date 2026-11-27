import { useEffect, useRef, useState } from "react";
import { CleaningDemo } from "./components/CleaningDemo";
import { ContactForm } from "./components/ContactForm";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { About, DemoBadge, Footer, Gallery, HowItWorks, PrivacyDialog, Pricing } from "./components/Sections";
import { Services } from "./components/Services";
import { MobileActionBar } from "./components/Call";
import type { ServiceId } from "./content/pl";
import { EMPTY_FORM, type OrderForm } from "./lib/validation";

export default function App() {
  // Спільний стан форми: hero і картки послуг передзаповнюють повну форму в #kontakt
  const [form, setForm] = useState<OrderForm>(EMPTY_FORM);
  const [paused, setPaused] = useState(false);
  const privacyRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    document.documentElement.dataset.motion = paused ? "paused" : "running";
  }, [paused]);

  const goToContact = (focusId: string) => {
    document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" });
    window.setTimeout(() => document.getElementById(focusId)?.focus({ preventScroll: true }), 650);
  };

  const onQuote = (patch: Partial<OrderForm>) => {
    setForm((f) => ({ ...f, ...patch }));
    goToContact("f-city");
  };

  const onPick = (service: ServiceId) => setForm((f) => ({ ...f, service }));
  const openPrivacy = () => privacyRef.current?.showModal();

  return (
    <>
      <Header paused={paused} onTogglePause={() => setPaused((p) => !p)} />
      <main id="main">
        <Hero onQuote={onQuote} />
        <Marquee />
        <Services onPick={onPick} />
        <CleaningDemo />
        <HowItWorks />
        <About />
        <Pricing />
        <Gallery />
        <ContactForm form={form} setForm={setForm} onPrivacy={openPrivacy} />
      </main>
      <Footer onPrivacy={openPrivacy} />
      <PrivacyDialog dialogRef={privacyRef} />
      <DemoBadge />
      <MobileActionBar />
    </>
  );
}
