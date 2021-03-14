import * as Yup from 'yup';
import moment from 'moment';

import { procurementStatusList, procurementPaymentState } from 'shared/modelsHelpers';

const procurementSchema = {
	option: Yup.object().shape({
		status: Yup.string()
			.required('Выберите вариант закупки, чтобы продолжить')
			.oneOf(procurementStatusList),
	}),
	data: {
		received: Yup.object().shape({
			shop: Yup.mixed().required(),
			noInvoice: Yup.bool().required(),
			invoiceNumber: Yup.string().when('noInvoice', (noInvoice, schema) => (!noInvoice ? schema.required() : schema)),
			invoiceDate: Yup.mixed().when('noInvoice', (noInvoice, schema) => {
				return !noInvoice
					? schema.required().transform((value, originalValue) => (moment(value).isValid() ? value : originalValue))
					: schema;
			}),
			pricePositions: Yup.number()
				.min(0)
				.required(),
			costDelivery: Yup.number()
				.min(0)
				.required(),
			receipts: Yup.array(
				Yup.object().shape({
					position: Yup.mixed().required(),
					quantity: Yup.number().when('position', (position, schema) => {
						return position.unitReceipt === 'pce' || position.unitRelease !== 'pce' ? schema.min(1).required() : schema.strip();
					}),
					quantityPackages: Yup.number().when('position', (position, schema) => {
						return position.unitReceipt === 'nmp' && position.unitRelease === 'pce' ? schema.min(1).required() : schema.strip();
					}),
					quantityInUnit: Yup.number().when('position', (position, schema) => {
						return position.unitReceipt === 'nmp' && position.unitRelease === 'pce' ? schema.min(1).required() : schema.strip();
					}),
					purchasePrice: Yup.number().required(),
					unitPurchasePrice: Yup.number().transform(value => (isNaN(value) ? 0 : Number(value))),
					costDelivery: Yup.number().transform(value => (isNaN(value) ? 0 : Number(value))),
					unitCostDelivery: Yup.number().transform(value => (isNaN(value) ? 0 : Number(value))),
					sellingPrice: Yup.number().transform(value => (isNaN(value) ? 0 : Number(value))),
					unitSellingPrice: Yup.number().transform(value => (isNaN(value) ? 0 : Number(value))),
					markupPercent: Yup.number().transform(value => (isNaN(value) ? 0 : Number(value))),
					markup: Yup.number().transform(value => (isNaN(value) ? 0 : Number(value))),
					unitMarkup: Yup.number().transform(value => (isNaN(value) ? 0 : Number(value))),
				})
			)
				// eslint-disable-next-line
				.min(1, 'Необходимо выбрать хотя бы ${min} позицию'),
		}),
		expected: Yup.object().shape({
			shop: Yup.mixed().required(),
			pricePositions: Yup.number()
				.min(0)
				.required(),
			costDelivery: Yup.number()
				.min(0)
				.required(),
			orderedReceiptsPositions: Yup.array(
				Yup.object().shape({
					position: Yup.mixed().required(),
					quantity: Yup.number()
						.min(1)
						.required(),
				})
			)
				// eslint-disable-next-line
				.min(1, 'Необходимо выбрать минимум ${min} позицию'),
		}),
	},
	priceFormation: Yup.object().shape({
		receipts: Yup.array(
			Yup.object().shape({
				visibleFormationPriceFields: Yup.boolean().oneOf([false], 'Подтвердите цену продажи'),
				sellingPrice: Yup.number(),
				unitSellingPrice: Yup.number().required(),
				markupPercent: Yup.number().required(),
				markup: Yup.number(),
				unitMarkup: Yup.number(),
			})
		),
	}),
	deliveryConfirmation: Yup.object().shape({
		paymentState: Yup.string()
			.required('Выберите вариант закупки, чтобы продолжить')
			.oneOf(procurementPaymentState),
		deliveryDate: Yup.mixed().when(['isConfirmed', 'isUnknownDeliveryDate'], (isConfirmed, isUnknownDeliveryDate, schema) => {
			return isConfirmed && !isUnknownDeliveryDate
				? schema.transform((value, originalValue) => (moment(value).isValid() ? value : originalValue))
				: schema.strip();
		}),
		deliveryTimeFrom: Yup.string().when(['isConfirmed', 'isUnknownDeliveryDate'], (isConfirmed, isUnknownDeliveryDate, schema) => {
			return isConfirmed && !isUnknownDeliveryDate ? schema : schema.strip();
		}),
		deliveryTimeTo: Yup.string().when(['isConfirmed', 'isUnknownDeliveryDate'], (isConfirmed, isUnknownDeliveryDate, schema) => {
			return isConfirmed && !isUnknownDeliveryDate ? schema : schema.strip();
		}),
	}),
};

export const procurementExpectedSchema = Yup.object().shape({
	shop: Yup.mixed().transform(value => value._id),
	compensateCostDelivery: Yup.boolean().strip(),
	deliveryDate: Yup.mixed(),
	noInvoice: Yup.boolean().strip(),
	invoiceNumber: Yup.string().strip(),
	invoiceDate: Yup.mixed().strip(),
	pricePositions: Yup.number(),
	costDelivery: Yup.number(),
	totalPrice: Yup.number(),
	orderedReceiptsPositions: Yup.array(
		Yup.object().shape({
			id: Yup.string().strip(),
			position: Yup.mixed().transform(value => value._id),
			quantity: Yup.number(),
		})
	),
	receipts: Yup.array().strip(),
	comment: Yup.string(),
});

export const procurementReceivedSchema = Yup.object().shape({
	shop: Yup.mixed().transform(value => value._id),
	isConfirmed: Yup.boolean().strip(),
	isUnknownDeliveryDate: Yup.boolean().strip(),
	deliveryDate: Yup.mixed().strip(),
	deliveryTimeFrom: Yup.string().strip(),
	deliveryTimeTo: Yup.string().strip(),
	invoiceNumber: Yup.string().when('noInvoice', (noInvoice, schema) => (!noInvoice ? schema : schema.strip())),
	invoiceDate: Yup.mixed().when('noInvoice', (noInvoice, schema) => (!noInvoice ? schema : schema.strip())),
	pricePositions: Yup.number(),
	costDelivery: Yup.number(),
	totalPrice: Yup.number(),
	orderedReceiptsPositions: Yup.array().strip(),
	receipts: Yup.array(
		Yup.object().shape({
			id: Yup.string().strip(),
			visibleFormationPriceFields: Yup.boolean().strip(),
			position: Yup.mixed().transform(value => value._id),
			quantity: Yup.number(),
			quantityPackages: Yup.number(),
			quantityInUnit: Yup.number(),
			purchasePrice: Yup.number(),
			unitPurchasePrice: Yup.number(),
			sellingPrice: Yup.number(),
			unitSellingPrice: Yup.number(),
			markupPercent: Yup.number(),
			markup: Yup.number(),
			unitMarkup: Yup.number(),
		})
	),
	comment: Yup.string().strip(),
});

export default procurementSchema;
