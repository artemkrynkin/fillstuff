import React from 'react';

import PositionName from 'src/components/PositionName';

import Shops from './Shops';

const Content = props => {
	const { storeNotification } = props;

	return (
		<>
			<PositionName name={storeNotification.position.name} characteristics={storeNotification.position.characteristics} size="lg" />

			<Shops position={storeNotification.position} />
		</>
	);
};

export default Content;
