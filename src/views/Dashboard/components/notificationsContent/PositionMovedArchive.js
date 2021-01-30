import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import PositionSummary from 'src/components/PositionSummary';

import stylesGlobal from '../../containers/Notification.module.css';
import styles from './PositionMovedArchive.module.css';

const PositionMovedArchive = props => {
	const {
		notification: { position },
		onHideNotification,
	} = props;

	return (
		<div className={styles.container}>
			<div className={stylesGlobal.header}>
				<FontAwesomeIcon className={stylesGlobal.notificationIcon} icon={['fal', 'archive']} />
				<Typography className={stylesGlobal.title} variant="h6">
					Позиция архивирована
				</Typography>
			</div>
			<PositionSummary name={position.name} characteristics={position.characteristics} style={{ marginTop: 15 }} avatar />
			<Grid direction="column" container>
				<div className={stylesGlobal.caption} style={{ marginBottom: 10 }}>
					Все поступления реализованы
				</div>
				<Button className={styles.hideButton} onClick={onHideNotification} variant="outlined" size="small">
					Скрыть
				</Button>
			</Grid>
		</div>
	);
};

export default PositionMovedArchive;
