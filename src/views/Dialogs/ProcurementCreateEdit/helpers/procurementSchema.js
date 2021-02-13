import * as Yup from 'yup';
import moment from 'moment';

import { procurementStatusList } from 'shared/modelsHelpers';

const procurementSchema = (depopulate = false) => {
	return Yup.object().shape({
		status: Yup.string()
			.required()
			.oneOf(procurementStatusList),
		shop: Yup.mixed()
			.required()
			.transform(value => (depopulate ? value._id : value)),
		noInvoice: Yup.bool().when('status', (status, schema) => {
			return status === 'received' ? schema.required() : schema.strip();
		}),
		invoiceNumber: Yup.string().when(['status', 'noInvoice'], (status, noInvoice, schema) => {
			return status === 'received' && !noInvoice ? schema.required() : schema.strip();
		}),
		invoiceDate: Yup.mixed().when(['status', 'noInvoice'], (status, noInvoice, schema) => {
			return status === 'received' && !noInvoice
				? schema.required().transform((value, originalValue) => (moment(value).isValid() ? value : originalValue))
				: schema.strip();
		}),
		pricePositions: Yup.number()
			.transform(value => (isNaN(value) ? 0 : value))
			.min(0),
		costDelivery: Yup.number()
			.transform(value => (isNaN(value) ? 0 : value))
			.min(0),
		receipts: Yup.array(
			Yup.object().shape({
				position: Yup.mixed().required(),
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
			.min(1, 'Необходимо выбрать хотя бы ${min} позицию'),
	});
};

export default procurementSchema;
