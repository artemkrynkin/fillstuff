import React, { useRef, useState } from 'react';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IconButton from '@material-ui/core/IconButton';
import MenuList from '@material-ui/core/MenuList';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import { unitTypeTransform } from 'shared/checkPositionAndReceipt';

import CardPaper from 'src/components/CardPaper';
import Dropdown from 'src/components/Dropdown';
import MenuItem from 'src/components/MenuItem';
import Chips from 'src/components/Chips';
import { DefinitionList, DefinitionListItem } from 'src/components/Definition';

import styles from './PositionDetails.module.css';
import Tooltip from '@material-ui/core/Tooltip';

const PositionDetails = props => {
	const { position, onOpenDialogPosition, onCancelArchivePositionAfterEnded } = props;
	const refDropdownActions = useRef(null);
	const [dropdownActions, setDropdownActions] = useState(false);

	const onHandleDropdownActions = value => setDropdownActions(value === null || value === undefined ? prevValue => !prevValue : value);

	return (
		<CardPaper
			leftContent={position.name}
			rightContent={
				<IconButton
					ref={refDropdownActions}
					className={ClassNames({
						[styles.actionButton]: true,
						activeAction: dropdownActions,
					})}
					onClick={() => onHandleDropdownActions()}
				>
					<FontAwesomeIcon icon={['far', 'ellipsis-h']} />
				</IconButton>
			}
			title
		>
			<DefinitionList>
				{position.characteristics.length ? (
					<DefinitionListItem
						term="Характеристики"
						value={position.characteristics.reduce(
							(fullName, characteristic) => (fullName ? `${fullName}, ` : '') + characteristic.name,
							''
						)}
					/>
				) : null}
				<DefinitionListItem term="Единица поступления" value={unitTypeTransform(position.unitReceipt)} />
				<DefinitionListItem term="Единица отпуска" value={unitTypeTransform(position.unitRelease)} />
				<DefinitionListItem term="Вид реализации" value={position.isFree ? 'Бесплатный' : 'Платный'} />
				<DefinitionListItem term="Минимальный остаток" value={position.minimumBalance} />
			</DefinitionList>

			{position.shops.length ? (
				<div style={{ marginTop: 40 }}>
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
										onRenderChipLabel={shop => {
											const link = shop.link || shop.shop.link;

											return (
												<>
													{link ? (
														<a
															// eslint-disable-next-line
															href={!~link.search(/^http[s]?\:\/\//) ? `//${link}` : `${link}`}
															target="_blank"
															rel="noreferrer noopener"
															style={{ margin: '-5px -12px -6px', padding: '5px 12px 6px' }}
														>
															{shop.shop.name}
														</a>
													) : (
														<span>{shop.shop.name}</span>
													)}
													{shop.comment ? (
														<Tooltip
															title={<div className={styles.commentText}>{shop.comment}</div>}
															placement="bottom"
															leaveDelay={500}
															interactive
														>
															<span className={styles.comment}>
																<FontAwesomeIcon icon={['far', 'comment']} />
															</span>
														</Tooltip>
													) : null}
												</>
											);
										}}
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
				onClose={() => onHandleDropdownActions(false)}
				placement="bottom-end"
				disablePortal={false}
			>
				<MenuList>
					<MenuItem
						onClick={() => {
							onHandleDropdownActions();
							onOpenDialogPosition('dialogPositionQRCode', 'position', position);
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
		</CardPaper>
	);
};

export default PositionDetails;
