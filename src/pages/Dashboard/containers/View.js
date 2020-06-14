import React, { Fragment } from 'react';

import Notifications from './Notifications';

const View = props => {
	const { storeNotifications } = props;

	return (
		<Fragment>
			<Notifications storeNotifications={storeNotifications} />
		</Fragment>
	);
};

export default View;
