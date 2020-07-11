import React from 'react';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

// import { LoadingPage } from 'src/components/Loading';
import Empty from 'src/components/Empty';

import styles from './View.module.css';

import stocktakingEmpty from 'public/img/stubs/stocktaking_empty.svg';

const View = props => {
	// const {
	// 	currentStudio,
	// 	onOpenDialogByName,
	// } = props;

	// if (!positions || !positionGroups) {
	// 	return <LoadingPage />;
	// }

	// if (positions && !positions.length && !positionGroups.length) {
	return (
		<Empty
			classNames={{
				container: styles.empty,
			}}
			imageSrc={stocktakingEmpty}
			content={
				<Typography variant="h6" gutterBottom>
					У вас еще нет инвентаризаций
				</Typography>
			}
			actions={
				<Button variant="contained" color="primary">
					Провести инвентаризацию
				</Button>
			}
		/>
	);
	// }

	// if (positions.length) {
	// 	return (
	// 		<Fragment>
	// 			<Indicators currentStudio={currentStudio} />
	// 			<Positions positions={positions} positionGroups={positionGroups} onOpenDialogByName={onOpenDialogByName} />
	// 		</Fragment>
	// 	);
	// }

	// return null;
};

export default View;
