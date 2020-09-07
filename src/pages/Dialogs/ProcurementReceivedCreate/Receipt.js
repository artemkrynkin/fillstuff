import React, { useRef } from 'react';
import { Field } from 'formik';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

import { receiptCalc } from 'shared/checkPositionAndReceipt';
import { formatNumber } from 'shared/utils';

import { formError, formErrorHelperText } from 'src/helpers/utils';

import NumberFormat, { moneyInputFormatProps } from 'src/components/NumberFormat';
import PositionNameInList from 'src/components/PositionNameInList';

import styles from './index.module.css';
import Tooltip from '@material-ui/core/Tooltip';
import ClassNames from 'classnames';

const Receipt = props => {
	const {
		setReceiptIndexInProcurement,
		onOpenDialogByName,
		formEditable,
		receipt: { position, ...receipt },
		index,
		arrayHelpers: { remove },
		formikProps: { errors, isSubmitting, values, setFieldValue, touched },
	} = props;
	const sellingPriceFieldRef = useRef(null);

	const isNmpPce = position.unitReceipt === 'nmp' && position.unitRelease === 'pce';
	const isNmpNmp = position.unitReceipt === 'nmp' && position.unitRelease === 'nmp';

	const autoGenUnitSellingPrice =
		!formEditable && !position.isFree ? formatNumber(receipt.unitPurchasePrice + receipt.unitCostDelivery + receipt.unitMarkup) : 0;

	const onOpenDialogPositionCreateReplacement = () => {
		const { createdAt, isArchived, archivedAfterEnded, hasReceipts, ...remainingProps } = position;

		const positionReplacement = {
			...remainingProps,
			childPosition: position,
		};

		setReceiptIndexInProcurement(index);
		onOpenDialogByName('dialogPositionCreateReplacement', 'positionReplacement', positionReplacement);
	};

	const onOpenDialogPositionEditReplacement = () => {
		setReceiptIndexInProcurement(index);
		onOpenDialogByName('dialogPositionEditReplacement', 'positionReplacement', position);
	};

	return (
		<Grid className={styles.receiptItem} wrap="nowrap" alignItems="baseline" container>
			<Grid className={styles.receiptNumber} item>
				{index + 1}
			</Grid>
			<Grid className={styles.receiptContent} direction="column" container>
				<Grid className={styles.receiptContentHeader} alignItems="center" container>
					<Grid className={styles.positionSelected} zeroMinWidth item>
						<PositionNameInList
							name={position.name}
							characteristics={position.characteristics}
							size="md"
							childPosition={position.childPosition}
							minHeight={false}
						/>
					</Grid>
					{formEditable && values.status !== 'expected' ? (
						<Grid className={styles.actionButtons} item>
							{!position.childPosition && !position.parentPosition ? (
								<Tooltip title="Создать позицию на замену" placement="top">
									<IconButton
										className={styles.actionButton}
										onClick={onOpenDialogPositionCreateReplacement}
										disabled={isSubmitting}
										tabIndex={-1}
									>
										<FontAwesomeIcon icon={['far-c', 'position-replacement']} />
									</IconButton>
								</Tooltip>
							) : null}
							{position.notCreated ? (
								<Tooltip title="Редактировать" placement="top">
									<IconButton
										className={styles.actionButton}
										onClick={onOpenDialogPositionEditReplacement}
										disabled={isSubmitting}
										tabIndex={-1}
									>
										<FontAwesomeIcon icon={['far', 'pen']} />
									</IconButton>
								</Tooltip>
							) : null}
							<Tooltip title="Удалить из заказа" placement="top">
								<IconButton
									className={ClassNames(styles.actionButton, 'destructiveAction')}
									onClick={() => remove(index)}
									disabled={isSubmitting}
									tabIndex={-1}
								>
									<FontAwesomeIcon icon={['far', 'trash']} />
								</IconButton>
							</Tooltip>
						</Grid>
					) : null}
				</Grid>
				<Grid alignItems="flex-start" spacing={2} container>
					<Grid xs={3} item>
						{position.unitReceipt === 'pce' || position.unitRelease === 'nmp' ? (
							<Field
								name={`receipts.${index}.quantity`}
								label={isNmpNmp ? 'Количество уп.' : 'Количество шт.'}
								placeholder="0"
								error={formError(touched, errors, `receipts.${index}.quantity`)}
								helperText={formErrorHelperText(touched, errors, `receipts.${index}.quantity`, null)}
								as={TextField}
								InputProps={{
									inputComponent: NumberFormat,
									inputProps: {
										allowNegative: false,
									},
								}}
								disabled={isSubmitting || !formEditable}
								fullWidth
							/>
						) : (
							<Field
								name={`receipts.${index}.quantityPackages`}
								label="Количество уп."
								placeholder="0"
								error={formError(touched, errors, `receipts.${index}.quantityPackages`)}
								helperText={formErrorHelperText(touched, errors, `receipts.${index}.quantityPackages`, null)}
								as={TextField}
								InputProps={{
									inputComponent: NumberFormat,
									inputProps: {
										allowNegative: false,
									},
								}}
								disabled={isSubmitting || !formEditable}
								fullWidth
							/>
						)}
					</Grid>

					{isNmpPce ? (
						<Grid xs={3} item>
							<Field
								name={`receipts.${index}.quantityInUnit`}
								label="Штук в упаковке"
								placeholder="0"
								as={TextField}
								error={formError(touched, errors, `receipts.${index}.quantityInUnit`)}
								helperText={formErrorHelperText(touched, errors, `receipts.${index}.quantityInUnit`, null)}
								InputProps={{
									inputComponent: NumberFormat,
									inputProps: {
										allowNegative: false,
									},
								}}
								disabled={isSubmitting || !formEditable}
								fullWidth
							/>
						</Grid>
					) : null}

					<Grid xs={3} item>
						<Field
							name={`receipts.${index}.purchasePrice`}
							label={position.unitReceipt === 'nmp' ? 'Цена покупки уп.' : 'Цена покупки шт.'}
							placeholder="0"
							as={TextField}
							error={formError(touched, errors, `receipts.${index}.purchasePrice`)}
							helperText={formErrorHelperText(touched, errors, `receipts.${index}.purchasePrice`, null)}
							InputProps={{
								endAdornment: <InputAdornment position="end">₽</InputAdornment>,
								inputComponent: NumberFormat,
								inputProps: {
									...moneyInputFormatProps,
								},
							}}
							disabled={isSubmitting || !formEditable}
							fullWidth
						/>
					</Grid>

					{formEditable ? (
						<Grid xs={3} item>
							{!position.isFree ? (
								<Field
									name={`receipts.${index}.markupPercent`}
									label="Наценка"
									placeholder="0"
									as={TextField}
									error={formError(touched, errors, `receipts.${index}.markupPercent`)}
									helperText={formErrorHelperText(touched, errors, `receipts.${index}.markupPercent`, null)}
									InputProps={{
										endAdornment: <InputAdornment position="end">%</InputAdornment>,
										inputComponent: NumberFormat,
										inputProps: {
											...moneyInputFormatProps,
											decimalScale: 4,
										},
									}}
									disabled={isSubmitting || !formEditable}
									fullWidth
								/>
							) : null}
						</Grid>
					) : (
						<Grid xs={3} item>
							{!position.isFree ? (
								<Field
									innerRef={sellingPriceFieldRef}
									name={isNmpPce ? `receipts.${index}.unitSellingPrice` : `receipts.${index}.sellingPrice`}
									label={isNmpNmp ? 'Цена продажи уп.' : 'Цена продажи шт.'}
									placeholder="0"
									as={TextField}
									error={formError(touched, errors, isNmpPce ? `receipts.${index}.unitSellingPrice` : `receipts.${index}.sellingPrice`)}
									helperText={formErrorHelperText(
										touched,
										errors,
										isNmpPce ? `receipts.${index}.unitSellingPrice` : `receipts.${index}.sellingPrice`
									)}
									InputProps={{
										endAdornment: <InputAdornment position="end">₽</InputAdornment>,
										inputComponent: NumberFormat,
										inputProps: {
											...moneyInputFormatProps,
											onFocus: ({ target }) => (target.selectionStart = target.value.length),
											onBlur: ({ target: { value } }) => {
												if (Number(value) < autoGenUnitSellingPrice) {
													setFieldValue(
														isNmpPce ? `receipts.${index}.unitSellingPrice` : `receipts.${index}.sellingPrice`,
														autoGenUnitSellingPrice
													);
												}
											},
											onChange: ({ target: { value } }) => {
												const receiptValues = {
													purchasePrice: receipt.purchasePrice,
													unitPurchasePrice: receipt.unitPurchasePrice,
													sellingPrice: Number(value),
													unitSellingPrice: Number(value),
													costDelivery: receipt.costDelivery,
													unitCostDelivery: receipt.unitCostDelivery,
												};

												const newReceiptValues = {
													...receiptCalc.markupPercent(receiptValues, {
														isFree: position.isFree,
														unitReceipt: position.unitReceipt,
														unitRelease: position.unitRelease,
													}),
													...receiptCalc.sellingPrice(receiptValues, {
														isFree: position.isFree,
													}),
												};

												setFieldValue(`receipts.${index}.sellingPrice`, newReceiptValues.sellingPrice);
												setFieldValue(`receipts.${index}.unitSellingPrice`, newReceiptValues.unitSellingPrice);
												setFieldValue(`receipts.${index}.markupPercent`, newReceiptValues.markupPercent);
												setFieldValue(`receipts.${index}.markup`, newReceiptValues.markup);
												setFieldValue(`receipts.${index}.unitMarkup`, newReceiptValues.unitMarkup);
											},
										},
									}}
									disabled={isSubmitting}
									validate={value => {
										if (Number(value) < autoGenUnitSellingPrice) {
											return 'Не может быть ниже рассчитанной цены';
										}
									}}
									fullWidth
								/>
							) : (
								<TextField
									label={isNmpNmp ? 'Цена продажи уп.' : 'Цена продажи шт.'}
									defaultValue="Бесплатно"
									inputProps={{
										readOnly: true,
									}}
									fullWidth
									readOnly
								/>
							)}
						</Grid>
					)}
				</Grid>
			</Grid>
		</Grid>
	);
};

export default Receipt;
