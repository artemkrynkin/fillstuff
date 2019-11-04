import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';

import QuantityIndicator from 'src/components/QuantityIndicator';
import Dropdown from 'src/components/Dropdown';

import { TableCell } from './styles';
import styles from './Positions.module.css';

import PriceDisplay from './PriceDisplay';

const positionActionsButtonClasses = dropdownActions =>
	ClassNames({
		[styles.positionActionsButton]: true,
		[styles.positionActionsButton_active]: Boolean(dropdownActions),
	});

const Position = props => {
	const { position, onOpenDialogPosition } = props;
	const refDropdownActions = useRef(null);
	const [dropdownActions, setDropdownActions] = useState(false);

	function onHandleDropdownActions() {
		setDropdownActions(prevValue => !prevValue);
	}

	const receiptsReceived = position.receipts
		.filter(receipt => receipt.status === 'received')
		.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

	return (
		<TableRow className={styles.position}>
			<TableCell style={position.positionGroup ? { paddingLeft: 41 } : {}}>
				{position.name}{' '}
				{position.characteristics.reduce((fullCharacteristics, characteristic) => `${fullCharacteristics} ${characteristic.label}`, '')}
				{!position.receipts.length ? <span className={styles.noReceipts}>Нет поступлений</span> : null}
			</TableCell>
			<TableCell align="right" width={160}>
				<QuantityIndicator
					type="position"
					unitReceipt={position.unitReceipt}
					unitIssue={position.unitIssue}
					divided={position.divided}
					minimumBalance={position.minimumBalance}
					receipts={position.receipts.map(receipt => ({ ...receipt.current }))}
				/>
			</TableCell>
			<TableCell align="right" width={130}>
				{position.divided ? position.minimumBalance : null}
			</TableCell>
			<TableCell align="right" width={140}>
				{position.activeReceipt ? (
					<PriceDisplay
						unitReceipt={position.unitReceipt}
						unitIssue={position.unitIssue}
						quantity={position.activeReceipt.current.quantity}
						isFree={false}
						price={Number((position.activeReceipt.unitPurchasePrice + position.activeReceipt.unitCostDelivery).toFixed(2))}
						receiptsReceived={receiptsReceived}
						receiptNearestPrice={
							receiptsReceived.length
								? Number((receiptsReceived[0].unitPurchasePrice + receiptsReceived[0].unitCostDelivery).toFixed(2))
								: undefined
						}
						priceChangeIsGood={false}
						title="цена закупки"
					/>
				) : (
					'-'
				)}
			</TableCell>
			<TableCell align="right" width={140}>
				{position.activeReceipt ? (
					<PriceDisplay
						unitReceipt={position.unitReceipt}
						unitIssue={position.unitIssue}
						quantity={position.activeReceipt.current.quantity}
						isFree={position.isFree}
						price={Number((position.activeReceipt.unitSellingPrice + position.activeReceipt.unitCostDelivery).toFixed(2))}
						receiptsReceived={receiptsReceived}
						receiptNearestPrice={
							receiptsReceived.length
								? Number((receiptsReceived[0].unitSellingPrice + receiptsReceived[0].unitCostDelivery).toFixed(2))
								: undefined
						}
						priceChangeIsGood={true}
						title="цена продажи"
					/>
				) : (
					'-'
				)}
			</TableCell>
			<TableCell align="right" width={50} style={{ padding: '0 7px' }}>
				<div>
					<IconButton
						ref={refDropdownActions}
						className={positionActionsButtonClasses(dropdownActions)}
						onClick={onHandleDropdownActions}
						size="small"
					>
						<FontAwesomeIcon icon={['far', 'ellipsis-h']} />
					</IconButton>

					<Dropdown
						anchor={refDropdownActions}
						open={dropdownActions}
						onClose={onHandleDropdownActions}
						placement="bottom-end"
						disablePortal={false}
					>
						{position.receipts.length || position.positionGroup ? (
							<MenuList>
								{position.receipts.length ? (
									<MenuItem
										onClick={() => {
											onHandleDropdownActions();
											onOpenDialogPosition('dialogPositionAddQuantity', position);
										}}
									>
										Добавить количество
									</MenuItem>
								) : null}
								{position.receipts.length ? (
									<MenuItem
										onClick={() => {
											onHandleDropdownActions();
											onOpenDialogPosition('dialogWriteOffCreate', position);
										}}
									>
										Списать количество
									</MenuItem>
								) : null}
								{position.receipts.length ? (
									<MenuItem
										onClick={() => {
											onHandleDropdownActions();
										}}
									>
										Статистика
									</MenuItem>
								) : null}
								{position.receipts.length ? (
									<MenuItem
										onClick={() => {
											onHandleDropdownActions();
										}}
									>
										Поступления
									</MenuItem>
								) : null}
								{position.positionGroup ? (
									<MenuItem
										onClick={() => {
											onHandleDropdownActions();
											onOpenDialogPosition('dialogPositionRemoveFromGroup', position);
										}}
									>
										Открепить от группы
									</MenuItem>
								) : null}
							</MenuList>
						) : null}
						{position.receipts.length || position.positionGroup ? <Divider /> : null}
						<MenuList>
							<MenuItem
								onClick={() => {
									onHandleDropdownActions();
									onOpenDialogPosition('dialogPositionQRCodeGeneration', position);
								}}
							>
								Генерация QR-кода
							</MenuItem>
							<MenuItem
								onClick={() => {
									onHandleDropdownActions();
									if (position.activeReceipt && position.receipts.length) {
										onOpenDialogPosition('dialogPositionReceiptEdit', position);
									} else {
										onOpenDialogPosition('dialogPositionEdit', position);
									}
								}}
							>
								Редактировать
							</MenuItem>
							<MenuItem
								onClick={() => {
									onHandleDropdownActions();
									onOpenDialogPosition('dialogPositionArchive', position);
								}}
							>
								Архивировать
							</MenuItem>
						</MenuList>
					</Dropdown>
				</div>
			</TableCell>
		</TableRow>
	);
};

Position.propTypes = {
	currentStockId: PropTypes.string.isRequired,
	position: PropTypes.object.isRequired,
};

export default Position;
