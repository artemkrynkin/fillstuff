import React, { useRef, useState } from 'react';
import { Form, Field, FastField, FieldArray } from 'formik';
import moment from 'moment';
import MomentUtils from '@date-io/moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { DatePicker } from '@material-ui/pickers';

import { declensionNumber } from 'src/helpers/utils';

import CheckboxWithLabel from 'src/components/CheckboxWithLabel';
import { DialogActions } from 'src/components/Dialog';
import NumberFormat, { currencyFormatInputProps } from 'src/components/NumberFormat';
import Dropdown from 'src/components/Dropdown';

import FormFieldArrayReceipts from './FormFieldArrayReceipts';

import stylesGlobal from 'src/styles/globals.module.css';
import styles from './index.module.css';

const FormProcurementCreate = props => {
	const {
		dialogRef,
		currentStudioId,
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
				{!formEditable ? (
					<div className={styles.correctData}>
						<Typography variant="h6" align="center">
							Введенные данные верны!
						</Typography>
						{sellingPositionCount ? (
							<Typography variant="body1" align="center">
								Для {declensionNumber(sellingPositionCount, ['позиции', 'позиций', 'позиций'], true)} цена продажи сформирована
								автоматически.
								<br />
								При необходимости отредактируйте цену продажи в ручную.
							</Typography>
						) : null}
					</div>
				) : null}
				<Grid style={{ marginBottom: 2 }} spacing={2} container>
					<Grid xs={4} item>
						<FastField
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
						<Grid className={stylesGlobal.formLabelControl} wrap="nowrap" alignItems="flex-start" style={{ marginBottom: 0 }} container>
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

						<Dropdown
							anchor={refDropdownDate}
							open={dropdownDate}
							onClose={() => onHandleDropdownDate(false)}
							placement="bottom"
							arrow={false}
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
					</Grid>
					<Grid xs={3} item>
						<FastField
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
									...currencyFormatInputProps,
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
									...currencyFormatInputProps,
								},
							}}
							disabled={isSubmitting || !formEditable}
							fullWidth
						/>
						{formEditable ? (
							<Field
								type="checkbox"
								name="compensateCostDelivery"
								Label={{
									label: (
										<div>
											Компенсировать
											<Tooltip
												title={
													<div style={{ maxWidth: 200 }}>
														При наличии в закупке позиций для продажи, стоимость доставки будет включена в цену продажи этих позиций
													</div>
												}
												placement="bottom-end"
											>
												<div className={styles.circleHelp}>
													<FontAwesomeIcon icon={['fal', 'question-circle']} fixedWidth />
												</div>
											</Tooltip>
										</div>
									),
								}}
								as={CheckboxWithLabel}
								disabled={isSubmitting || !formEditable}
							/>
						) : null}
					</Grid>
				</Grid>

				<FieldArray name="receipts" validateOnChange={false}>
					{props => (
						<FormFieldArrayReceipts
							dialogRef={dialogRef}
							currentStudioId={currentStudioId}
							receiptInitialValues={receiptInitialValues}
							positions={positions}
							formEditable={formEditable}
							arrayHelpers={props}
							formikProps={{ errors, isSubmitting, setFieldValue, touched, values }}
						/>
					)}
				</FieldArray>
			</DialogContent>
			<DialogActions
				leftHandleProps={
					!formEditable
						? {
								handleProps: {
									onClick: () => {
										onHandleEditFormProcurement(true);
									},
								},
								text: 'Изменить закупку',
						  }
						: {}
				}
				rightHandleProps={{
					handleProps: {
						onClick: () => submitForm(),
						disabled: isSubmitting,
					},
					text: !formEditable ? 'Занести на склад' : 'Проверить данные',
					isLoading: isSubmitting,
				}}
			/>
		</Form>
	);
};

export default FormProcurementCreate;
