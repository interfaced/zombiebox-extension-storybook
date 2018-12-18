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

		exported.options.forEach((optionWidget, index) => {
			this.appendWidget(optionWidget);

			optionWidget.on(optionWidget.EVENT_FOCUS, () => {
				this._fireEvent(this.EVENT_OPTION_SELECTED, options[index], index, optionWidget.getContainer());
			});
		});

		/**
		 * Fired with:
		 *     {string} Selected option
		 *     {string} Option's index
		 *     {HTMLElement} Option's element
		 * @const {string}
		 */
		this.EVENT_OPTION_SELECTED = 'option-selected';
	}
};
