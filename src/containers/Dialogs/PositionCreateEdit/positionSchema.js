import * as Yup from 'yup';

const positionSchema = (type, depopulate = false) => {
	return Yup.object().shape({
		name: Yup.string()
			.min(2)
			.max(100)
			.required(),
		unitReceipt: Yup.string()
			.oneOf(['pce', 'nmp'])
			.required(),
		unitIssue: Yup.string()
			.oneOf(['pce', 'nmp'])
			.required(),
		quantity: Yup.number()
			.nullable(true)
			.transform(value => (isNaN(value) ? null : value))
			.when(['unitReceipt', 'unitIssue'], (unitReceipt, unitIssue, schema) => {
				return type === 'create' && (unitReceipt === 'pce' || unitIssue !== 'pce') ? schema.min(1).required() : schema.strip();
			}),
		quantityPackages: Yup.number()
			.nullable(true)
			.transform(value => (isNaN(value) ? null : value))
			.when(['unitReceipt', 'unitIssue'], (unitReceipt, unitIssue, schema) => {
				return type === 'create' && unitReceipt === 'nmp' && unitIssue === 'pce' ? schema.min(1).required() : schema.strip();
			}),
		quantityInUnit: Yup.number()
			.nullable(true)
			.transform(value => (isNaN(value) ? null : value))
			.when(['unitReceipt', 'unitIssue'], (unitReceipt, unitIssue, schema) => {
				return unitReceipt === 'nmp' && unitIssue === 'pce' ? schema.min(1).required() : schema.strip();
			}),
		minimumBalance: Yup.number()
			.nullable(true)
			.transform(value => (isNaN(value) ? null : value))
			.when('divided', (divided, schema) => {
				return divided ? schema.min(1).required() : schema;
			}),
		purchasePrice: Yup.number()
			.nullable(true)
			.transform(value => (isNaN(value) ? null : value))
			.min(0)
			.required(),
		sellingPrice: Yup.number()
			.nullable(true)
			.transform(value => (isNaN(value) ? null : value))
			.when(['unitReceipt', 'unitIssue'], (unitReceipt, unitIssue, schema) => {
				return unitReceipt === 'pce' || unitIssue !== 'pce' ? schema.min(0).required() : schema.strip();
			}),
		unitSellingPrice: Yup.number()
			.nullable(true)
			.transform(value => (isNaN(value) ? null : value))
			.when(['unitReceipt', 'unitIssue'], (unitReceipt, unitIssue, schema) => {
				return unitReceipt === 'nmp' && unitIssue === 'pce' ? schema.min(0).required() : schema.strip();
			}),
		linkInShop: Yup.string().required(),
		characteristics: Yup.array()
			.when('empty', (empty, schema) => (depopulate ? schema.of(Yup.string()) : schema))
			.transform((currentValue, originalValue) => {
				return depopulate ? currentValue.map(characteristic => characteristic._id) : currentValue;
			}),
		characteristicTemp: Yup.object().when('empty', (empty, schema) => (!depopulate ? schema : schema.strip())),
	});
};

export default positionSchema;
