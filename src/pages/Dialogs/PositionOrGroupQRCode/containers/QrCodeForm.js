import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Form, Formik } from 'formik';
import pdfMake from 'pdfmake/build/pdfmake';
import { v4 as uuidv4 } from 'uuid';

import Grid from '@material-ui/core/Grid';

import { sleep } from 'shared/utils';

import { CLIENT_URL } from 'src/api/constants';

import Settings from './Settings';
import Markup from './Markup';
import qrCodeSchema from '../helpers/qrCodeSchema';
import docDefinitionRender from '../helpers/docDefinitionRender';
import { renderOptionsTranslate, stickerWidthMax, stickerWidthOptimal, titleSizeMax, titleSizeOptimal } from '../helpers/renderOptions';

import { editPosition } from 'src/actions/positions';
import { enqueueSnackbar } from 'src/actions/snackbars';

import styles from './QrCodeForm.module.css';

const QrCodeForm = props => {
	const { type, selectedPositionOrGroup } = props;
	const [qrCodeSvg, setQrCodeSvg] = useState(null);

	const onSubmit = async values => {
		const { type, selectedPositionOrGroup: position } = props;
		const formSettings = qrCodeSchema.cast(values);

		const infoMetaGenerate = (printDestination, printDestinationEnabled) => {
			const qrCountText = `QR ${printDestination === 'storage' ? 'код ' : 'коды '}`;
			const printDestinationText = printDestinationEnabled ? `${renderOptionsTranslate.printDestination[printDestination]} ` : '';
			const forText = `для ${type === 'position' ? 'позиции' : 'группы'} "${position.name}"`;

			return `${qrCountText}${printDestinationText.toLowerCase()}${forText}`;
		};

		const fonts = {
			Nunito: {
				normal: `${CLIENT_URL}/fonts/Nunito/Nunito-Regular.ttf`,
				bold: `${CLIENT_URL}/fonts/Nunito/Nunito-Bold.ttf`,
				italics: `${CLIENT_URL}/fonts/Nunito/Nunito-Italic.ttf`,
				bolditalics: `${CLIENT_URL}/fonts/Nunito/Nunito-BoldItalic.ttf`,
			},
		};
		const definition = docDefinitionRender({ title: position.name, ...formSettings, qrCodeSvg });

		const docDefinition = {
			info: {
				title: infoMetaGenerate(formSettings.printDestination),
				subject: infoMetaGenerate(formSettings.printDestination, true),
				creator: 'Blikside',
				producer: 'Blikside',
			},
			defaultStyle: {
				font: 'Nunito',
				pageSize: 'A4',
			},
			...definition,
		};

		if (type === 'position') {
			await props
				.editPosition(position._id, {
					printDestination: formSettings.printDestination,
				})
				.then(response => {
					if (response.status === 'error' && !response.data) {
						props.enqueueSnackbar({
							message: response.message || 'Неизвестная ошибка.',
							options: {
								variant: 'error',
							},
						});
					}
				});
		}

		await sleep(300);

		const pdf = pdfMake.createPdf(docDefinition, null, fonts);

		if (formSettings.printDestination === 'storage') {
			pdf.print();
		} else {
			pdf.download(`${selectedPositionOrGroup.name.replace(' ', '-')}_${Date.now()}`);
		}
	};

	const quantity = type === 'position' ? selectedPositionOrGroup.receipts.reduce((sum, receipt) => sum + receipt.current.quantity, 0) : 0;

	const qrData = JSON.stringify({
		type: type === 'position' ? 's-p' : type === 'positionGroup' ? 's-pg' : '',
		id: selectedPositionOrGroup.qrcodeId,
	});

	const initialValues = {
		printDestination: 'storage',
		quantity,
		stickerOrientation: 'portrait',
		stickerSize: 7,
		stickerWidth: stickerWidthOptimal(stickerWidthMax(7)),
		titleSize: titleSizeOptimal(titleSizeMax(7)),
		stickerColor: 'colored',
	};

	return (
		<Formik
			initialValues={initialValues}
			validationSchema={qrCodeSchema}
			validateOnBlur={false}
			validateOnChange={false}
			onSubmit={onSubmit}
		>
			{formikProps => {
				const {
					values: { printDestination, stickerOrientation, stickerSize, stickerWidth, titleSize, stickerColor },
				} = formikProps;

				const stickerOptions = { printDestination, stickerOrientation, stickerSize, stickerWidth, titleSize, stickerColor };

				return (
					<Form>
						<Grid className={styles.container} container>
							<Settings type={type} formikProps={formikProps} />
							<Markup
								selectedPositionOrGroup={selectedPositionOrGroup}
								qrData={qrData}
								qrCodeSvg={qrCodeSvg}
								setQrCodeSvg={setQrCodeSvg}
								stickerOptions={stickerOptions}
							/>
						</Grid>
					</Form>
				);
			}}
		</Formik>
	);
};

const mapDispatchToProps = dispatch => {
	return {
		editPosition: (positionId, position) => dispatch(editPosition({ params: { positionId }, data: { position } })),
		enqueueSnackbar: (...args) => dispatch(enqueueSnackbar(...args)),
	};
};

export default connect(null, mapDispatchToProps)(QrCodeForm);
