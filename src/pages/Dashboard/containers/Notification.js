import React, { Fragment, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import ClassNames from 'classnames';
import moment from 'moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MenuList from '@material-ui/core/MenuList';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import CardPaper from 'src/components/CardPaper';
import Money from 'src/components/Money';
import Dropdown from 'src/components/Dropdown';
import MenuItem from 'src/components/MenuItem';

import { editStatusDeliveryIsExpected } from 'src/actions/storeNotifications';

import styles from './Notification.module.css';
import Tooltip from '../../../components/Tooltip';

const calendarFormat = {
	sameDay: 'Сегодня',
	nextDay: 'Завтра',
	lastDay: 'Вчера',
	sameElse: function(now) {
		return this.isSame(now, 'year') ? 'D MMMM' : 'D MMMM YYYY';
	},
	nextWeek: function(now) {
		return this.isSame(now, 'year') ? 'D MMMM' : 'D MMMM YYYY';
	},
	lastWeek: function(now) {
		return this.isSame(now, 'year') ? 'D MMMM' : 'D MMMM YYYY';
	},
};

const Notification = props => {
	const { index, reverseIndex, importance, onOpenDialogByName, notification } = props;
	const [actionStatus, setActionStatus] = useState(false);

	const containerClasses = ClassNames({
		[styles.card]: true,
		[styles.cardImportanceRed]: importance === 'red',
		[styles.cardImportanceOrange]: importance === 'orange',
		[styles.cardImportanceGreen]: importance === 'green',
		[styles.cardNew]: notification.actionStatus === 'new',
		[styles.cardDeleting]: actionStatus === 'deleting' || notification.actionStatus === 'deleting',
		[styles.cardPositionEnds]: notification.type === 'position-ends',
		[styles.cardDeliveryIsExpected]: notification.type === 'delivery-is-expected',
	});

	const openViewDialog = event => {
		if (
			(event.target.closest('.' + styles.actionButton) &&
				event.target.closest('.' + styles.actionButton).classList.contains(styles.actionButton)) ||
			event.target.closest('[role="tooltip"]')
		)
			return;

		switch (notification.type) {
			case 'position-ends':
				return onOpenDialogByName('dialogPositionEnded', 'storeNotification', notification);
			default:
				return;
		}
	};

	useEffect(() => {
		if (notification.type === 'delivery-is-expected' && notification.procurement.isConfirmed) {
			const momentDate = moment();

			let interval;
			const deliveryTimeToParse = notification.procurement.deliveryTimeTo.split(':');
			const deliveryDateAndTime = moment(notification.procurement.deliveryDate).set({
				hour: deliveryTimeToParse[0],
				minute: deliveryTimeToParse[1],
				second: 0,
			});

			const intervalHandler = async () => {
				if (moment().isSameOrAfter(deliveryDateAndTime)) {
					setActionStatus('deleting');
					clearInterval(interval);

					props.editStatusDeliveryIsExpected(notification);
				}
			};

			if (momentDate.isSameOrBefore(deliveryDateAndTime)) {
				interval = setInterval(intervalHandler, 5000);
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
				<PositionEndsContent notification={notification} importance={importance} />
			) : notification.type === 'delivery-is-expected' ? (
				<DeliveryIsExpectedContent notification={notification} importance={importance} />
			) : null}
		</CardPaper>
	);
};

const PositionEndsContent = props => {
	const { notification } = props;

	const remainingQuantity = notification.position.receipts.reduce((sum, receipt) => sum + receipt.current.quantity, 0);

	return (
		<Fragment>
			<div className={styles.header}>
				<FontAwesomeIcon className={styles.notificationIcon} icon={['fal', 'chart-line-down']} />
				<Typography className={styles.title} variant="h6">
					Заканчивается позиция
				</Typography>
			</div>
			<Typography className={styles.subtitle} variant="subtitle1">
				{notification.position.name}
			</Typography>
			<div>
				<div className={styles.caption}>
					Остаток: {remainingQuantity} {notification.position.unitRelease === 'pce' ? 'шт.' : 'уп.'}
				</div>
				<div className={styles.caption}>
					Закончится через:
					<Tooltip title="Недостаточно данных для расчета" className={styles.robotIcon} placement="bottom">
						<FontAwesomeIcon icon={['fal', 'robot']} />
					</Tooltip>
				</div>
			</div>
		</Fragment>
	);
};

const DeliveryIsExpectedContent = props => {
	const { notification } = props;
	const refDropdownActions = useRef(null);
	const [dropdownActions, setDropdownActions] = useState(false);

	const onHandleDropdownActions = value => setDropdownActions(value === null || value === undefined ? prevValue => !prevValue : value);

	return (
		<Fragment>
			<IconButton
				ref={refDropdownActions}
				className={ClassNames({
					[styles.actionButton]: true,
					[styles.actionButtonActive]: dropdownActions,
				})}
				onClick={() => onHandleDropdownActions()}
				size="small"
			>
				<FontAwesomeIcon icon={['far', 'ellipsis-v']} />
			</IconButton>
			<div className={styles.header}>
				<FontAwesomeIcon className={styles.notificationIcon} icon={['fal', 'truck']} />
				<Typography className={styles.title} variant="h6">
					{notification.procurement.isConfirmed ? 'Ожидается доставка' : 'Ожидается подтверждение заказа'}
				</Typography>
			</div>
			{notification.procurement.isConfirmed ? (
				<Typography className={styles.subtitle} variant="subtitle1">
					{moment(notification.procurement.deliveryDate).calendar(null, calendarFormat)} с {notification.procurement.deliveryTimeFrom} до{' '}
					{notification.procurement.deliveryTimeTo}
				</Typography>
			) : null}
			<div>
				<div className={styles.totalPrice}>
					<Money value={notification.procurement.totalPrice} />
				</div>
				<div className={styles.info}>
					<div className={styles.infoItem}>{notification.procurement.shop.name}</div>
				</div>
			</div>

			<Dropdown
				anchor={refDropdownActions}
				open={dropdownActions}
				onClose={() => onHandleDropdownActions(false)}
				placement="bottom-end"
				disablePortal={true}
			>
				<MenuList>
					<MenuItem
						onClick={() => {
							onHandleDropdownActions();
							// onOpenDialogProcurement('dialogProcurementReceivedCreate', 'procurementReceived', procurement);
						}}
						iconBefore={<FontAwesomeIcon icon={['far', 'truck-loading']} />}
					>
						Оформить закупку
					</MenuItem>
					<MenuItem
						onClick={() => {
							onHandleDropdownActions();
							// onOpenDialogProcurement('dialogProcurementExpectedEdit', 'procurementExpected', procurement);
						}}
						iconBefore={<FontAwesomeIcon icon={['far', 'pen']} />}
					>
						Редактировать
					</MenuItem>
					<MenuItem
						onClick={() => {
							onHandleDropdownActions();
							// onOpenDialogProcurement('dialogProcurementExpectedCancel', 'procurementExpected', procurement);
						}}
						iconBefore={<FontAwesomeIcon icon={['far', 'undo']} />}
						destructive
					>
						Отменить заказ
					</MenuItem>
				</MenuList>
			</Dropdown>
		</Fragment>
	);
};

const mapDispatchToProps = dispatch => {
	return {
		editStatusDeliveryIsExpected: data => dispatch(editStatusDeliveryIsExpected({ data })),
	};
};

export default connect(null, mapDispatchToProps)(Notification);
