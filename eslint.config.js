const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const eslintPluginJest = require('eslint-plugin-jest');
const globals = require('globals');

module.exports = [
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
  },
  eslintPluginJest.configs['flat/recommended'],
  eslintPluginPrettierRecommended,
];
