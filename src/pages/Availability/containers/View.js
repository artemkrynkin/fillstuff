import React, { Fragment } from 'react';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { LoadingPage } from 'src/components/Loading';
import Empty from 'src/components/Empty';

import Indicators from './Indicators';
import Positions from './Positions';

import styles from './View.module.css';

import emptyImage from 'public/img/stubs/availability.svg';

const View = props => {
	const {
		currentStudio,
		onOpenDialogByName,
		positions: { data: positions },
		positionGroups: { data: positionGroups },
	} = props;

	if (!positions || !positionGroups) {
		return <LoadingPage />;
	}

	if (positions && !positions.length && !positionGroups.length) {
		return (
			<Empty
				classNames={{
					container: styles.empty,
				}}
				imageSrc={emptyImage}
				content={
					<Typography variant="h6" gutterBottom>
						Похоже, у вас еще нет позиций
					</Typography>
				}
				actions={
					<Button onClick={() => onOpenDialogByName('dialogPositionCreate')} variant="contained" color="primary">
						Создать позицию
					</Button>
				}
			/>
		);
	}

	if (positions && positions.every(position => position.isArchived)) {
		return (
			<Empty
				classNames={{
					container: styles.empty,
				}}
				imageSrc={emptyImage}
				content={
					<Typography variant="h6" gutterBottom>
						Похоже, все ваши позиции находятся в архиве
					</Typography>
				}
				actions={
					<Button onClick={() => onOpenDialogByName('dialogPositionCreate')} variant="contained" color="primary">
						Создать новую позицию
					</Button>
				}
			/>
		);
	}

	if (positions.length) {
		return (
			<Fragment>
				<Indicators currentStudio={currentStudio} />
				<Positions positions={positions} positionGroups={positionGroups} onOpenDialogByName={onOpenDialogByName} />
			</Fragment>
		);
	}

	return null;
};

export default View;
