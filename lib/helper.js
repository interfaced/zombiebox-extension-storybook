goog.provide('zb.storybook.Helper');
goog.require('zb.layers.Layer');
goog.require('zb.storybook.ui.Area');
goog.require('zb.widgets.Widget');


/**
 */
zb.storybook.Helper = class {
	/**
	 * @param {zb.storybook.ui.Area} area
	 * @param {zb.layers.Layer} layer
	 */
	constructor(area, layer) {
		/**
		 * @type {zb.storybook.ui.Area}
		 * @protected
		 */
		this._area = area;

		/**
		 * @type {HTMLElement}
		 * @protected
		 */
		this._areaContainer = area.getContainer();

		/**
		 * @type {string}
		 * @protected
		 */
		this._defaultAreaBackground = area.getBackground();

		/**
		 * @type {zb.layers.Layer}
		 * @protected
		 */
		this._layer = layer;
	}

	/**
	 * @param {HTMLElement} element
	 */
	placeElement(element) {
		this._areaContainer.appendChild(element);
	}

	/**
	 * @param {HTMLElement} element
	 */
	removeElement(element) {
		this._areaContainer.removeChild(element);
	}

	/**
	 * @param {HTMLElement} element
	 * @param {{
	 *     horizontally: (boolean|undefined),
	 *     vertically: (boolean|undefined)
	 * }=} opt_options
	 */
	centerElement(element, {horizontally = true, vertically = true} = {}) {
		const elementStyle = element.style;

		elementStyle.position = 'absolute';

		if (horizontally) {
			elementStyle.left = '50%';
			elementStyle.marginLeft = `-${element.offsetWidth / 2}px`;
		}

		if (vertically) {
			elementStyle.top = '50%';
			elementStyle.marginTop = `-${element.offsetHeight / 2}px`;
		}
	}

	/**
	 * @param {zb.widgets.Widget} widget
	 */
	placeWidget(widget) {
		this._area.appendWidget(widget);
		this.placeElement(widget.getContainer());
	}

	/**
	 * @param {zb.widgets.Widget} widget
	 */
	removeWidget(widget) {
		this._area.removeWidget(widget);
		this.removeElement(widget.getContainer());
	}

	/**
	 * @param {zb.widgets.Widget} widget
	 * @param {{
	 *     horizontally: (boolean|undefined),
	 *     vertically: (boolean|undefined)
	 * }=} opt_options
	 */
	centerWidget(widget, opt_options = {}) {
		this.centerElement(widget.getContainer(), opt_options);
	}

	/**
	 * @param {zb.widgets.Widget} widget
	 */
	focusWidget(widget) {
		this._area.activateWidget(widget);
	}

	/**
	 * @param {string} background
	 */
	setAreaBackground(background) {
		this._areaContainer.style.background = background;
	}

	/**
	 */
	resetAreaBackground() {
		this._areaContainer.style.background = this._defaultAreaBackground;
	}

	/**
	 * @param {zb.layers.Layer} layer
	 */
	showLayer(layer) {
		this._layer.showChildLayerInstance(layer);
	}

	/**
	 * @param {zb.layers.Layer} layer
	 */
	closeLayer(layer) {
		this._layer.closeChildLayer(layer);
	}

	/**
	 */
	closeAllLayers() {
		this._layer.getChildLayers()
			.forEach((childLayer) => this._layer.closeChildLayer(childLayer));
	}
};
