module.exports = {
	extends: 'interfaced',
	overrides: [
		{
			files: ['lib/**/*.js'],
			extends: 'interfaced/esm',
			rules: {
				'import/extensions': ['error', {jst: 'always'}],
				'import/no-unresolved': ['error', {
					ignore: [
						'^generated/',
						'^cutejs/'
					]
				}]
			},
			settings: {
				'import/resolver': 'zombiebox'
			}
		},
		{
			files: ['index.js'],
			extends: 'interfaced/node'
		}
	]
};

