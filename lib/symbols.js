goog.provide('zb.storybook.AFTER_SETUP');
goog.provide('zb.storybook.AFTER_TEARDOWN');
goog.provide('zb.storybook.BEFORE_SETUP');
goog.provide('zb.storybook.BEFORE_TEARDOWN');


/**
 * @const {symbol}
 */
zb.storybook.BEFORE_SETUP = Symbol('BEFORE_SETUP');


/**
 * @const {symbol}
 */
zb.storybook.AFTER_SETUP = Symbol('AFTER_SETUP');


/**
 * @const {symbol}
 */
zb.storybook.BEFORE_TEARDOWN = Symbol('BEFORE_TEARDOWN');


/**
 * @const {symbol}
 */
zb.storybook.AFTER_TEARDOWN = Symbol('AFTER_TEARDOWN');
