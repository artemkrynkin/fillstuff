import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';

import PositionNameInList from 'src/components/PositionNameInList';
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

	const onHandleDropdownActions = () => setDropdownActions(prevValue => !prevValue);

	const receiptsReceived = position.receipts.filter(receipt => receipt.status === 'received');

	return (
		<TableRow className={styles.position}>
			<TableCell style={position.positionGroup ? { paddingLeft: 41 } : {}}>
				<Link className={styles.positionLink} to={`/availability/${position._id}`}>
					<PositionNameInList name={position.name} characteristics={position.characteristics} />
				</Link>
			</TableCell>
			<TableCell align="right" width={240}>
				{position.receipts.length ? (
					<QuantityIndicator
						type="position"
						unitReceipt={position.unitReceipt}
						unitRelease={position.unitRelease}
						divided={position.divided}
						minimumBalance={position.minimumBalance}
						receipts={position.receipts.map(receipt => ({ ...receipt.current }))}
					/>
				) : null}
			</TableCell>
			{position.receipts.length ? (
				<TableCell align="right" width={140}>
					{position.activeReceipt ? (
						<PriceDisplay
							unitReceipt={position.unitReceipt}
							unitRelease={position.unitRelease}
							quantity={position.activeReceipt.current.quantity}
							isFree={false}
							price={Number(position.activeReceipt.unitPurchasePrice.toFixed(2))}
							receiptsReceived={receiptsReceived}
							receiptNearestPrice={receiptsReceived.length ? Number(receiptsReceived[0].unitPurchasePrice.toFixed(2)) : undefined}
							priceChangeIsGood={false}
							title="цена покупки"
						/>
					) : (
						'-'
					)}
				</TableCell>
			) : null}
			{position.receipts.length ? (
				<TableCell align="right" width={140}>
					{position.activeReceipt ? (
						<PriceDisplay
							unitReceipt={position.unitReceipt}
							unitRelease={position.unitRelease}
							quantity={position.activeReceipt.current.quantity}
							isFree={position.isFree}
							price={Number(position.activeReceipt.unitSellingPrice.toFixed(2))}
							receiptsReceived={receiptsReceived}
							receiptNearestPrice={receiptsReceived.length ? Number(receiptsReceived[0].unitSellingPrice.toFixed(2)) : undefined}
							priceChangeIsGood={true}
							title="цена продажи"
						/>
					) : (
						'-'
					)}
				</TableCell>
			) : null}
			{!position.receipts.length ? (
				<TableCell align="left" colSpan={2} width={280}>
					<span className={styles.caption} style={{ marginLeft: 17 }}>
						Нет поступлений
					</span>
				</TableCell>
			) : null}
			<TableCell align="right" width={50} style={{ padding: '0 7px' }}>
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
										onOpenDialogPosition('dialogReceiptActiveAddQuantity', position);
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
						{!position.activeReceipt && !position.receipts.length ? (
							<MenuItem
								onClick={() => {
									onHandleDropdownActions();
								}}
							>
								Добавить поступление
							</MenuItem>
						) : null}
						<MenuItem
							onClick={() => {
								onHandleDropdownActions();
								onOpenDialogPosition('dialogPositionEdit', position);
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
			</TableCell>
		</TableRow>
	);
};

Position.propTypes = {
	position: PropTypes.object.isRequired,
};

export default Position;
