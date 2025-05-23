import terser from "@rollup/plugin-terser";

export default {
  input: "src/app.js",
  output: {
    file: "dist/bundle.js",
    format: "iife",
    sourcemap: true,
  },
  plugins: [terser()],
};
