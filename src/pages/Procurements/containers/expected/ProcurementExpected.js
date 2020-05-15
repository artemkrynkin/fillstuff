import React, { useRef, useState } from 'react';
import ClassNames from 'classnames';
import moment from 'moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MenuList from '@material-ui/core/MenuList';

import { declensionNumber } from 'src/helpers/utils';

import CardPaper from 'src/components/CardPaper';
import Money from 'src/components/Money';
import MenuItem from 'src/components/MenuItem';
import Dropdown from 'src/components/Dropdown';
import AvatarTitle from 'src/components/AvatarTitle';

import styles from './ProcurementExpected.module.css';

const momentDate = moment();

const ProcurementExpected = props => {
	const { procurement, onOpenDialogProcurement } = props;
	const refDropdownActions = useRef(null);
	const [dropdownActions, setDropdownActions] = useState(false);

	const onHandleDropdownActions = value => setDropdownActions(value === null || value === undefined ? prevValue => !prevValue : value);

	const isCurrentYear = momentDate.isSame(procurement.deliveryDate, 'year');
	const deliveryDate = moment(procurement.deliveryDate).format(isCurrentYear ? 'D MMMM' : 'D MMMM YYYY');
	const timeFrom = moment(procurement.deliveryTimeFrom).format('HH:mm');
	const timeTo = moment(procurement.deliveryTimeTo).format('HH:mm');

	const openViewDialog = event => {
		if (
			event.target.closest('.' + styles.actionButton) &&
			event.target.closest('.' + styles.actionButton).classList.contains(styles.actionButton)
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
					<FontAwesomeIcon icon={['far', 'ellipsis-h']} />
				</IconButton>
				<div className={styles.deliveryDate}>
					{deliveryDate} с {timeFrom} до {timeTo}
				</div>
				<AvatarTitle
					className={styles.user}
					imageSrc={procurement.orderedByMember.user.avatar}
					title={procurement.orderedByMember.user.name}
				/>
				<Grid alignItems="center" container>
					<Grid xs={12} item>
						<div className={styles.totalPrice}>
							<Money value={procurement.totalPrice} />
						</div>
						<Grid container>
							<div className={styles.infoItem}>{procurement.shop.name}</div>
							<div className={styles.infoItem}>
								{declensionNumber(procurement.positions.length, ['позиция', 'позиции', 'позиций'], true)}
							</div>
						</Grid>
					</Grid>
				</Grid>
			</CardPaper>

			<Dropdown
				anchor={refDropdownActions}
				open={dropdownActions}
				onClose={() => onHandleDropdownActions(false)}
				placement="bottom-end"
				disablePortal={false}
			>
				<MenuList>
					<MenuItem
						onClick={() => {
							onHandleDropdownActions();
							onOpenDialogProcurement('dialogProcurementReceivedCreate', 'procurementReceived', procurement);
						}}
						iconBefore={<FontAwesomeIcon icon={['far', 'truck-loading']} />}
					>
						Оформить закупку
					</MenuItem>
					<MenuItem
						onClick={() => {
							onHandleDropdownActions();
							onOpenDialogProcurement('dialogProcurementExpectedEdit', 'procurementExpected', procurement);
						}}
						iconBefore={<FontAwesomeIcon icon={['far', 'pen']} />}
					>
						Редактировать
					</MenuItem>
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
		</div>
	);
};

export default ProcurementExpected;
