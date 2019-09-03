# zombiebox-extension-storybook

[ZombieBox](https://zombiebox.tv) extension for interactive UI development. Inspired by [Storybook](https://github.com/storybooks/storybook) project.

## Usage

First, you need to create a stories set for your widget.

We recommend to place stories in a widget directory, e.g. `app/my/widgets/button/story/button.js`. 
File must export a factory function that returns a stories set:

```javascript
import Helper from 'storybook/helper';
import StoriesSet from 'storybook/types';
import Button from '../button';

/**
 * @param {Helper} helper
 * @return {StoriesSet}
 */
export default (helper) => {
	const button = new Button();

	return {
		'default': {
			setup() {
				helper.placeWidget(button);
			},
			teardown() {
				helper.removeWidget(button);
			}
		}
	};
};
```

Generally speaking, a story represents `setup` and `teardown` hooks, where you can adjust widget displaying. 
Both hooks can return a promise, `teardown` may be omitted.

Then, initialize storybook with the brand new stories. The best place to do it is hook `onReady` of an application class:

```javascript
import {init as initStorybook} from 'storybook/storybook';
import BaseApplication from 'generated/zb/base-application';
import ButtonStory from 'app/my/widgets/button/story/button';

/**
 */
export default class Application extends BaseApplication {
	/**
	 */
	onReady() {
		initStorybook(this, {
			Button: ButtonStory
		}, {
			background: 'grey'
		});
	}
}
```

Third argument is the next options:

* `background` (optional) - a background of the area where widgets will be placed. If omitted the area will be white.

* `defaultSet` (optional) - title of the set that should be activated when storybook is being opened first time.

* `defaultStory` (optional) - title of the story that should be activated from the set specified in `defaultSet`.

## Helper API

Helper is a communication layer between storybook and story. An instance of helper is passed to each factory function and can be accessed by its stories due to a closure.

#### placeWidget/placeElement

Place a given widget/element in the area.

#### removeWidget/removeElement

Remove a given widget/element from the area.

#### centerWidget/centerElement

Center a given widget/element in the area. As a second argument optionally takes object with `horizontally` and `vertically` properties, with which you can adjust centring e.g.:

```javascript
helper.centerWidget(myWidget, {vertically: false}); // Will center the widget only horizontally
```

#### focusWidget

Set a given widget to a focused state.

#### setAreaBackground

Change a color of the area.

#### resetAreaBackground

Reset a color of the area to the default one, which was specified (or not) during initialization.

#### showLayer/closeLayer/closeAllLayers

Show or close a specific or all layers.

## Hooks

There are four available hooks:

* `BEFORE_SETUP`
* `AFTER_SETUP`
* `BEFORE_TEARDOWN`
* `AFTER_TEARDOWN`

Each of them can return a promise. With these hooks you can separate a duplicate code and leave only story-specific actions, e.g.:

```javascript
import Helper from 'storybook/helper';
import StoriesSet, {AFTER_TEARDOWN, BEFORE_SETUP} from 'storybook/types';
import Button from '../button';

/**
 * @param {Helper} helper
 * @return {StoriesSet}
 */
export default (helper) => {
	const button = new Button();

	return {
		[BEFORE_SETUP]() {
			helper.placeWidget(button);
			helper.centerWidget(button);
		},

		[AFTER_TEARDOWN]() {
			helper.removeWidget(button);
		},

		'default': {
			setup() {}
		},

		'activated': {
			setup() {
				button.setActivated(true);
			},
			teardown() {
				button.setActivated(false);
			}
		}
	};
};
```
