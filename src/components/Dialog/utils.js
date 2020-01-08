export const observeActions = (container, stickySelector, position = null, sentinelAdditionalText = '') => {
	const sentinelClass = position + sentinelAdditionalText;

	const observer = new IntersectionObserver(
		(records, observer) => {
			const {
				boundingClientRect: targetInfo,
				target: { parentElement },
				rootBounds: rootBoundsInfo,
			} = records[0];

			const stickyTarget = parentElement ? parentElement.querySelector(`.${stickySelector}`) : null;

			if (!stickyTarget) {
				return console.error(`Property 'stickyTarget' is null. Perhaps the element class '${stickySelector}' is incorrect or notfound.`);
			}

			if (sentinelClass === `top${sentinelAdditionalText}`) {
				if (targetInfo.bottom < rootBoundsInfo.top) {
					stickyTarget.classList.toggle('stuck', true);
				}

				if (targetInfo.bottom >= rootBoundsInfo.top && targetInfo.bottom < rootBoundsInfo.bottom) {
					stickyTarget.classList.toggle('stuck', false);
				}
			}

			if (sentinelClass === `bottom${sentinelAdditionalText}`) {
				if (targetInfo.bottom > rootBoundsInfo.top) {
					stickyTarget.classList.toggle('stuck', true);
				}

				if (targetInfo.bottom <= rootBoundsInfo.bottom && targetInfo.bottom > rootBoundsInfo.top) {
					stickyTarget.classList.toggle('stuck', false);
				}
			}
		},
		{
			threshold: [0],
			root: container,
		}
	);

	observer.observe(container.querySelector(`.sentinel-${sentinelClass}`));
};
