import React, { useState } from 'react';
import { Form, Formik } from 'formik';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

import Grid from '@material-ui/core/Grid';

import { sleep } from 'shared/utils';

import Settings from './Settings';
import Markup from './Markup';
import qrCodeSchema from '../helpers/qrCodeSchema';
import docDefinitionRender from '../helpers/docDefinitionRender';
import { renderOptionsTranslate, stickerWidthMax, stickerWidthOptimal, titleSizeMax, titleSizeOptimal } from '../helpers/renderOptions';

import { CLIENT_URL } from 'src/api/constants';

import styles from './QrCodeForm.module.css';

const QrCodeForm = props => {
	const { type, selectedPositionOrGroup } = props;
	const [qrCodeSvg, setQrCodeSvg] = useState(null);

	const onSubmit = async (values, actions) => {
		const { type, selectedPositionOrGroup } = props;
		const formSettings = qrCodeSchema.cast(values);

		const fonts = {
			Nunito: {
				normal: `${CLIENT_URL}/fonts/Nunito/Nunito-Regular.ttf`,
				bold: `${CLIENT_URL}/fonts/Nunito/Nunito-Bold.ttf`,
				italics: `${CLIENT_URL}/fonts/Nunito/Nunito-Italic.ttf`,
				bolditalics: `${CLIENT_URL}/fonts/Nunito/Nunito-BoldItalic.ttf`,
			},
		};
		const definition = docDefinitionRender({ title: selectedPositionOrGroup.name, ...formSettings, qrCodeSvg });

		pdfMake.vfs = pdfFonts.pdfMake.vfs;

		const docDefinition = {
			info: {
				title: `QR ${formSettings.printDestination === 'storage' ? 'код' : 'коды'} для ${type === 'position' ? 'позиции' : 'группы'} "${
					selectedPositionOrGroup.name
				}"`,
				subject: `QR ${formSettings.printDestination === 'storage' ? 'код' : 'коды'} ${renderOptionsTranslate.printDestination[
					formSettings.printDestination
				].toLowerCase()} для ${type === 'position' ? 'позиции' : 'группы'} "${selectedPositionOrGroup.name}"`,
				creator: 'Blikside',
				producer: 'Blikside',
			},
			defaultStyle: {
				font: 'Nunito',
				pageSize: 'A4',
			},
			...definition,
		};

		await sleep(300);

		const pdf = pdfMake.createPdf(docDefinition, null, fonts);

		pdf.print();
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

export default QrCodeForm;
