import React from 'react';

import Grid from '@material-ui/core/Grid';

import CardPaper from 'src/components/CardPaper';
import NumberFormat, { currencyFormatProps } from 'src/components/NumberFormat';

import styles from './PeriodIndicators.module.css';

const PeriodIndicators = props => {
	const {
		indicators: { total, sellingPositions, freePositions },
	} = props;

	return (
		<CardPaper header={false} style={{ marginBottom: 40 }}>
			<Grid container>
				<Grid xs={6} item />
				<Grid xs={6} item>
					<Grid alignItems="flex-end" justify="flex-start" direction="column" container>
						<NumberFormat
							value={total}
							renderText={value => (
								<div className={styles.totalPurchasePrice}>
									Всего: <span>{value}</span>
								</div>
							)}
							displayType="text"
							onValueChange={() => {}}
							{...currencyFormatProps}
						/>
						<NumberFormat
							value={sellingPositions}
							renderText={value => (
								<div className={styles.purchasePrice}>
									По позициям для продажи: <span>{value}</span>
								</div>
							)}
							displayType="text"
							onValueChange={() => {}}
							{...currencyFormatProps}
						/>
						<NumberFormat
							value={freePositions}
							renderText={value => (
								<div className={styles.costDelivery}>
									По бесплатным позициям: <span>{value}</span>
								</div>
							)}
							displayType="text"
							onValueChange={() => {}}
							{...currencyFormatProps}
						/>
					</Grid>
				</Grid>
			</Grid>
		</CardPaper>
	);
};

export default PeriodIndicators;
