goog.provide('zb.storybook.utils.debounce');

/**
 * @template RESULT
 * @param {function(...?): RESULT} targetFunction
 * @param {number} waitTime
 * @return {function(...?): RESULT}
 */
zb.storybook.utils.debounce = (targetFunction, waitTime) => {
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
};
