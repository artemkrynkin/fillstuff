import * as Yup from 'yup';
import moment from 'moment';

import { procurementStatusList } from 'shared/modelsHelpers';

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
				.transform(value => Number(value))
				.min(0),
			costDelivery: Yup.number()
				.transform(value => Number(value))
				.min(0),
			receipts: Yup.array(
				Yup.object().shape({
					position: Yup.mixed().required(),
					quantity: Yup.number()
						.nullable(true)
						.transform(value => (isNaN(value) ? null : Number(value)))
						.when('position', (position, schema) => {
							return position.unitReceipt === 'pce' || position.unitRelease !== 'pce' ? schema.min(1).required() : schema.strip();
						}),
					quantityPackages: Yup.number()
						.nullable(true)
						.transform(value => (isNaN(value) ? null : Number(value)))
						.when('position', (position, schema) => {
							return position.unitReceipt === 'nmp' && position.unitRelease === 'pce' ? schema.min(1).required() : schema.strip();
						}),
					quantityInUnit: Yup.number()
						.nullable(true)
						.transform(value => (isNaN(value) ? null : Number(value)))
						.when('position', (position, schema) => {
							return position.unitReceipt === 'nmp' && position.unitRelease === 'pce' ? schema.min(1).required() : schema.strip();
						}),
					purchasePrice: Yup.number()
						.nullable(true)
						.transform(value => (isNaN(value) ? null : Number(value)))
						.min(0)
						.required(),
					unitPurchasePrice: Yup.number()
						.nullable(true)
						.transform(value => (isNaN(value) ? null : Number(value)))
						.min(0),
					costDelivery: Yup.number()
						.nullable(true)
						.transform(value => (isNaN(value) ? null : Number(value)))
						.min(0),
					unitCostDelivery: Yup.number()
						.nullable(true)
						.transform(value => (isNaN(value) ? null : Number(value)))
						.min(0),
					sellingPrice: Yup.number()
						.nullable(true)
						.transform(value => (isNaN(value) ? null : Number(value)))
						.min(0),
					unitSellingPrice: Yup.number()
						.nullable(true)
						.transform(value => (isNaN(value) ? null : Number(value)))
						.min(0),
					markupPercent: Yup.number()
						.nullable(true)
						.transform(value => (isNaN(value) ? null : Number(value)))
						.min(0),
					markup: Yup.number()
						.nullable(true)
						.transform(value => (isNaN(value) ? null : Number(value)))
						.min(0),
					unitMarkup: Yup.number()
						.nullable(true)
						.transform(value => (isNaN(value) ? null : Number(value)))
						.min(0),
				})
			)
				// eslint-disable-next-line
				.min(1, 'Необходимо выбрать хотя бы ${min} позицию'),
		}),
		expected: Yup.object().shape({
			shop: Yup.mixed().required(),
		}),
	},
	priceFormation: Yup.object().shape({
		receipts: Yup.array(
			Yup.object().shape({
				visibleFormationPriceFields: Yup.boolean().oneOf([false], 'Подтвердите цену продажи'),
				sellingPrice: Yup.number()
					.nullable(true)
					.transform(value => (isNaN(value) ? null : Number(value)))
					.min(0),
				unitSellingPrice: Yup.number()
					.nullable(true)
					.transform(value => (isNaN(value) ? null : Number(value)))
					.min(0),
				markupPercent: Yup.number()
					.nullable(true)
					.transform(value => (isNaN(value) ? null : Number(value)))
					.min(0),
				markup: Yup.number()
					.nullable(true)
					.transform(value => (isNaN(value) ? null : Number(value)))
					.min(0),
				unitMarkup: Yup.number()
					.nullable(true)
					.transform(value => (isNaN(value) ? null : Number(value)))
					.min(0),
			})
		),
	}),
	deliveryConfirmation: Yup.object().shape({}),
};

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
