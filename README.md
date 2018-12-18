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

Generally speaking, a story represents the `setup` and `teardown` hooks, where you can adjust widget displaying. 
Both hooks can return promise, `teardown` may be omitted.

Then, initialize storybook with the brand new stories. The best place to do it is hook `onReady` of an application class:

```javascript
goog.provide('my.Application');
goog.require('my.BaseApplication');
goog.require('my.widgets.Button');
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
