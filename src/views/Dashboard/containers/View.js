import React from 'react';

import Notifications from './Notifications';
import Tasks from './Tasks';

const View = props => {
	const { onOpenDialogByName, storeNotifications } = props;

	return (
		<>
			<Notifications onOpenDialogByName={onOpenDialogByName} storeNotifications={storeNotifications} />
			<Tasks />
		</>
	);
};

export default View;
