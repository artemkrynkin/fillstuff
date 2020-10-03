import * as Yup from 'yup';

import renderOptions from './renderOptions';

const qrCodeSchema = Yup.object().shape({
	printDestination: Yup.string()
		.oneOf(renderOptions.printDestination)
		.required(),
	quantity: Yup.number().when('printDestination', (printDestination, schema) =>
		printDestination === 'storage' ? schema.transform(() => 1) : schema.min(1, 'Введите количество').required()
	),
	stickerOrientation: Yup.string()
		.oneOf(renderOptions.stickerOrientation)
		.required(),
	stickerSize: Yup.number()
		.oneOf(renderOptions.stickerSize)
		.required(),
	stickerWidth: Yup.number().when('stickerOrientation', (printDestination, schema) =>
		printDestination === 'landscape' ? schema.oneOf(renderOptions.stickerWidth).required() : schema.strip()
	),
	titleSize: Yup.number()
		.oneOf(renderOptions.titleSize)
		.when(['printDestination', 'stickerOrientation', 'stickerSize'], (printDestination, stickerOrientation, stickerSize, schema) =>
			printDestination === 'storage' && ((stickerOrientation === 'portrait' && stickerSize > 3) || stickerOrientation === 'landscape')
				? schema.required()
				: schema.strip()
		),
	stickerColor: Yup.string()
		.oneOf(renderOptions.stickerColor)
		.required(),
});

export default qrCodeSchema;
