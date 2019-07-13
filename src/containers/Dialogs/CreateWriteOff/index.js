import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ClassNames from 'classnames';

import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import * as Yup from 'yup';

import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';

import { PDDialog, PDDialogActions, PDDialogTitle } from 'src/components/Dialog';

import { getStockStatus } from 'src/actions/stocks';
import { createWriteOff } from 'src/actions/writeOffs';

import './index.styl';

const writeOffSchema = Yup.object().shape({
	productId: Yup.string().required('Обязательное поле'),
	quantity: Yup.number()
		// eslint-disable-next-line
		.min(1, 'Введите расход')
		// eslint-disable-next-line
		.required('Обязательное поле'),
});

class CreateWriteOff extends Component {
	static propTypes = {
		dialogOpen: PropTypes.bool.isRequired,
		onCloseDialog: PropTypes.func.isRequired,
		currentStock: PropTypes.object.isRequired,
	};

	render() {
		const {
			dialogOpen,
			onCloseDialog,
			currentUser,
			products: {
				data: products,
				isFetching: isLoadingProducts,
				// error: errorProducts
			},
		} = this.props;

		const rowClasses = (productId, selectedProductId) =>
			ClassNames({
				'dialog-create-write-off__row': true,
				'dialog-create-write-off__row_selected': productId === selectedProductId,
			});

		return (
			<PDDialog open={dialogOpen} onClose={onCloseDialog} maxWidth="lg" fullWidth scroll="body" stickyActions>
				<PDDialogTitle theme="primary" onClose={onCloseDialog}>
					Выбор позиции для расхода
				</PDDialogTitle>
				<Formik
					initialValues={{ productId: '', quantity: 0 }}
					validationSchema={writeOffSchema}
					validateOnBlur={false}
					validateOnChange={false}
					onSubmit={(values, actions) => {
						this.props.createWriteOff(currentUser._id, values).then(response => {
							if (response.status === 'success') {
								this.props.getStockStatus();
								onCloseDialog();
							} else actions.setSubmitting(false);
						});
					}}
					render={({ errors, touched, isSubmitting, values, setFieldValue, setFieldError }) => (
						<Form>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>Наименование</TableCell>
										<TableCell width="130px">Количество</TableCell>
										<TableCell width="160px" />
									</TableRow>
								</TableHead>
								<TableBody>
									{!isLoadingProducts ? (
										products && products.length ? (
											products.map(product => (
												<TableRow
													key={product._id}
													className={rowClasses(product._id, values.productId)}
													onClick={() => {
														if (product._id !== values.productId) {
															setFieldError('quantity');
															setFieldValue('productId', product._id);
															setFieldValue('quantity', 0);
														}
													}}
												>
													<TableCell className="dialog-create-write-off__cell dialog-create-write-off__cell_name">
														{product.name}
													</TableCell>
													<TableCell className="dialog-create-write-off__cell">{product.quantity}</TableCell>
													<TableCell className="dialog-create-write-off__cell" align="right">
														{product._id === values.productId ? (
															<Field
																name="quantity"
																type="number"
																component={TextField}
																InputLabelProps={{
																	shrink: true,
																}}
																autoComplete="off"
																validate={value => {
																	if (value > product.quantity) {
																		return `Максимум для расхода: ${product.quantity}`;
																	}
																}}
																fullWidth
																autoFocus
															/>
														) : null}
													</TableCell>
												</TableRow>
											))
										) : (
											<TableRow>
												<TableCell colSpan={5}>
													<Typography variant="caption" align="center" component="div" style={{ padding: '1px 0' }}>
														Еще не создано ни одной позиции.
													</Typography>
												</TableCell>
											</TableRow>
										)
									) : (
										<TableRow>
											<TableCell colSpan={5} style={{ padding: 12 }}>
												<div children={<CircularProgress size={20} />} style={{ textAlign: 'center' }} />
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
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
										disabled: isSubmitting || !values.productId,
									},
									text: isSubmitting ? <CircularProgress size={20} /> : 'Записать расход',
								}}
							/>
						</Form>
					)}
				/>
			</PDDialog>
		);
	}
}

const mapStateToProps = state => {
	return {
		currentUser: state.user.data,
		products: state.products,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentStock, selectedUserId } = ownProps;

	return {
		getStockStatus: () => dispatch(getStockStatus(currentStock._id)),
		createWriteOff: (userId, values) => dispatch(createWriteOff(currentStock._id, userId, selectedUserId, values)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CreateWriteOff);
