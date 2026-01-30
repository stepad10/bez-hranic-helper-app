import js from "@eslint/js";
import tseslint from "typescript-eslint";
import solid from "eslint-plugin-solid";
import prettier from "eslint-config-prettier";

export default tseslint.config(
    {
        ignores: ["dist", "node_modules", "coverage"],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ["**/*.{ts,tsx}"],
        ...solid.configs["flat/typescript"],
    },
    {
        rules: {
            "@typescript-eslint/no-explicit-any": "error",
        },
    },
    prettier, // Must serve as the last object to override other configs
);
