import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["package/index.ts"],
  clean: true,
  dts: true,
  format: ["cjs", "esm"],
});
