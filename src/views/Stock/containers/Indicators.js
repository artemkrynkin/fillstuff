import React from 'react';

import Grid from '@material-ui/core/Grid';

import CardPaper from 'src/components/CardPaper';
import Money from 'src/components/Money';

import { MuiTheme } from 'src/helpers/MuiTheme';
import styles from './Indicators.module.css';

const Indicators = props => {
	const { currentStudio } = props;

	return (
		<CardPaper header={false} style={{ marginBottom: MuiTheme.spacing(2) }}>
			<Grid container>
				<Grid item xs={6}>
					<Grid alignItems="flex-end" justifyContent="flex-start" container>
						<div className={styles.title}>Количество позиций:</div>
						<div className={styles.content}>{currentStudio.stock.numberPositions}</div>
					</Grid>
				</Grid>
				<Grid item xs={6}>
					<Grid alignItems="flex-end" justifyContent="flex-end" container>
						<div className={styles.title}>Стоимость склада:</div>
						<div className={styles.content}>
							<Money value={currentStudio.stock.stockPrice} />
						</div>
					</Grid>
				</Grid>
			</Grid>
		</CardPaper>
	);
};

export default Indicators;
