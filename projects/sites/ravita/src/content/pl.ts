// Усі тексти сайту в одному місці — легко правити й перекладати.
// ВАЖЛИВО: тут немає цін, рейтингів, відгуків і цифр «досвіду» — їх має підтвердити компанія.

export const SERVICES = [
  {
    id: "domy",
    title: "Domy i mieszkania",
    lead: "Regularne lub jednorazowe sprzątanie Twojego domu.",
    tone: "light",
    image: "assets/services/domy.webp" as string | null, // AI-ілюстрація (не фото робіт)
  },
  {
    id: "okna",
    title: "Mycie okien",
    lead: "Okna, ramy i parapety bez smug.",
    tone: "yellow",
    image: "assets/services/okna.webp" as string | null, // AI-ілюстрація (не фото робіт)
  },
  {
    id: "biura",
    title: "Biura i lokale",
    lead: "Czyste miejsce pracy dla zespołu i klientów.",
    tone: "dark",
    image: "assets/services/biura.webp" as string | null, // AI-ілюстрація (не фото робіт)
  },
  {
    id: "generalne",
    title: "Sprzątanie generalne",
    lead: "Gruntowne sprzątanie od podłogi po sufit.",
    tone: "light",
    image: "assets/services/generalne.webp" as string | null, // AI-ілюстрація (не фото робіт)
  },
] as const;

export type ServiceId = (typeof SERVICES)[number]["id"];

export const MARQUEE_WORDS = ["Czystość", "Świeżość", "Komfort", "Ravita"];

export const STEPS = [
  { title: "Wybierz usługę", text: "Zaznacz, czego potrzebujesz — dom, okna, biuro albo sprzątanie generalne." },
  { title: "Zapytaj o wycenę", text: "Podaj metraż i miejscowość. Wycena zależy od zakresu prac." },
  { title: "Ustal termin", text: "Wybierz dzień, który Ci odpowiada. Potwierdzimy go telefonicznie." },
  { title: "Ciesz się czystością", text: "My sprzątamy, a Ty masz czas na to, co naprawdę ważne." },
];

export const NAV = [
  { href: "#uslugi", label: "Usługi" },
  { href: "#o-nas", label: "O nas" },
  { href: "#cennik", label: "Cennik" },
  { href: "#kontakt", label: "Kontakt" },
];

// Галерея: ТІЛЬКИ реальні фото робіт Ravita (не AI). Поки масив порожній — секція прихована.
// Приклад: { src: "assets/gallery/kuchnia-po.webp", alt: "Kuchnia po sprzątaniu generalnym" }
export const GALLERY_PHOTOS: { src: string; alt: string }[] = [];
