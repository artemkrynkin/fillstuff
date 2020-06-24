import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';
import moment from 'moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MenuList from '@material-ui/core/MenuList';
import Typography from '@material-ui/core/Typography';

import { formatNumber } from 'shared/utils';

import { DialogSticky, DialogTitle } from 'src/components/Dialog';
import { DefinitionList, DefinitionListItem } from 'src/components/Definition';
import MenuItem from 'src/components/MenuItem';
import Dropdown from 'src/components/Dropdown';
import NumberFormat, { currencyMoneyFormatProps } from 'src/components/NumberFormat';
import AvatarTitle from 'src/components/AvatarTitle';
import PositionNameInList from 'src/components/PositionNameInList';

import styles from './index.module.css';

const momentDate = moment();

const ProcurementExpectedView = props => {
	const { dialogOpen, onCloseDialog, onExitedDialog, selectedProcurement, onOpenDialogByName } = props;
	const refDropdownActions = useRef(null);
	const [dropdownActions, setDropdownActions] = useState(false);

	if (!selectedProcurement) return null;

	const onHandleDropdownActions = value => setDropdownActions(value === null || value === undefined ? prevValue => !prevValue : value);

	const isCurrentYear = momentDate.isSame(selectedProcurement.deliveryDate, 'year');
	const deliveryDate = moment(selectedProcurement.deliveryDate).format(isCurrentYear ? 'D MMMM' : 'D MMMM YYYY');

	return (
		<DialogSticky open={dialogOpen} onClose={onCloseDialog} onExited={onExitedDialog} maxWidth="md" scroll="body" stickyTitle>
			<DialogTitle onClose={onCloseDialog} theme="white">
				<Grid className={styles.headerActions} alignItems="center" container>
					{selectedProcurement.isConfirmed ? (
						<Button
							onClick={() => onOpenDialogByName('dialogProcurementReceivedCreate', 'procurementReceived', selectedProcurement)}
							color="primary"
							variant="contained"
							size="small"
						>
							Оформить закупку
						</Button>
					) : (
						<Button
							onClick={() => onOpenDialogByName('dialogProcurementExpectedConfirm', 'procurementExpected', selectedProcurement)}
							color="primary"
							variant="contained"
							size="small"
						>
							Подтвердить заказ
						</Button>
					)}
					<IconButton
						ref={refDropdownActions}
						className={ClassNames({
							[styles.otherActionsButton]: true,
							[styles.otherActionsButtonActive]: dropdownActions,
						})}
						onClick={() => onHandleDropdownActions()}
					>
						<FontAwesomeIcon icon={['far', 'ellipsis-v']} />
					</IconButton>
				</Grid>
			</DialogTitle>
			<DialogContent style={{ overflow: 'initial' }}>
				<Typography variant="h6" gutterBottom>
					Информация по заказу
				</Typography>
				<DefinitionList>
					<DefinitionListItem
						term="Заказал"
						value={
							<AvatarTitle
								classNames={{
									image: styles.avatarImage,
									title: styles.avatarTitle,
								}}
								imageSrc={selectedProcurement.orderedByMember.user.avatar}
								title={selectedProcurement.orderedByMember.user.name}
							/>
						}
					/>
					<DefinitionListItem term="Магазин" value={selectedProcurement.shop.name} />
					{selectedProcurement.isConfirmed ? (
						<DefinitionListItem
							term="Дата доставки"
							value={
								!selectedProcurement.isUnknownDeliveryDate
									? `${deliveryDate} с ${selectedProcurement.deliveryTimeFrom} до ${selectedProcurement.deliveryTimeTo}`
									: 'Дата доставки не известна'
							}
						/>
					) : null}
					<DefinitionListItem
						term="Итого"
						value={
							<NumberFormat
								value={formatNumber(selectedProcurement.totalPrice, { toString: true })}
								renderText={value => value}
								displayType="text"
								{...currencyMoneyFormatProps}
							/>
						}
					/>
					<DefinitionListItem
						term="Стоимость позиций"
						value={
							<NumberFormat
								value={formatNumber(selectedProcurement.pricePositions, { toString: true })}
								renderText={value => value}
								displayType="text"
								{...currencyMoneyFormatProps}
							/>
						}
					/>
					<DefinitionListItem
						term="Стоимость доставки"
						value={
							<NumberFormat
								value={formatNumber(selectedProcurement.costDelivery, { toString: true })}
								renderText={value => value}
								displayType="text"
								{...currencyMoneyFormatProps}
							/>
						}
					/>
					<DefinitionListItem term="Комментарий" value={selectedProcurement.comment} />
				</DefinitionList>

				<Typography variant="h6" style={{ marginTop: 40 }} gutterBottom>
					Заказанные позиции
				</Typography>
				{selectedProcurement.positions.length ? (
					<div>
						{selectedProcurement.positions.map((position, index) => (
							<Grid className={styles.positionItem} key={position._id} wrap="nowrap" alignItems="baseline" container>
								<Grid className={styles.positionItemNumber} item>
									{index + 1}
								</Grid>
								<Grid className={styles.positionItemContent} style={{ flex: '1 1' }} zeroMinWidth item>
									<PositionNameInList name={position.name} characteristics={position.characteristics} size="md" />
								</Grid>
							</Grid>
						))}
					</div>
				) : null}
			</DialogContent>

			<Dropdown
				anchor={refDropdownActions}
				open={dropdownActions}
				onClose={() => onHandleDropdownActions(false)}
				placement="bottom-end"
				disablePortal={false}
			>
				<MenuList>
					{selectedProcurement.isConfirmed ? (
						<MenuItem
							onClick={() => {
								onHandleDropdownActions();
								onOpenDialogByName('dialogProcurementExpectedEdit', 'procurementExpected', selectedProcurement);
							}}
							iconBefore={<FontAwesomeIcon icon={['far', 'pen']} />}
						>
							Редактировать
						</MenuItem>
					) : null}
					<MenuItem
						onClick={() => {
							onHandleDropdownActions();
							onOpenDialogByName('dialogProcurementExpectedCancel', 'procurementExpected', selectedProcurement);
						}}
						iconBefore={<FontAwesomeIcon icon={['far', 'undo']} />}
						destructive
					>
						Отменить заказ
					</MenuItem>
				</MenuList>
			</Dropdown>
		</DialogSticky>
	);
};

ProcurementExpectedView.propTypes = {
	dialogOpen: PropTypes.bool.isRequired,
	onCloseDialog: PropTypes.func.isRequired,
	onExitedDialog: PropTypes.func,
	selectedProcurement: PropTypes.object,
	onOpenDialogByName: PropTypes.func,
};

export default ProcurementExpectedView;
