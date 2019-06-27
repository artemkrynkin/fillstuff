import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Formik, Form, Field } from 'formik';
import { Select, TextField } from 'formik-material-ui';
import * as Yup from 'yup';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
// import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';

import { PDDialogActions, PDDialogTitle } from 'src/components/Dialog';
import TitlePageOrLogo from './TitlePageOrLogo';

import { createProduct } from 'src/actions/products';

const createProductSchema = Yup.object().shape({
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
});

class CLProjectPublications extends Component {
	state = {
		dialogCreateProduct: false,
	};

	onOpenDialogCreateProduct = () => {
		this.setState({
			dialogCreateProduct: true,
		});
	};

	onCloseDialogCreateProduct = () => {
		this.setState({
			dialogCreateProduct: false,
		});
	};

	render() {
		const {
			pageTitle,
			theme,
			// currentUser,
			currentStock,
		} = this.props;
		const { dialogCreateProduct } = this.state;

		return (
			<div className="header__column_left">
				<TitlePageOrLogo pageTitle={pageTitle} theme={theme} />
				<div className="header__column-group_left">
					<Button
						className="mui-btn-ct400"
						variant="contained"
						color="primary"
						style={{ marginRight: 8 }}
						onClick={this.onOpenDialogCreateProduct}
					>
						<FontAwesomeIcon icon={['far', 'plus']} />
						&nbsp;&nbsp;Товар
					</Button>
					<Button className="mui-btn-ct400" variant="contained" color="primary">
						<FontAwesomeIcon icon={['fal', 'qrcode']} />
						&nbsp;&nbsp;Печать QR-кодов
					</Button>
				</div>

				<Dialog open={dialogCreateProduct} onClose={this.onCloseDialogCreateProduct} maxWidth="lg" fullWidth>
					<PDDialogTitle theme="primary" onClose={this.onCloseDialogCreateProduct}>
						Добавление нового товара
					</PDDialogTitle>
					<Formik
						initialValues={{
							name: '',
							amount: 0,
							purchasePrice: 0,
							sellingPrice: 0,
							categoryId: '',
						}}
						validationSchema={createProductSchema}
						validateOnBlur={false}
						validateOnChange={false}
						onSubmit={(values, actions) => {
							this.props.createProduct(values).then(response => {
								if (response.status === 'success') this.onCloseDialogCreateProduct();
								else actions.setSubmitting(false);
							});
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
									<Grid className="pd-rowGridFormLabelControl" container spacing={2}>
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
										<Grid xs={4} item>
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
									<Grid className="pd-rowGridFormLabelControl" style={{ marginBottom: 0 }} container>
										<FormControl fullWidth>
											<InputLabel shrink>Категория:</InputLabel>
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
								</DialogContent>
								<PDDialogActions
									leftHandleProps={{
										handleProps: {
											onClick: this.onCloseDialogCreateProduct,
										},
										text: 'Закрыть',
									}}
									rightHandleProps={{
										handleProps: {
											type: 'submit',
											disabled: isSubmitting,
										},
										text: isSubmitting ? <CircularProgress size={20} /> : 'Добавить',
									}}
								/>
							</Form>
						)}
					/>
				</Dialog>
			</div>
		);
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentStock } = ownProps;

	return {
		createProduct: values => dispatch(createProduct(currentStock._id, values)),
	};
};

export default connect(
	null,
	mapDispatchToProps
)(CLProjectPublications);
