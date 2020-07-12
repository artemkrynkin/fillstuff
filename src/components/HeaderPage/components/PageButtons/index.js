import React from 'react';

import Stock from './Stock';
import Procurements from './Procurements';
import Members from './Members';

const PageButtons = props => {
	const { pageName } = props;

	switch (pageName) {
		case 'stock':
			return <Stock {...props} />;
		case 'procurements':
			return <Procurements {...props} />;
		case 'members':
			return <Members {...props} />;
		default:
			return null;
	}
};

export default PageButtons;
