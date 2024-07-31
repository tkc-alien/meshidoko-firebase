module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
    "/generated/**/*", // Ignore generated files.
    "/coverage/**/*", // Ignore coverage files.
  ],
  plugins: [
    "@typescript-eslint/eslint-plugin",
    "simple-import-sort", // import文の自動整列を実現
    "import", // 上記プラグインを拡張（自動整列のルールを追加）
    "unused-imports", // 未使用のimport文を削除
  ],
  rules: {
    "quotes": ["error", "double"],
    "import/no-unresolved": 0,
    "indent": ["error", 2, { SwitchCase: 1 }],
    "no-restricted-imports": [
      "error",
      {
        patterns: ["./", "../"],
      },
    ],
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    "simple-import-sort/imports": "error", // importのsortルールを設定
    "simple-import-sort/exports": "error", // exportのsortルールを設定
    "import/first": "error", // すべてのimportがファイルの先頭にあることを確認
    "import/newline-after-import": "error", // import後に改行があることを確認
    "import/no-duplicates": "error", // 同じファイルのimportをマージ
    "unused-imports/no-unused-imports": "error", // 未使用のimport文を削除
  },
};
