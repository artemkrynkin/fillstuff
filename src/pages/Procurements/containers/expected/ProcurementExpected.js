import React, { Fragment, useRef, useState } from 'react';
import ClassNames from 'classnames';
import moment from 'moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuList from '@material-ui/core/MenuList';
import Tooltip from '@material-ui/core/Tooltip';

import { declensionNumber } from 'src/helpers/utils';

import CardPaper from 'src/components/CardPaper';
import Money from 'src/components/Money';
import MenuItem from 'src/components/MenuItem';
import Dropdown from 'src/components/Dropdown';
import AvatarTitle from 'src/components/AvatarTitle';

import { useStylesProcurementExpected as useStyles } from '../../components/styles';
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
	const classes = useStyles();

	const onHandleDropdownActions = value => setDropdownActions(value === null || value === undefined ? prevValue => !prevValue : value);

	const openViewDialog = () => onOpenDialogProcurement('dialogProcurementExpectedView', 'procurementExpected', procurement);

	return (
		<div className={styles.container}>
			<CardPaper className={classes.card} onClick={openViewDialog} header={false} elevation={1}>
				<IconButton
					ref={refDropdownActions}
					className={ClassNames(styles.actionButton, { activeAction: dropdownActions })}
					onClick={event => {
						event.stopPropagation();
						onHandleDropdownActions();
					}}
					size="small"
				>
					<FontAwesomeIcon icon={['far', 'ellipsis-v']} />
				</IconButton>
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
				) : (
					<Typography className={styles.subtitle} variant="subtitle1">
						Ожидается подтверждение заказа
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
							<Tooltip title={<div className={styles.commentText}>{procurement.comment}</div>} placement="bottom">
								<span className={styles.commentIcon}>
									<FontAwesomeIcon icon={['fal', 'comment']} />
								</span>
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
					stopPropagation
				>
					<MenuList>
						{procurement.isConfirmed ? (
							<MenuItem
								onClick={() => {
									onHandleDropdownActions();
									onOpenDialogProcurement('dialogProcurementReceivedCreate', 'procurementReceived', procurement);
								}}
								iconBefore={<FontAwesomeIcon icon={['far', 'truck-loading']} fixedWidth />}
								positive
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
								positive
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
								iconBefore={<FontAwesomeIcon icon={['far', 'pen']} fixedWidth />}
							>
								Редактировать
							</MenuItem>
						) : null}
						<MenuItem
							onClick={() => {
								onHandleDropdownActions();
								onOpenDialogProcurement('dialogProcurementExpectedCancel', 'procurementExpected', procurement);
							}}
							iconBefore={<FontAwesomeIcon icon={['far', 'undo']} fixedWidth />}
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
