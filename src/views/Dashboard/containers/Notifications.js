import React, { Fragment, useEffect, useState } from 'react';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Grid from '@material-ui/core/Grid';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';

import { LoadingComponent } from 'src/components/Loading';

import Notification from './Notification';
import NotificationCardGridEmpty from '../components/NotificationCardGridEmpty';

import styles from './Notifications.module.css';

const Notifications = props => {
	const {
		onOpenDialogByName,
		storeNotifications: { data: storeNotifications, isFetching: isLoadingStoreNotifications },
	} = props;
	const [visibleAllNotifications, setVisibleAllNotifications] = useState(false);
	const [height, setHeight] = useState(0);

	const onHandleVisibleNotifications = value =>
		setVisibleAllNotifications(value === null || value === undefined ? prevValue => !prevValue : value);

	useEffect(() => {
		const mostNotifications = Math.max(storeNotifications.red.length, storeNotifications.orange.length, storeNotifications.green.length);

		setHeight(mostNotifications * 168 + (mostNotifications - 1) * 16 + 48);
	}, [storeNotifications]);

	if (isLoadingStoreNotifications) return <LoadingComponent />;

	return (
		<div
			className={ClassNames(styles.container, { visibleAllNotifications: visibleAllNotifications })}
			style={visibleAllNotifications ? { height } : {}}
		>
			<Grid className={styles.stickyHeader} justify="space-between" alignItems="center" container>
				<Grid item>
					<Typography variant="h5">События</Typography>
				</Grid>
				<Grid item>
					<ButtonBase className={ClassNames(styles.showButton, styles.showLessButton)} onClick={() => onHandleVisibleNotifications(false)}>
						<FontAwesomeIcon icon={['far', 'angle-up']} />
						Показать меньше
					</ButtonBase>
				</Grid>
			</Grid>
			<Grid className={styles.grids} spacing={2} container>
				{Object.keys(storeNotifications).map(notificationType => (
					<Grid key={notificationType} className={styles.grid} xs={4} item>
						{storeNotifications[notificationType].length ? (
							<Fragment>
								<div className={styles.notifications}>
									{storeNotifications[notificationType].map((notification, index) => (
										<Notification
											key={notification._id}
											visibleAllNotifications={visibleAllNotifications}
											index={index}
											reverseIndex={storeNotifications[notificationType].length - index}
											importance={notificationType}
											onOpenDialogByName={onOpenDialogByName}
											notification={notification}
										/>
									))}
								</div>
								{storeNotifications[notificationType].length > 1 ? (
									<ButtonBase
										className={ClassNames(styles.showButton, styles.showMoreButton)}
										onClick={() => onHandleVisibleNotifications(true)}
									>
										{`Еще ${storeNotifications[notificationType].length - 1}`}
									</ButtonBase>
								) : null}
							</Fragment>
						) : (
							<NotificationCardGridEmpty notificationType={notificationType} />
						)}
					</Grid>
				))}
			</Grid>
		</div>
	);
};

export default Notifications;
