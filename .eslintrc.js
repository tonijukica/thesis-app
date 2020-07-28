module.exports = {
  env: {
    browser: true,
    node: true,
    es2020: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['@typescript-eslint', 'react', 'prettier'],
  extends: [
    'airbnb',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'prettier',
    'prettier/@typescript-eslint',
    'prettier/react',
  ],
  rules: {
    quotes: [2, 'single', { allowTemplateLiterals: true, avoidEscape: true }],
    'no-else-return': [0, 'never'],
    'import/extensions': [0, 'never'],
    'import/prefer-default-export': [0, 'never'],
    'react/react-in-jsx-scope': [0, 'never'],
    'react/jsx-filename-extension': [1, { extensions: ['.ts', '.tsx'] }],
    'react/prop-types': 0,
    'react/jsx-props-no-spreading': ['error', { custom: 'ignore' }],
    'prettier/prettier': ['error', { singleQuote: true }],
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['~'],
      },
    },
  },
};
