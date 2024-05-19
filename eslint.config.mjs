import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    languageOptions: {
      globals: globals.node,
    },
  },
  pluginJs.configs.recommended,
  tseslint.configs.recommended,
  {
    parser: tsParser,
    parserOptions: {
      project: './tsconfig.json',
    },
  },
];
