import React, { Fragment, useEffect, useState } from 'react';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Grid from '@material-ui/core/Grid';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';

import Empty from 'src/components/Empty';
import { LoadingComponent } from 'src/components/Loading';

import Notification from './Notification';

import emptyImage from 'public/img/stubs/dashboard_events_empy.svg';
import styles from './Notifications.module.css';

const Notifications = props => {
	const {
		storeNotifications: { data: storeNotifications, isFetching: isLoadingStoreNotifications },
	} = props;
	const [visibleAllNotifications, setVisibleAllNotifications] = useState(false);
	const [height, setHeight] = useState(0);

	const onHandleVisibleNotifications = value =>
		setVisibleAllNotifications(value === null || value === undefined ? prevValue => !prevValue : value);

	useEffect(() => {
		const mostNotifications = Math.max(storeNotifications.red.length, storeNotifications.orange.length, storeNotifications.green.length);

		setHeight(mostNotifications * 168 + (mostNotifications - 1) * 16 + 40);
	}, [storeNotifications]);

	if (isLoadingStoreNotifications) return <LoadingComponent />;

	if (!storeNotifications.red.length && !storeNotifications.orange.length && !storeNotifications.green.length) {
		return (
			<Empty
				classNames={{
					container: styles.empty,
					image: styles.emptyImage,
				}}
				imageSrc={emptyImage}
				imageSize=""
				content={
					<Fragment>
						<Typography variant="h6">Событий нет</Typography>
						<Typography variant="body1">Отдохните или займитесь другими делами :)</Typography>
					</Fragment>
				}
			/>
		);
	}

	const containerClasses = ClassNames({
		[styles.container]: true,
		visibleAllNotifications: visibleAllNotifications,
	});

	const showMoreButtonClasses = ClassNames({
		[styles.showButton]: true,
		[styles.showMoreButton]: true,
	});

	return (
		<div className={containerClasses} style={visibleAllNotifications ? { height } : {}}>
			<div className={styles.stickyHeader}>
				<ButtonBase className={styles.showButton} onClick={() => onHandleVisibleNotifications(false)}>
					<FontAwesomeIcon icon={['far', 'angle-up']} />
					Показать меньше
				</ButtonBase>
			</div>
			<Grid className={styles.grids} spacing={2} container>
				{Object.keys(storeNotifications).map(notificationType =>
					storeNotifications[notificationType].length ? (
						<Grid key={notificationType} className={styles.grid} xs={4} item>
							<div className={styles.notifications}>
								{storeNotifications[notificationType].map((notification, index) => (
									<Notification
										key={notification._id}
										index={index}
										reverseIndex={storeNotifications[notificationType].length - index}
										importance={notificationType}
										notification={notification}
									/>
								))}
							</div>
							{storeNotifications[notificationType].length > 1 ? (
								<ButtonBase className={showMoreButtonClasses} onClick={() => onHandleVisibleNotifications(true)}>
									{`Еще ${storeNotifications[notificationType].length - 1}`}
								</ButtonBase>
							) : null}
						</Grid>
					) : null
				)}
			</Grid>
		</div>
	);
};

export default Notifications;
