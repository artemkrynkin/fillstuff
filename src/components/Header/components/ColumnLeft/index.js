import React from 'react';

import Availability from './Availability';
import Procurements from './Procurements';
import Members from './Members';
import TitlePageOrLogo from './TitlePageOrLogo';

import styles from 'src/components/Header/index.module.css';

const ColumnLeft = props => {
	const { pageName } = props;

	switch (pageName) {
		case 'availability':
			return <Availability {...props} />;
		case 'procurements':
			return <Procurements {...props} />;
		case 'members':
			return <Members {...props} />;
		default:
			return (
				<div className={styles.column_left}>
					<TitlePageOrLogo {...props} />
				</div>
			);
	}
};

export default ColumnLeft;
