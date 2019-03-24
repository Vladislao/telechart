module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true
  },
  plugins: ["prettier"],
  extends: ["airbnb-base", "prettier"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    "prettier/prettier": "error",

    quotes: ["error", "double"],
    "comma-dangle": ["error", "never"],
    "arrow-parens": ["error", "as-needed"],
    "no-param-reassign": ["error", { props: false }]
  }
};
