goog.provide('zb.storybook.ui.MinimizeButton');
goog.require('zb.device.input.Keys');
goog.require('zb.html');
goog.require('zb.storybook.templates.minimizeButton');
goog.require('zb.widgets.InlineWidget');


/**
 */
zb.storybook.ui.MinimizeButton = class extends zb.widgets.InlineWidget {
	/**
	 */
	constructor() {
		super(zb.html.findFirstElementNode(zb.storybook.templates.minimizeButton().root));

		/**
		 * Fired with: nothing
		 * @const {string}
		 */
		this.EVENT_CLICKED = 'clicked';
	}

	/**
	 */
	setRightward() {
		this._container.classList.remove('_leftward');
		this._container.classList.add('_rightward');
	}

	/**
	 */
	setLeftward() {
		this._container.classList.remove('_rightward');
		this._container.classList.add('_leftward');
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
