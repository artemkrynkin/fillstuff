import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ClassNames from 'classnames';

import { Formik, Form, Field, FieldArray } from 'formik';
import { TextField } from 'formik-material-ui';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';

import { PDDialog, PDDialogActions, PDDialogTitle } from 'src/components/Dialog';

import { getStockStatus } from 'src/actions/stocks';
import { getProducts } from 'src/actions/products';
import { createWriteOff } from 'src/actions/writeOffs';

import './index.styl';

class PrintQRCodesProduct extends Component {
	static propTypes = {
		dialogOpen: PropTypes.bool.isRequired,
		onCloseDialog: PropTypes.func.isRequired,
		currentStock: PropTypes.object.isRequired,
	};

	checkSelection = (products, productId) => {
		return products.some(product => product._id === productId);
	};

	findProductIndex = (products, findingProductId) => {
		return products.findIndex(product => product._id === findingProductId);
	};

	onSelectProduct = (arrayHelpers, products, product) => {
		const productIndex = this.findProductIndex(products, product._id);

		if (!!~productIndex) return arrayHelpers.remove(productIndex);
		else {
			QRCode.toDataURL(
				JSON.stringify({
					type: 'product',
					productId: product._id,
				}),
				{
					margin: 10,
					width: 1000,
				}
			)
				.then(url => {
					arrayHelpers.push({ _id: product._id, name: product.name, dataUrl: url, quantity: 0 });
				})
				.catch(err => {
					console.error(err);
				});
		}
	};

	onGenerateAndSavePDF = (actions, products) => {
		const doc = new jsPDF();

		let currentPage = 0;

		if (products.length > 1) {
			for (let p = 0; p < products.length; p++) {
				if (p > 0) doc.addPage();
			}
		}

		for (let p = 0; p < products.length; p++) {
			let y = 6;
			let x = 0;
			let QRCodeSize = 25;
			let columns = Math.floor(210 / QRCodeSize);
			let rowsPerPage = Math.floor((297 - y) / QRCodeSize);
			let pagesPerProduct = 0;

			for (let i = 0; i < products[p].quantity; i++) {
				pagesPerProduct = Math.ceil(y / QRCodeSize / rowsPerPage);

				if (i % columns === 0 && i !== 0) y += QRCodeSize;

				if (i % columns === 0) x = 0;
				else x += QRCodeSize;
			}

			y = 6;
			x = 0;

			for (let p = 0; p < pagesPerProduct; p++) {
				if (p > 0) doc.addPage();
			}

			currentPage += 1;

			doc.setPage(currentPage);
			doc.setFontSize(10);
			doc.text(3, 6, products[p]._id, { align: 'left' });

			for (let i = 0; i < products[p].quantity; i++) {
				if (i % columns === 0 && i !== 0) y += QRCodeSize;

				if (i % columns === 0) x = 0;
				else x += QRCodeSize;

				doc.addImage(products[p].dataUrl, 'JPEG', x, y, QRCodeSize, QRCodeSize);

				console.log(Math.ceil(y / QRCodeSize / rowsPerPage), Math.ceil(y / QRCodeSize));

				doc.setPage(Math.ceil(y / QRCodeSize / rowsPerPage));

				if (Math.ceil(y / QRCodeSize) > rowsPerPage) {
					y = 6;
					x = 0;
				}
			}
		}

		doc.save(`product_qr_codes_${+new Date()}.pdf`);

		actions.setSubmitting(false);
	};

	render() {
		const {
			dialogOpen,
			onCloseDialog,
			products: {
				data: products,
				isFetching: isLoadingProducts,
				// error: errorProducts
			},
		} = this.props;

		const rowClasses = (products, productId) =>
			ClassNames({
				'dialog-print-qr-codes-product__row': true,
				'dialog-print-qr-codes-product__row_selected': this.checkSelection(products, productId),
			});

		return (
			<PDDialog open={dialogOpen} onClose={onCloseDialog} maxWidth="lg" fullWidth scroll="body" stickyActions>
				<PDDialogTitle theme="primary" onClose={onCloseDialog}>
					Выбор позиций для печати QR-кодов
				</PDDialogTitle>
				<Formik
					initialValues={{ products: [] }}
					validateOnBlur={false}
					// validateOnChange={false}
					onSubmit={(values, actions) => {
						this.onGenerateAndSavePDF(actions, values.products);
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
											<FieldArray
												name="products"
												render={arrayHelpers =>
													products.map((product, index) => (
														<TableRow key={product._id} className={rowClasses(values.products, product._id)}>
															<TableCell
																className="dialog-print-qr-codes-product__cell dialog-print-qr-codes-product__cell_name"
																onClick={() => this.onSelectProduct(arrayHelpers, values.products, product)}
															>
																{product.name}
															</TableCell>
															<TableCell
																className="dialog-print-qr-codes-product__cell"
																onClick={() => this.onSelectProduct(arrayHelpers, values.products, product)}
															>
																{product.quantity}
															</TableCell>
															<TableCell
																className="dialog-print-qr-codes-product__cell"
																align="right"
																onClick={() => {
																	if (!this.checkSelection(values.products, product._id)) {
																		this.onSelectProduct(arrayHelpers, values.products, product);
																	}
																}}
															>
																{this.checkSelection(values.products, product._id) ? (
																	<Field
																		name={`products[${this.findProductIndex(values.products, product._id)}].quantity`}
																		type="number"
																		component={TextField}
																		InputLabelProps={{
																			shrink: true,
																		}}
																		autoComplete="off"
																		validate={value => {
																			if (value === 0 || value === '') return 'Обязательное поле';
																		}}
																		fullWidth
																		autoFocus
																	/>
																) : null}
															</TableCell>
														</TableRow>
													))
												}
											/>
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
										disabled: isSubmitting || !values.products.length,
									},
									text: isSubmitting ? <CircularProgress size={20} /> : 'Дальше',
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
		getProducts: () => dispatch(getProducts(currentStock._id)),
		createWriteOff: (userId, values) => dispatch(createWriteOff(currentStock._id, userId, selectedUserId, values)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PrintQRCodesProduct);
