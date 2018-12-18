# zombiebox-extension-storybook

[ZombieBox](https://zombiebox.tv) extension for interactive UI development.

## Usage

First, you need to create a stories set for your widget.

We recommend to place stories in a widget directory, e.g. `app/my/widgets/button/story/button.js`. 
File must provide a factory function that returns stories set:

```javascript
goog.provide('my.widgets.story.Button');
goog.require('zb.storybook.Helper');
goog.require('zb.storybook.StoriesSet');

/**
 * @param {zb.storybook.Helper} helper
 * @return {zb.storybook.StoriesSet}
 */
my.widgets.story.Button = (helper) => {
	const button = new my.widgets.Button();

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
goog.provide('my.Application');
goog.require('my.BaseApplication');
goog.require('my.widgets.story.Button');
goog.require('zb.storybook');

/**
 */
my.Application = class extends my.BaseApplication {
	/**
	 */
	onReady() {
		zb.storybook.init(this, {
			'my.widgets.Button': my.widgets.story.Button
		}, 'grey');
	}
}
```

Third param is a background of storybook area where widgets will be placed. 
It's optional and can be omitted, in this case area will be white.

After storybook is initialized you can open/close it by calling `zb.storybook.open` and `zb.storybook.close`.

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

## Hooks

There are four available hooks:

* `zb.storybook.BEFORE_SETUP`;
* `zb.storybook.AFTER_SETUP`;
* `zb.storybook.BEFORE_TEARDOWN`;
* `zb.storybook.AFTER_TEARDOWN`.

Each of them can return a promise. With this hooks you can separate a duplicate code and leave only story-specific actions, e.g.:

```javascript
goog.provide('my.widgets.story.Button');
goog.require('zb.storybook.AFTER_TEARDOWN');
goog.require('zb.storybook.BEFORE_SETUP');
goog.require('zb.storybook.Helper');
goog.require('zb.storybook.StoriesSet');

/**
 * @param {zb.storybook.Helper} helper
 * @return {zb.storybook.StoriesSet}
 */
my.widgets.story.Button = (helper) => {
	const button = new my.widgets.Button();

	return {
		[zb.storybook.BEFORE_SETUP]: () => {
			helper.placeWidget(button);
			helper.centerWidget(button);
		},

		[zb.storybook.AFTER_TEARDOWN]: () => {
			helper.removeWidget(button);
		},
		
		'default': {
			setup() {},
			teardown() {}
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
