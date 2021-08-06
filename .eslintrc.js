module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier"],
  extends: ["airbnb-typescript", "prettier"],
  parserOptions: {
    project: [".tsconfig.json"],
  },
  rules: {
    "react/require-default-props": 0,
  },
};
