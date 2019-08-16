import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
		value: 1,
		label: '1 см',
	},
	{
		value: 2,
	},
	{
		value: 3,
	},
	{
		value: 4,
	},
	{
		value: 5,
	},
	{
		value: 6,
	},
	{
		value: 7,
	},
	{
		value: 8,
	},
	{
		value: 9,
	},
	{
		value: 10,
		label: '10 см',
	},
];

class ProductOrMarkerQRCodePrint extends Component {
	static propTypes = {
		dialogOpen: PropTypes.bool.isRequired,
		onCloseDialog: PropTypes.func.isRequired,
		dataType: PropTypes.oneOf(['product', 'marker']),
		QRCodeData: PropTypes.object.isRequired,
		selectedProduct: PropTypes.object,
		selectedMarker: PropTypes.object,
	};

	initialState = {
		QRCodeDataUrl: null,
		QRCodeSize: 5,
		pixelsPerCentimeter: 38 + 5,
	};

	state = this.initialState;

	setQRCodeSize = (event, newValue) => {
		const { QRCodeSize } = this.state;

		if (newValue !== QRCodeSize) {
			this.setState({ QRCodeSize: newValue }, this.generateQRCode);
		}
	};

	generateQRCode = async () => {
		const { QRCodeData } = this.props;
		const { QRCodeSize, pixelsPerCentimeter } = this.state;

		const url = await QRCode.toDataURL(JSON.stringify(QRCodeData), {
			margin: 0,
			width: QRCodeSize * pixelsPerCentimeter * (QRCodeSize > 1 ? 2 : 4),
		});

		this.setState({ QRCodeDataUrl: url });
	};

	onGenerateAndSavePDF = (actions, values) => {
		const { QRCodeDataUrl, QRCodeSize } = this.state;
		// const { quantity } = values;
		const doc = new jsPDF();

		// let currentPage = 0;

		// doc.addPage();

		doc.addImage(QRCodeDataUrl, 'JPEG', 0, 0, QRCodeSize * 10, QRCodeSize * 10);

		// for (let i = 0; i < quantity; i++) {
		// 	let y = 6;
		// 	let x = 0;
		// 	let QRCodeSize = 25;
		// 	let columns = Math.floor(210 / QRCodeSize);
		// 	let rowsPerPage = Math.floor((297 - y) / QRCodeSize);
		// 	let pagesPerProduct = Math.ceil(y / QRCodeSize / rowsPerPage);
		//
		//   if (i % columns === 0 && i !== 0) y += QRCodeSize;
		//
		//   if (i % columns === 0) x = 0;
		//   else x += QRCodeSize;
		//
		// 	y = 6;
		// 	x = 0;
		//
		// 	// for (let p = 0; p < pagesPerProduct; p++) {
		// 	// 	if (p > 0) doc.addPage();
		// 	// }
		//
		// 	currentPage += 1;
		//
		// 	doc.setPage(currentPage);
		// 	doc.setFontSize(10);
		// 	doc.text(3, 6, products[p]._id, { align: 'left' });
		//
		// 	for (let i = 0; i < products[p].quantity; i++) {
		// 		if (i % columns === 0 && i !== 0) y += QRCodeSize;
		//
		// 		if (i % columns === 0) x = 0;
		// 		else x += QRCodeSize;
		//
		// 		doc.addImage(products[p].dataUrl, 'JPEG', x, y, QRCodeSize, QRCodeSize);
		//
		// 		console.log(Math.ceil(y / QRCodeSize / rowsPerPage), Math.ceil(y / QRCodeSize));
		//
		// 		doc.setPage(Math.ceil(y / QRCodeSize / rowsPerPage));
		//
		// 		if (Math.ceil(y / QRCodeSize) > rowsPerPage) {
		// 			y = 6;
		// 			x = 0;
		// 		}
		// 	}
		// }

		doc.save(`product_qr_${+new Date()}.pdf`);

		actions.setSubmitting(false);
	};

	onExitedDialog = () => {
		const { onExitedDialog } = this.props;

		this.setState(this.initialState, () => {
			if (onExitedDialog) onExitedDialog();
		});
	};

	// componentDidMount() {
	// 	this.setState({ isMounted: true });
	// 	console.log(this.props);
	//
	// 	this.generateQRCode();
	// }

	render() {
		const { dialogOpen, onCloseDialog, dataType, selectedProduct, selectedMarker } = this.props;
		const { QRCodeDataUrl, QRCodeSize, pixelsPerCentimeter } = this.state;

		if (!QRCodeDataUrl && (selectedProduct || selectedMarker)) this.generateQRCode();

		return (
			<PDDialog open={dialogOpen} onClose={onCloseDialog} onExited={this.onExitedDialog} maxWidth="md" scroll="body" stickyActions>
				<PDDialogTitle theme="primary" onClose={onCloseDialog}>
					Печать QR-кода
				</PDDialogTitle>
				<Formik
					initialValues={{ quantity: '' }}
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
										if (dataType === 'marker' && value > selectedMarker.quantity) {
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
									getAriaValueText={value => `${value} см`}
									onChange={this.setQRCodeSize}
									aria-labelledby="discrete-slider-custom"
									step={1}
									valueLabelDisplay="auto"
									marks={marks}
									min={1}
									max={10}
								/>

								<div style={{ textAlign: 'center', marginBottom: 10 }}>
									{selectedProduct ? <div>{selectedProduct.name}</div> : null}
									{selectedMarker ? <div>{selectedMarker.mainCharacteristic.label}</div> : null}
								</div>
								<div style={{ alignItems: 'center', display: 'flex', height: 428, justifyContent: 'center' }}>
									<img src={QRCodeDataUrl} width={QRCodeSize * pixelsPerCentimeter} height={QRCodeSize * pixelsPerCentimeter} alt="" />
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

export default ProductOrMarkerQRCodePrint;
