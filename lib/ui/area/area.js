goog.provide('zb.storybook.ui.Area');
goog.require('zb.html');
goog.require('zb.widgets.InlineWidget');


/**
 */
zb.storybook.ui.Area = class extends zb.widgets.InlineWidget {
	/**
	 */
	constructor() {
		super(zb.html.div('w-ext-storybook-area'));
	}

	/**
	 * @override
	 */
	isFocusable() {
		return this.getWidgets()
			.some((widget) => widget.isFocusable());
	}

	/**
	 * @param {string} background
	 */
	setBackground(background) {
		this._container.style.background = background;
	}

	/**
	 * @return {string}
	 */
	getBackground() {
		return this._container.style.background;
	}
};
