goog.provide('zb.storybook.ui.Menu');
goog.require('zb.device.input.Keys');
goog.require('zb.std.plain.Direction');
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
		const {
			SCROLLING_END_DEBOUNCE_DELAY,
			ITEM_OPTION_SELECT_DEBOUNCE_DELAY
		} = zb.storybook.ui.Menu;

		super();

		/**
		 * @type {Array<zb.storybook.ui.MenuItem>}
		 * @protected
		 */
		this._widgets;

		/**
		 * @type {zb.storybook.templates.MenuOut}
		 * @protected
		 */
		this._exported;

		/**
		 * @type {?zb.storybook.ui.MenuItem}
		 * @protected
		 */
		this._selectedItem = null;

		/**
		 * @type {number}
		 * @protected
		 */
		this._selectedItemOptionIndex = -1;

		/**
		 * @type {function()}
		 * @protected
		 */
		this._endScrollingDebounced = zb.storybook.utils.debounce(
			this._endScrolling.bind(this),
			SCROLLING_END_DEBOUNCE_DELAY
		);

		/**
		 * @type {function(zb.storybook.ui.MenuItem, number)}
		 * @protected
		 */
		this._onItemOptionSelectedDebounced = zb.storybook.utils.debounce(
			this._onItemOptionSelected.bind(this),
			ITEM_OPTION_SELECT_DEBOUNCE_DELAY
		);

		/**
		 * Fired with:
		 *     {zb.storybook.ui.MenuItem} Selected item
		 *     {string} Selected option
		 * @const {string}
		 */
		this.EVENT_ITEM_OPTION_SELECTED = 'item-option-selected';

		this._listenContainerMouseLeave();
	}

	/**
	 * @override
	 */
	afterDOMShow() {
		super.afterDOMShow();

		if (this._selectedItem) {
			this._updateSliderOffset(this._selectedItem, this._selectedItemOptionIndex);
		}

		this._updateThumbSize();
		this._updateThumbPosition();
	}

	/**
	 * @override
	 */
	processKey(zbKey, opt_e) {
		const Keys = zb.device.input.Keys;

		if (zbKey === Keys.MOUSE_WHEEL_UP || zbKey === Keys.MOUSE_WHEEL_DOWN) {
			this._beginScrolling();
			this._endScrollingDebounced();

			return super.processKey(zbKey === Keys.MOUSE_WHEEL_UP ? Keys.UP : Keys.DOWN, opt_e);
		}

		return super.processKey(zbKey, opt_e);
	}

	/**
	 * @param {zb.storybook.ui.MenuItem} item
	 */
	addItem(item) {
		item.on(item.EVENT_OPTION_FOCUSED, (eventName, optionIndex) => {
			this._onItemOptionFocused(item, optionIndex);
			this._onItemOptionSelectedDebounced(item, optionIndex);
		});

		this.appendWidget(item);

		this._exported.slider.appendChild(item.getContainer());

		this._updateThumbSize();
	}

	/**
	 * @param {zb.storybook.ui.MenuItem} item
	 * @param {string=} opt_option
	 */
	selectItem(item, opt_option) {
		const optionIndex = opt_option ? item.getOptions().indexOf(opt_option) : 0;
		const optionWidget = item.getWidgets()[optionIndex];

		this.activateWidget(item);
		item.activateWidget(optionWidget);

		this._onItemOptionFocused(item, optionIndex);
		this._onItemOptionSelected(item, optionIndex);
	}

	/**
	 */
	selectNext() {
		this._selectInDirection(zb.std.plain.Direction.Sign.ASC);
	}

	/**
	 */
	selectPrev() {
		this._selectInDirection(zb.std.plain.Direction.Sign.DESC);
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
	 * @param {zb.std.plain.Direction.Sign} directionSign
	 * @protected
	 */
	_selectInDirection(directionSign) {
		if (!this._selectedItem) {
			return;
		}

		const selectedItemIndex = this._widgets.indexOf(this._selectedItem);
		const selectedItemOptions = this._selectedItem.getOptions();

		let newItem;
		let newOption;

		if (directionSign === zb.std.plain.Direction.Sign.ASC) {
			if (
				this._selectedItemOptionIndex !== -1 &&
				this._selectedItemOptionIndex !== selectedItemOptions.length - 1
			) {
				newItem = this._selectedItem;
				newOption = selectedItemOptions[this._selectedItemOptionIndex + 1];
			} else {
				newItem = this._widgets[selectedItemIndex + 1];
			}
		}

		if (directionSign === zb.std.plain.Direction.Sign.DESC) {
			if (
				this._selectedItemOptionIndex !== -1 &&
				this._selectedItemOptionIndex !== 0
			) {
				newItem = this._selectedItem;
				newOption = selectedItemOptions[this._selectedItemOptionIndex - 1];
			} else {
				newItem = this._widgets[selectedItemIndex - 1];
				if (newItem) {
					const newItemOptions = newItem.getOptions();
					newOption = newItemOptions[newItemOptions.length - 1];
				}
			}
		}

		if (newItem) {
			this.selectItem(newItem, newOption);
		}
	}

	/**
	 * @protected
	 */
	_beginScrolling() {
		this._addContainerClass('_scrolling');
	}

	/**
	 * @protected
	 */
	_endScrolling() {
		this._removeContainerClass('_scrolling');
	}

	/**
	 * @protected
	 */
	_updateThumbSize() {
		const {viewport, slider, thumb} = this._exported;

		thumb.style.height = `${viewport.offsetHeight / slider.offsetHeight * 100}%`;
	}

	/**
	 * @protected
	 */
	_updateThumbPosition() {
		const {slider, thumb} = this._exported;

		thumb.style.top = `${Math.abs(slider.offsetTop) / slider.offsetHeight * 100}%`;
	}

	/**
	 * @param {zb.storybook.ui.MenuItem} item
	 * @param {number} optionIndex
	 * @protected
	 */
	_updateSliderOffset(item, optionIndex) {
		const {slider, viewport} = this._exported;

		const optionWidget = item.getWidgets()[optionIndex];
		const optionElement = optionWidget.getContainer();

		const viewportRect = zb.std.plain.Rect.createByClientRect(
			viewport.getBoundingClientRect()
		);

		const itemRect = zb.std.plain.Rect.createByClientRect(
			item.getContainer().getBoundingClientRect()
		);

		const optionRect = zb.std.plain.Rect.createByClientRect(
			optionElement.getBoundingClientRect()
		);

		let offsetIncrement = 0;

		if (optionRect.y1 > viewportRect.y1) {
			offsetIncrement = (optionRect.y1 - viewportRect.y1) * -1;
		}

		if (optionRect.y0 < viewportRect.y0) {
			offsetIncrement = viewportRect.y0 - (optionIndex === 0 ? itemRect.y0 : optionRect.y0);
		}

		if (offsetIncrement) {
			slider.style.top = `${slider.offsetTop + offsetIncrement}px`;
		}
	}

	/**
	 * @protected
	 */
	_listenContainerMouseLeave() {
		this._container.addEventListener('mouseleave', () => {
			/** @type {Function} */ (this._onItemOptionSelectedDebounced).cancel();
		});
	}

	/**
	 * @param {zb.storybook.ui.MenuItem} item
	 * @param {number} optionIndex
	 * @protected
	 */
	_onItemOptionFocused(item, optionIndex) {
		this._updateSliderOffset(item, optionIndex);
		this._updateThumbPosition();
	}

	/**
	 * @param {zb.storybook.ui.MenuItem} item
	 * @param {number} optionIndex
	 * @protected
	 */
	_onItemOptionSelected(item, optionIndex) {
		if (this._selectedItem) {
			const selectedItemOptionWidget = this._selectedItem.getWidgets()[this._selectedItemOptionIndex];
			const selectedItemOptionElement = selectedItemOptionWidget.getContainer();

			selectedItemOptionElement.classList.remove('_selected');
		}

		const optionValue = item.getOptions()[optionIndex];
		const optionWidget = item.getWidgets()[optionIndex];
		const optionElement = optionWidget.getContainer();

		optionElement.classList.add('_selected');

		this._selectedItem = item;
		this._selectedItemOptionIndex = optionIndex;

		this._fireEvent(this.EVENT_ITEM_OPTION_SELECTED, item, optionValue);
	}
};


/**
 * @const {number} In milliseconds
 */
zb.storybook.ui.Menu.SCROLLING_END_DEBOUNCE_DELAY = 500;


/**
 * @const {number} In milliseconds
 */
zb.storybook.ui.Menu.ITEM_OPTION_SELECT_DEBOUNCE_DELAY = 1000;
