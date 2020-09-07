import * as Yup from 'yup';
import moment from 'moment';

const procurementSchema = (depopulate = false) => {
	return Yup.object().shape({
		shop: Yup.mixed()
			.required()
			.transform((currentValue, originalValue) => (depopulate ? currentValue._id : currentValue)),
		invoiceNumber: Yup.string().when('noInvoice', (noInvoice, schema) => {
			return !noInvoice ? schema.required() : schema.strip();
		}),
		invoiceDate: Yup.mixed().when('noInvoice', (noInvoice, schema) => {
			return !noInvoice
				? schema.required().transform((value, originalValue) => (moment(value).isValid() ? value : originalValue))
				: schema.strip();
		}),
		costDelivery: Yup.number()
			.transform(value => (isNaN(value) ? 0 : value))
			.min(0),
		pricePositions: Yup.number().min(0),
		receipts: Yup.array(
			Yup.object().shape({
				position: Yup.mixed()
					.required()
					.transform(position => {
						const { _id, notCreated, childPosition, characteristics, ...remainingParams } = position;

						const positionReplacement = {
							...remainingParams,
							childPosition: _id,
							notCreated,
							characteristics: characteristics.map(characteristic => characteristic._id),
						};

						return depopulate ? (notCreated ? positionReplacement : _id) : position;
					}),
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
				costDelivery: Yup.number()
					.transform(value => (isNaN(value) ? 0 : value))
					.min(0),
				unitCostDelivery: Yup.number()
					.transform(value => (isNaN(value) ? 0 : value))
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
			})
		)
			// eslint-disable-next-line
			.min(1, 'Необходимо выбрать минимум ${min} позицию'),
	});
};

export default procurementSchema;
