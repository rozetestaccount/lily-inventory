import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// IMPORTANT for GitHub Pages:
// Replace 'lily-inventory' below with your exact GitHub repo name.
// e.g. if your repo is github.com/yourname/lily-app -> base: "/lily-app/"
// If deploying to StackBlitz or your own domain instead, set base: "/"
export default defineConfig({
  plugins: [react()],
  base: "/lily-inventory/",
});
