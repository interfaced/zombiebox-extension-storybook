/*
 * This file is part of the ZombieBox package.
 *
 * Copyright © 2012-2019, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import {Out, render} from 'generated/cutejs/storybook/ui/scene/scene.jst';
import {warn} from 'zb/console/console';
import AbstractCuteScene from 'cutejs/layers/abstract-scene';
import IInput from 'zb/device/interfaces/i-input';
import IStorage from 'zb/device/interfaces/i-storage';
import InputKeys from 'zb/device/input/keys';
import {Value as DirectionValue} from 'zb/geometry/direction';
import {AFTER_SETUP, AFTER_TEARDOWN, BEFORE_SETUP, BEFORE_TEARDOWN} from '../../symbols';
import {Hook, StoriesSet, Story} from '../../types';
import Area from '../area/area';
import MenuItem from '../menu-item/menu-item';


/**
 */
export default class Scene extends AbstractCuteScene {
	/**
	 * @param {IInput} deviceInput
	 * @param {IStorage} deviceStorage
	 */
	constructor(deviceInput, deviceStorage) {
		super();

		/**
		 * @type {Out}
		 * @protected
		 */
		this._exported;

		/**
		 * @type {IInput}
		 * @protected
		 */
		this._deviceInput = deviceInput;

		/**
		 * @type {IStorage}
		 * @protected
		 */
		this._deviceStorage = deviceStorage;

		/**
		 * @type {?MenuItem}
		 * @protected
		 */
		this._defaultMenuItem = null;

		/**
		 * @type {?string}
		 * @protected
		 */
		this._defaultMenuItemOption = null;

		/**
		 * @type {?Story}
		 * @protected
		 */
		this._selectedStory = null;

		/**
		 * @type {?Object<symbol, Hook>}
		 * @protected
		 */
		this._selectedStoryHooks = null;

		/**
		 * Fired with: nothing
		 * @const {string}
		 */
		this.EVENT_WANT_CLOSE = 'want-close';

		this._addContainerClass('s-ext-storybook');

		this._restoreMenu();
		this._hideSpinner();

		this._listenWidgets();
		this._initNavigationRules();
	}

	/**
	 * @override
	 */
	beforeDOMShow() {
		super.beforeDOMShow();

		const {menu, minimizeButton} = this._exported;

		if (this._defaultMenuItem) {
			menu.selectItem(this._defaultMenuItem, this._defaultMenuItemOption || undefined);
		}

		this._defaultWidget = this._isMenuMinimized() ? minimizeButton : menu;
	}

	/**
	 * @override
	 */
	wait(promise) {
		const blockId = this._deviceInput.block();
		const blockPromise = super.wait(promise);

		this._showSpinner();

		promise.finally(() => {
			this._deviceInput.unblock(blockId);
			this._hideSpinner();
		});

		return blockPromise;
	}

	/**
	 * @param {string} title
	 * @param {StoriesSet} storiesSet
	 * @param {boolean} isDefault
	 * @param {string=} defaultStoryName
	 */
	addStoriesSet(title, storiesSet, isDefault, defaultStoryName) {
		const {menu, navigator} = this._exported;

		const symbols = [
			BEFORE_SETUP,
			AFTER_SETUP,
			BEFORE_TEARDOWN,
			AFTER_TEARDOWN
		];

		const hooks = {};
		symbols.forEach((symbol) => {
			if (storiesSet[symbol]) {
				hooks[symbol] = storiesSet[symbol];
			}
		});

		const storyNames = Object.keys(storiesSet)
			.filter((name) => !symbols.includes(name));

		if (!storyNames.length) {
			throw new Error(`Set "${title}" is empty and can't be added`);
		}

		const newMenuItem = new MenuItem(title, storyNames);

		menu.addItem(newMenuItem);
		menu.on(menu.EVENT_ITEM_OPTION_SELECTED, (eventName, item, storyName) => {
			if (item !== newMenuItem) {
				return;
			}

			const story = storiesSet[storyName];
			if (typeof story !== 'object') {
				throw new Error(
					`Story "${storyName}" from the set "${title}" has a wrong type: ` +
					`should be an object with setup/teardown hooks, but ${typeof story} given`
				);
			}

			if (this._selectedStory !== story) {
				this._selectStory(title, storyName, story, hooks);
			}

			navigator.setTitle(title);
			navigator.setSubtitle(storyName);
		});

		if (!this._defaultMenuItem || isDefault) {
			this._defaultMenuItem = newMenuItem;

			if (defaultStoryName) {
				if (!storyNames.includes(defaultStoryName)) {
					warn(`Story "${defaultStoryName}" doesn't exist in the set "${title}" and can't be set as default`);
				} else {
					this._defaultMenuItemOption = defaultStoryName;
				}
			}
		}
	}

