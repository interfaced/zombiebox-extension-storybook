goog.provide('zb.storybook.ui.Spinner');
goog.require('zb.html');
goog.require('zb.widgets.InlineWidget');


/**
 */
zb.storybook.ui.Spinner = class extends zb.widgets.InlineWidget {
	/**
	 */
	constructor() {
		super(zb.html.div('w-ext-storybook-spinner'));
	}
};
