import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import moment from 'moment';

import { getDeliveryDateTimeMoment } from 'src/helpers/utils';

import HeaderPage from 'src/components/HeaderPage';
import Layout from 'src/components/Layout';
import { withCurrentUser } from 'src/components/withCurrentUser';

import stylesPage from 'src/styles/page.module.css';
import styles from './index.module.css';

import Index from './containers/index';

const Dashboard = props => {
	const { currentStudio, storeNotifications } = props;

	const layoutMetaInfo = {
		pageName: 'dashboard',
		pageTitle: 'Монитор',
	};

	return (
		<Layout metaInfo={layoutMetaInfo}>
			<HeaderPage pageName={layoutMetaInfo.pageName} pageTitle={layoutMetaInfo.pageTitle} />
			<div className={`${stylesPage.pageContent} ${styles.container}`}>
				<Index currentStudio={currentStudio} storeNotifications={storeNotifications} />
			</div>
		</Layout>
	);
};

const mapStateToProps = state => {
	const {
		storeNotifications: {
			data: storeNotificationsData,
			isFetching: isLoadingStoreNotifications,
			// error: errorMembers
		},
	} = state;

	const storeNotifications = {
		data: null,
		isFetching: isLoadingStoreNotifications,
	};

	const newStoreNotificationsData = {
		red: [],
		orange: [],
		green: [],
	};

	if (storeNotificationsData && storeNotificationsData.length) {
		const momentDate = moment();
		const notificationTypes = {
			red: /^(position-ends|receipts-missing)$/,
			orange: /none/,
			green: /^(member-invoice)$/,
		};

		storeNotificationsData.forEach(storeNotification => {
			const newStoreNotification = {
				...storeNotification,
			};

			if (newStoreNotification.type === 'delivery-is-expected') {
				const { procurement } = newStoreNotification;

				if (procurement.isConfirmed && !procurement.isUnknownDeliveryDate) {
					const deliveryDateTo = getDeliveryDateTimeMoment(procurement.deliveryDate, procurement.deliveryTimeTo, 'to');

					if (momentDate.isSameOrAfter(deliveryDateTo)) {
						newStoreNotification.sortDate = deliveryDateTo.format();

						newStoreNotificationsData.red.push(newStoreNotification);
					} else {
						const notificationType = momentDate.isSame(deliveryDateTo, 'date') ? 'orange' : 'green';
						const deliveryDateFrom = getDeliveryDateTimeMoment(procurement.deliveryDate, procurement.deliveryTimeFrom);

						newStoreNotification.sortDate = deliveryDateFrom.format();

						newStoreNotificationsData[notificationType].push(newStoreNotification);
					}
				} else {
					newStoreNotificationsData.orange.push(newStoreNotification);
				}
			} else {
				newStoreNotification.sortDate = newStoreNotification.createdAt;

				Object.keys(notificationTypes).forEach(type => {
					if (notificationTypes[type].test(newStoreNotification.type)) {
						newStoreNotificationsData[type].push(newStoreNotification);
					}
				});
			}
		});

		Object.keys(notificationTypes).forEach(type => {
			newStoreNotificationsData[type] = newStoreNotificationsData[type].sort((a, b) => {
				const sortDateA = new Date(a.sortDate);
				const sortDateB = new Date(b.sortDate);
				const createdAtA = new Date(a.createdAt);
				const createdAtB = new Date(b.createdAt);

				if (a.type === 'delivery-is-expected' && b.type === 'delivery-is-expected') {
					if (type === 'red') {
						return sortDateA - sortDateB && createdAtA - createdAtB;
					} else {
						return sortDateB - sortDateA && createdAtB - createdAtA;
					}
				} else {
					return sortDateB - sortDateA && createdAtB - createdAtA;
				}
			});
		});
	}

	storeNotifications.data = newStoreNotificationsData;

	return {
		storeNotifications: storeNotifications,
	};
};

export default compose(connect(mapStateToProps, null), withCurrentUser)(Dashboard);
