import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
      "@components": "/src/components",
      "@features": "/src/features",
      "@hooks": "/src/hooks",
      "@data": "/src/data",
      "@utils": "/src/utils",
      "@layout": "/src/layout",
    },
  },
});
