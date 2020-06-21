import React, { Fragment } from 'react';

import Notifications from './Notifications';

const View = props => {
	const { onOpenDialogByName, storeNotifications } = props;

	return (
		<Fragment>
			<Notifications onOpenDialogByName={onOpenDialogByName} storeNotifications={storeNotifications} />
		</Fragment>
	);
};

export default View;
