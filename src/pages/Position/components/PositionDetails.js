import React, { useRef, useState } from 'react';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IconButton from '@material-ui/core/IconButton';
import MenuList from '@material-ui/core/MenuList';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import { characteristicTypeTransform, unitTypeTransform } from 'shared/checkPositionAndReceipt';

import CardPaper from 'src/components/CardPaper';
import Dropdown from 'src/components/Dropdown';
import MenuItem from 'src/components/MenuItem';
import Chips from 'src/components/Chips';
import { DefinitionList, DefinitionListItem } from 'src/components/Definition';

import styles from './PositionDetails.module.css';

const PositionDetails = props => {
	const { position, onOpenDialogPosition, onCancelArchivePositionAfterEnded } = props;
	const refDropdownActions = useRef(null);
	const [dropdownActions, setDropdownActions] = useState(false);

	const onHandleDropdownActions = () => setDropdownActions(prevValue => !prevValue);

	return (
		<CardPaper
			leftContent={position.name}
			rightContent={
				<IconButton
					ref={refDropdownActions}
					className={ClassNames({
						[styles.actionButton]: true,
						[styles.actionButtonActive]: dropdownActions,
					})}
					onClick={onHandleDropdownActions}
				>
					<FontAwesomeIcon icon={['far', 'ellipsis-h']} />
				</IconButton>
			}
			title
		>
			<DefinitionList>
				<DefinitionListItem term="Единица поступления" value={unitTypeTransform(position.unitReceipt)} />
				<DefinitionListItem term="Единица отпуска" value={unitTypeTransform(position.unitRelease)} />
				<DefinitionListItem term="Вид реализации" value={position.isFree ? 'Бесплатный' : 'Платный'} />
				<DefinitionListItem term="Минимальный остаток" value={position.minimumBalance} />
			</DefinitionList>

			{position.characteristics.length || position.shops.length ? (
				<div>
					<Divider style={{ margin: '20px 0' }} />

					<Typography variant="h6" gutterBottom>
						Информация для закупок
					</Typography>
					<DefinitionList>
						{position.shops.length ? (
							<DefinitionListItem
								term="Магазины"
								value={
									<Chips
										chips={position.shops}
										onRenderChipLabel={value =>
											value.shop.link ? (
												<a
													// eslint-disable-next-line
													href={!~value.shop.link.search(/^http[s]?\:\/\//) ? `//${value.shop.link}` : `${value.shop.link}`}
													target="_blank"
													rel="noreferrer noopener"
													style={{ margin: '-5px -15px -6px', padding: '5px 15px 6px' }}
												>
													{value.shop.name}
												</a>
											) : (
												<span>{value.shop.name}</span>
											)
										}
										onRemoveChip={null}
									/>
								}
							/>
						) : null}
						{position.characteristics.length ? (
							<DefinitionListItem
								term="Характеристики"
								value={
									<Chips
										chips={position.characteristics}
										onRenderChipLabel={value => (
											<span>
												<span style={{ fontWeight: 600 }}>{characteristicTypeTransform(value.type)}</span>: {value.name}
											</span>
										)}
										onRemoveChip={null}
									/>
								}
							/>
						) : null}
					</DefinitionList>
				</div>
			) : null}

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
							onOpenDialogPosition('dialogPositionQRCode', position);
						}}
						iconBefore={<FontAwesomeIcon icon={['fal', 'qrcode']} style={{ fontSize: 16 }} />}
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
		</CardPaper>
	);
};

export default PositionDetails;
