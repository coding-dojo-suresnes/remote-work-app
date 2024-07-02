module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: ['@gads-citron/eslint-config-citron'],
  root: true,
  env: {
    node: true,
    mocha: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {},
  overrides: [
    {
      files: ['**/*.spec.ts'],
      rules: {
        'max-lines-per-function': 'off',
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
};
