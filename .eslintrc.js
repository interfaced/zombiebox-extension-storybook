const path = require('path');
const {nsUtils} = require('eslint-plugin-goog');

module.exports = {
	extends: 'interfaced',
	overrides: [
		Object.assign(
			{
				files: 'lib/**',
			},
			require('eslint-config-interfaced/overrides/zombiebox')
		),
		{
			files: 'lib/**',
			settings: {
				knownNamespaces: [
					...nsUtils.findByPattern(path.join(__dirname , 'lib', '**', '*.js'))
				]
			}
		},
		Object.assign(
			{
				files: 'index.js',
			},
			require('eslint-config-interfaced/overrides/node')
		),
	]
};
