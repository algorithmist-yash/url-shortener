import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/shorten": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/analytics": {
        target: "http://localhost:5000",
        changeOrigin: true,
      }
    }
  }
});
