const path = require('path');
const {AbstractExtension} = require('zombiebox');


/**
 */
class Extension extends AbstractExtension {
	/**
	 * @override
	 */
	getName() {
		return 'storybook';
	}

	/**
	 * @override
	 */
	getSourcesDir() {
		return path.join(__dirname, 'lib');
	}

	/**
	 * @override
	 */
	getConfig() {
		return {};
	}

	/**
	 * @override
	 */
	buildCLI(yargs, application) {
		return undefined;
	}

	/**
	 * @override
	 */
	generateCode(projectConfig) {
		return {};
	}
}


module.exports = Extension;
