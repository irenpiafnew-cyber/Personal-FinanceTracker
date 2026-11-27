import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// base: "./" — щоб зібраний сайт відкривався з будь-якої папки (і на Vercel, і з диска)
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
});
