goog.provide('zb.storybook.ui.Navigator');
goog.require('zb.html');
goog.require('zb.storybook.templates.NavigatorOut');
goog.require('zb.storybook.templates.navigator');
goog.require('zb.widgets.CuteWidget');


/**
 */
zb.storybook.ui.Navigator = class extends zb.widgets.CuteWidget {
	/**
	 */
	constructor() {
		super();

		/**
		 * @type {zb.storybook.templates.NavigatorOut}
		 * @protected
		 */
		this._exported;

		/**
		 * Fired with: nothing
		 * @const {string}
		 */
		this.EVENT_PREV = 'prev';

		/**
		 * Fired with: nothing
		 * @const {string}
		 */
		this.EVENT_NEXT = 'next';

		this._listenArrows();
	}

	/**
	 * @override
	 */
	isFocusable() {
		return false;
	}

	/**
	 * @param {string} title
	 */
	setTitle(title) {
		zb.html.text(this._exported.title, title);
	}

	/**
	 * @param {string} subtitle
	 */
	setSubtitle(subtitle) {
		zb.html.text(this._exported.subtitle, subtitle);
	}

	/**
	 * @override
	 */
	_renderTemplate() {
		return zb.storybook.templates.navigator(
			this._getTemplateData(),
			this._getTemplateOptions()
		);
	}

	/**
	 * @protected
	 */
	_listenArrows() {
		const {arrowPrev, arrowNext} = this._exported;

		arrowPrev.addEventListener('click', () => {
			this._fireEvent(this.EVENT_PREV);
		});

		arrowNext.addEventListener('click', () => {
			this._fireEvent(this.EVENT_NEXT);
		});
	}
};
