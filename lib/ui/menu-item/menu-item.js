/*
 * This file is part of the ZombieBox package.
 *
 * Copyright © 2018-2020, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import {render} from 'generated/cutejs/storybook/ui/menu-item/menu-item.jst';
import InlineWidget from 'cutejs/widgets/inline-widget';
import {findFirstElementNode} from 'zb/html';


/**
 */
export default class MenuItem extends InlineWidget {
	/**
	 * @param {string} caption
	 * @param {Array<string>} options
	 */
	constructor(caption, options) {
		const exported = render({
			caption,
			options
		});

		super(findFirstElementNode(exported.root));

		/**
		 * @type {Array<string>}
		 * @protected
		 */
		this._options = options;

		/**
		 * Fired with:
		 *     {string} Index of the focused option
		 * @const {string}
		 */
		this.EVENT_OPTION_FOCUSED = 'option-focused';

		exported.options.forEach((optionWidget, index) => {
			this.appendWidget(optionWidget);

			optionWidget.on(optionWidget.EVENT_FOCUS, () => {
				this._fireEvent(this.EVENT_OPTION_FOCUSED, index);
			});
		});
	}

	/**
	 * @return {Array<string>}
	 */
	getOptions() {
		return this._options;
	}
}
