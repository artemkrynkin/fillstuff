import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Typography from '@material-ui/core/Typography';

import PositionSummary from 'src/components/PositionSummary';

import styles from '../../containers/Notification.module.css';

const ReceiptsMissing = props => {
	const {
		notification: { position },
	} = props;

	return (
		<>
			<div className={styles.header}>
				<FontAwesomeIcon className={styles.notificationIcon} icon={['fal-c', 'receipts-missing']} />
				<Typography className={styles.title} variant="h6">
					Отсутствует поступление
				</Typography>
			</div>
			<Typography className={styles.subtitle} variant="subtitle1">
				Создайте заказ или оформите закупку
			</Typography>
			<PositionSummary name={position.name} characteristics={position.characteristics} avatar />
		</>
	);
};

export default ReceiptsMissing;
