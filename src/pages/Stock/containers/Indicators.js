import React from 'react';

import Grid from '@material-ui/core/Grid';

import CardPaper from 'src/components/CardPaper';
import Money from 'src/components/Money';

import theme from 'src/helpers/BliksideMuiTheme';
import styles from './Indicators.module.css';

const Indicators = props => {
	const { currentStudio } = props;

	return (
		<CardPaper header={false} style={{ marginBottom: theme.spacing(2) }}>
			<Grid container>
				<Grid item xs={6}>
					<Grid alignItems="flex-end" justify="flex-start" container>
						<div className={styles.title}>Количество позиций:</div>
						<div className={styles.content}>{currentStudio.store.numberPositions}</div>
					</Grid>
				</Grid>
				<Grid item xs={6}>
					<Grid alignItems="flex-end" justify="flex-end" container>
						<div className={styles.title}>Стоимость склада:</div>
						<div className={styles.content}>
							<Money value={currentStudio.store.storePrice} />
						</div>
					</Grid>
				</Grid>
			</Grid>
		</CardPaper>
	);
};

export default Indicators;
