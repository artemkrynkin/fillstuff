import React, { useRef, useState } from 'react';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IconButton from '@material-ui/core/IconButton';
import MenuList from '@material-ui/core/MenuList';
import Divider from '@material-ui/core/Divider';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { characteristicTypeTransform, unitTypeTransform } from 'shared/checkPositionAndReceipt';

import CardPaper from 'src/components/CardPaper';
import Dropdown from 'src/components/Dropdown';
import MenuItem from 'src/components/MenuItem';
import Chips from 'src/components/Chips';

import stylesGlobal from 'src/styles/globals.module.css';
import styles from './PositionDetails.module.css';

const positionActionsButtonClasses = dropdownActions =>
	ClassNames({
		[styles.actionsButton]: true,
		[styles.actionsButton_active]: Boolean(dropdownActions),
	});

const PositionDetails = props => {
	const { position, onOpenDialogPosition, onCancelArchivePositionAfterEnded } = props;
	const refDropdownActions = useRef(null);
	const [dropdownActions, setDropdownActions] = useState(false);

	const onHandleDropdownActions = () => setDropdownActions(prevValue => !prevValue);

	return (
		<CardPaper
			leftContent={position.name}
			rightContent={
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
						<MenuList>
							<MenuItem
								onClick={() => {
									onHandleDropdownActions();
									onOpenDialogPosition('dialogPositionQRCodeGeneration', position);
								}}
								iconBefore={<FontAwesomeIcon icon={['fal', 'qrcode']} style={{ fontSize: 16 }} />}
							>
								Генерация QR-кода
							</MenuItem>
						</MenuList>
						<Divider />
						<MenuList>
							{position.positionGroup ? (
								<MenuItem
									onClick={() => {
										onHandleDropdownActions();
										onOpenDialogPosition('dialogPositionRemoveFromGroup', position);
									}}
									iconBefore={<FontAwesomeIcon icon={['far', 'folder-minus']} style={{ fontSize: 16 }} />}
								>
									Открепить от группы
								</MenuItem>
							) : null}
							<MenuItem
								onClick={() => {
									onHandleDropdownActions();
									onOpenDialogPosition('dialogPositionEdit', position);
								}}
								iconBefore={<FontAwesomeIcon icon={['far', 'pen']} />}
							>
								Редактировать
							</MenuItem>
							{position.archivedAfterEnded ? (
								<MenuItem
									onClick={() => {
										onHandleDropdownActions();
										onCancelArchivePositionAfterEnded(position._id);
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
									onOpenDialogPosition('dialogPositionArchiveDelete', position);
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
				</div>
			}
			title
		>
			<Grid className={stylesGlobal.formLabelControl} wrap="nowrap" alignItems="flex-start" style={{ marginBottom: 0 }} container>
				<InputLabel style={{ minWidth: 146 }}>Единица поступления</InputLabel>
				<TextField
					defaultValue={unitTypeTransform(position.unitReceipt)}
					inputProps={{
						readOnly: true,
					}}
					fullWidth
					readOnly
				/>
			</Grid>
			<Grid className={stylesGlobal.formLabelControl} wrap="nowrap" alignItems="flex-start" style={{ marginBottom: 0 }} container>
				<InputLabel style={{ minWidth: 146 }}>Единица отпуска</InputLabel>
				<TextField
					defaultValue={unitTypeTransform(position.unitRelease)}
					inputProps={{
						readOnly: true,
					}}
					fullWidth
					readOnly
				/>
			</Grid>
			<Grid className={stylesGlobal.formLabelControl} wrap="nowrap" alignItems="flex-start" style={{ marginBottom: 0 }} container>
				<InputLabel style={{ minWidth: 146 }}>Вид реализации</InputLabel>
				<TextField
					defaultValue={position.isFree ? 'Бесплатный' : 'Платный'}
					inputProps={{
						readOnly: true,
					}}
					fullWidth
					readOnly
				/>
			</Grid>
			<Grid className={stylesGlobal.formLabelControl} wrap="nowrap" alignItems="flex-start" style={{ marginBottom: 0 }} container>
				<InputLabel style={{ minWidth: 146 }}>Минимальный остаток</InputLabel>
				<TextField
					defaultValue={position.minimumBalance}
					inputProps={{
						readOnly: true,
					}}
					fullWidth
					readOnly
				/>
			</Grid>

			{position.shopName || position.characteristics.length ? (
				<div>
					<Divider style={{ margin: '20px 0' }} />

					<Typography variant="h6" gutterBottom>
						Информация для закупок
					</Typography>
					{position.shopName ? (
						<Grid className={stylesGlobal.formLabelControl} wrap="nowrap" alignItems="flex-start" style={{ marginBottom: 0 }} container>
							<InputLabel style={{ minWidth: 146 }}>Магазин / Ссылка</InputLabel>
							<Typography variant="subtitle2" style={{ fontWeight: 400, padding: '8px 0' }}>
								{position.shopLink ? (
									<a
										// eslint-disable-next-line
										href={!~position.shopLink.search(/^http[s]?\:\/\//) ? `//${position.shopLink}` : `${position.shopLink}`}
										target="_blank"
										rel="noreferrer noopener"
									>
										{position.shopName}
									</a>
								) : (
									position.shopName
								)}
							</Typography>
						</Grid>
					) : null}

					{position.characteristics.length ? (
						<Grid className={stylesGlobal.formLabelControl} style={{ marginBottom: 11 }} wrap="nowrap" alignItems="flex-start" container>
							<InputLabel style={{ display: 'inline-flex', minWidth: 146 }}>Характеристики</InputLabel>
							<Grid style={{ marginTop: 7, width: 'calc(100% - 120px)' }} container>
								<Chips
									chips={position.characteristics}
									onRenderChipLabel={value => (
										<span>
											<span style={{ fontWeight: 600 }}>{characteristicTypeTransform(value.type)}</span>: {value.label}
										</span>
									)}
									onRemoveChip={null}
								/>
							</Grid>
						</Grid>
					) : null}
				</div>
			) : null}
		</CardPaper>
	);
};

export default PositionDetails;
