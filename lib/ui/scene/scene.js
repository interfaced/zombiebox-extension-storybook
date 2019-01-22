goog.provide('zb.storybook.ui.Scene');
goog.require('zb.device.IInput');
goog.require('zb.device.IStorage');
goog.require('zb.device.input.Keys');
goog.require('zb.layers.CuteScene');
goog.require('zb.std.plain.Direction');
goog.require('zb.storybook.AFTER_SETUP');
goog.require('zb.storybook.AFTER_TEARDOWN');
goog.require('zb.storybook.BEFORE_SETUP');
goog.require('zb.storybook.BEFORE_TEARDOWN');
goog.require('zb.storybook.Hook');
goog.require('zb.storybook.StoriesSet');
goog.require('zb.storybook.Story');
goog.require('zb.storybook.templates.SceneOut');
goog.require('zb.storybook.templates.scene');
goog.require('zb.storybook.ui.Area');
goog.require('zb.storybook.ui.MenuItem');


/**
 */
zb.storybook.ui.Scene = class extends zb.layers.CuteScene {
	/**
	 * @param {zb.device.IInput} deviceInput
	 * @param {zb.device.IStorage} deviceStorage
	 */
	constructor(deviceInput, deviceStorage) {
		super();

		/**
		 * @type {zb.storybook.templates.SceneOut}
		 * @protected
		 */
		this._exported;

		/**
		 * @type {zb.device.IInput}
		 * @protected
		 */
		this._deviceInput = deviceInput;

		/**
		 * @type {zb.device.IStorage}
		 * @protected
		 */
		this._deviceStorage = deviceStorage;

		/**
		 * @type {?zb.storybook.ui.MenuItem}
		 * @protected
		 */
		this._defaultMenuItem = null;

		/**
		 * @type {?string}
		 * @protected
		 */
		this._defaultMenuItemOption = null;

		/**
		 * @type {?zb.storybook.Story}
		 * @protected
		 */
		this._selectedStory = null;

		/**
		 * @type {?Object<symbol, zb.storybook.Hook>}
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
	 * @param {zb.storybook.StoriesSet} storiesSet
	 * @param {boolean} isDefault
	 * @param {string=} defaultStoryName
	 */
	addStoriesSet(title, storiesSet, isDefault, defaultStoryName) {
		const {menu, navigator} = this._exported;

		const symbols = [
			zb.storybook.BEFORE_SETUP,
			zb.storybook.AFTER_SETUP,
			zb.storybook.BEFORE_TEARDOWN,
			zb.storybook.AFTER_TEARDOWN
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

		const newMenuItem = new zb.storybook.ui.MenuItem(title, storyNames);

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
				this._selectStory(story, hooks);
			}

			navigator.setTitle(title);
			navigator.setSubtitle(storyName);
		});

		if (!this._defaultMenuItem || isDefault) {
			this._defaultMenuItem = newMenuItem;

			if (defaultStoryName) {
				if (!storyNames.includes(defaultStoryName)) {
					throw new Error(
						`Story "${defaultStoryName}" doesn't exist in the set "${title}" and can't be set as default`
					);
				}

				this._defaultMenuItemOption = defaultStoryName;
			}
		}
	}

	/**
	 * @return {zb.storybook.ui.Area}
	 */
	getPlacementArea() {
		return this._exported.area;
	}

	/**
	 * @override
	 */
	_renderTemplate() {
		return zb.storybook.templates.scene(
			this._getTemplateData(),
			this._getTemplateOptions()
		);
	}

	/**
	 * @override
	 */
	_processKey(zbKey, opt_e) {
		const {menu} = this._exported;

		if (zbKey === zb.device.input.Keys.PAGE_UP) {
			menu.selectPrev();
			return true;
		}

		if (zbKey === zb.device.input.Keys.PAGE_DOWN) {
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
		const {UP, DOWN, RIGHT, LEFT} = zb.std.plain.Direction.Value;
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
		if (this._deviceStorage.getItem(zb.storybook.ui.Scene.MENU_MINIMIZED_STORAGE_KEY)) {
			this._minimizeMenu();
		} else {
			this._expandMenu();
		}
	}

	/**
	 * @protected
	 */
	_minimizeMenu() {
		const {RIGHT, LEFT} = zb.std.plain.Direction.Value;
		const {backButton, minimizeButton, navigator} = this._exported;

		minimizeButton.setRightward();
		navigator.show();

		this.setNavigationRule(minimizeButton, LEFT, backButton);
		this.setNavigationRule(backButton, RIGHT, minimizeButton);

		this._addContainerClass('_minimized');
		this._deviceStorage.setItem(zb.storybook.ui.Scene.MENU_MINIMIZED_STORAGE_KEY, 'true');
	}

	/**
	 * @protected
	 */
	_expandMenu() {
		const {RIGHT, LEFT} = zb.std.plain.Direction.Value;
		const {backButton, minimizeButton, navigator} = this._exported;

		minimizeButton.setLeftward();
		navigator.hide();

		this.removeNavigationRule(minimizeButton, LEFT);
		this.removeNavigationRule(backButton, RIGHT);

		this._removeContainerClass('_minimized');
		this._deviceStorage.removeItem(zb.storybook.ui.Scene.MENU_MINIMIZED_STORAGE_KEY);
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
	 * @param {zb.storybook.Story} story
	 * @param {Object<symbol, zb.storybook.Hook>} hooks
	 * @protected
	 */
	_selectStory(story, hooks) {
		let teardownPromise;

		if (this._selectedStory) {
			teardownPromise = Promise.resolve(
				this._selectedStoryHooks[zb.storybook.BEFORE_TEARDOWN] &&
				this._selectedStoryHooks[zb.storybook.BEFORE_TEARDOWN]()
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
				this._selectedStoryHooks[zb.storybook.AFTER_TEARDOWN] &&
				this._selectedStoryHooks[zb.storybook.AFTER_TEARDOWN]()
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
				hooks[zb.storybook.BEFORE_SETUP] &&
				hooks[zb.storybook.BEFORE_SETUP]()
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
				hooks[zb.storybook.AFTER_SETUP] &&
				hooks[zb.storybook.AFTER_SETUP]()
			));

			setupPromise = setupPromise.catch((error) => {
				throw new Error(`An error occurred during AFTER_SETUP hook: ${error}`);
			});

			this._selectedStory = story;
			this._selectedStoryHooks = hooks;

			this.wait(setupPromise);
		});
	}
};


/**
 * @const {string}
 */
zb.storybook.ui.Scene.MENU_MINIMIZED_STORAGE_KEY = '__storybook-menu-minimized';