	/**
	 * @return {Area}
	 */
	getPlacementArea() {
		return this._exported.area;
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
	 * @override
	 */
	_processKey(zbKey, opt_e) {
		const {menu} = this._exported;

		if (zbKey === InputKeys.PAGE_UP) {
			menu.selectPrev();
			return true;
		}

		if (zbKey === InputKeys.PAGE_DOWN) {
			menu.selectNext();
			return true;
		}

		return super._processKey(zbKey, opt_e);
	}

	/**
	 * @protected
	 */
	_listenWidgets() {
		const {backButton, minimizeButton, navigator, menu} = this._exported;

		backButton.on(backButton.EVENT_CLICKED, () => {
			this._fireEvent(this.EVENT_WANT_CLOSE);
		});

		minimizeButton.on(minimizeButton.EVENT_CLICKED, () => {
			if (this._isMenuMinimized()) {
				this._expandMenu();
			} else {
				this._minimizeMenu();
			}
		});

		navigator.on(navigator.EVENT_PREV, () => {
			menu.selectPrev();
		});

		navigator.on(navigator.EVENT_NEXT, () => {
			menu.selectNext();
		});
	}

	/**
	 * @protected
	 */
	_initNavigationRules() {
		const {UP, DOWN, RIGHT, LEFT} = DirectionValue;
		const {area, menu, backButton, minimizeButton} = this._exported;

		this.setNavigationRule(backButton, UP, null);
		this.setNavigationRule(backButton, DOWN, null);

		this.setNavigationRule(menu, UP, null);
		this.setNavigationRule(menu, RIGHT, minimizeButton);

		this.setNavigationRule(area, UP, null);
		this.setNavigationRule(area, DOWN, null);
		this.setNavigationRule(area, RIGHT, null);
		this.setNavigationRule(area, LEFT, minimizeButton);

		this.setNavigationRule(minimizeButton, UP, null);
		this.setNavigationRule(minimizeButton, DOWN, null);
		this.setNavigationRule(minimizeButton, RIGHT, area);
	}

	/**
	 * @protected
	 */
	_restoreMenu() {
		if (this._deviceStorage.getItem(MENU_MINIMIZED_STORAGE_KEY)) {
			this._minimizeMenu();
		} else {
			this._expandMenu();
		}
	}

	/**
	 * @protected
	 */
	_minimizeMenu() {
		const {RIGHT, LEFT} = DirectionValue;
		const {backButton, minimizeButton, navigator} = this._exported;

		minimizeButton.setRightward();
		navigator.show();

		this.setNavigationRule(minimizeButton, LEFT, backButton);
		this.setNavigationRule(backButton, RIGHT, minimizeButton);

		this._addContainerClass('_minimized');
		this._deviceStorage.setItem(MENU_MINIMIZED_STORAGE_KEY, 'true');
	}

	/**
	 * @protected
	 */
	_expandMenu() {
		const {RIGHT, LEFT} = DirectionValue;
		const {backButton, minimizeButton, navigator} = this._exported;

		minimizeButton.setLeftward();
		navigator.hide();

		this.removeNavigationRule(minimizeButton, LEFT);
		this.removeNavigationRule(backButton, RIGHT);

		this._removeContainerClass('_minimized');
		this._deviceStorage.removeItem(MENU_MINIMIZED_STORAGE_KEY);
	}

	/**
	 * @return {boolean}
	 * @protected
	 */
	_isMenuMinimized() {
		return this._container.classList.contains('_minimized');
	}

	/**
	 * @protected
	 */
	_showSpinner() {
		this._exported.spinner.show();
	}

	/**
	 * @protected
	 */
	_hideSpinner() {
		this._exported.spinner.hide();
	}

	/**
	 * @param {string} setName
	 * @param {string} storyName
	 * @param {Story} story
	 * @param {Object<symbol, Hook>} hooks
	 * @protected
	 */
	_selectStory(setName, storyName, story, hooks) {
		let teardownPromise;

		if (this._selectedStory) {
			teardownPromise = Promise.resolve(
				this._selectedStoryHooks[BEFORE_TEARDOWN] &&
				this._selectedStoryHooks[BEFORE_TEARDOWN]()
			);

			teardownPromise = teardownPromise.catch((error) => {
				throw new Error(`An error occurred during BEFORE_TEARDOWN hook: ${error}`);
			});

			teardownPromise = teardownPromise.then(() => Promise.resolve(
				this._selectedStory.teardown &&
				this._selectedStory.teardown()
			));

			teardownPromise = teardownPromise.catch((error) => {
				throw new Error(`An error occurred during a teardown: ${error}`);
			});

			teardownPromise = teardownPromise.then(() => Promise.resolve(
				this._selectedStoryHooks[AFTER_TEARDOWN] &&
				this._selectedStoryHooks[AFTER_TEARDOWN]()
			));

			teardownPromise = teardownPromise.catch((error) => {
				throw new Error(`An error occurred during AFTER_TEARDOWN hook: ${error}`);
			});
		} else {
			teardownPromise = Promise.resolve();
		}

		this.wait(teardownPromise);

		teardownPromise.then(() => {
			let setupPromise = Promise.resolve(
				hooks[BEFORE_SETUP] &&
				hooks[BEFORE_SETUP]()
			);

			setupPromise = setupPromise.catch((error) => {
				throw new Error(`An error occurred during BEFORE_SETUP hook: ${error}`);
			});

			setupPromise = setupPromise.then(() => Promise.resolve(
				story.setup()
			));

			setupPromise = setupPromise.catch((error) => {
				throw new Error(`An error occurred during a setup: ${error}`);
			});

			setupPromise = setupPromise.then(() => Promise.resolve(
				hooks[AFTER_SETUP] &&
				hooks[AFTER_SETUP]()
			));

			setupPromise = setupPromise.catch((error) => {
				throw new Error(`An error occurred during AFTER_SETUP hook: ${error}`);
			});

			this._selectedStory = story;
			this._selectedStoryHooks = hooks;

			this._deviceStorage.setItem(PREVIOUSLY_SELECTED_SET_STORAGE_KEY, setName);
			this._deviceStorage.setItem(PREVIOUSLY_SELECTED_STORY_STORAGE_KEY, storyName);

			this.wait(setupPromise);
		});
	}
}


/**
 * @const {string}
 */
const MENU_MINIMIZED_STORAGE_KEY = '__storybook-menu-minimized';

/**
 * @const {string}
 */
export const PREVIOUSLY_SELECTED_SET_STORAGE_KEY = '__storybook-previously-selected-set';
/**
 * @const {string}
 */
export const PREVIOUSLY_SELECTED_STORY_STORAGE_KEY = '__storybook-previously-selected-story';
