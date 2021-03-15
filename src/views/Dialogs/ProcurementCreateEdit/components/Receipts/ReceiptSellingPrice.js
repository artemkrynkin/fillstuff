import React, { useState } from 'react';
import { Field } from 'formik';

import { withStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';

import { formatNumber } from 'shared/utils';
import colorTheme from 'shared/colorTheme';
import { receiptCalc } from 'shared/checkPositionAndReceipt';

import PositionSummary from 'src/components/PositionSummary';
import NumberFormat, { currencyMoneyFormatProps, moneyInputFormatProps } from 'src/components/NumberFormat';
import { DefinitionList, DefinitionListItem } from 'src/components/Definition';

import { helperText } from '../../helpers/utils';

const styles = {
	receiptItem: {
		'&:not(:last-child)': {
			marginBottom: 20,
		},
	},
	receiptNumber: {
		color: colorTheme.blueGrey['300'],
		fontSize: 14,
		fontWeight: 600,
		padding: '5px 0',
		width: 35,
	},
	receiptContent: {
		borderBottom: `1px solid ${colorTheme.brightness['5']}`,
		flex: '1 1',
		paddingBottom: 20,
		minWidth: 0,
		'$receiptItem:last-child &': {
			borderBottom: 'none',
			paddingBottom: 0,
		},
	},
	receiptContentHeader: {
		marginBottom: 15,
	},
	positionSelected: {
		flex: '1 1',
	},
	formationPriceGrid: {
		marginTop: 11,
	},
	actionButton: {
		padding: 9,
		width: 32,
		'&.positiveAction': {
			color: colorTheme.teal['300'],
		},
		'& svg': {
			fontSize: 14,
		},
	},
};

const FormatNumberListItem = ({ value }) => (
	<NumberFormat value={value} renderText={value => value} displayType="text" {...currencyMoneyFormatProps} />
);

const TooltipSellingPrice = ({ receipt, visibleUnitMarkup, children }) => (
	<Tooltip
		title={
			<DefinitionList style={{ width: 240 }}>
				<DefinitionListItem
					term="Цена покупки"
					value={<FormatNumberListItem value={formatNumber(receipt.unitPurchasePrice, { toString: true })} />}
				/>
				{receipt.unitCostDelivery ? (
					<DefinitionListItem
						term="Стоимость доставки"
						value={<FormatNumberListItem value={formatNumber(receipt.unitCostDelivery, { toString: true })} />}
					/>
				) : null}
				{visibleUnitMarkup && receipt.unitMarkup ? (
					<DefinitionListItem
						term="Наценка"
						value={<FormatNumberListItem value={formatNumber(receipt.unitMarkup, { toString: true })} />}
					/>
				) : null}
			</DefinitionList>
		}
		placement="right"
		interactive
	>
		<span style={{ cursor: 'pointer' }}>{children}</span>
	</Tooltip>
);

function ReceiptSellingPrice({
	classes,
	index,
	receipt,
	position = receipt.position,
	formikProps: { isSubmitting, setFieldValue, getFieldMeta },
}) {
	const [activeField, setActiveField] = useState('');

	const fieldsMeta = {
		visibleFormationPriceFields: getFieldMeta(`receipts.${index}.visibleFormationPriceFields`),
		quantity: getFieldMeta(`receipts.${index}.quantity`),
		quantityPackages: getFieldMeta(`receipts.${index}.quantityPackages`),
		quantityInUnit: getFieldMeta(`receipts.${index}.quantityInUnit`),
		purchasePrice: getFieldMeta(`receipts.${index}.purchasePrice`),
		unitSellingPrice: getFieldMeta(`receipts.${index}.unitSellingPrice`),
		markupPercent: getFieldMeta(`receipts.${index}.markupPercent`),
	};

	const generatedUnitSellingPrice = formatNumber(receipt.unitPurchasePrice + receipt.unitCostDelivery);

	const onFocusField = (fieldName, { target }) => {
		setActiveField(fieldName);

		target.select();
	};

	const onChangeField = (fieldName, { target: { value } }) => {
		if (activeField !== fieldName) return;

		const receiptValues = {
			purchasePrice: receipt.purchasePrice,
			unitPurchasePrice: receipt.unitPurchasePrice,
			costDelivery: receipt.costDelivery,
			unitCostDelivery: receipt.unitCostDelivery,
		};

		if (fieldName === 'unitSellingPrice') {
			receiptValues.unitSellingPrice = Number(value);

			receiptCalc.markupPercent(receiptValues, { isFree: position.isFree });
		} else if (fieldName === 'markupPercent') {
			receiptValues.markupPercent = Number(value);
		}

		receiptCalc.sellingPrice(receiptValues, { isFree: position.isFree });

		const fieldChanges = ['sellingPrice', 'unitSellingPrice', 'markupPercent', 'markup', 'unitMarkup'];

		for (let key in fieldChanges) {
			setFieldValue(`receipts.${index}.${fieldChanges[key]}`, receiptValues[fieldChanges[key]], false);
		}
	};

	const onBlurUnitSellingPrice = ({ target: { value } }) => {
		if (Number(value) < generatedUnitSellingPrice) {
			setFieldValue(`receipts.${index}.unitSellingPrice`, generatedUnitSellingPrice);
		}
	};

	const onBlurMarkupPercent = ({ target: { value } }) => {
		setFieldValue(`receipts.${index}.markupPercent`, Number(value));
	};

	const onToggleVisibleSellingPrice = value => {
		setFieldValue(`receipts.${index}.visibleFormationPriceFields`, value, !value);
	};

	return (
		<Grid className={classes.receiptItem} wrap="nowrap" alignItems="flex-start" container>
			<Grid className={classes.receiptNumber} item>
				{index + 1}
			</Grid>
			<Grid className={classes.receiptContent} direction="column" container>
				<Grid className={classes.receiptContentHeader} alignItems="center" container>
					<Grid className={classes.positionSelected} zeroMinWidth item>
						<PositionSummary name={position.name} characteristics={position.characteristics} size="md" avatar />
					</Grid>
					{!position.isFree ? (
						<Grid className={classes.actionButtons} item>
							{receipt.visibleFormationPriceFields ? (
								<Button onClick={() => onToggleVisibleSellingPrice(false)} variant="contained" color="primary" size="small">
									Сохранить
								</Button>
							) : (
								<Tooltip title="Изменить цену продажи" placement="top">
									<IconButton onClick={() => onToggleVisibleSellingPrice(true)} className={classes.actionButton}>
										<FontAwesomeIcon icon={['far', 'pen']} />
									</IconButton>
								</Tooltip>
							)}
						</Grid>
					) : null}
				</Grid>
				<Grid alignItems="flex-start" container>
					<Grid xs={6} item>
						<DefinitionList>
							{!receipt.visibleFormationPriceFields ? (
								<DefinitionListItem
									term="Цена продажи"
									value={
										!position.isFree ? (
											<TooltipSellingPrice receipt={receipt} visibleUnitMarkup>
												<FormatNumberListItem value={formatNumber(receipt.unitSellingPrice, { toString: true })} />
											</TooltipSellingPrice>
										) : (
											<Typography variant="body1">Бесплатно</Typography>
										)
									}
								/>
							) : null}
							{receipt.visibleFormationPriceFields ? (
								<DefinitionListItem
									term="Мин. цена продажи"
									value={
										<TooltipSellingPrice receipt={receipt}>
											<FormatNumberListItem value={formatNumber(generatedUnitSellingPrice, { toString: true })} />
										</TooltipSellingPrice>
									}
								/>
							) : null}
						</DefinitionList>
						{receipt.visibleFormationPriceFields ? (
							<Grid className={classes.formationPriceGrid} alignItems="flex-start" spacing={2} container>
								<Grid xs={7} item>
									<Field
										name={`receipts.${index}.unitSellingPrice`}
										label="Цена продажи"
										placeholder="0"
										as={TextField}
										error={fieldsMeta.unitSellingPrice.touched && Boolean(fieldsMeta.unitSellingPrice.error)}
										helperText={helperText(fieldsMeta.unitSellingPrice.touched, fieldsMeta.unitSellingPrice.error)}
										InputProps={{
											endAdornment: <InputAdornment position="end">₽</InputAdornment>,
											inputComponent: NumberFormat,
											inputProps: {
												...moneyInputFormatProps,
												maxLength: 7,
												onFocus: event => onFocusField('unitSellingPrice', event),
												onChange: event => onChangeField('unitSellingPrice', event),
												onBlur: onBlurUnitSellingPrice,
											},
										}}
										disabled={isSubmitting}
										validate={value => {
											if (value < generatedUnitSellingPrice) return 'Не может быть ниже минимальной цены';
										}}
										autoFocus
										fullWidth
									/>
								</Grid>

								<Grid xs={5} item>
									<Field
										name={`receipts.${index}.markupPercent`}
										label="Наценка"
										placeholder="0"
										as={TextField}
										error={fieldsMeta.markupPercent.touched && Boolean(fieldsMeta.markupPercent.error)}
										helperText={helperText(fieldsMeta.markupPercent.touched, fieldsMeta.markupPercent.error)}
										InputProps={{
											endAdornment: <InputAdornment position="end">%</InputAdornment>,
											inputComponent: NumberFormat,
											inputProps: {
												...moneyInputFormatProps,
												decimalScale: 4,
												onFocus: event => onFocusField('markupPercent', event),
												onChange: event => onChangeField('markupPercent', event),
												onBlur: onBlurMarkupPercent,
											},
										}}
										disabled={isSubmitting}
										fullWidth
									/>
								</Grid>
							</Grid>
						) : null}
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
}

export default withStyles(styles)(ReceiptSellingPrice);
