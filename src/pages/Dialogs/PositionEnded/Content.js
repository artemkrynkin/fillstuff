import React from 'react';

import PositionSummary from 'src/components/PositionSummary';

import Shops from './Shops';

const Content = props => {
	const { storeNotification } = props;

	return (
		<>
			<PositionSummary name={storeNotification.position.name} characteristics={storeNotification.position.characteristics} size="lg" />

			<Shops position={storeNotification.position} />
		</>
	);
};

export default Content;
