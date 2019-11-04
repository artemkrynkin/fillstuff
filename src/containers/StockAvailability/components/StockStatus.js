import React from 'react';

import Grid from '@material-ui/core/Grid';

import CardPaper from 'src/components/CardPaper';

import styles from './StockStatus.module.css';

const StockStatus = props => {
	const { currentStock } = props;

	return (
		<CardPaper header={false} style={{ marginBottom: 16 }}>
			<Grid container>
				<Grid item xs={6}>
					<Grid alignItems="flex-end" justify="flex-start" container>
						<div className={styles.title}>Количество позиций:</div>
						<div className={styles.content}>{currentStock.status.numberPositions}</div>
					</Grid>
				</Grid>
				<Grid item xs={6}>
					<Grid alignItems="flex-end" justify="flex-end" container>
						<div className={styles.title}>Стоимость склада:</div>
						<div className={styles.content}>{currentStock.status.stockPrice} ₽</div>
					</Grid>
				</Grid>
			</Grid>
		</CardPaper>
	);
};

export default StockStatus;
