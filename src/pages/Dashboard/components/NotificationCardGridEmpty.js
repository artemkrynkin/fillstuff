import React from 'react';

import styles from './NotificationCardGridEmpty.module.css';

const NotificationCardGridEmpty = props => {
	const { notificationType } = props;

	const notificationsGridEmptyText = {
		red: 'Совершите действие',
		orange: 'Уделите внимание',
		green: 'Информационные',
	};

	return (
		<div className={styles.card}>
			<div className={styles.text}>{notificationsGridEmptyText[notificationType]}</div>
		</div>
	);
};

export default NotificationCardGridEmpty;
