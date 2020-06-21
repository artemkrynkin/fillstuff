import React, { Fragment } from 'react';

import PositionNameInList from 'src/components/PositionNameInList';

import Shops from './Shops';

const Content = props => {
	const { storeNotification } = props;

	return (
		<Fragment>
			<PositionNameInList name={storeNotification.position.name} characteristics={storeNotification.position.characteristics} size="lg" />

			<Shops position={storeNotification.position} />
		</Fragment>
	);
};

export default Content;
