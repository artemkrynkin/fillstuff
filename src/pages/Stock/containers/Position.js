import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ButtonBase from '@material-ui/core/ButtonBase';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import MenuList from '@material-ui/core/MenuList';
import Divider from '@material-ui/core/Divider';

import { formatNumber } from 'shared/utils';

import NumberFormat, { currencyMoneyFormatProps } from 'src/components/NumberFormat';
import PositionNameInList from 'src/components/PositionNameInList';
import QuantityIndicator from 'src/components/QuantityIndicator';
import Dropdown from 'src/components/Dropdown';
import MenuItem from 'src/components/MenuItem';

import { archivePositionAfterEnded } from 'src/actions/positions';

import SellingPriceDisplay from '../components/SellingPriceDisplay';

import { TableCell } from './styles';
import stylesPositions from './Positions.module.css';
import styles from './Position.module.css';

const Position = props => {
	const { position, onOpenDialogPosition } = props;
	const refDropdownActions = useRef(null);
	const [dropdownActions, setDropdownActions] = useState(false);

	const onHandleDropdownActions = value => setDropdownActions(value === null || value === undefined ? prevValue => !prevValue : value);

	const onArchivedAfterEnded = () => {
		props.archivePositionAfterEnded(position._id, { archivedAfterEnded: false });
	};

	return (
		<TableRow className={stylesPositions.position}>
			<TableCell style={position.positionGroup ? { paddingLeft: 41 } : {}} width={330}>
				<Link className={styles.positionLink} to={`/stock/${position._id}`}>
					<PositionNameInList
						name={position.name}
						characteristics={position.characteristics}
						archivedAfterEnded={position.archivedAfterEnded}
						deliveryIsExpected={Boolean(position.deliveryIsExpected.length)}
					/>
				</Link>
			</TableCell>
			<TableCell />
			<TableCell align="right" width={240}>
				{position.receipts.length ? (
					<QuantityIndicator
						type="position"
						unitReceipt={position.unitReceipt}
						unitRelease={position.unitRelease}
						minimumBalance={position.minimumBalance}
						archivedAfterEnded={position.archivedAfterEnded}
						receipts={position.receipts.map(receipt => ({ ...receipt.current }))}
					/>
				) : null}
			</TableCell>
			{position.receipts.length ? (
				<TableCell align="right" width={140}>
					<NumberFormat
						value={formatNumber(position.activeReceipt.unitPurchasePrice, { toString: true })}
						renderText={value => value}
						displayType="text"
						{...currencyMoneyFormatProps}
					/>
				</TableCell>
			) : null}
			{position.receipts.length ? (
				<TableCell align="right" width={140}>
					<SellingPriceDisplay position={position} />
				</TableCell>
			) : null}
			{!position.receipts.length ? (
				<TableCell align="left" colSpan={2} width={280}>
					<ButtonBase
						onClick={() => onOpenDialogPosition('dialogReceiptConfirmCreate', 'position', position)}
						className={styles.createReceipt}
					>
						Создать поступление
					</ButtonBase>
				</TableCell>
			) : null}
			<TableCell align="right" width={50} style={{ padding: '0 7px' }}>
				<IconButton
					ref={refDropdownActions}
					className={ClassNames({
						[stylesPositions.actionButton]: true,
						activeAction: dropdownActions,
					})}
					onClick={() => onHandleDropdownActions()}
				>
					<FontAwesomeIcon icon={['far', 'ellipsis-h']} />
				</IconButton>
			</TableCell>

			<Dropdown
				anchor={refDropdownActions}
				open={dropdownActions}
				onClose={() => onHandleDropdownActions(false)}
				placement="bottom-end"
				disablePortal={false}
			>
				{position.receipts.length ? (
					<MenuList>
						<MenuItem
							onClick={() => {
								onHandleDropdownActions();
								onOpenDialogPosition('dialogReceiptActiveAddQuantity', 'position', position);
							}}
						>
							Добавить количество
						</MenuItem>
						<MenuItem
							onClick={() => {
								onHandleDropdownActions();
								onOpenDialogPosition('dialogWriteOffCreate', 'position', position);
							}}
						>
							Списать количество
						</MenuItem>
					</MenuList>
				) : null}
				{position.receipts.length ? <Divider /> : null}
				<MenuList>
					<MenuItem
						onClick={() => {
							onHandleDropdownActions();
							onOpenDialogPosition('dialogPositionQRCode', 'position', position);
						}}
						iconBefore={<FontAwesomeIcon icon={['far-c', 'qr-code']} />}
					>
						Печать QR-кода
					</MenuItem>
				</MenuList>
				<Divider />
				<MenuList>
					{position.positionGroup ? (
						<MenuItem
							onClick={() => {
								onHandleDropdownActions();
								onOpenDialogPosition('dialogPositionRemoveFromGroup', 'position', position);
							}}
							iconBefore={<FontAwesomeIcon icon={['far', 'folder-minus']} style={{ fontSize: 16 }} />}
						>
							Открепить от группы
						</MenuItem>
					) : null}
					<MenuItem
						onClick={() => {
							onHandleDropdownActions();
							onOpenDialogPosition('dialogPositionEdit', 'position', position);
						}}
						iconBefore={<FontAwesomeIcon icon={['far', 'pen']} />}
					>
						Редактировать
					</MenuItem>
					{position.archivedAfterEnded ? (
						<MenuItem
							onClick={() => {
								onHandleDropdownActions();
								onArchivedAfterEnded();
							}}
							iconBefore={
								<span className="fa-layers fa-fw" style={{ width: '16px' }}>
									<FontAwesomeIcon icon={['far', 'archive']} />
									<FontAwesomeIcon icon={['fas', 'circle']} transform="shrink-5 down-2.5 right-7" inverse />
									<FontAwesomeIcon icon={['fas', 'clock']} transform="shrink-7 down-2.5 right-7" />
								</span>
							}
						>
							Отменить архивирование
						</MenuItem>
					) : null}
					<MenuItem
						onClick={() => {
							onHandleDropdownActions();
							onOpenDialogPosition('dialogPositionArchiveDelete', 'position', position);
						}}
						iconBefore={
							position.hasReceipts ? <FontAwesomeIcon icon={['far', 'archive']} /> : <FontAwesomeIcon icon={['far', 'trash-alt']} />
						}
						destructive
					>
						{position.hasReceipts ? 'Архивировать' : 'Удалить'}
					</MenuItem>
				</MenuList>
			</Dropdown>
		</TableRow>
	);
};

Position.propTypes = {
	position: PropTypes.object.isRequired,
};

const mapDispatchToProps = dispatch => {
	return {
		archivePositionAfterEnded: (positionId, data) => dispatch(archivePositionAfterEnded({ params: { positionId }, data })),
	};
};

export default connect(null, mapDispatchToProps)(Position);
