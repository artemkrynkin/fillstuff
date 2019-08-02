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

export const markersSchema = product =>
	Yup.object().shape({
		markers: Yup.array().of(
			Yup.object().shape({
				manufacturer: Yup.string().required(),
				manufacturerTemp: Yup.string().strip(),
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
						return !isFree && product.receiptUnits === 'nmp' && product.unitIssue === 'pce'
							? schema.min(0).required()
							: schema.strip();
					}),
				linkInShop: Yup.string().required(),
				specifications: Yup.array().of(
					Yup.object().shape({
						name: Yup.string().required(),
						value: Yup.string().required(),
						label: Yup.string().required(),
					})
				),
				specificationTemp: Yup.object()
					.shape({
						name: Yup.string(),
						value: Yup.string(),
					})
					.strip(),
			})
		),
	});

export const markerSchema = product =>
	Yup.object().shape({
		manufacturer: Yup.string().required(),
		manufacturerTemp: Yup.string().strip(),
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
				return !isFree && product.receiptUnits === 'nmp' && product.unitIssue === 'pce'
					? schema.min(0).required()
					: schema.strip();
			}),
		linkInShop: Yup.string().required(),
		specifications: Yup.array().of(
			Yup.object().shape({
				name: Yup.string().required(),
				value: Yup.string().required(),
				label: Yup.string().required(),
			})
		),
		specificationTemp: Yup.object()
			.shape({
				name: Yup.string(),
				value: Yup.string(),
			})
			.strip(),
	});
