/*
 * This file is part of the ZombieBox package.
 *
 * Copyright © 2018-2020, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import Layer from 'zb/layers/layer';
import Widget from 'zb/widgets/widget';
import Area from './ui/area/area';


/**
 */
export default class Helper {
	/**
	 * @param {Area} area
	 * @param {Layer} layer
	 */
	constructor(area, layer) {
		/**
		 * @type {Widget}
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
		 * @type {Layer}
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
	 * }=} options
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
	 * @param {Widget} widget
	 */
	placeWidget(widget) {
		this._area.appendWidget(widget);
		this.placeElement(widget.getContainer());
	}

	/**
	 * @param {Widget} widget
	 */
	removeWidget(widget) {
		this._area.removeWidget(widget);
		this.removeElement(widget.getContainer());
	}

	/**
	 * @param {Widget} widget
	 * @param {{
	 *     horizontally: (boolean|undefined),
	 *     vertically: (boolean|undefined)
	 * }=} options
	 */
	centerWidget(widget, options = {}) {
		this.centerElement(widget.getContainer(), options);
	}

	/**
	 * @param {Widget} widget
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
	 * @param {Layer} layer
	 */
	showLayer(layer) {
		this._layer.showChildLayerInstance(layer);
	}

	/**
	 * @param {Layer} layer
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
}
