import React from 'react';

import Grid from '@material-ui/core/Grid';

import CardPaper from 'src/components/CardPaper';

import './StockStatus.styl';

const StockStatus = props => {
	const { currentStock } = props;

	return (
		<CardPaper className="sa-stock-status" elevation={1} header={false} style={{ marginBottom: 16 }}>
			<Grid container>
				<Grid item xs={4}>
					<Grid container alignItems="flex-end">
						<div className="sa-stock-status__title">Количество позиций:</div>
						<div className="sa-stock-status__content">{currentStock.status.numberProducts}</div>
					</Grid>
				</Grid>
				<Grid item xs={4}>
					<Grid container alignItems="flex-end">
						<div className="sa-stock-status__title">Количество маркеров:</div>
						<div className="sa-stock-status__content">{currentStock.status.numberMarkers}</div>
					</Grid>
				</Grid>
				<Grid item xs={4}>
					<Grid container alignItems="flex-end">
						<div className="sa-stock-status__title">Стоимость склада:</div>
						<div className="sa-stock-status__content">{currentStock.status.stockCost} ₽</div>
					</Grid>
				</Grid>
			</Grid>
		</CardPaper>
	);
};

export default StockStatus;
