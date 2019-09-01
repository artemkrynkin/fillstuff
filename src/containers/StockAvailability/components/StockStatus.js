import React from 'react';

import Grid from '@material-ui/core/Grid';

import CardPaper from 'src/components/CardPaper';

import './StockStatus.styl';

const StockStatus = props => {
	const { currentStock } = props;

	return (
		<CardPaper className="sa-stock-status" elevation={1} header={false} style={{ marginBottom: 16 }}>
			<Grid justify="space-between" container>
				<Grid item xs={6}>
					<Grid alignItems="flex-end" justify="flex-start" container>
						<div className="sa-stock-status__title">Количество позиций:</div>
						<div className="sa-stock-status__content">{currentStock.status.numberPositions}</div>
					</Grid>
				</Grid>
				<Grid item xs={6}>
					<Grid alignItems="flex-end" justify="flex-end" container>
						<div className="sa-stock-status__title">Стоимость склада:</div>
						<div className="sa-stock-status__content">{currentStock.status.stockPrice} ₽</div>
					</Grid>
				</Grid>
			</Grid>
		</CardPaper>
	);
};

export default StockStatus;
