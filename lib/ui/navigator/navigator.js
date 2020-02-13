/*
 * This file is part of the ZombieBox package.
 *
 * Copyright © 2018-2020, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import {render, Out} from 'generated/cutejs/storybook/ui/navigator/navigator.jst';
import AbstractCuteWidget from 'cutejs/widgets/abstract-widget';
import {text} from 'zb/html';


/**
 */
export default class Navigator extends AbstractCuteWidget {
	/**
	 */
	constructor() {
		super();

		/**
		 * @type {Out}
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
		text(this._exported.title, title);
	}

	/**
	 * @param {string} subtitle
	 */
	setSubtitle(subtitle) {
		text(this._exported.subtitle, subtitle);
	}

	/**
	 * @override
	 */
	_renderTemplate() {
		return render(
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
}
