const path = require('path');
const {nsUtils} = require('eslint-plugin-goog');

const knownNamespaces = [
	...nsUtils.findByPattern(path.join(__dirname , 'lib', 'ok', '**', '*.js'))
];

module.exports = {
	extends: 'interfaced/zombiebox',
	settings: {
		knownNamespaces
	}
};
