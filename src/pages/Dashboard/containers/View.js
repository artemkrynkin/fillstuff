import React, { Fragment } from 'react';

import Notifications from './Notifications';
import Statistics from './Statistics';

const View = props => {
	const { onOpenDialogByName, storeNotifications } = props;

	return (
		<Fragment>
			<Notifications onOpenDialogByName={onOpenDialogByName} storeNotifications={storeNotifications} />
			<Statistics />
		</Fragment>
	);
};

export default View;
