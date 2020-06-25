import React, { Fragment, useRef, useState } from 'react';
import ClassNames from 'classnames';
import moment from 'moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuList from '@material-ui/core/MenuList';

import { declensionNumber } from 'src/helpers/utils';

import CardPaper from 'src/components/CardPaper';
import Money from 'src/components/Money';
import MenuItem from 'src/components/MenuItem';
import Dropdown from 'src/components/Dropdown';
import AvatarTitle from 'src/components/AvatarTitle';
import Tooltip from 'src/components/Tooltip';

import styles from './ProcurementExpected.module.css';

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

const ProcurementExpected = props => {
	const { procurement, onOpenDialogProcurement } = props;
	const refDropdownActions = useRef(null);
	const [dropdownActions, setDropdownActions] = useState(false);

	const onHandleDropdownActions = value => setDropdownActions(value === null || value === undefined ? prevValue => !prevValue : value);

	const openViewDialog = event => {
		if (
			(event.target.closest('.' + styles.actionButton) &&
				event.target.closest('.' + styles.actionButton).classList.contains(styles.actionButton)) ||
			event.target.closest('[role="tooltip"]') ||
			(event.target.closest('.' + styles.procurementComment) &&
				event.target.closest('.' + styles.procurementComment).classList.contains(styles.procurementComment))
		)
			return;

		onOpenDialogProcurement('dialogProcurementExpectedView', 'procurementExpected', procurement);
	};

	return (
		<div className={styles.container}>
			<CardPaper className={styles.card} onClick={openViewDialog} header={false} elevation={1}>
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
				{!procurement.isUnknownDeliveryDate ? (
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
				)}
				<AvatarTitle
					classNames={{
						container: styles.user,
					}}
					imageSrc={procurement.orderedByMember.user.avatar}
					title={procurement.orderedByMember.user.name}
				/>
				<div className={styles.totalPrice}>
					<Money value={procurement.totalPrice} />
				</div>
				<div className={styles.info}>
					<div className={styles.infoItem}>{procurement.shop.name}</div>
					<div className={styles.infoItem}>{declensionNumber(procurement.positions.length, ['позиция', 'позиции', 'позиций'], true)}</div>
					{procurement.comment ? (
						<Fragment>
							<div className={styles.infoItem}>&nbsp;</div>
							<Tooltip title={procurement.comment} className={styles.procurementComment} placement="bottom" leaveDelay={500} interactive>
								<FontAwesomeIcon icon={['fal', 'comment']} />
							</Tooltip>
						</Fragment>
					) : null}
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
									onOpenDialogProcurement('dialogProcurementReceivedCreate', 'procurementReceived', procurement);
								}}
								iconBefore={<FontAwesomeIcon icon={['far', 'truck-loading']} />}
							>
								Оформить закупку
							</MenuItem>
						) : (
							<MenuItem
								onClick={() => {
									onHandleDropdownActions();
									onOpenDialogProcurement('dialogProcurementExpectedConfirm', 'procurementExpected', procurement);
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
									onOpenDialogProcurement('dialogProcurementExpectedEdit', 'procurementExpected', procurement);
								}}
								iconBefore={<FontAwesomeIcon icon={['far', 'pen']} />}
							>
								Редактировать
							</MenuItem>
						) : null}
						<MenuItem
							onClick={() => {
								onHandleDropdownActions();
								onOpenDialogProcurement('dialogProcurementExpectedCancel', 'procurementExpected', procurement);
							}}
							iconBefore={<FontAwesomeIcon icon={['far', 'undo']} />}
							destructive
						>
							Отменить заказ
						</MenuItem>
					</MenuList>
				</Dropdown>
			</CardPaper>
		</div>
	);
};

export default ProcurementExpected;
