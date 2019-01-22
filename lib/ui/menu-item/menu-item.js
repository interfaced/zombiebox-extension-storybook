goog.provide('zb.storybook.ui.MenuItem');
goog.require('zb.html');
goog.require('zb.storybook.templates.menuItem');
goog.require('zb.widgets.InlineWidget');


/**
 */
zb.storybook.ui.MenuItem = class extends zb.widgets.InlineWidget {
	/**
	 * @param {string} caption
	 * @param {Array<string>} options
	 */
	constructor(caption, options) {
		const exported = zb.storybook.templates.menuItem({
			caption,
			options
		});

		super(zb.html.findFirstElementNode(exported.root));

		/**
		 * @type {Array<string>}
		 * @protected
		 */
		this._options = options;

		/**
		 * Fired with:
		 *     {string} Index of the focused option
		 * @const {string}
		 */
		this.EVENT_OPTION_FOCUSED = 'option-focused';

		exported.options.forEach((optionWidget, index) => {
			this.appendWidget(optionWidget);

			optionWidget.on(optionWidget.EVENT_FOCUS, () => {
				this._fireEvent(this.EVENT_OPTION_FOCUSED, index);
			});
		});
	}

	/**
	 * @override
	 */
	focus(prevRect) {
		this.activateWidget(null);

		super.focus(prevRect);
	}

	/**
	 * @return {Array<string>}
	 */
	getOptions() {
		return this._options;
	}
};
