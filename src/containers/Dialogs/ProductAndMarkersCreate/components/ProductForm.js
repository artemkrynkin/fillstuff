import React from 'react';
import PropTypes from 'prop-types';

import { Formik, Form, Field } from 'formik';
import { TextField, Select, CheckboxWithLabel } from 'formik-material-ui';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CircularProgress from '@material-ui/core/CircularProgress';
import MenuItem from '@material-ui/core/MenuItem';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Fade from '@material-ui/core/Fade';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';

import { PDDialogActions } from 'src/components/Dialog';

import { productSchema } from './FormScheme';

const ProductForm = props => {
	const { onCloseDialog, currentStock, initialValuesFrom, onSubmit } = props;

	const initialValues = initialValuesFrom || {
		name: '',
		stock: currentStock._id,
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
			render={({ errors, isSubmitting, values }) => (
				<Form>
					<DialogContent>
						<Grid
							className="pd-rowGridFormLabelControl"
							style={{ marginBottom: 12 }}
							wrap="nowrap"
							alignItems="flex-start"
							container
						>
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
								<Field
									name="receiptUnits"
									component={Select}
									IconComponent={() => <FontAwesomeIcon icon={['far', 'angle-down']} className="pd-selectIcon" />}
									error={Boolean(errors.receiptUnits)}
									MenuProps={{
										elevation: 2,
										transitionDuration: 150,
										TransitionComponent: Fade,
									}}
									displayEmpty
								>
									<MenuItem value="" disabled>
										Выберите
									</MenuItem>
									<MenuItem value="pce">Штука</MenuItem>
									<MenuItem value="nmp">Упаковка</MenuItem>
								</Field>
								{Boolean(errors.receiptUnits) ? <FormHelperText error>{errors.receiptUnits}</FormHelperText> : null}
							</FormControl>
						</Grid>

						{values.receiptUnits === 'nmp' ? (
							<Grid className="pd-rowGridFormLabelControl" wrap="nowrap" alignItems="flex-start" container>
								<InputLabel error={Boolean(errors.unitIssue)} style={{ minWidth: 146 }}>
									Единица отпуска:
								</InputLabel>
								<FormControl fullWidth>
									<Field
										name="unitIssue"
										component={Select}
										IconComponent={() => <FontAwesomeIcon icon={['far', 'angle-down']} className="pd-selectIcon" />}
										error={Boolean(errors.unitIssue)}
										MenuProps={{
											elevation: 2,
											transitionDuration: 150,
											TransitionComponent: Fade,
										}}
										displayEmpty
									>
										<MenuItem value="" disabled>
											Выберите
										</MenuItem>
										<MenuItem value="pce">Штука</MenuItem>
										<MenuItem value="nmp">Упаковка</MenuItem>
									</Field>
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
								type: 'submit',
								disabled: isSubmitting,
							},
							text: isSubmitting ? <CircularProgress size={20} /> : 'Добавить маркер',
							iconRight: !isSubmitting ? (
								<FontAwesomeIcon icon={['far', 'angle-right']} style={{ fontSize: 22, marginTop: 2 }} />
							) : null,
						}}
					/>
				</Form>
			)}
		/>
	);
};

ProductForm.propTypes = {
	initialValuesFrom: PropTypes.object,
	onSubmit: PropTypes.func.isRequired,
};

export default ProductForm;
