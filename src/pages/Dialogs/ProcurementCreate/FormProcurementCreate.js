import React, { useRef, useState } from 'react';
import { Form, Field, FieldArray, ErrorMessage } from 'formik';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { DatePicker } from '@material-ui/pickers';

import { declensionNumber } from 'src/helpers/utils';

import CheckboxWithLabel from 'src/components/CheckboxWithLabel';
import NumberFormat, { moneyInputFormatProps } from 'src/components/NumberFormat';
import Dropdown from 'src/components/Dropdown';
import Tooltip from 'src/components/Tooltip';

import FormFieldArrayReceipts from './FormFieldArrayReceipts';

import styles from './index.module.css';

const FormProcurementCreate = props => {
	const {
		dialogRef,
		receiptInitialValues,
		onHandleEditFormProcurement,
		positions,
		formEditable,
		formikProps: { errors, isSubmitting, submitForm, setFieldValue, touched, values },
	} = props;
	const refDropdownDate = useRef(null);
	const [dropdownDate, setDropdownDate] = useState(false);

	const onHandleDropdownDate = value => setDropdownDate(!value === null || value === undefined ? !dropdownDate : value);

	const onChangeDate = date => {
		setFieldValue('date', date);
		onHandleDropdownDate(false);
	};

	const sellingPositionCount = !formEditable ? values.receipts.reduce((sum, receipt) => sum + (!receipt.position.isFree ? 1 : 0), 0) : 0;

	return (
		<Form>
			<DialogContent style={{ overflow: 'initial' }}>
				{!formEditable && sellingPositionCount ? (
					<div
						className={ClassNames({
							[styles.headerInfo]: true,
							[styles.headerInfoBlueGrey]: true,
						})}
					>
						<Grid justify="center" alignItems="center" container>
							<FontAwesomeIcon
								className={styles.headerInfoIcon}
								icon={['fad', 'exclamation-circle']}
								style={{ '--fa-primary-opacity': 0.9, '--fa-secondary-opacity': 0.2 }}
							/>
							<Typography className={styles.headerInfoText} variant="body1">
								Для {declensionNumber(sellingPositionCount, ['позиции', 'позиций', 'позиций'], true)} рассчитана цена продажи.
								<br />
								При необходимости измените её вручную.
							</Typography>
						</Grid>
					</div>
				) : null}

				<ErrorMessage name="pricePositions">
					{message => (
						<div
							className={ClassNames({
								[styles.headerInfo]: true,
								[styles.headerInfoRed]: true,
							})}
						>
							<Grid justify="center" alignItems="center" container>
								<FontAwesomeIcon
									className={styles.headerInfoIcon}
									icon={['fad', 'exclamation-circle']}
									style={{ '--fa-primary-opacity': 0.9, '--fa-secondary-opacity': 0.2 }}
								/>
								<Typography className={styles.headerInfoText} variant="body1">
									{message}
								</Typography>
							</Grid>
						</div>
					)}
				</ErrorMessage>

				<Grid style={{ marginBottom: 12 }} spacing={2} container>
					<Grid xs={4} item>
						<Field
							name="number"
							placeholder={values.noInvoice ? '-' : ''}
							label="Номер чека/накладной"
							error={Boolean(errors.number && touched.number)}
							helperText={typeof errors.number === 'string' && touched.number ? errors.number : null}
							as={TextField}
							disabled={isSubmitting || !formEditable || values.noInvoice}
							autoFocus
							fullWidth
						/>
						{formEditable ? (
							<Field
								type="checkbox"
								name="noInvoice"
								Label={{ label: 'Чек/накладная отсутствует' }}
								as={CheckboxWithLabel}
								onChange={({ target: { checked } }) => {
									setFieldValue('noInvoice', checked);

									if (checked && values.number) setFieldValue('number', '');
									if (checked && values.date) setFieldValue('date', '');
								}}
								disabled={isSubmitting || !formEditable}
							/>
						) : null}
					</Grid>
					<Grid xs={2} item>
						<Grid wrap="nowrap" alignItems="center" container>
							<InputLabel style={{ margin: '20px 8px 0 -8px' }}>от</InputLabel>
							<TextField
								innerRef={refDropdownDate}
								name="date"
								placeholder={values.noInvoice ? '-' : ''}
								label="Дата"
								error={Boolean(errors.date && touched.date)}
								helperText={typeof errors.date === 'string' && touched.date ? errors.date : null}
								disabled={isSubmitting || !formEditable || values.noInvoice}
								value={values.date ? moment(values.date).format('DD.MM.YYYY') : ''}
								onFocus={() => onHandleDropdownDate(true)}
								fullWidth
							/>
						</Grid>
					</Grid>
					<Grid xs={3} item>
						<Field
							name="totalPrice"
							placeholder="0"
							label="Итого по чеку/накладной"
							error={Boolean(errors.totalPrice && touched.totalPrice)}
							helperText={typeof errors.totalPrice === 'string' && touched.totalPrice ? errors.totalPrice : null}
							as={TextField}
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
					<Grid xs={3} item>
						<Field
							name="costDelivery"
							placeholder="0"
							label="Стоимость доставки"
							as={TextField}
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
						{formEditable ? (
							<Grid alignItems="center" container>
								<Field
									type="checkbox"
									name="compensateCostDelivery"
									Label={{ label: 'Компенсировать' }}
									as={CheckboxWithLabel}
									disabled={isSubmitting || !formEditable}
								/>
								<Tooltip
									title={
										<div style={{ maxWidth: 200 }}>
											При наличии в закупке платных позиций, стоимость доставки будет включена в цену продажи этих позиций.
										</div>
									}
									placement="bottom-end"
								>
									<div className={styles.helpIcon}>
										<FontAwesomeIcon icon={['fal', 'question-circle']} fixedWidth />
									</div>
								</Tooltip>
							</Grid>
						) : null}
					</Grid>
				</Grid>

				<FieldArray name="receipts" validateOnChange={false}>
					{props => (
						<FormFieldArrayReceipts
							dialogRef={dialogRef}
							receiptInitialValues={receiptInitialValues}
							positions={positions}
							formEditable={formEditable}
							arrayHelpers={props}
							formikProps={{ errors, isSubmitting, setFieldValue, touched, values }}
						/>
					)}
				</FieldArray>
			</DialogContent>
			<DialogActions>
				<Grid spacing={2} container>
					{!formEditable ? (
						<Grid xs={3} item>
							<Button onClick={() => onHandleEditFormProcurement(true)} variant="outlined" size="large" fullWidth>
								Изменить закупку
							</Button>
						</Grid>
					) : null}
					<Grid xs={!formEditable ? 9 : 12} item>
						<Button
							type={formEditable ? 'submit' : 'button'}
							onClick={formEditable ? () => {} : submitForm}
							disabled={isSubmitting}
							variant="contained"
							color="primary"
							size="large"
							fullWidth
						>
							{isSubmitting ? <CircularProgress size={20} style={{ position: 'absolute' }} /> : null}
							<span className="loading-button-label" style={{ opacity: Number(!isSubmitting) }}>
								{!formEditable ? 'Занести на склад' : 'Проверить данные'}
							</span>
						</Button>
					</Grid>
				</Grid>
			</DialogActions>

			<Dropdown
				anchor={refDropdownDate}
				open={dropdownDate}
				onClose={() => onHandleDropdownDate(false)}
				placement="bottom"
				disablePortal={false}
			>
				<MuiPickersUtilsProvider utils={MomentUtils}>
					<DatePicker
						value={values.date}
						onChange={onChangeDate}
						variant="static"
						leftArrowButtonProps={{
							size: 'small',
						}}
						leftArrowIcon={<FontAwesomeIcon icon={['far', 'angle-left']} />}
						rightArrowButtonProps={{
							size: 'small',
						}}
						rightArrowIcon={<FontAwesomeIcon icon={['far', 'angle-right']} />}
						disableFuture
						disableToolbar
					/>
				</MuiPickersUtilsProvider>
			</Dropdown>
		</Form>
	);
};

export default FormProcurementCreate;
