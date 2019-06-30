import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Formik, Form, Field } from 'formik';
import { Select, TextField } from 'formik-material-ui';
import * as Yup from 'yup';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CircularProgress from '@material-ui/core/CircularProgress';
import MenuItem from '@material-ui/core/MenuItem';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Fade from '@material-ui/core/Fade';
import FormHelperText from '@material-ui/core/FormHelperText';
import Dialog from '@material-ui/core/Dialog';

import { PDDialogActions, PDDialogTitle } from 'src/components/Dialog';

import { createProduct, editProduct } from 'src/actions/products';

const productSchema = Yup.object().shape({
	name: Yup.string()
		// eslint-disable-next-line
		.min(2, 'Наименование товара не может быть короче ${min} символов')
		// eslint-disable-next-line
		.max(100, 'Наименование товара не может превышать ${max} символов')
		.required('Обязательное поле'),
	amount: Yup.number()
		// eslint-disable-next-line
		.min(0, 'Количество не может быть меньше ${min}')
		// eslint-disable-next-line
		.required('Обязательное поле'),
	purchasePrice: Yup.number()
		// eslint-disable-next-line
		.min(0, 'Цена закупки не может быть меньше ${min}')
		// eslint-disable-next-line
		.required('Обязательное поле'),
	sellingPrice: Yup.number()
		// eslint-disable-next-line
		.min(0, 'Цена продажи не может быть меньше ${min}')
		// eslint-disable-next-line
		.required('Обязательное поле'),
	unit: Yup.string()
		.oneOf(['pce', 'nmp', 'npl', 'bot'], 'Значение отсутствует в списке доступных ролей')
		.required('Обязательное поле'),
	minimumBalance: Yup.number()
		// eslint-disable-next-line
		.min(1, 'Неснижаемый остаток не может быть меньше ${min}')
		// eslint-disable-next-line
		.required('Обязательное поле'),
});

