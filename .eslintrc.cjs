module.exports = {
  env: {
    node: true,
    es2021: true
  },
  extends: 'airbnb-base',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest'
  },
  rules: {
    semi: 0,
    'no-console': 0,
    'no-plusplus': 0,
    'comma-dangle': 0,
    'no-extra-semi': 0,
    'no-await-in-loop': 0,
    'import/extensions': 0,
    'operator-linebreak': 0,
    'import/no-unresolved': 0,
    'object-curly-newline': 0,
    'function-paren-newline': 0,
    'implicit-arrow-linebreak': 0
  }
}
