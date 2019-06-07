const {join, dirname} = require('path');

function resolveModulePath(packageName) {
	const packageInfoPath = require.resolve(`${packageName}/package.json`);

	return join(dirname(packageInfoPath), require(packageInfoPath).module);
}

module.exports = {
	extends: 'interfaced',
	overrides: [
		{
			...require('eslint-config-interfaced/overrides/esm'),
			files: ['lib/**/*.js'],
			settings: {
				'import/resolver': {
					alias: [
						['zb', resolveModulePath('zombiebox')],
						['cutejs', resolveModulePath('zombiebox-extension-cutejs')]
					]
				}
			}
		},
		{
			files: ['lib/**/*.js'],
			rules: {
				'import/extensions': {jst: 'always'},
				'import/no-unresolved': ['error', {ignore: ['^generated/']}]
			}
		},
		{
			...require('eslint-config-interfaced/overrides/node'),
			files: ['index.js']
		}
	]
};

