import React from 'react';

import CLStockAvailability from './CLStockAvailability';
import TitlePageOrLogo from './TitlePageOrLogo';

import styles from '../index.module.css';

const ColumnLeft = props => {
	const { pageName } = props;

	switch (pageName) {
		case 'stock-availability':
			return <CLStockAvailability {...props} />;
		default:
			return (
				<div className={styles.column_left}>
					<TitlePageOrLogo {...props} />
				</div>
			);
	}
};

export default ColumnLeft;
