/*
 * This file is part of the ZombieBox package.
 *
 * Copyright © 2012-2019, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import {render} from 'generated/cutejs/storybook/ui/minimize-button/minimize-button.jst';
import InlineWidget from 'cutejs/widgets/inline-widget';
import {findFirstElementNode} from 'zb/html';
import Keys from 'zb/device/input/keys';


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
	_processKey(zbKey, opt_e) {
		if (zbKey === Keys.ENTER) {
			this._fireEvent(this.EVENT_CLICKED);
			return true;
		}

		return false;
	}
}
