/*
 * This file is part of the ZombieBox package.
 *
 * Copyright © 2018-2020, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import AbstractApplication from 'zb/abstract-application';
import Helper from './helper';
import {StoriesFactory} from './types';
import Scene, {PREVIOUSLY_SELECTED_SET_STORAGE_KEY, PREVIOUSLY_SELECTED_STORY_STORAGE_KEY} from './ui/scene/scene';


/**
 * @param {AbstractApplication} application
 * @param {!Object<string, StoriesFactory>} stories
 * @param {{
 *     background: (string|undefined),
 *     defaultSet: (string|undefined),
 *     defaultStory: (string|undefined),
 *     savePreviousSet: (boolean|undefined),
 *     savePreviousStory: (boolean|undefined)
 * }=} options
 * }
 */
export const init = (
	application,
	stories,
	{
		background = 'white',
		defaultSet,
		defaultStory,
		savePreviousSet = true,
		savePreviousStory = true
	}
) => {
	const layerManager = application.getLayerManager();

	if (layerManager.getLayer(SCENE_NAME)) {
		throw new Error('Storybook is already inited');
	}

	const scene = new Scene(
		application.device.input,
		application.device.storage
	);

	application.addScene(scene, SCENE_NAME);

	const area = scene.getPlacementArea();

	area.setBackground(background);

	const helper = new Helper(area, scene);

	area.getContainer().style.background = background;

	const previousSet =
		savePreviousSet && application.device.storage.getItem(PREVIOUSLY_SELECTED_SET_STORAGE_KEY);
	const previousStory =
		savePreviousStory && previousSet && application.device.storage.getItem(PREVIOUSLY_SELECTED_STORY_STORAGE_KEY);

	const setToSelect = defaultSet || previousSet;
	const storyToSelect = defaultStory || previousStory;

	Object.keys(stories)
		.forEach((title) => {
			const factory = stories[title];
			const isDefault = title === setToSelect;

			scene.addStoriesSet(
				title,
				factory(helper),
				isDefault,
				isDefault ? /** @type {string|undefined} */ (storyToSelect) : undefined
			);
		});

	opener = () => {
		const currentLayer = layerManager.getCurrentLayer();
		const layerSnapshot = currentLayer && currentLayer.takeSnapshot();
		const layerManagerSnapshot = layerManager.takeSnapshot();

		closer = () => {
			layerManager.hide();

			return Promise.resolve(layerSnapshot && layerSnapshot())
				.then(layerManagerSnapshot)
				.finally(() => {
					closer = null;
				});
		};

		return layerManager.open(scene);
	};

	scene.on(scene.EVENT_WANT_CLOSE, () => closer());
};


/**
 * @return {Promise}
 */
export const open = () => {
	if (!opener) {
		throw new Error('Storybook is not inited yet, use init()');
	}

	return opener();
};

/**
 * @return {Promise}
 */
export const close = () => {
	if (!closer) {
		throw new Error('Storybook is not open yet, use open()');
	}

	return closer();
};


/**
 * @type {?function(): Promise}
 */
let opener = null;


/**
 * @type {?function(): Promise}
 */
let closer = null;


/**
 * @const {string}
 */
const SCENE_NAME = '__storybook__';
