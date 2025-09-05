// OLD LINT CODE
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { globalIgnores } from "eslint/config";
import { defineConfig } from "eslint/config";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
]);

// NEW LINT CODE
// import js from "@eslint/js";
// import globals from "globals";
// import reactHooks from "eslint-plugin-react-hooks";
// import reactRefresh from "eslint-plugin-react-refresh";
// import tseslint from "typescript-eslint";
// import { defineConfig } from "eslint";
// import reactCompiler from "eslint-plugin-react-compiler";

// export default defineConfig({
//   ignores: ["dist/**"],
//   files: ["**/*.{ts,tsx}"],
//   extends: [
//     js.configs.recommended,
//     tseslint.configs.recommended,
//     reactHooks.configs["recommended-latest"],
//     reactRefresh.configs.vite,
//     reactCompiler.configs.recommended,
//   ],
//   languageOptions: {
//     ecmaVersion: 2020,
//     globals: {
//       ...globals.browser,
//     },
//     parser: tseslint.parser,
//     parserOptions: {
//       project: "./tsconfig.json",
//       ecmaFeatures: {
//         jsx: true,
//       },
//     },
//   },
//   plugins: {
//     "@typescript-eslint": tseslint.plugin,
//     "react-hooks": reactHooks,
//     "react-refresh": reactRefresh,
//     react: reactPlugin,
//     "react-compiler": reactCompiler,
//   },
//   settings: {
//     react: {
//       version: "detect",
//     },
//   },
// });
