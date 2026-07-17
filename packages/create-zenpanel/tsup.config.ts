import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "node20",
  outDir: "dist",
  clean: true,
  splitting: false,
  sourcemap: false,
  dts: false,
  outExtension() {
    return { js: ".js" };
  },
  banner: {
    js: "#!/usr/bin/env node",
  },
});
