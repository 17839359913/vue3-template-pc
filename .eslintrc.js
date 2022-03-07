module.exports = {
    root: true,
    env: {
      node: true
    },
    extends: [
      'plugin:vue/vue3-essential',
      '@vue/typescript/recommended'
    ],
    parserOptions: {
      ecmaVersion: 2020
    },
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'semi-style': 'off',
      '@typescript-eslint/no-extra-semi': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      'import/prefer-default-export': 'off',
      'no-shadow': 'off',
      'implicit-arrow-linebreak': 'off',
      'function-paren-newline': 'off',
      'max-len': ['error', { code: 300 }],
      'padded-blocks': 'off',
      'no-trailing-spaces': 'off',
      'object-curly-newline': 'off',
      'operator-linebreak': 'off',
      'comma-dangle': [
        'error',
        {
          exports: 'never',
          imports: 'never'
        }
      ],
      'global-require': 0
    }
  }
