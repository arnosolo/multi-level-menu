module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    '@antfu',
  ],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'vue',
  ],
  rules: {
    'vue/component-name-in-template-casing': ['error', 'kebab-case', {
      registeredComponentsOnly: false,
      ignores: [],
    }],
    'curly': ['error', 'all'],
  },
}
