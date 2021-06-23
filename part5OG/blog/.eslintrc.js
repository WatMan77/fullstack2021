module.exports = {
  'env': {
    // 'browser': true, // Is this needed?
    'commonjs': true,
    'es2021': true,
    "node": true,
    // "jest/globals": true // Also with. Got rid of the "expect" not defined errors
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'ecmaVersion': 12
  },
  'rules': {
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'windows'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'never'
    ]
  }
}
