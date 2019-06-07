/*
 * This file is part of the ZombieBox package.
 *
 * Copyright © 2012-2019, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * @template RESULT
 * @param {function(...?): RESULT} targetFunction
 * @param {number} waitTime
 * @return {function(...?): RESULT}
 */
export default function debounce(targetFunction, waitTime) {
	let timer = null;

	function debounced(...args) {
		function complete() {
			timer = null;

			return targetFunction(...args);
		}

		if (timer) {
			clearTimeout(timer);
		}

		timer = setTimeout(complete, waitTime);
	}

	debounced.cancel = () => {
		clearTimeout(timer);
		timer = null;
	};

	return debounced;
}
