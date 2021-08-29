import React, { useRef, useState } from 'react';
import moment from 'moment';
import { Field } from 'formik';
import DatePicker from 'react-datepicker';

import { withStyles } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';

import CheckboxWithLabel from 'src/components/CheckboxWithLabel';
import Dropdown from 'src/components/Dropdown';
import HeaderDatepicker from 'src/components/Datepicker/Header';

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
							<Field
								name="invoiceNumber"
								placeholder="Номер"
								as={TextField}
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
										value={values.invoiceDate ? moment(values.invoiceDate).format('DD.MM.YYYY') : ''}
										error={touched.invoiceDate && Boolean(errors.invoiceDate)}
										helperText={touched.invoiceDate && errors.invoiceDate}
										disabled={isSubmitting}
										onFocus={() => setTimeout(() => onHandleDropdownInvoiceDate(true), 100)}
										fullWidth
									/>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Collapse>

				<Grid className={classes.noInvoiceGrid} item>
					<Field
						type="checkbox"
						name="noInvoice"
						Label={{ label: 'Чек/накладная отсутствует' }}
						as={CheckboxWithLabel}
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
        <DatePicker
          selected={values.invoiceDate}
          renderCustomHeader={HeaderDatepicker}
          onChange={onChangeInvoiceDate}
          disabledKeyboardNavigation
          inline
        />
			</Dropdown>
		</>
	);
}

export default withStyles(styles)(InvoiceData);
