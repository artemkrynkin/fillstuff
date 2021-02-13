import React, { useRef, useState } from 'react';
import moment from 'moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withStyles } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import { LocalizationProvider, StaticDatePicker } from '@material-ui/pickers';
import MomentUtils from '@material-ui/pickers/adapter/moment';

import CheckboxWithLabel from 'src/components/CheckboxWithLabel';
import Dropdown from 'src/components/Dropdown';

const styles = theme => ({
	invoiceDateGrid: {
		width: 160,
	},
	invoiceNumberFieldGrid: {
		width: 200,
	},
	invoiceDateFieldGrid: {
		flex: '1 1',
	},
	noInvoiceGrid: {
		marginBottom: -10,
	},
	labelOr: {
		marginLeft: -theme.spacing(1),
	},
});

function InvoiceData({ classes, formikProps: { isSubmitting, values, touched, errors, handleChange, setFieldValue } }) {
	const refDropdownInvoiceDate = useRef(null);
	const [dropdownInvoiceDate, setDropdownInvoiceDate] = useState(false);

	const onHandleDropdownInvoiceDate = value =>
		setDropdownInvoiceDate(value === null || value === undefined ? prevValue => !prevValue : value);

	const onChangeInvoiceDate = date => {
		setFieldValue('invoiceDate', date);
		onHandleDropdownInvoiceDate(false);
	};

	const onChangeNoInvoice = ({ target: { checked } }) => {
		setFieldValue('noInvoice', checked);

		if (checked && values.invoiceNumber) setFieldValue('invoiceNumber', '');
		if (checked && values.invoiceDate) setFieldValue('invoiceDate', '');
	};

	return (
		<>
			<Grid direction="column" container>
				<Collapse in={!values.noInvoice} timeout="auto">
					<Grid wrap="nowrap" alignItems="flex-start" spacing={2} container>
						<Grid className={classes.invoiceNumberGrid} item>
							<TextField
								name="invoiceNumber"
								placeholder="Номер"
								onChange={handleChange}
								error={touched.invoiceNumber && Boolean(errors.invoiceNumber)}
								helperText={touched.invoiceNumber && errors.invoiceNumber}
								InputProps={{
									inputProps: {
										maxLength: 30,
									},
								}}
								disabled={isSubmitting}
								fullWidth
							/>
						</Grid>
						<Grid className={classes.invoiceDateGrid} item>
							<Grid alignItems="baseline" container>
								<InputLabel className={classes.labelOr} data-inline>
									от
								</InputLabel>
								<Grid className={classes.invoiceDateFieldGrid} item>
									<TextField
										innerRef={refDropdownInvoiceDate}
										name="invoiceDate"
										placeholder="Дата"
										error={touched.invoiceDate && Boolean(errors.invoiceDate)}
										helperText={touched.invoiceDate && errors.invoiceDate}
										disabled={isSubmitting}
										value={values.invoiceDate ? moment(values.invoiceDate).format('DD.MM.YYYY') : ''}
										onFocus={() => setTimeout(() => onHandleDropdownInvoiceDate(true), 100)}
										fullWidth
									/>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Collapse>
				<Grid className={classes.noInvoiceGrid} item>
					<CheckboxWithLabel
						type="checkbox"
						name="noInvoice"
						Label={{ label: 'Чек/накладная отсутствует' }}
						onChange={onChangeNoInvoice}
						disabled={isSubmitting}
					/>
				</Grid>
			</Grid>

			<Dropdown
				anchor={refDropdownInvoiceDate}
				open={dropdownInvoiceDate}
				onClose={() => onHandleDropdownInvoiceDate(false)}
				placement="bottom"
			>
				<LocalizationProvider dateAdapter={MomentUtils}>
					<StaticDatePicker
						views={['date']}
						displayStaticWrapperAs="desktop"
						reduceAnimations
						value={values.invoiceDate}
						onChange={onChangeInvoiceDate}
						leftArrowButtonProps={{
							size: 'small',
						}}
						leftArrowIcon={<FontAwesomeIcon icon={['far', 'angle-left']} />}
						rightArrowButtonProps={{
							size: 'small',
						}}
						rightArrowIcon={<FontAwesomeIcon icon={['far', 'angle-right']} />}
						disableFuture
						allowKeyboardControl={false}
					/>
				</LocalizationProvider>
			</Dropdown>
		</>
	);
}

export default withStyles(styles)(InvoiceData);
