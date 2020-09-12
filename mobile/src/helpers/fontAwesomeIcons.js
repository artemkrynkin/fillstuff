import { library } from '@fortawesome/fontawesome-svg-core';
// import {
// } from '@fortawesome/free-brands-svg-icons';

import { faFlashlight as fasFlashlight } from '@fortawesome/pro-solid-svg-icons';

import { faTimes as farTimes } from '@fortawesome/pro-regular-svg-icons';

import { faTimes as falTimes, faBug as falBug, faCog as falCog } from '@fortawesome/pro-light-svg-icons';

library.add(
	// Brands
	// Solid
	fasFlashlight,

	// Regular
	farTimes,

	// Light
	falTimes,
	falBug,
	falCog
);
