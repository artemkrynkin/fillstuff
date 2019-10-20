import React from 'react';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@material-ui/core/Button';

import TitlePageOrLogo from './TitlePageOrLogo';

import styles from 'src/components/Header/index.module.css';

const StockPurchases = props => {
	const { currentUser, pageTitle, theme } = props;

	return (
		<div className={styles.column_left}>
			<TitlePageOrLogo pageTitle={pageTitle} theme={theme} />
			<div className={styles.columnGroup_left}>
				<Button
					className={styles.buttonColorTeal400}
					component={Link}
					to={`/stocks/${currentUser.activeStockId}/purchases/create`}
					variant="contained"
					color="primary"
					style={{ marginRight: 8 }}
				>
					<FontAwesomeIcon icon={['far', 'plus']} style={{ marginRight: 10 }} />
					Создать покупку
				</Button>
			</div>
		</div>
	);
};

export default StockPurchases;
