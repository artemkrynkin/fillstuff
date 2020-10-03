import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import ClassNames from 'classnames';
import moment from 'moment';

import { getDeliveryDateTimeMoment, capitalize } from 'src/helpers/utils';

import CardPaper from 'src/components/CardPaper';

import { editStatusDeliveryIsExpected } from 'src/actions/storeNotifications';

import PositionEnds from '../components/notificationsContent/PositionEnds';
import ReceiptsMissing from '../components/notificationsContent/ReceiptsMissing';
import DeliveryIsExpected from '../components/notificationsContent/DeliveryIsExpected';
import MemberInvoice from '../components/notificationsContent/MemberInvoice';

import styles from './Notification.module.css';

const Notification = props => {
	const { index, reverseIndex, importance, onOpenDialogByName, notification } = props;
	const [actionStatus, setActionStatus] = useState(false);

	const containerClasses = ClassNames(
		styles.card,
		styles[`cardImportance${capitalize(importance)}`],
		styles[`card${capitalize(notification.type.replace(/-/g, ' ')).replace(/ /g, '')}`],
		{
			[styles.cardNew]: notification.actionStatus === 'new',
			[styles.cardDeleting]: actionStatus === 'deleting' || notification.actionStatus === 'deleting',
		}
	);

	const openViewDialog = () => {
		switch (notification.type) {
			case 'position-ends':
			case 'receipts-missing':
				return onOpenDialogByName('dialogPositionEnded', 'storeNotification', notification);
			case 'delivery-is-expected':
				const { procurement } = notification;

				return onOpenDialogByName('dialogProcurementExpectedView', 'procurementExpected', procurement);
			default:
				return;
		}
	};

	useEffect(() => {
		if (notification.type === 'delivery-is-expected') {
			const { procurement } = notification;

			if (procurement.isConfirmed && !procurement.isUnknownDeliveryDate) {
				const momentDate = moment();

				let interval;
				const deliveryDateTo = getDeliveryDateTimeMoment(procurement.deliveryDate, procurement.deliveryTimeTo, 'to');

				if (momentDate.isSameOrBefore(deliveryDateTo)) {
					interval = setInterval(() => {
						if (moment().isSameOrAfter(deliveryDateTo)) {
							setActionStatus('deleting');
							clearInterval(interval);

							props.editStatusDeliveryIsExpected(notification);
						}
					}, 5000);
				}
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<CardPaper
			className={containerClasses}
			onClick={openViewDialog}
			header={false}
			elevation={1}
			style={{ zIndex: reverseIndex, '--cardIndex': index, '--cardReverseIndex': reverseIndex }}
		>
			{notification.type === 'position-ends' ? (
				<PositionEnds notification={notification} importance={importance} />
			) : notification.type === 'receipts-missing' ? (
				<ReceiptsMissing notification={notification} importance={importance} />
			) : notification.type === 'delivery-is-expected' ? (
				<DeliveryIsExpected notification={notification} importance={importance} onOpenDialogByName={onOpenDialogByName} />
			) : notification.type === 'member-invoice' ? (
				<MemberInvoice notification={notification} importance={importance} onOpenDialogByName={onOpenDialogByName} />
			) : null}
		</CardPaper>
	);
};

const mapDispatchToProps = dispatch => {
	return {
		editStatusDeliveryIsExpected: data => dispatch(editStatusDeliveryIsExpected({ data })),
	};
};

export default connect(null, mapDispatchToProps)(Notification);
