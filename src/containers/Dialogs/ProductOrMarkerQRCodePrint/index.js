import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import * as Yup from 'yup';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

import CircularProgress from '@material-ui/core/CircularProgress';
import { DialogContent } from '@material-ui/core';
import Slider from '@material-ui/core/Slider';

import { PDDialog, PDDialogActions, PDDialogTitle } from 'src/components/Dialog';

import './index.styl';

const ProductOrMarkerQRCodePrintSchema = Yup.object().shape({
	quantity: Yup.number()
		.min(1, 'Введите количество')
		.required(),
});

const marks = [
	{
		value: 10,
		label: '10 мм',
	},
	{
		value: 20,
	},
	{
		value: 30,
	},
	{
		value: 40,
	},
	{
		value: 50,
	},
	{
		value: 60,
	},
	{
		value: 70,
	},
	{
		value: 80,
	},
	{
		value: 90,
	},
	{
		value: 100,
		label: '100 мм',
	},
];

const initialState = {
	QRCodeDataUrl: null,
	QRCodeSize: 50,
	pixelsPerMillimeter: 3.793627,
};

class ProductOrMarkerQRCodePrint extends Component {
	static propTypes = {
		dialogOpen: PropTypes.bool.isRequired,
		onCloseDialog: PropTypes.func.isRequired,
		currentStock: PropTypes.object.isRequired,
		actionType: PropTypes.oneOfType([PropTypes.object.isRequired, PropTypes.string.isRequired]),
		selectedProduct: PropTypes.object,
		selectedMarker: PropTypes.object,
	};

	state = initialState;

	setQRCodeSize = (event, newValue) => {
		this.generateQRCode();

		this.setState({ QRCodeSize: newValue });
	};

	generateQRCode = () => {
		const { actionType, selectedProduct, selectedMarker } = this.props;
		const { QRCodeSize, pixelsPerMillimeter } = this.state;

		console.log(actionType);

		const generateData = {
			type: actionType,
			[`${actionType}Id`]: actionType === 'product' ? selectedProduct._id : actionType === 'marker' ? selectedMarker._id : null,
		};

		QRCode.toDataURL(JSON.stringify(generateData), {
			margin: 0,
			width: QRCodeSize * pixelsPerMillimeter * 2,
		})
			.then(url => {
				this.setState({ QRCodeDataUrl: url });
			})
			.catch(err => {
				console.error(err);
			});
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

	onExitedDialog = () => {
		const { onExitedDialog } = this.props;

		this.setState(initialState);

		onExitedDialog();
	};

	render() {
		const { dialogOpen, onCloseDialog, actionType, selectedProduct, selectedMarker } = this.props;
		const { QRCodeDataUrl, QRCodeSize, pixelsPerMillimeter } = this.state;

		if (!actionType) return null;
		if (actionType === 'product' && !selectedProduct) return null;
		if (actionType === 'marker' && !selectedProduct && !selectedMarker) return null;

		if (!QRCodeDataUrl) {
			this.generateQRCode();
		}

		return (
			<PDDialog
				open={dialogOpen}
				onClose={onCloseDialog}
				onExited={this.onExitedDialog}
				maxWidth="md"
				scroll="body"
				stickyTitle
				stickyActions
			>
				<PDDialogTitle theme="primary" onClose={onCloseDialog}>
					Печать QR-кода
				</PDDialogTitle>
				<Formik
					initialValues={{ quantity: 1 }}
					validationSchema={ProductOrMarkerQRCodePrintSchema}
					validateOnBlur={false}
					validateOnChange={false}
					onSubmit={(values, actions) => this.onGenerateAndSavePDF(actions, values)}
					render={({ errors, touched, isSubmitting, values }) => (
						<Form>
							<DialogContent>
								<Field
									name="quantity"
									type="number"
									component={TextField}
									InputLabelProps={{
										shrink: true,
									}}
									autoComplete="off"
									validate={value => {
										if (value > selectedMarker.quantity) {
											return `Максимум для списания: ${selectedMarker.quantity}`;
										}
									}}
									fullWidth
									autoFocus
								/>
								<br />
								<br />
								<Slider
									defaultValue={QRCodeSize}
									getAriaValueText={value => `${value} мм`}
									onChange={this.setQRCodeSize}
									aria-labelledby="discrete-slider-custom"
									step={10}
									valueLabelDisplay="auto"
									marks={marks}
									min={10}
									max={100}
								/>

								<div style={{ textAlign: 'center', marginBottom: 10 }}>
									{selectedProduct ? <div>{selectedProduct.name}</div> : null}
									{selectedMarker ? <div>{selectedMarker.mainCharacteristic.label}</div> : null}
								</div>
								<div style={{ alignItems: 'center', display: 'flex', height: 380, justifyContent: 'center' }}>
									<img src={QRCodeDataUrl} width={QRCodeSize * pixelsPerMillimeter} alt="" />
								</div>
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
									text: isSubmitting ? <CircularProgress size={20} /> : 'Печать',
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
	};
};

export default connect(
	mapStateToProps,
	null
)(ProductOrMarkerQRCodePrint);
