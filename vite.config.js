import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { shrinkImages } from "./vite-plugin-shrink-images.js"
import { cv } from "./vite-plugin-cv.js"

export default defineConfig({
  plugins: [react(), tailwindcss(), shrinkImages(), cv()],
})
