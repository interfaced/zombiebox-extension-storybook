goog.provide('zb.storybook.ui.Menu');
goog.require('zb.device.input.Keys');
goog.require('zb.std.plain.Rect');
goog.require('zb.storybook.templates.MenuOut');
goog.require('zb.storybook.templates.menu');
goog.require('zb.storybook.ui.MenuItem');
goog.require('zb.storybook.utils.debounce');
goog.require('zb.widgets.CuteWidget');


/**
 */
zb.storybook.ui.Menu = class extends zb.widgets.CuteWidget {
	/**
	 */
	constructor() {
		super();

		/**
		 * @type {zb.storybook.templates.MenuOut}
		 * @protected
		 */
		this._exported;

		/**
		 * @type {function()}
		 * @protected
		 */
		this._endScrollingDebounced = zb.storybook.utils.debounce(
			this._endScrolling.bind(this),
			zb.storybook.ui.Menu.SCROLLING_END_DEBOUNCE_DELAY
		);
	}

	/**
	 * @override
	 */
	processKey(zbKey, opt_e) {
		const Keys = zb.device.input.Keys;

		if (zbKey === Keys.MOUSE_WHEEL_UP || zbKey === Keys.MOUSE_WHEEL_DOWN) {
			this._startScrolling();
			this._endScrollingDebounced();

			return super.processKey(zbKey === Keys.MOUSE_WHEEL_UP ? Keys.UP : Keys.DOWN, opt_e);
		}

		return super.processKey(zbKey, opt_e);
	}

	/**
	 * @param {zb.storybook.ui.MenuItem} item
	 */
	addItem(item) {
		const {viewport, slider} = this._exported;

		this.appendWidget(item);

		slider.appendChild(item.getContainer());

		item.on(item.EVENT_OPTION_SELECTED, (eventName, option, position, element) => {
			const viewportRect = zb.std.plain.Rect.createByClientRect(
				viewport.getBoundingClientRect()
			);

			const itemRect = zb.std.plain.Rect.createByClientRect(
				item.getContainer().getBoundingClientRect()
			);

			const selectedRect = zb.std.plain.Rect.createByClientRect(
				element.getBoundingClientRect()
			);

			let offsetIncrement = 0;

			if (selectedRect.y1 > viewportRect.y1) {
				offsetIncrement = (selectedRect.y1 - viewportRect.y1) * -1;
			}

			if (selectedRect.y0 < viewportRect.y0) {
				offsetIncrement = viewportRect.y0 - (position === 0 ? itemRect.y0 : selectedRect.y0);
			}

			if (offsetIncrement) {
				slider.style.top = `${slider.offsetTop + offsetIncrement}px`;
			}
		});
	}

	/**
	 * @override
	 */
	_renderTemplate() {
		return zb.storybook.templates.menu(
			this._getTemplateData(),
			this._getTemplateOptions()
		);
	}

	/**
	 * @protected
	 */
	_startScrolling() {
		this._container.classList.add('_scrolling');
	}

	/**
	 * @protected
	 */
	_endScrolling() {
		this._container.classList.remove('_scrolling');
	}
};


/**
 * @const {number} In milliseconds
 */
zb.storybook.ui.Menu.SCROLLING_END_DEBOUNCE_DELAY = 500;
