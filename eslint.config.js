// @ts-check
const tseslint = require('typescript-eslint');

module.exports = tseslint.config(
  tseslint.configs.recommended,
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  },
);
