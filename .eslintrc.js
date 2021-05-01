module.exports = {
  extends: ['eslint:standard', 'prettier', 'plugin:prettier/standard'],
  rules: {
    // disable semicolon check
    semi: 'never',

    // override default options for rules from base configurations
    'comma-dangle': ['error', 'never'],

    // disable rules from base configurations
    'no-console': 'off',
    'no-multi-spaces': 'off'
  }
};
