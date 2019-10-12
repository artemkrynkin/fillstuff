import React from 'react';

import StockAvailability from './StockAvailability';
import StockPurchases from './StockPurchases';
import TitlePageOrLogo from './TitlePageOrLogo';

import styles from 'src/components/Header/index.module.css';

const ColumnLeft = props => {
	const { pageName } = props;

	switch (pageName) {
		case 'stock-availability':
			return <StockAvailability {...props} />;
		case 'stock-purchases':
			return <StockPurchases {...props} />;
		default:
			return (
				<div className={styles.column_left}>
					<TitlePageOrLogo {...props} />
				</div>
			);
	}
};

export default ColumnLeft;
