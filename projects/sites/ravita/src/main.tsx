import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Шрифт підключаємо локально (не з Google Fonts) — це вимога RODO/GDPR у Польщі та ЄС
import "@fontsource-variable/plus-jakarta-sans";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
