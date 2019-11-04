import * as Yup from 'yup';

const procurementSchema = Yup.object().shape({
	number: Yup.string()
		.matches(/^[a-zA-Z0-9]+$/, 'Номер должен состоять только из латинских символов и цифр')
		.required(),
	costDelivery: Yup.number(),
	totalPurchasePrice: Yup.number().min(0),
	totalPurchasePriceWithCostDelivery: Yup.number().min(0),
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
			sellingPrice: Yup.number()
				.nullable(true)
				.transform(value => (isNaN(value) ? null : value))
				.when('position', (position, schema) => {
					return position.unitReceipt === 'pce' || position.unitIssue !== 'pce' ? schema.min(0).required() : schema.strip();
				}),
			unitSellingPrice: Yup.number()
				.nullable(true)
				.transform(value => (isNaN(value) ? null : value))
				.min(0)
				.required(),
		})
	)
		// eslint-disable-next-line
		.min(1, 'Необходимо выбрать минимум ${min} позицию'),
});

export default procurementSchema;
