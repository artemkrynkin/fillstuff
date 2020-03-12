import React, { useState } from 'react';
import ClassNames from 'classnames';
import moment from 'moment';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import Tooltip from '@material-ui/core/Tooltip';

import { formatNumber } from 'shared/utils';

import NumberFormat, { currencyMoneyFormatProps } from 'src/components/NumberFormat';
import QuantityIndicator from 'src/components/QuantityIndicator';
import CardPaper from 'src/components/CardPaper';

import { TableCell } from './styles';
import styles from './Receipts.module.css';

const momentDate = moment();

const statusTransform = status => {
	switch (status) {
		case 'closed':
			return 'Закрыто';
		case 'active':
			return 'Активно';
		case 'received':
			return 'Получено';
		case 'expected':
		default:
			return 'Ожидается';
	}
};

const statusColorClasses = status =>
	ClassNames({
		[styles.status]: true,
		[styles.statusRed]: status === 'closed',
		[styles.statusGreen]: status === 'active',
		[styles.statusYellow]: status === 'received',
		[styles.statusOrange]: status === 'expected',
	});

const Receipts = props => {
	const { position, receiptsData } = props;
	const [showReceipts, setShowReceipts] = useState(5);

	const onShowReceipts = length => setShowReceipts(length);

	return (
		<CardPaper
			leftContent="Детали позиции"
			rightContent={
				receiptsData && receiptsData.status === 'success' && !receiptsData.data.length ? (
					<Button variant="outlined" color="primary" size="small">
						Создать поступление
					</Button>
				) : null
			}
			style={{ marginTop: 16 }}
			title
		>
			{receiptsData && receiptsData.status === 'success' && receiptsData.data.length ? (
				<div className={styles.receipts}>
					<Table style={{ tableLayout: 'fixed', margin: '-20px 0' }}>
						<TableHead>
							<TableRow>
								<TableCell width={140}>Дата поступления</TableCell>
								<TableCell>Закупка</TableCell>
								<TableCell width={100}>Статус</TableCell>
								<TableCell align="right" width={160}>
									Количество
								</TableCell>
								<TableCell align="right" width={140}>
									Цена закупки
								</TableCell>
								<TableCell align="right" width={140}>
									Цена продажи
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{receiptsData.data.map((receipt, index) => {
								const isCurrentYear = momentDate.isSame(receipt.createdAt, 'year');

								if (index + 1 > showReceipts) return null;

								return (
									<TableRow key={receipt._id}>
										<TableCell width={140}>{moment(receipt.createdAt).format(isCurrentYear ? 'D MMMM в HH:mm' : 'D MMMM YYYY')}</TableCell>
										<TableCell>
											<a
												className={styles.buttonLink}
												href={`/procurements/${receipt.procurement._id}`}
												target="_blank"
												rel="noreferrer noopener"
											>
												{!receipt.procurement.noInvoice ? (
													<div>
														<span>№</span>
														{receipt.procurement.number} от {moment(receipt.procurement.date).format('DD.MM.YYYY')}
													</div>
												) : (
													'Чек/накладная отсутствует'
												)}
											</a>
										</TableCell>
										<TableCell width={100}>
											<span className={statusColorClasses(receipt.status)}>{statusTransform(receipt.status)}</span>
										</TableCell>
										<TableCell align="right" width={160}>
											<QuantityIndicator
												type="receipt"
												unitReceipt={position.unitReceipt}
												unitRelease={position.unitRelease}
												receipts={[{ ...receipt.initial }]}
											/>
										</TableCell>
										<TableCell align="right" width={140}>
											<NumberFormat
												value={formatNumber(receipt.unitPurchasePrice, { toString: true })}
												renderText={value => value}
												displayType="text"
												{...currencyMoneyFormatProps}
											/>
										</TableCell>
										<TableCell align="right" width={140}>
											{!receipt.position.isFree ? (
												<Tooltip
													title={
														<div>
															<NumberFormat
																value={formatNumber(receipt.unitPurchasePrice, { toString: true })}
																renderText={value => `Цена покупки: ${value}`}
																displayType="text"
																{...currencyMoneyFormatProps}
															/>
															{receipt.unitCostDelivery > 0 ? <br /> : null}
															{receipt.unitCostDelivery > 0 ? (
																<NumberFormat
																	value={formatNumber(receipt.unitCostDelivery, { toString: true })}
																	renderText={value => `Стоимость доставки: ${value}`}
																	displayType="text"
																	{...currencyMoneyFormatProps}
																/>
															) : null}
															{receipt.unitMarkup > 0 ? <br /> : null}
															{receipt.unitMarkup > 0 ? (
																<NumberFormat
																	value={formatNumber(receipt.unitMarkup, { toString: true })}
																	renderText={value => `Наценка: ${value}`}
																	displayType="text"
																	{...currencyMoneyFormatProps}
																/>
															) : null}
															{receipt.unitManualMarkup > 0 ? <br /> : null}
															{receipt.unitManualMarkup > 0 ? (
																<NumberFormat
																	value={formatNumber(receipt.unitManualMarkup, { toString: true })}
																	renderText={value => `Ручная наценка: ${value}`}
																	displayType="text"
																	{...currencyMoneyFormatProps}
																/>
															) : null}
														</div>
													}
												>
													<span>
														<NumberFormat
															value={formatNumber(receipt.unitSellingPrice, { toString: true })}
															renderText={value => value}
															displayType="text"
															{...currencyMoneyFormatProps}
														/>
													</span>
												</Tooltip>
											) : (
												<span className={styles.caption}>Бесплатно</span>
											)}
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
					{receiptsData.data.length > showReceipts ? (
						<Grid justify="center" container>
							<Button onClick={() => onShowReceipts(receiptsData.data.length)} variant="outlined" style={{ marginTop: 25 }}>
								Показать все счета
							</Button>
						</Grid>
					) : null}
				</div>
			) : receiptsData && receiptsData.status === 'success' && !receiptsData.data.length ? (
				<Typography>Еще нет ни одного поступления</Typography>
			) : receiptsData && receiptsData.status === 'error' ? (
				<Typography>Не удалось загрузить поступления</Typography>
			) : !receiptsData ? (
				<div children={<CircularProgress size={20} />} style={{ textAlign: 'center' }} />
			) : null}
		</CardPaper>
	);
};

export default Receipts;
