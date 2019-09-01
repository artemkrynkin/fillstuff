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
import DropdownMenu from 'src/components/DropdownMenu';

import { TableCell } from './styles';
import PriceDisplay from './PriceDisplay';

const positionActionsButtonClasses = dropdownMenu =>
	ClassNames({
		'sa-positions__position-actions-button': true,
		'sa-positions__position-actions-button_active': Boolean(dropdownMenu),
	});

const Position = props => {
	const { position, onOpenDialogPosition } = props;
	const anchorDropdownMenu = useRef(null);
	const [dropdownMenu, setDropdownMenu] = useState(false);

	function onHandleDropdownMenu() {
		setDropdownMenu(prevValue => !prevValue);
	}

	const receiptsReceived = position.receipts
		.filter(receipt => receipt.status === 'received')
		.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

	return (
		<TableRow className="sa-positions__position">
			<TableCell style={position.positionGroup ? { paddingLeft: 41 } : {}}>
				{position.name}{' '}
				{position.characteristics.reduce((fullCharacteristics, characteristic) => `${fullCharacteristics} ${characteristic.label}`, '')}
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
				<PriceDisplay
					unitReceipt={position.unitReceipt}
					unitIssue={position.unitIssue}
					quantity={position.activeReceipt.current.quantity}
					isFree={false}
					price={position.activeReceipt.unitPurchasePrice}
					receiptsReceived={receiptsReceived}
					receiptNearestPrice={receiptsReceived.length ? receiptsReceived[0].unitPurchasePrice : undefined}
					priceChangeIsGood={false}
					title="цена закупки"
				/>
			</TableCell>
			<TableCell align="right" width={140}>
				<PriceDisplay
					unitReceipt={position.unitReceipt}
					unitIssue={position.unitIssue}
					quantity={position.activeReceipt.current.quantity}
					isFree={position.isFree}
					price={position.activeReceipt.unitSellingPrice}
					receiptsReceived={receiptsReceived}
					receiptNearestPrice={receiptsReceived.length ? receiptsReceived[0].unitSellingPrice : undefined}
					priceChangeIsGood={true}
					title="цена продажи"
				/>
			</TableCell>
			<TableCell align="right" width={50} style={{ padding: '0 7px' }}>
				<div className="sa-positions__position-actions">
					<IconButton
						ref={anchorDropdownMenu}
						className={positionActionsButtonClasses(dropdownMenu)}
						onClick={onHandleDropdownMenu}
						size="small"
					>
						<FontAwesomeIcon icon={['far', 'ellipsis-h']} />
					</IconButton>

					<DropdownMenu
						anchor={anchorDropdownMenu}
						open={dropdownMenu}
						onClose={onHandleDropdownMenu}
						placement="bottom-end"
						disablePortal={false}
					>
						<MenuList>
							<MenuItem
								onClick={() => {
									onHandleDropdownMenu();
								}}
							>
								Статистика позиции
							</MenuItem>
							<MenuItem
								onClick={() => {
									onHandleDropdownMenu();
								}}
							>
								Поступления позиции
							</MenuItem>
							<MenuItem
								onClick={() => {
									onHandleDropdownMenu();
									onOpenDialogPosition('dialogPositionAddQuantity', position);
								}}
							>
								Добавить количество
							</MenuItem>
							<MenuItem
								onClick={() => {
									onHandleDropdownMenu();
									onOpenDialogPosition('dialogCreateWriteOff', position);
								}}
							>
								Списать количество
							</MenuItem>
							{position.positionGroup ? (
								<MenuItem
									onClick={() => {
										onHandleDropdownMenu();
										onOpenDialogPosition('dialogPositionRemoveFromGroup', position);
									}}
								>
									Открепить от группы
								</MenuItem>
							) : null}
						</MenuList>
						<Divider />
						<MenuList>
							<MenuItem
								onClick={() => {
									onHandleDropdownMenu();
									onOpenDialogPosition('dialogPositionQRCodeGeneration', position);
								}}
							>
								Генерация QR-кода
							</MenuItem>
							<MenuItem
								onClick={() => {
									onHandleDropdownMenu();
									onOpenDialogPosition('dialogPositionEdit', position);
								}}
							>
								Редактировать
							</MenuItem>
							<MenuItem
								onClick={() => {
									onHandleDropdownMenu();
									onOpenDialogPosition('dialogPositionArchive', position);
								}}
							>
								Архивировать
							</MenuItem>
						</MenuList>
					</DropdownMenu>
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
