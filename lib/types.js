/*
 * This file is part of the ZombieBox package.
 *
 * Copyright © 2018-2020, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import Helper from './helper';


/**
 * @typedef {function(): (Promise|undefined)}
 */
export let Hook;


/**
 * @typedef {{
 *     setup: Hook,
 *     teardown: (Hook|undefined)
 * }}
 */
export let Story;


/**
 * @typedef {!Object<string, Story|Hook>}
 */
export let StoriesSet;


/**
 * @typedef {function(Helper): StoriesSet}
 */
export let StoriesFactory;


/**
 * @const {string}
 */
export const BEFORE_SETUP = '__storybook-before-setup';


/**
 * @const {string}
 */
export const AFTER_SETUP = '__storybook-after-setup';


/**
 * @const {string}
 */
export const BEFORE_TEARDOWN = '__storybook-before-teardown';


/**
 * @const {string}
 */
export const AFTER_TEARDOWN = '__storybook-after-teardown';
