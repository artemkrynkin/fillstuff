import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';

import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import QRCode from 'qrcode';

import { DialogContent } from '@material-ui/core';
import Slider from '@material-ui/core/Slider';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

import theme from 'shared/theme';
import { sleep } from 'shared/utils';

import { DialogSticky, DialogActions, DialogTitle } from 'src/components/Dialog';

import marks from './marks';

import stylesGlobal from 'src/styles/globals.module.css';
import styles from './index.module.css';

const QRCodeGenerationSchema = Yup.object().shape({
	quantity: Yup.number()
		.min(1, 'Введите количество')
		.required(),
});

const QRNameClasses = QRCodeSize =>
	ClassNames({
		[styles.qrName]: true,
		[styles.qrNameHide]: QRCodeSize <= 2,
	});

const QRCharacteristicsClasses = QRCodeSize =>
	ClassNames({
		[styles.qrCharacteristics]: true,
		[styles.qrCharacteristicsHide]: QRCodeSize <= 2,
	});

class DialogPositionOrGroupQRCodeGeneration extends Component {
	static propTypes = {
		dialogOpen: PropTypes.bool.isRequired,
		onCloseDialog: PropTypes.func.isRequired,
		type: PropTypes.oneOf(['positionGroup', 'position']),
		selectedPositionOrGroup: PropTypes.object,
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
		const { type, selectedPositionOrGroup } = this.props;
		const { QRCodeSize, pixelsPerCentimeter } = this.state;

		const url = await QRCode.toDataURL(
			JSON.stringify({
				type: type,
				id: selectedPositionOrGroup._id,
			}),
			{
				margin: 0,
				width: QRCodeSize * pixelsPerCentimeter * (QRCodeSize > 2 ? 2 : 5),
			}
		);

		this.setState({ QRCodeDataUrl: url });
	};

	onGenerateAndSavePDF = async (actions, values) => {
		const { type, selectedPositionOrGroup } = this.props;
		const { QRCodeDataUrl, QRCodeSize } = this.state;
		const QRSettings = marks[QRCodeSize - 1].settings;
		const { quantity } = values;

		if (!selectedPositionOrGroup) return;

		const PAGE_A4_W_PX = 595.28;
		const PAGE_A4_W_MM = 210;
		const PXX_PER_CM = (PAGE_A4_W_PX / PAGE_A4_W_MM) * 10;
		const PAGE_MARGINS = {
			left: 20,
			top: 15,
			right: 20,
			bottom: 15,
		};
		const QR_TABLE_WIDTH = QRCodeSize * PXX_PER_CM;
		const PDF_DOC_NAME = `${selectedPositionOrGroup.name}_${type}_qr_${+new Date()}.pdf`;

		pdfMake.vfs = pdfFonts.pdfMake.vfs;

		const contentGeneration = () => {
			const columnsPerQR = Math.floor((PAGE_A4_W_PX - (PAGE_MARGINS.left + PAGE_MARGINS.right)) / (QR_TABLE_WIDTH + 40));
			const rowsPerQR = Math.ceil(quantity / columnsPerQR);
			let content = [];
			let generatedQRs = 0;

			for (let row = 0; row < rowsPerQR; row++) {
				content.push({
					table: {
						widths: [],
						dontBreakRows: true,
						body: [[]],
					},
					layout: {
						paddingLeft: () => 20,
						paddingRight: () => 20,
						paddingTop: () => 20,
						paddingBottom: () => 20,
						hLineColor: (i, node) => theme.blueGrey.cBg100,
						vLineColor: (i, node) => theme.blueGrey.cBg100,
					},
				});

				for (let column = 0; column < columnsPerQR; column++) {
					let contentColumn = [];

					if (generatedQRs !== quantity) {
						if (QRCodeSize > 2)
							contentColumn.push({
								text: selectedPositionOrGroup.name,
								fontSize: QRSettings.fontSizePdf,
								bold: true,
								margin: [
									0,
									0,
									0,
									type === 'position' && selectedPositionOrGroup.characteristics.length ? QRSettings.marginPdf - 5 : QRSettings.marginPdf,
								],
								alignment: 'center',
							});

						if (type === 'position' && QRCodeSize > 2)
							contentColumn.push({
								text: selectedPositionOrGroup.characteristics.reduce(
									(fullCharacteristics, characteristic) => `${fullCharacteristics} ${characteristic.label}`,
									''
								),
								fontSize: QRSettings.fontSizePdf - 2,
								margin: [0, 0, 0, QRSettings.marginPdf],
								alignment: 'center',
							});

						contentColumn.push({
							image: QRCodeDataUrl,
							fit: [QR_TABLE_WIDTH, QR_TABLE_WIDTH],
							alignment: 'center',
						});

						generatedQRs += 1;
					} else {
						contentColumn = { text: '', border: [false, false, false, false] };
					}

					content[row].table.widths.push(QR_TABLE_WIDTH);
					content[row].table.body[0].push(contentColumn);
				}
			}

			return content;
		};

		const docDefinition = {
			pageMargins: Object.values(PAGE_MARGINS),
			content: contentGeneration(),
			defaultStyle: {
				pageSize: 'A4',
			},
		};

		await sleep(300);

		pdfMake.createPdf(docDefinition).download(PDF_DOC_NAME, async () => {
			actions.setSubmitting(false);
		});
	};

