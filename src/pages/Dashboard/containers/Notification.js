import React, { Fragment, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import ClassNames from 'classnames';
import moment from 'moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MenuList from '@material-ui/core/MenuList';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import { getDeliveryDateTimeMoment } from 'src/helpers/utils';

import CardPaper from 'src/components/CardPaper';
import Money from 'src/components/Money';
import Dropdown from 'src/components/Dropdown';
import MenuItem from 'src/components/MenuItem';
import Tooltip from 'src/components/Tooltip';

import { editStatusDeliveryIsExpected } from 'src/actions/storeNotifications';

import styles from './Notification.module.css';

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
			event.target.closest('[role="tooltip"]') ||
			(event.target.closest('.' + styles.procurementComment) &&
				event.target.closest('.' + styles.procurementComment).classList.contains(styles.procurementComment))
		)
			return;

		switch (notification.type) {
			case 'position-ends':
				return onOpenDialogByName('dialogPositionEnded', 'storeNotification', notification);
			case 'delivery-is-expected':
				return onOpenDialogByName('dialogProcurementExpectedView', 'procurementExpected', notification.procurement);
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
				<PositionEndsContent notification={notification} importance={importance} />
			) : notification.type === 'delivery-is-expected' ? (
				<DeliveryIsExpectedContent notification={notification} importance={importance} onOpenDialogByName={onOpenDialogByName} />
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
	const {
		notification: { procurement },
		onOpenDialogByName,
	} = props;
	const refDropdownActions = useRef(null);
	const [dropdownActions, setDropdownActions] = useState(false);

	const onHandleDropdownActions = value => setDropdownActions(value === null || value === undefined ? prevValue => !prevValue : value);

	const deliveryDateToExpired = moment().isAfter(getDeliveryDateTimeMoment(procurement.deliveryDate, procurement.deliveryTimeTo, 'to'));

	const eventStatus = procurement.isConfirmed
		? !procurement.isUnknownDeliveryDate && deliveryDateToExpired
			? 'expired'
			: 'expected'
		: 'unconfirmed';

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
				{eventStatus === 'expected' ? (
					<FontAwesomeIcon className={styles.notificationIcon} icon={['fal', 'truck']} />
				) : eventStatus === 'unconfirmed' ? (
					<span className={`${styles.notificationIcon} fa-layers fa-fw`} style={{ width: '30px' }}>
						<FontAwesomeIcon icon={['fal', 'truck']} transform="right-1" />
						<FontAwesomeIcon icon={['fas', 'circle']} transform="shrink-5 up-4 left-6.5" inverse />
						<FontAwesomeIcon icon={['fas', 'question-circle']} transform="shrink-7 up-4 left-6.5" />
					</span>
				) : (
					<span className={`${styles.notificationIcon} fa-layers fa-fw`} style={{ width: '30px' }}>
						<FontAwesomeIcon icon={['fal', 'truck']} transform="right-1" />
						<FontAwesomeIcon icon={['fas', 'circle']} transform="shrink-5 up-4 left-6.5" inverse />
						<FontAwesomeIcon icon={['fas', 'exclamation-circle']} transform="shrink-7 up-4 left-6.5" />
					</span>
				)}
				<Typography className={styles.title} variant="h6">
					{eventStatus === 'expected'
						? 'Ожидается доставка'
						: eventStatus === 'unconfirmed'
						? 'Ожидается подтверждение заказа'
						: 'Доставка просрочена'}
				</Typography>
			</div>
			{procurement.isConfirmed ? (
				!procurement.isUnknownDeliveryDate ? (
					<Typography className={styles.subtitle} variant="subtitle1">
						{moment(procurement.deliveryDate).calendar(null, calendarFormat)}{' '}
						{procurement.deliveryTimeFrom && procurement.deliveryTimeTo
							? procurement.deliveryTimeFrom !== procurement.deliveryTimeTo
								? `с ${procurement.deliveryTimeFrom} до ${procurement.deliveryTimeTo}`
								: `в ${procurement.deliveryTimeFrom}`
							: null}
					</Typography>
				) : (
					<Typography className={styles.subtitle} variant="subtitle1">
						Дата доставки не известна
					</Typography>
				)
			) : null}
			<div>
				<div className={styles.totalPrice}>
					<Money value={procurement.totalPrice} />
				</div>
				<div className={styles.info}>
					<div className={styles.infoItem}>{procurement.shop.name}</div>
					{procurement.comment ? (
						<Fragment>
							<div className={styles.infoItem}>&nbsp;</div>
							<Tooltip title={procurement.comment} className={styles.procurementComment} placement="bottom" leaveDelay={500} interactive>
								<FontAwesomeIcon icon={['fal', 'comment']} />
							</Tooltip>
						</Fragment>
					) : null}
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
					{procurement.isConfirmed ? (
						<MenuItem
							onClick={() => {
								onHandleDropdownActions();
								onOpenDialogByName('dialogProcurementReceivedCreate', 'procurementReceived', procurement);
							}}
							iconBefore={<FontAwesomeIcon icon={['far', 'truck-loading']} />}
						>
							Оформить закупку
						</MenuItem>
					) : (
						<MenuItem
							onClick={() => {
								onHandleDropdownActions();
								onOpenDialogByName('dialogProcurementExpectedConfirm', 'procurementExpected', procurement);
							}}
							iconBefore={
								<span className="fa-layers fa-fw" style={{ width: '16px' }}>
									<FontAwesomeIcon icon={['far', 'truck']} />
									<FontAwesomeIcon icon={['fas', 'circle']} transform="shrink-5 up-4 left-6" inverse />
									<FontAwesomeIcon icon={['fas', 'check-circle']} transform="shrink-7 up-4 left-6" />
								</span>
							}
						>
							Подтвердить заказ
						</MenuItem>
					)}
					{procurement.isConfirmed ? (
						<MenuItem
							onClick={() => {
								onHandleDropdownActions();
								onOpenDialogByName('dialogProcurementExpectedEdit', 'procurementExpected', procurement);
							}}
							iconBefore={<FontAwesomeIcon icon={['far', 'pen']} />}
						>
							Редактировать
						</MenuItem>
					) : null}
					<MenuItem
						onClick={() => {
							onHandleDropdownActions();
							onOpenDialogByName('dialogProcurementExpectedCancel', 'procurementExpected', procurement);
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
