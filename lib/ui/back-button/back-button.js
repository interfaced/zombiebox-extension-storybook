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
import Key from 'zb/device/input/key';


/**
 */
export default class BackButton extends InlineWidget {
	/**
	 */
	constructor() {
		super(div());

		/**
		 * Fired with: nothing
		 * @const {string}
		 */
		this.EVENT_CLICKED = 'clicked';

		this._addContainerClass('w-ext-storybook-back-button');
	}

	/**
	 * @override
	 */
	_processKey(zbKey, event) {
		if (zbKey === Key.ENTER) {
			this._fireEvent(this.EVENT_CLICKED);
			return true;
		}

		return false;
	}
}
