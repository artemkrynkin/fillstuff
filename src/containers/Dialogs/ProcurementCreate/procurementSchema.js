import * as Yup from 'yup';
import moment from 'moment';

const procurementSchema = Yup.object().shape({
	number: Yup.string().when('noInvoice', (noInvoice, schema) => {
		return !noInvoice ? schema.required() : schema.notRequired();
	}),
	date: Yup.mixed().when('noInvoice', {
		is: false,
		then: Yup.date()
			.required()
			.transform(function(value, originalValue) {
				if (moment(value).isValid()) return value;
			}),
		otherwise: Yup.mixed().notRequired(),
	}),
	costDelivery: Yup.number()
		.transform(value => (isNaN(value) ? 0 : value))
		.min(0),
	pricePositions: Yup.number().min(0),
	totalPrice: Yup.number()
		.min(0)
		.required(),
	receipts: Yup.array(
		Yup.object().shape({
			quantity: Yup.number()
				.nullable(true)
				.transform(value => (isNaN(value) ? null : value))
				.when('position', (position, schema) => {
					return position.unitReceipt === 'pce' || position.unitIssue !== 'pce' ? schema.min(1).required() : schema.strip();
				}),
			quantityPackages: Yup.number()
				.nullable(true)
				.transform(value => (isNaN(value) ? null : value))
				.when('position', (position, schema) => {
					return position.unitReceipt === 'nmp' && position.unitIssue === 'pce' ? schema.min(1).required() : schema.strip();
				}),
			quantityInUnit: Yup.number()
				.nullable(true)
				.transform(value => (isNaN(value) ? null : value))
				.when('position', (position, schema) => {
					return position.unitReceipt === 'nmp' && position.unitIssue === 'pce' ? schema.min(1).required() : schema.strip();
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
			costDelivery: Yup.number()
				.transform(value => (isNaN(value) ? 0 : value))
				.min(0),
			unitCostDelivery: Yup.number()
				.transform(value => (isNaN(value) ? 0 : value))
				.min(0),
			extraCharge: Yup.number()
				.transform(value => (isNaN(value) ? 0 : value))
				.min(0),
			unitExtraCharge: Yup.number()
				.transform(value => (isNaN(value) ? 0 : value))
				.min(0),
			manualExtraCharge: Yup.number()
				.transform(value => (isNaN(value) ? 0 : value))
				.min(0),
			unitManualExtraCharge: Yup.number()
				.transform(value => (isNaN(value) ? 0 : value))
				.min(0),
		})
	)
		// eslint-disable-next-line
		.min(1, 'Необходимо выбрать минимум ${min} позицию'),
});

export default procurementSchema;
