import React, { Fragment } from 'react';

import { LoadingPage } from 'src/components/Loading';

import Procurement from './Procurement';

const View = props => {
	const { procurementData } = props;

	if (!procurementData || !procurementData.data) {
		return <LoadingPage />;
	}

	const { data: procurement } = procurementData;

	return (
		<Fragment>
			<Procurement procurement={procurement} />
		</Fragment>
	);
};

export default View;
