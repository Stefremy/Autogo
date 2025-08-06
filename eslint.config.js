const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const reactPlugin = require("eslint-plugin-react");
const reactHooksPlugin = require("eslint-plugin-react-hooks");
const jsxA11yPlugin = require("eslint-plugin-jsx-a11y");
const importPlugin = require("eslint-plugin-import");

module.exports = [
  {
    ignores: ["**/node_modules/**", "**/dist/**", "**/.next/**"],
  },
  // TypeScript files
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        project: ["./tsconfig.json", "./frontend/tsconfig.json"],
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "jsx-a11y": jsxA11yPlugin,
      import: importPlugin,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "import/order": ["warn", { groups: ["builtin", "external", "internal"] }],
      "jsx-a11y/anchor-is-valid": "warn",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  // JS files
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "jsx-a11y": jsxA11yPlugin,
      import: importPlugin,
    },
    rules: {
      "no-unused-vars": "warn",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "import/order": ["warn", { groups: ["builtin", "external", "internal"] }],
      "jsx-a11y/anchor-is-valid": "warn",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
