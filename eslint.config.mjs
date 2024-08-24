import globals from 'globals';
import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin-js';


export default [
	js.configs.recommended,
	{
		ignores: [
			'build/',
			'dev/js/lib/',
			'docs/',
			'node_modules/',
		],
	},
	{
		files: [
			'dev/js/**/*.js',
		],
		languageOptions: {
			sourceType: 'script',
		},
	},
	{
		languageOptions: {
			ecmaVersion: 2022,
			globals: {
				...globals.browser,
				js13k: 'writable',
				pxtex: 'readonly',
				W: 'readonly',
				zzfx: 'readonly',
			},
		},
		plugins: {
			'@stylistic': stylistic,
		},
		rules: {
			'@stylistic/indent': [
				'error',
				'tab',
				{
					SwitchCase: 1,
				},
			],
			'@stylistic/linebreak-style': [
				'error',
				'unix',
			],
			'@stylistic/no-empty': 0,
			'no-sparse-arrays': 0,
			'no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_',
				},
			],
			'no-var': ['error'],
			'@stylistic/one-var-declaration-per-line': ['warn', 'always'],
			'@stylistic/quotes': [
				'error',
				'single',
				{
					avoidEscape: true,
				},
			],
			'@stylistic/semi': ['error', 'always'],
			'@stylistic/space-in-parens': ['warn', 'always'],
		},
	},
];