import React from 'react';

import Notifications from './Notifications';

const View = props => {
	const { onOpenDialogByName, storeNotifications } = props;

	return (
		<>
			<Notifications onOpenDialogByName={onOpenDialogByName} storeNotifications={storeNotifications} />
		</>
	);
};

export default View;
