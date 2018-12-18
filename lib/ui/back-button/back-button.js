goog.provide('zb.storybook.ui.BackButton');
goog.require('zb.device.input.Keys');
goog.require('zb.html');
goog.require('zb.storybook.templates.backButton');
goog.require('zb.widgets.InlineWidget');


/**
 */
zb.storybook.ui.BackButton = class extends zb.widgets.InlineWidget {
	/**
	 * @param {string} caption
	 * @param {Array<string>} options
	 */
	constructor(caption, options) {
		const exported = zb.storybook.templates.backButton({
			caption,
			options
		});

		super(zb.html.findFirstElementNode(exported.root));

		/**
		 * Fired with: nothing
		 * @const {string}
		 */
		this.EVENT_CLICKED = 'clicked';
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
