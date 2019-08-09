import * as Yup from 'yup';

export const productSchema = Yup.object().shape({
	name: Yup.string()
		.min(2)
		.max(100)
		.required(),
	receiptUnits: Yup.string()
		.oneOf(['pce', 'nmp'])
		.required(),
	unitIssue: Yup.string().when('receiptUnits', (value, schema) => {
		return value === 'nmp' ? schema.oneOf(['pce', 'nmp']).required() : schema.strip();
	}),
	minimumBalance: Yup.number().when('dividedMarkers', (value, schema) => {
		return !value ? schema.min(0).required() : schema.strip();
	}),
});

const oneMarkerSchema = (product, depopulate = false) => {
	return {
		mainCharacteristic: Yup.mixed()
			.nullable(true)
			.required()
			.transform((currentValue, originalValue) => {
				if (depopulate) return currentValue._id;
				else if (!currentValue) return null;
				else return currentValue;
			}),
		mainCharacteristicTemp: Yup.object().shape({
			type: Yup.string().required(),
		}),
		quantity: Yup.number()
			.nullable(true)
			.transform(value => (isNaN(value) ? null : value))
			.when('empty', (empty, schema) => {
				return product.receiptUnits === 'pce' || product.unitIssue !== 'pce' ? schema.min(0).required() : schema.strip();
			}),
		quantityPackages: Yup.number()
			.nullable(true)
			.transform(value => (isNaN(value) ? null : value))
			.when('empty', (empty, schema) => {
				return product.receiptUnits === 'nmp' && product.unitIssue === 'pce' ? schema.min(0).required() : schema.strip();
			}),
		quantityInUnit: Yup.number()
			.nullable(true)
			.transform(value => (isNaN(value) ? null : value))
			.when('empty', (empty, schema) => {
				return product.receiptUnits === 'nmp' && product.unitIssue === 'pce' ? schema.min(0).required() : schema.strip();
			}),
		minimumBalance: Yup.number()
			.nullable(true)
			.transform(value => (isNaN(value) ? null : value))
			.when('empty', (empty, schema) => {
				return product.dividedMarkers ? schema.min(0).required() : schema.strip();
			}),
		purchasePrice: Yup.number()
			.nullable(true)
			.transform(value => (isNaN(value) ? null : value))
			.min(0)
			.required(),
		sellingPrice: Yup.number()
			.nullable(true)
			.transform(value => (isNaN(value) ? null : value))
			.when('isFree', (isFree, schema) => {
				return !isFree && product.unitIssue !== 'pce' ? schema.min(0).required() : schema.strip();
			}),
		unitSellingPrice: Yup.number()
			.nullable(true)
			.transform(value => (isNaN(value) ? null : value))
			.when('isFree', (isFree, schema) => {
				return !isFree && product.receiptUnits === 'nmp' && product.unitIssue === 'pce' ? schema.min(0).required() : schema.strip();
			}),
		linkInShop: Yup.string().required(),
		characteristics: Yup.array()
			.when('empty', (empty, schema) => {
				return depopulate ? schema.of(Yup.string()) : schema;
			})
			.transform((currentValue, originalValue) => {
				return depopulate ? currentValue.map(characteristic => characteristic._id) : currentValue;
			}),
		characteristicTemp: Yup.object().strip(),
	};
};

export const markersSchema = (product, depopulate) =>
	Yup.object().shape({
		markers: Yup.array().of(Yup.object().shape(oneMarkerSchema(product, depopulate))),
	});

export const markerSchema = (product, depopulate) => Yup.object().shape(oneMarkerSchema(product, depopulate));
