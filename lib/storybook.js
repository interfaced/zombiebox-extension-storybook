goog.provide('zb.storybook');
goog.require('zb.Application');
goog.require('zb.storybook.Helper');
goog.require('zb.storybook.StoriesFactory');
goog.require('zb.storybook.ui.Scene');


/**
 * @param {zb.Application} application
 * @param {!Object<string, zb.storybook.StoriesFactory>} stories
 * @param {string=} opt_background
 */
zb.storybook.init = (application, stories, opt_background = 'white') => {
	const {SCENE_NAME} = zb.storybook;
	const layerManager = application.getLayerManager();

	if (layerManager.getLayer(SCENE_NAME)) {
		throw new Error('Storybook is already inited');
	}

	const scene = new zb.storybook.ui.Scene();
	const area = scene.getPlacementArea();
	const helper = new zb.storybook.Helper(area, opt_background);

	area.getContainer().style.background = opt_background;
	application.addScene(scene, SCENE_NAME);

	Object.keys(stories)
		.forEach((title) => {
			scene.addStoriesSet(title, stories[title](helper));
		});

	zb.storybook._opener = () => {
		const currentLayer = layerManager.getCurrentLayer();
		const layerSnapshot = currentLayer && currentLayer.takeSnapshot();
		const layerManagerSnapshot = layerManager.takeSnapshot();

		zb.storybook._closer = () => {
			layerManager.hide();

			return Promise.resolve(layerSnapshot)
				.then(layerManagerSnapshot);
		};

		return layerManager.open(scene);
	};

	scene.on(scene.EVENT_WANT_CLOSE, () => zb.storybook._closer());
};


/**
 * @return {IThenable}
 */
zb.storybook.open = () => {
	if (!zb.storybook._opener) {
		throw new Error('Storybook is not inited yet, use zb.storybook.init');
	}

	return zb.storybook._opener();
};

/**
 * @return {IThenable}
 */
zb.storybook.close = () => {
	if (!zb.storybook._closer) {
		throw new Error('Storybook is not open yet, use zb.storybook.open');
	}

	return zb.storybook._closer();
};


/**
 * @type {?function(): IThenable}
 * @protected
 */
zb.storybook._opener = null;


/**
 * @type {?function(): IThenable}
 * @protected
 */
zb.storybook._closer = null;


/**
 * @const {string}
 */
zb.storybook.SCENE_NAME = '__storybook__';
