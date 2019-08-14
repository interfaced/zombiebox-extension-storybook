/*
 * This file is part of the ZombieBox package.
 *
 * Copyright © 2012-2019, Interfaced
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
 * @typedef {!Object<string|symbol, Story|Hook>}
 */
export let StoriesSet;


/**
 * @typedef {function(Helper): StoriesSet}
 */
export let StoriesFactory;
