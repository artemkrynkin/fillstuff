import React from 'react';
import { Field } from 'formik';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Tooltip from '@material-ui/core/Tooltip';

import colorTheme from 'shared/colorTheme';

import NumberFormat, { moneyInputFormatProps } from 'src/components/NumberFormat';
import CheckboxWithLabel from 'src/components/CheckboxWithLabel';

const styles = theme => ({
	compensateCostDeliveryGrid: {
		paddingLeft: 173,
	},
	pricePositionsFieldGrid: {
		width: 173,
	},
	costDeliveryFieldGrid: {
		width: 173,
	},
	helpIcon: {
		color: colorTheme.blueGrey['300'],
		cursor: 'pointer',
		display: 'inline-block',
		fontSize: 16,
		marginLeft: 5,
		verticalAlign: 'middle',
	},
});

function TotalPrice({ classes, formikProps: { isSubmitting, values, touched, errors, handleChange } }) {
	return (
		<Grid direction="column" container>
			<Grid wrap="nowrap" alignItems="flex-start" spacing={2} container>
				<Grid className={classes.pricePositionsFieldGrid} item>
					<Field
						name="pricePositions"
						placeholder="0"
						label="Стоимость позиций"
						as={TextField}
						error={touched.pricePositions && Boolean(errors.pricePositions)}
						helperText={touched.pricePositions && errors.pricePositions}
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
				<Grid className={classes.costDeliveryFieldGrid} item>
					<Field
						name="costDelivery"
						placeholder="0"
						label="Стоимость доставки"
						as={TextField}
						error={touched.costDelivery && Boolean(errors.costDelivery)}
						helperText={touched.costDelivery && errors.costDelivery}
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
			<Grid className={classes.compensateCostDeliveryGrid} alignItems="center" container>
				<Field
					type="checkbox"
					name="compensateCostDelivery"
					Label={{ label: 'Компенсировать' }}
					as={CheckboxWithLabel}
					disabled={isSubmitting}
				/>
				<Tooltip
					title={
						<div style={{ maxWidth: 250 }}>
							При наличии в закупке позиций для продажи, стоимость доставки будет включена в цену продажи этих позиций.
						</div>
					}
					placement="bottom"
				>
					<div className={classes.helpIcon}>
						<FontAwesomeIcon icon={['fal', 'question-circle']} fixedWidth />
					</div>
				</Tooltip>
			</Grid>
		</Grid>
	);
}

export default withStyles(styles)(TotalPrice);
