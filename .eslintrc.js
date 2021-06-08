module.exports = {
  extends: ['eslint:recommended', 'prettier'],
  parser: 'babel-eslint',
  plugins: ['prettier'],
  env: {
    node: true,
    es6: true
  },
  rules: {
    'comma-dangle': ['error', 'never'],
    'no-multi-spaces': 'off',
    'no-underscore-dangle': 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'prettier/prettier': 'error',
    semi: [2, 'always']
  }
};
