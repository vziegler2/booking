import js from '@eslint/js';
import globals from 'globals';

export default [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.es2021,
                grecaptcha: 'readonly'
            }
        },
        rules: {
            'indent': ['error', 4],
            'linebreak-style': ['error', 'unix'],
            'quotes': ['error', 'single'],
            'semi': ['error', 'always'],
            'no-unused-vars': ['warn'],
            'no-console': ['warn', { allow: ['warn', 'error', 'log'] }],
            'eqeqeq': ['error', 'always'],
            'curly': ['error', 'all'],
            'brace-style': ['error', '1tbs'],
            'comma-dangle': ['error', 'never'],
            'no-multiple-empty-lines': ['error', { max: 2 }],
            'no-trailing-spaces': 'error',
            'arrow-spacing': ['error', { before: true, after: true }],
            'object-curly-spacing': ['error', 'always'],
            'array-bracket-spacing': ['error', 'never'],
            'space-before-blocks': 'error',
            'keyword-spacing': ['error', { before: true, after: true }]
        }
    },
    {
        ignores: [
            'node_modules/**',
            'dist/**',
            'coverage/**',
            '*.min.js'
        ]
    }
];
