import React, { Fragment } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Typography from '@material-ui/core/Typography';

// import Tooltip from 'src/components/Tooltip';

import styles from '../../containers/Notification.module.css';

const PositionEnds = props => {
	const {
		notification: { position },
	} = props;

	const remainingQuantity = position.receipts.reduce((sum, receipt) => sum + receipt.current.quantity, 0);

	return (
		<Fragment>
			<div className={styles.header}>
				<FontAwesomeIcon className={styles.notificationIcon} icon={['fal', 'chart-line-down']} />
				<Typography className={styles.title} variant="h6">
					Заканчивается позиция
				</Typography>
			</div>
			<Typography className={styles.subtitle} variant="subtitle1">
				{position.name}
			</Typography>
			<div>
				<div className={styles.caption}>
					Остаток: {remainingQuantity} {position.unitRelease === 'pce' ? 'шт.' : 'уп.'}
				</div>
				{/*<div className={styles.caption}>*/}
				{/*  Закончится через:*/}
				{/*  <Tooltip title="Недостаточно данных для расчета" className={styles.robotIcon} placement="bottom">*/}
				{/*    <FontAwesomeIcon icon={['fal', 'robot']} />*/}
				{/*  </Tooltip>*/}
				{/*</div>*/}
			</div>
		</Fragment>
	);
};

export default PositionEnds;
