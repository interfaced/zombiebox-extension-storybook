/*
 * This file is part of the ZombieBox package.
 *
 * Copyright © 2018-2020, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import InlineWidget from 'cutejs/widgets/inline-widget';
import {div} from 'zb/html';


/**
 */
export default class Area extends InlineWidget {
	/**
	 */
	constructor() {
		super(div('w-ext-storybook-area'));
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
}
