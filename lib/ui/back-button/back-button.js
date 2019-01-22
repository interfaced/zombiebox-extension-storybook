goog.provide('zb.storybook.ui.BackButton');
goog.require('zb.device.input.Keys');
goog.require('zb.html');
goog.require('zb.widgets.InlineWidget');


/**
 */
zb.storybook.ui.BackButton = class extends zb.widgets.InlineWidget {
	/**
	 */
	constructor() {
		super(zb.html.div());

		/**
		 * Fired with: nothing
		 * @const {string}
		 */
		this.EVENT_CLICKED = 'clicked';

		this._addContainerClass('w-ext-storybook-back-button');
	}

	/**
	 * @override
	 */
	_processKey(zbKey, opt_e) {
		if (zbKey === zb.device.input.Keys.ENTER) {
			this._fireEvent(this.EVENT_CLICKED);
			return true;
		}

		return false;
	}
};
