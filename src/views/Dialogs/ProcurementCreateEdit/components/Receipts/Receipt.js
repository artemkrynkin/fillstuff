import React from 'react';
import ClassNames from 'classnames';
import { Field } from 'formik';

import { withStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

import colorTheme from 'shared/colorTheme';

import PositionSummary from 'src/components/PositionSummary';
import NumberFormat, { moneyInputFormatProps } from 'src/components/NumberFormat';

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
	actionButtons: {
		marginLeft: 'auto',
		paddingLeft: 20,
	},
	actionButton: {
		padding: 0,
		marginLeft: 5,
		'& svg': {
			fontSize: 16,
		},
	},
};

const positionBadges = ({ position, badges = [] }) => {
	if (position.childPosition) badges.push('replaceable');

	return badges;
};

function Receipt({
	classes,
	index,
	receipt,
	position = receipt.position,
	formikProps: { isSubmitting, values, getFieldMeta },
	arrayHelpers: { remove },
}) {
	const fieldsMeta = {
		quantity: getFieldMeta(`receipts.${index}.quantity`),
		quantityPackages: getFieldMeta(`receipts.${index}.quantityPackages`),
		quantityInUnit: getFieldMeta(`receipts.${index}.quantityInUnit`),
		purchasePrice: getFieldMeta(`receipts.${index}.purchasePrice`),
	};
	const isNmpPce = position.unitReceipt === 'nmp' && position.unitRelease === 'pce';
	const isNmpNmp = position.unitReceipt === 'nmp' && position.unitRelease === 'nmp';

	const onRemoveReceipt = () => remove(index);

	return (
		<Grid className={classes.receiptItem} wrap="nowrap" alignItems="flex-start" container>
			<Grid className={classes.receiptNumber} item>
				{index + 1}
			</Grid>
			<Grid className={classes.receiptContent} direction="column" container>
				<Grid className={classes.receiptContentHeader} alignItems="center" container>
					<Grid className={classes.positionSelected} zeroMinWidth item>
						<PositionSummary
							name={position.name}
							characteristics={position.characteristics}
							badges={positionBadges({ position })}
							size="md"
							avatar
						/>
					</Grid>
					{values.status !== 'expected' ? (
						<Grid className={classes.actionButtons} item>
							<Tooltip title="Удалить из списка" placement="top">
								<IconButton
									className={ClassNames(classes.actionButton, 'destructiveAction')}
									onClick={onRemoveReceipt}
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
								as={TextField}
								error={fieldsMeta.quantity.touched && Boolean(fieldsMeta.quantity.error)}
								helperText={fieldsMeta.quantity.touched && fieldsMeta.quantity.error}
								InputProps={{
									inputComponent: NumberFormat,
									inputProps: {
										allowNegative: false,
										maxLength: 7,
									},
								}}
								disabled={isSubmitting}
								fullWidth
							/>
						) : (
							<Field
								name={`receipts.${index}.quantityPackages`}
								label="Количество уп."
								placeholder="0"
								as={TextField}
								error={fieldsMeta.quantityPackages.touched && Boolean(fieldsMeta.quantityPackages.error)}
								helperText={fieldsMeta.quantityPackages.touched && fieldsMeta.quantityPackages.error}
								InputProps={{
									inputComponent: NumberFormat,
									inputProps: {
										allowNegative: false,
										maxLength: 7,
									},
								}}
								disabled={isSubmitting}
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
								error={fieldsMeta.quantityInUnit.touched && Boolean(fieldsMeta.quantityInUnit.error)}
								helperText={fieldsMeta.quantityInUnit.touched && fieldsMeta.quantityInUnit.error}
								InputProps={{
									inputComponent: NumberFormat,
									inputProps: {
										allowNegative: false,
										maxLength: 7,
									},
								}}
								disabled={isSubmitting}
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
							error={fieldsMeta.purchasePrice.touched && Boolean(fieldsMeta.purchasePrice.error)}
							helperText={fieldsMeta.purchasePrice.touched && fieldsMeta.purchasePrice.error}
							InputProps={{
								endAdornment: <InputAdornment position="end">₽</InputAdornment>,
								inputComponent: NumberFormat,
								inputProps: {
									...moneyInputFormatProps,
									maxLength: 7,
								},
							}}
							disabled={isSubmitting}
							fullWidth
						/>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
}

export default withStyles(styles)(Receipt);
