goog.provide('zb.storybook.ui.Scene');
goog.require('zb.layers.CuteScene');
goog.require('zb.promise');
goog.require('zb.std.plain.Direction');
goog.require('zb.storybook.StoriesSet');
goog.require('zb.storybook.Story');
goog.require('zb.storybook.templates.SceneOut');
goog.require('zb.storybook.templates.scene');
goog.require('zb.storybook.ui.MenuItem');
goog.require('zb.storybook.utils.debounce');
goog.require('zb.widgets.Widget');


/**
 */
zb.storybook.ui.Scene = class extends zb.layers.CuteScene {
	/**
	 */
	constructor() {
		super();

		/**
		 * @type {zb.storybook.templates.SceneOut}
		 * @protected
		 */
		this._exported;

		/**
		 * @type {?zb.storybook.Story}
		 * @protected
		 */
		this._selectedStory = null;

		/**
		 * @type {function(zb.storybook.Story)}
		 * @protected
		 */
		this._selectStoryDebounced = zb.storybook.utils.debounce(
			this._selectStory.bind(this),
			zb.storybook.ui.Scene.STORY_SELECT_DEBOUNCE_DELAY
		);

		/**
		 * Fired with: nothing
		 * @const {string}
		 */
		this.EVENT_WANT_CLOSE = 'want-close';

		const {area, menu, spinner, backButton, minimizeButton} = this._exported;
		const {RIGHT, LEFT} = zb.std.plain.Direction.Value;

		this._addContainerClass('s-ext-storybook');

		spinner.hide();

		this.setNavigationRule(area, LEFT, minimizeButton);
		this.setNavigationRule(menu, RIGHT, minimizeButton);
		this.setNavigationRule(minimizeButton, RIGHT, area);
		this.setNavigationRule(backButton, RIGHT, minimizeButton);

		this._listenWidgets();
	}

	/**
	 * @override
	 */
	wait(promise) {
		const blockPromise = super.wait(promise);

		const {spinner} = this._exported;
		const blockId = app.device.input.block();

		spinner.show();
		zb.promise.always(promise, () => {
			app.device.input.unblock(blockId);
			spinner.hide();
		});

		return blockPromise;
	}

	/**
	 * @param {string} title
	 * @param {zb.storybook.StoriesSet} storiesSet
	 */
	addStoriesSet(title, storiesSet) {
		const newMenuItem = new zb.storybook.ui.MenuItem(title, Object.keys(storiesSet));

		newMenuItem.on(newMenuItem.EVENT_OPTION_SELECTED, (eventName, storyName) => {
			this._selectStoryDebounced(storiesSet[storyName]);
		});

		this._exported.menu.addItem(newMenuItem);
	}

	/**
	 * @return {zb.widgets.Widget}
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
	 * @protected
	 */
	_listenWidgets() {
		const {menu, backButton, minimizeButton} = this._exported;

		backButton.on(backButton.EVENT_CLICKED, () => {
			this._fireEvent(this.EVENT_WANT_CLOSE);
		});

		minimizeButton.setLeftward();
		minimizeButton.on(minimizeButton.EVENT_CLICKED, () => {
			const containerClassList = this._container.classList;
			const isMinimized = containerClassList.contains('_minimized');

			if (isMinimized) {
				menu.enable();
				minimizeButton.setLeftward();
			} else {
				menu.disable();
				minimizeButton.setRightward();
			}

			containerClassList.toggle('_minimized', !isMinimized);
		});
	}

	/**
	 * @param {zb.storybook.Story} newStory
	 * @protected
	 */
	_selectStory(newStory) {
		const teardownPromise = Promise.resolve(
			this._selectedStory &&
			this._selectedStory.teardown &&
			this._selectedStory.teardown()
		);

		this.wait(teardownPromise);

		teardownPromise.then(() => {
			this._selectedStory = newStory;
			this.wait(Promise.resolve(this._selectedStory.setup()));
		});
	}
};


/**
 * @const {number} In milliseconds
 */
zb.storybook.ui.Scene.STORY_SELECT_DEBOUNCE_DELAY = 1 * 1000;
