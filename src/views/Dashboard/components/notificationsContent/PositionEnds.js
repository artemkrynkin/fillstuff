import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Typography from '@material-ui/core/Typography';

import PositionSummary from 'src/components/PositionSummary';

import styles from '../../containers/Notification.module.css';

const PositionEnds = props => {
	const {
		notification: { position },
	} = props;

	const remainingQuantity = position.receipts.reduce((sum, receipt) => sum + receipt.current.quantity, 0);

	return (
		<>
			<div className={styles.header}>
				<FontAwesomeIcon className={styles.notificationIcon} icon={['fal', 'chart-line-down']} />
				<Typography className={styles.title} variant="h6">
					Заканчивается позиция
				</Typography>
			</div>
			<PositionSummary name={position.name} characteristics={position.characteristics} style={{ marginTop: 15 }} avatar />
			<div>
				<div className={styles.caption}>
					Остаток: {remainingQuantity} {position.unitRelease === 'pce' ? 'шт.' : 'уп.'}
				</div>
			</div>
		</>
	);
};

export default PositionEnds;
