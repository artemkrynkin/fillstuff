import React from 'react';

import StockAvailability from './StockAvailability';
import StockProcurements from './StockProcurements';
import TitlePageOrLogo from './TitlePageOrLogo';

import styles from 'src/components/Header/index.module.css';

const ColumnLeft = props => {
	const { pageName } = props;

	switch (pageName) {
		case 'stock-availability':
			return <StockAvailability {...props} />;
		case 'stock-procurements':
			return <StockProcurements {...props} />;
		default:
			return (
				<div className={styles.column_left}>
					<TitlePageOrLogo {...props} />
				</div>
			);
	}
};

export default ColumnLeft;