class CreateEditProduct extends Component {
	static propTypes = {
		actionType: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.object.isRequired]),
		dialogOpen: PropTypes.bool.isRequired,
		selectedData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
		onCloseDialog: PropTypes.func.isRequired,
		currentStock: PropTypes.object.isRequired,
	};

	static defaultProps = {
		actionType: null,
	};

	render() {
		const { actionType, dialogOpen, selectedProduct, onCloseDialog, currentStock } = this.props;

		const initialValues = {
			name: '',
			categoryId: '',
			amount: 0,
			purchasePrice: 0,
			sellingPrice: 0,
			unit: '',
			minimumBalance: 0,
			shop: '',
		};

		return (
			<Dialog open={dialogOpen} onClose={onCloseDialog} maxWidth="lg" fullWidth scroll="body">
				<PDDialogTitle theme="primary" onClose={onCloseDialog}>
					{actionType === 'create' ? 'Добавление новой позиции' : 'Редактирование позиции'}
				</PDDialogTitle>
				<Formik
					initialValues={actionType === 'create' ? initialValues : selectedProduct}
					validationSchema={productSchema}
					validateOnBlur={false}
					validateOnChange={false}
					onSubmit={(values, actions) => {
						if (actionType === 'create') {
							this.props.createProduct(values).then(response => {
								if (response.status === 'success') onCloseDialog();
								else actions.setSubmitting(false);
							});
						}

						if (actionType === 'edit') {
							this.props.editProduct(selectedProduct._id, values).then(response => {
								if (response.status === 'success') onCloseDialog();
								else actions.setSubmitting(false);
							});
						}
					}}
					render={({ errors, touched, isSubmitting, values }) => (
						<Form>
							<DialogContent>
								<Grid className="pd-rowGridFormLabelControl" container={false}>
									<Field
										name="name"
										label="Наименование"
										component={TextField}
										InputLabelProps={{
											shrink: true,
										}}
										autoComplete="off"
										autoFocus
										fullWidth
									/>
								</Grid>
								<Grid className="pd-rowGridFormLabelControl" container>
									<FormControl fullWidth>
										<InputLabel error={Boolean(errors.categoryId)} shrink>
											Категория
										</InputLabel>
										<Field
											name="categoryId"
											component={Select}
											IconComponent={() => <FontAwesomeIcon icon={['far', 'angle-down']} className="pd-selectIcon" />}
											error={Boolean(errors.categoryId)}
											MenuProps={{
												elevation: 2,
												transitionDuration: 150,
												TransitionComponent: Fade,
											}}
											displayEmpty
											disabled={!currentStock.categories.length}
										>
											<MenuItem value="">Без категории</MenuItem>
											{currentStock.categories.map((category, index) => {
												return (
													<MenuItem key={category._id} value={category._id}>
														{category.name}
													</MenuItem>
												);
											})}
										</Field>
										{Boolean(errors.categoryId) ? <FormHelperText error={true}>{errors.categoryId}</FormHelperText> : null}
									</FormControl>
								</Grid>
								<Grid className="pd-rowGridFormLabelControl" style={{ marginBottom: 12 }} container spacing={2}>
									<Grid xs={4} item>
										<FormControl fullWidth>
											<InputLabel error={Boolean(errors.unit)} shrink>
												Единица измерения
											</InputLabel>
											<Field
												name="unit"
												component={Select}
												IconComponent={() => <FontAwesomeIcon icon={['far', 'angle-down']} className="pd-selectIcon" />}
												error={Boolean(errors.unit)}
												MenuProps={{
													elevation: 2,
													transitionDuration: 150,
													TransitionComponent: Fade,
												}}
												displayEmpty
											>
												<MenuItem value="" disabled>
													Выберите ед. изм.
												</MenuItem>
												<MenuItem value="pce">Штука</MenuItem>
												<MenuItem value="nmp">Упаковка</MenuItem>
												<MenuItem value="npl">Рулон</MenuItem>
												<MenuItem value="bot">Бутыль</MenuItem>
											</Field>
											{Boolean(errors.unit) ? <FormHelperText error={true}>{errors.unit}</FormHelperText> : null}
										</FormControl>
									</Grid>
									<Grid xs={4} item>
										<Field
											name="amount"
											type="number"
											label="Количество"
											component={TextField}
											InputLabelProps={{
												shrink: true,
											}}
											autoComplete="off"
											fullWidth
										/>
									</Grid>
									<Grid xs={4} item>
										<Field
											name="minimumBalance"
											type="number"
											label="Неснижаемый остаток"
											component={TextField}
											InputLabelProps={{
												shrink: true,
											}}
											autoComplete="off"
											fullWidth
										/>
									</Grid>
								</Grid>
								<Grid className="pd-rowGridFormLabelControl" style={{ marginBottom: -8 }} container spacing={2}>
									<Grid xs={6} item>
										<Field
											name="purchasePrice"
											type="number"
											label="Цена закупки"
											component={TextField}
											InputLabelProps={{
												shrink: true,
											}}
											autoComplete="off"
											fullWidth
										/>
									</Grid>
									<Grid xs={6} item>
										<Field
											name="sellingPrice"
											type="number"
											label="Цена продажи"
											component={TextField}
											InputLabelProps={{
												shrink: true,
											}}
											autoComplete="off"
											fullWidth
										/>
									</Grid>
								</Grid>
							</DialogContent>
							<PDDialogActions
								leftHandleProps={{
									handleProps: {
										onClick: onCloseDialog,
									},
									text: 'Закрыть',
								}}
								rightHandleProps={{
									handleProps: {
										type: 'submit',
										disabled: isSubmitting,
									},
									text: isSubmitting ? <CircularProgress size={20} /> : 'Сохранить',
								}}
							/>
						</Form>
					)}
				/>
			</Dialog>
		);
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentStock } = ownProps;

	return {
		createProduct: values => dispatch(createProduct(currentStock._id, values)),
		editProduct: (productId, newValues) => dispatch(editProduct(productId, newValues)),
	};
};

export default connect(
	null,
	mapDispatchToProps
)(CreateEditProduct);
