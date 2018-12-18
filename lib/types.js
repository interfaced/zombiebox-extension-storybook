goog.provide('zb.storybook.Hook');
goog.provide('zb.storybook.StoriesFactory');
goog.provide('zb.storybook.StoriesSet');
goog.provide('zb.storybook.Story');
goog.require('zb.storybook.Helper');


/**
 * @typedef {function(): (IThenable|undefined)}
 */
zb.storybook.Hook;


/**
 * @typedef {{
 *     setup: zb.storybook.Hook,
 *     teardown: (zb.storybook.Hook|undefined)
 * }}
 */
zb.storybook.Story;


/**
 * @typedef {!Object<string, zb.storybook.Story>}
 */
zb.storybook.StoriesSet;


/**
 * @typedef {function(zb.storybook.Helper): zb.storybook.StoriesSet}
 */
zb.storybook.StoriesFactory;
