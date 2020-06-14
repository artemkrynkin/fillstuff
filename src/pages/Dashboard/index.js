import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import moment from 'moment';
import loadable from '@loadable/component';

import generateMetaInfo from 'shared/generate-meta-info';

import Head from 'src/components/head';
import HeaderPage from 'src/components/HeaderPage';
import { LoadingPage } from 'src/components/Loading';
import { withCurrentUser } from 'src/components/withCurrentUser';

import stylesPage from 'src/styles/page.module.css';
import styles from './index.module.css';

const Index = loadable(() => import('./containers/index' /* webpackChunkName: "Availability_Index" */), {
	fallback: <LoadingPage />,
});

const Dashboard = props => {
	const { currentStudio, storeNotifications } = props;

	const metaInfo = {
		pageName: 'dashboard',
		pageTitle: 'Монитор',
	};
	const { title, description } = generateMetaInfo({
		type: metaInfo.pageName,
		data: {
			title: metaInfo.pageTitle,
		},
	});

	return (
		<div className={stylesPage.page}>
			<Head title={title} description={description} />

			<HeaderPage pageName={metaInfo.pageName} pageTitle={metaInfo.pageTitle} />
			<div className={`${stylesPage.pageContent} ${styles.container}`}>
				<Index currentStudio={currentStudio} storeNotifications={storeNotifications} />
			</div>
		</div>
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
			red: /position-ends/,
			orange: /asd/,
			green: /sad/,
		};

		storeNotificationsData.forEach(storeNotification => {
			const newStoreNotification = {
				...storeNotification,
			};

			if (newStoreNotification.type === 'delivery-is-expected') {
				const deliveryDateAndTime = moment(newStoreNotification.procurement.deliveryDate).set({
					hour: moment(newStoreNotification.procurement.deliveryTimeTo).get('hour'),
					minute: moment(newStoreNotification.procurement.deliveryTimeTo).get('minute'),
					second: 0,
				});

				if (momentDate.isSameOrAfter(deliveryDateAndTime)) {
					const deliveryDate = new Date(newStoreNotification.procurement.deliveryDate);
					const deliveryTime = new Date(newStoreNotification.procurement.deliveryTimeTo);

					deliveryDate.setHours(deliveryTime.getHours());
					deliveryDate.setMinutes(deliveryTime.getMinutes());

					newStoreNotification.sortDate = deliveryDate;

					newStoreNotificationsData.red.push(newStoreNotification);
				} else {
					const deliveryDate = new Date(newStoreNotification.procurement.deliveryDate);
					const deliveryTime = new Date(newStoreNotification.procurement.deliveryTimeFrom);

					deliveryDate.setHours(deliveryTime.getHours());
					deliveryDate.setMinutes(deliveryTime.getMinutes());

					newStoreNotification.sortDate = deliveryDate;

					if (momentDate.isSame(deliveryDateAndTime, 'date')) {
						newStoreNotificationsData.orange.push(newStoreNotification);
					} else {
						newStoreNotificationsData.green.push(newStoreNotification);
					}
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

				if (a.type === 'delivery-is-expected' && b.type === 'delivery-is-expected') {
					if (type === 'red') {
						return sortDateB - sortDateA;
					} else {
						return sortDateA - sortDateB;
					}
				} else {
					return sortDateB - sortDateA;
				}
			});
		});
	}

	storeNotifications.data = newStoreNotificationsData;

	return {
		storeNotifications: storeNotifications,
	};
};

const mapDispatchToProps = dispatch => {
	return {};
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withCurrentUser)(Dashboard);
