const path = require('path');


/**
 * @implements {IZBAddon}
 */
class Extension {
	/**
	 * @return {string}
	 */
	getName() {
		return 'storybook';
	}

	/**
	 * @return {string}
	 */
	getPublicDir() {
		return path.join(__dirname, 'lib');
	}

	/**
	 * @return {Object}
	 */
	getConfig() {
		return {};
	}
}


/**
 * @type {IZBAddon}
 */
module.exports = Extension;
