import React, { Fragment } from 'react';

import Notifications from './Notifications';
import Tasks from './Tasks';

const View = props => {
	const { onOpenDialogByName, storeNotifications } = props;

	return (
		<Fragment>
			<Notifications onOpenDialogByName={onOpenDialogByName} storeNotifications={storeNotifications} />
			<Tasks />
		</Fragment>
	);
};

export default View;
