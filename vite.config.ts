import path from "path";
import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@wsvaio/uniapi": path.resolve(__dirname, "package/index.ts"),
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [uni()],
});
