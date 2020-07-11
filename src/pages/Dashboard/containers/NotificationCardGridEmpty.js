import React from 'react';
import ClassNames from 'classnames';

import styles from './NotificationCardGridEmpty.module.css';

const NotificationCardGridEmpty = props => {
	const { notificationType } = props;

	const notificationsGridEmptyText = {
		red: 'События\nнезамедлительного действия',
		orange: 'События\nособого внимания',
		green: 'Информационные\nсобытия',
	};

	const cardNotificationGridEmpty = ClassNames({
		[styles.card]: true,
		[styles.cardImportanceRed]: notificationType === 'red',
		[styles.cardImportanceOrange]: notificationType === 'orange',
		[styles.cardImportanceGreen]: notificationType === 'green',
	});

	return (
		<div className={cardNotificationGridEmpty}>
			<div className={styles.text}>{notificationsGridEmptyText[notificationType]}</div>
		</div>
	);
};

export default NotificationCardGridEmpty;