	onEnter = () => {
		const { selectedPositionOrGroup } = this.props;
		const { QRCodeDataUrl } = this.state;

		if (!QRCodeDataUrl && selectedPositionOrGroup) this.generateQRCode();
	};

	onExitedDialog = () => {
		const { onExitedDialog } = this.props;

		this.setState(this.initialState, () => {
			if (onExitedDialog) onExitedDialog();
		});
	};

	render() {
		const { type, dialogOpen, onCloseDialog, selectedPositionOrGroup } = this.props;
		const { QRCodeDataUrl, QRCodeSize, pixelsPerCentimeter } = this.state;
		const QRSettings = marks[QRCodeSize - 1].settings;

		if (!QRCodeDataUrl && !selectedPositionOrGroup) return null;

		const QRWidth = QRCodeSize * pixelsPerCentimeter;

		return (
			<DialogSticky
				open={dialogOpen}
				onEnter={this.onEnter}
				onClose={onCloseDialog}
				onExited={this.onExitedDialog}
				maxWidth="md"
				scroll="body"
				stickyActions
			>
				<DialogTitle onClose={onCloseDialog}>Генерация QR-кода</DialogTitle>
				<Formik
					initialValues={{ quantity: '' }}
					validationSchema={QRCodeGenerationSchema}
					validateOnBlur={false}
					validateOnChange={false}
					onSubmit={(values, actions) => this.onGenerateAndSavePDF(actions, values)}
				>
					{({ errors, isSubmitting, touched }) => (
						<Form>
							<DialogContent>
								<Grid className={stylesGlobal.formLabelControl}>
									<Field
										name="quantity"
										type="number"
										label="Количество QR-кодов в PDF"
										error={Boolean(touched.quantity && errors.quantity)}
										helperText={(touched.quantity && errors.quantity) || ''}
										as={TextField}
										fullWidth
										autoFocus
									/>
								</Grid>

								<Grid className={stylesGlobal.formLabelControl}>
									<InputLabel style={{ minWidth: 146 }}>Размер QR-кодов</InputLabel>
									<FormControl fullWidth>
										<Slider
											disabled={isSubmitting}
											value={QRCodeSize}
											getAriaValueText={value => `${value} см`}
											onChange={this.setQRCodeSize}
											aria-labelledby="discrete-slider-custom"
											step={1}
											valueLabelDisplay="auto"
											marks={marks}
											min={1}
											max={10}
										/>
									</FormControl>
								</Grid>

								<div className={styles.qrContainer} style={{ maxWidth: QRWidth }}>
									<div
										className={QRNameClasses(QRCodeSize)}
										style={{
											fontSize: QRSettings.fontSize,
											marginBottom:
												type === 'position' && selectedPositionOrGroup.characteristics.length ? QRSettings.margin - 5 : QRSettings.margin,
										}}
									>
										{selectedPositionOrGroup.name}
									</div>
									{type === 'position' && selectedPositionOrGroup.characteristics.length ? (
										<div
											className={QRCharacteristicsClasses(QRCodeSize)}
											style={{
												fontSize: QRSettings.fontSize - 2,
												marginBottom: QRSettings.margin,
											}}
										>
											{selectedPositionOrGroup.characteristics.reduce(
												(fullCharacteristics, characteristic) => `${fullCharacteristics} ${characteristic.label}`,
												''
											)}
										</div>
									) : null}
									<img className={styles.qrCode} src={QRCodeDataUrl} width={QRWidth} height={QRWidth} alt="" />
								</div>
							</DialogContent>
							<DialogActions
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
									text: 'Скачать PDF',
									isLoading: isSubmitting,
								}}
							/>
						</Form>
					)}
				</Formik>
			</DialogSticky>
		);
	}
}

export default DialogPositionOrGroupQRCodeGeneration;
