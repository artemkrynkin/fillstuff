import * as Yup from 'yup';
import moment from 'moment';

import { procurementStatusList } from 'shared/modelsHelpers';

const procurementSchema = {
	option: Yup.object().shape({
		status: Yup.string()
			.required('Выберите вариант закупки, чтобы продолжить')
			.oneOf(procurementStatusList),
	}),
	dataReceived: Yup.object().shape({
		shop: Yup.mixed().required(),
		noInvoice: Yup.bool().required(),
		invoiceNumber: Yup.string().when('noInvoice', (noInvoice, schema) => {
			return !noInvoice ? schema.required() : schema.strip();
		}),
		invoiceDate: Yup.mixed().when('noInvoice', (noInvoice, schema) => {
			return !noInvoice
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
	}),
	dataExpected: Yup.object().shape({
		shop: Yup.mixed().required(),
	}),
	priceFormation: Yup.object().shape({}),
	deliveryConfirmation: Yup.object().shape({}),
};

export default procurementSchema;
