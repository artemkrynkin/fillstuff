import * as Yup from 'yup';

const procurementSchema = Yup.object().shape({
	number: Yup.string().required(),
	costDelivery: Yup.number()
		.transform(value => (isNaN(value) ? 0 : value))
		.min(0),
	purchasePrice: Yup.number()
		.min(0)
		.required(),
	purchasePriceTemp: Yup.number().min(0),
	totalPurchasePrice: Yup.number().min(0),
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
			costDelivery: Yup.number()
				.transform(value => (isNaN(value) ? 0 : value))
				.min(0),
			unitCostDelivery: Yup.number()
				.transform(value => (isNaN(value) ? 0 : value))
				.min(0),
		})
	)
		// eslint-disable-next-line
		.min(1, 'Необходимо выбрать минимум ${min} позицию'),
});

export default procurementSchema;
