import * as Yup from 'yup';

const receiptSchema = Yup.object().shape({
	quantity: Yup.number()
		.nullable(true)
		.transform(value => (isNaN(value) ? null : value))
		.when('position', (position, schema) => {
			return position.unitReceipt === 'pce' || position.unitRelease !== 'pce' ? schema.min(1).required() : schema.strip();
		}),
	quantityPackages: Yup.number()
		.nullable(true)
		.transform(value => (isNaN(value) ? null : value))
		.when('position', (position, schema) => {
			return position.unitReceipt === 'nmp' && position.unitRelease === 'pce' ? schema.min(1).required() : schema.strip();
		}),
	quantityInUnit: Yup.number()
		.nullable(true)
		.transform(value => (isNaN(value) ? null : value))
		.when('position', (position, schema) => {
			return position.unitReceipt === 'nmp' && position.unitRelease === 'pce' ? schema.min(1).required() : schema.strip();
		}),
	purchasePrice: Yup.number()
		.nullable(true)
		.transform(value => (isNaN(value) ? null : value))
		.min(0)
		.required(),
	unitPurchasePrice: Yup.number()
		.nullable(true)
		.transform(value => (isNaN(value) ? null : value))
		.min(0),
	sellingPrice: Yup.number()
		.nullable(true)
		.transform(value => (isNaN(value) ? null : value))
		.min(0),
	unitSellingPrice: Yup.number()
		.nullable(true)
		.transform(value => (isNaN(value) ? null : value))
		.min(0),
	markupPercent: Yup.number()
		.transform(value => (isNaN(value) ? 0 : value))
		.min(0),
	markup: Yup.number()
		.transform(value => (isNaN(value) ? 0 : value))
		.min(0),
	unitMarkup: Yup.number()
		.transform(value => (isNaN(value) ? 0 : value))
		.min(0),
});

export default receiptSchema;
