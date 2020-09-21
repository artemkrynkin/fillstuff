import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';

import { unitTypeTransform } from 'shared/checkPositionAndReceipt';

import CardPaper from 'src/components/CardPaper';
import Chips from 'src/components/Chips';
import { DefinitionList, DefinitionListItem } from 'src/components/Definition';
import PositionSummary from 'src/components/PositionSummary';

import PositionDropdown from '../components/PositionDropdown';

import styles from './PositionDetails.module.css';

const PositionDetails = props => {
	const { position, onOpenDialogPosition, onArchivedAfterEnded } = props;
	const refDropdownActions = useRef(null);
	const [dropdownActions, setDropdownActions] = useState(false);

	const onToggleDropdownActions = value => setDropdownActions(value === null || value === undefined ? prevValue => !prevValue : value);

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
					onClick={() => onToggleDropdownActions()}
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

			{position.childPosition || position.parentPosition ? (
				<div style={{ marginTop: 40 }}>
					<Typography variant="h6" gutterBottom>
						{position.childPosition ? 'Заменяемая позиция' : 'Позиция на замену'}
					</Typography>
					<Link to={`/stock/${position.childPosition ? position.childPosition._id : position.parentPosition._id}`}>
						<PositionSummary
							name={position.childPosition ? position.childPosition.name : position.parentPosition.name}
							characteristics={position.childPosition ? position.childPosition.characteristics : position.parentPosition.characteristics}
							size="sm"
							minHeight={false}
							style={{ display: 'inline-block' }}
						/>
					</Link>
				</div>
			) : null}

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

			<PositionDropdown
				refDropdownActions={refDropdownActions}
				dropdownActions={dropdownActions}
				onToggleDropdownActions={onToggleDropdownActions}
				position={position}
				onOpenDialogPosition={onOpenDialogPosition}
				onArchivedAfterEnded={onArchivedAfterEnded}
			/>
		</CardPaper>
	);
};

export default PositionDetails;
