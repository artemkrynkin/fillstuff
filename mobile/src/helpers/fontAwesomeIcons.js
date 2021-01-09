import { library } from '@fortawesome/fontawesome-svg-core';
// import {
// } from '@fortawesome/free-brands-svg-icons';

import { faFlashlight as fasFlashlight } from '@fortawesome/pro-solid-svg-icons';

import {
	faTimes as farTimes,
	faDoorOpen as farDoorOpen,
	faPlus as farPlus,
	faMinus as farMinus,
	faHomeAlt as farHomeAlt,
	faScanner as farScanner,
	faInventory as farInventory,
} from '@fortawesome/pro-regular-svg-icons';

import { faTimes as falTimes, faBug as falBug, faCog as falCog } from '@fortawesome/pro-light-svg-icons';

import { faBoxAlt as fadBoxAlt } from '@fortawesome/pro-duotone-svg-icons';

library.add(
	// Brands
	// Solid
	fasFlashlight,

	// Regular
	farTimes,
	farDoorOpen,
	farPlus,
	farMinus,
	farHomeAlt,
	farScanner,
	farInventory,

	// Light
	falTimes,
	falBug,
	falCog,

	// Duotone
	fadBoxAlt
);
