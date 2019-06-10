import { library } from '@fortawesome/fontawesome-svg-core';
import { faVk, faInstagram } from '@fortawesome/free-brands-svg-icons';

import {
	faAngleDown as fasAngleDown,
	faHeart as fasHeart,
	faComment as fasComment,
	faBullhorn as fasBullhorn,
	faUserAlt as fasUserAlt,
} from '@fortawesome/pro-solid-svg-icons';

import {
	faAngleDown as farAngleDown,
	faTimes as farTimes,
	faCalendar as farCalendar,
	faClipboard as farClipboard,
	faChartBar as farChartBar,
	faTrashAlt as farTrashAlt,
	faEye as farEye,
	faClone as farClone,
	faEllipsisH as farEllipsisH,
	faCheck as farCheck,
	faCircle as farCircle,
	faDotCircle as farDotCircle,
	faSyncAlt as farSyncAlt,
} from '@fortawesome/pro-regular-svg-icons';

import {
	faAngleLeft as falAngleLeft,
	faAngleRight as falAngleRight,
	faAngleUp as falAngleUp,
	faAngleDown as falAngleDown,
	faTimes as falTimes,
	faCog as falCog,
	faQuestionCircle as falQuestionCircle,
	faVideo as falVideo,
	faPlus as falPlus,
} from '@fortawesome/pro-light-svg-icons';

library.add(
	// Brands
	faVk,
	faInstagram,

	// Solid
	fasAngleDown,
	fasHeart,
	fasComment,
	fasBullhorn,
	fasUserAlt,

	// Regular
	farAngleDown,
	farTimes,
	farCalendar,
	farClipboard,
	farChartBar,
	farTrashAlt,
	farEye,
	farClone,
	farEllipsisH,
	farCheck,
	farCircle,
	farDotCircle,
	farSyncAlt,

	// Light
	falAngleLeft,
	falAngleRight,
	falAngleUp,
	falAngleDown,
	falTimes,
	falCog,
	falQuestionCircle,
	falVideo,
	falPlus
);
