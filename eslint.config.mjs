import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import prettier from "eslint-config-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next", "next/typescript", "prettier"),
  {
    rules: {
      "react/no-unescaped-entities"               :  1,
      "@typescript-eslint/no-explicit-any"        :  0,
      "import/prefer-default-export"              :  0,
      "react/no-unstable-nested-components"       :  0,
      "react/react-in-jsx-scope"                  :  0,
      "react/require-default-props"               :  0,
      "react/jsx-props-no-spreading"              :  0,
      "no-console"                                :  1,
      "no-nested-ternary"                         :  0,
      "react-hooks/exhaustive-deps"               :  0,
      "@typescript-eslint/no-unused-expressions"  :  0,
      "@typescript-eslint/no-array-constructor"   :  0,
    },
  },
  prettier,
];

export default eslintConfig;
