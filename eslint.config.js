import tsParser from "@typescript-eslint/parser";
import reactNativePlugin from "eslint-plugin-react-native";
import globals from "globals";

export default [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "react-native": reactNativePlugin,
    },
    rules: {
      "react-native/no-unused-styles": 2,
      // 'react-native/no-inline-styles': 1,
      "react-native/no-raw-text": 0,
      "react-native/no-single-element-style-arrays": 2,
      "react-native/no-color-literals": 1,
    },
  },
];
