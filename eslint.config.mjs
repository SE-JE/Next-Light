import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals",
    "eslint-config-prettier",
    "plugin:prettier/recommended"
  ),
  {
    plugins: [
      "react",
      "@typescript-eslint",
      "prettier",
      "eslint-plugin-prettier",
    ],
    rules: {
      "@typescript-eslint/no-unused-vars": 1,
      "@typescript-eslint/no-explicit-any": 0,
      "import/prefer-default-export": 0,
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
        },
      ],
      "react/no-unstable-nested-components": 0,
      "react/react-in-jsx-scope": 0,
      "react/require-default-props": 0,
      "react/jsx-props-no-spreading": 0,
      "no-console": "error",
      "no-nested-ternary": 0,
    },
  },
];

export default eslintConfig;
