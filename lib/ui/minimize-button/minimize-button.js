/*
 * This file is part of the ZombieBox package.
 *
 * Copyright © 2018-2020, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import {render} from 'generated/cutejs/storybook/ui/minimize-button/minimize-button.jst';
import InlineWidget from 'cutejs/widgets/inline-widget';
import {findFirstElementNode} from 'zb/html';
import Key from 'zb/device/input/key';


/**
 */
export default class MinimizeButton extends InlineWidget {
	/**
	 */
	constructor() {
		super(findFirstElementNode(render().root));

		/**
		 * Fired with: nothing
		 * @const {string}
		 */
		this.EVENT_CLICKED = 'clicked';
	}

	/**
	 */
	setRightward() {
		this._removeContainerClass('_leftward');
		this._addContainerClass('_rightward');
	}

	/**
	 */
	setLeftward() {
		this._removeContainerClass('_rightward');
		this._addContainerClass('_leftward');
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
