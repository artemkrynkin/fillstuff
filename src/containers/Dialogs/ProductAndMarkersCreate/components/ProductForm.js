import React from 'react';
import PropTypes from 'prop-types';

import { Formik, Form, Field } from 'formik';
import { TextField, CheckboxWithLabel } from 'formik-material-ui';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CircularProgress from '@material-ui/core/CircularProgress';
import MenuItem from '@material-ui/core/MenuItem';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';

import { unitTypes, unitTypeTransform } from 'shared/checkProductAndMarkers';

import { PDDialogTitle, PDDialogActions } from 'src/components/Dialog';
import { CustomSelectField } from 'src/components/CustomSelectField';

import { productSchema } from './FormScheme';

const ProductForm = props => {
	const { onCloseDialog, saveProduct, onSubmit } = props;

	const initialValues = saveProduct || {
		name: '',
		dividedMarkers: true,
		receiptUnits: '',
		unitIssue: '',
		minimumBalance: '',
	};

	return (
		<Formik
			initialValues={initialValues}
			validationSchema={productSchema}
			validateOnBlur={false}
			validateOnChange={false}
			onSubmit={(values, actions) => onSubmit(values, actions)}
			render={({ errors, isSubmitting, values, handleSubmit }) => (
				<Form>
					<PDDialogTitle theme="primary" onClose={onCloseDialog}>
						Создание новой позиции
					</PDDialogTitle>
					<DialogContent>
						<Grid className="pd-rowGridFormLabelControl" style={{ marginBottom: 12 }} wrap="nowrap" alignItems="flex-start" container>
							<InputLabel error={Boolean(errors.name)} style={{ minWidth: 146 }}>
								Наименование:
							</InputLabel>
							<Field
								name="name"
								component={TextField}
								InputLabelProps={{
									shrink: true,
								}}
								autoComplete="off"
								autoFocus
								fullWidth
							/>
						</Grid>

						<Grid className="pd-rowGridFormLabelControl" style={{ marginBottom: 12, paddingLeft: 156 }}>
							<Grid>
								<Field
									name="dividedMarkers"
									Label={{ label: 'Считать маркеры раздельно' }}
									component={CheckboxWithLabel}
									color="primary"
									icon={<FontAwesomeIcon icon={['far', 'square']} />}
									checkedIcon={<FontAwesomeIcon icon={['fas', 'check-square']} />}
								/>
							</Grid>
						</Grid>

						<Grid className="pd-rowGridFormLabelControl" wrap="nowrap" alignItems="flex-start" container>
							<InputLabel error={Boolean(errors.receiptUnits)} style={{ minWidth: 146 }}>
								Единица поступления:
							</InputLabel>
							<FormControl fullWidth>
								<CustomSelectField name="receiptUnits" error={Boolean(errors.receiptUnits)} displayEmpty>
									<MenuItem value="" disabled>
										Выберите
									</MenuItem>
									{unitTypes.map((unitType, index) => (
										<MenuItem key={index} value={unitType}>
											{unitTypeTransform(unitType)}
										</MenuItem>
									))}
								</CustomSelectField>
								{Boolean(errors.receiptUnits) ? <FormHelperText error>{errors.receiptUnits}</FormHelperText> : null}
							</FormControl>
						</Grid>

						{values.receiptUnits === 'nmp' ? (
							<Grid className="pd-rowGridFormLabelControl" wrap="nowrap" alignItems="flex-start" container>
								<InputLabel error={Boolean(errors.unitIssue)} style={{ minWidth: 146 }}>
									Единица отпуска:
								</InputLabel>
								<FormControl fullWidth>
									<CustomSelectField name="unitIssue" error={Boolean(errors.unitIssue)} displayEmpty>
										<MenuItem value="" disabled>
											Выберите
										</MenuItem>
										{unitTypes.map((unitType, index) => (
											<MenuItem key={index} value={unitType}>
												{unitTypeTransform(unitType)}
											</MenuItem>
										))}
									</CustomSelectField>
									{Boolean(errors.unitIssue) ? <FormHelperText error>{errors.unitIssue}</FormHelperText> : null}
								</FormControl>
							</Grid>
						) : null}

						{!values.dividedMarkers ? (
							<Grid className="pd-rowGridFormLabelControl" wrap="nowrap" alignItems="flex-start" container>
								<InputLabel error={Boolean(errors.minimumBalance)} style={{ minWidth: 146 }}>
									Мин. остаток в {values.receiptUnits === 'nmp' && values.unitIssue !== 'pce' ? 'упаковках' : 'штуках'}:
								</InputLabel>
								<FormControl fullWidth>
									<Field
										name="minimumBalance"
										type="number"
										placeholder="0"
										component={TextField}
										InputLabelProps={{
											shrink: true,
										}}
										autoComplete="off"
										fullWidth
									/>
								</FormControl>
							</Grid>
						) : null}
					</DialogContent>
					<PDDialogActions
						leftHandleProps={{
							handleProps: {
								onClick: onCloseDialog,
							},
							text: 'Отмена',
						}}
						rightHandleProps={{
							handleProps: {
								onClick: handleSubmit,
								disabled: isSubmitting,
							},
							text: isSubmitting ? <CircularProgress size={20} /> : 'Добавить маркер',
							iconRight: !isSubmitting ? <FontAwesomeIcon icon={['far', 'angle-right']} style={{ fontSize: 22, marginTop: 2 }} /> : null,
						}}
					/>
				</Form>
			)}
		/>
	);
};

ProductForm.propTypes = {
	saveProduct: PropTypes.object,
	onSubmit: PropTypes.func.isRequired,
};

export default ProductForm;
