import React from 'react';

import Availability from './Availability';
import Procurements from './Procurements';
import Members from './Members';

const PageButtons = props => {
	const { pageName } = props;

	switch (pageName) {
		case 'availability':
			return <Availability {...props} />;
		case 'procurements':
			return <Procurements {...props} />;
		case 'members':
			return <Members {...props} />;
		default:
			return null;
	}
};

export default PageButtons;
