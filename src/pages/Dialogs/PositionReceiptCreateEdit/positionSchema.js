import * as Yup from 'yup';

const positionSchema = (type, depopulate = false) => {
	return Yup.object().shape({
		name: Yup.string()
			.min(2)
			.max(60)
			.required(),
		unitReceipt: Yup.string()
			.oneOf(['pce', 'nmp'])
			.required(),
		unitRelease: Yup.string()
			.oneOf(['pce', 'nmp'])
			.required(),
		quantity: Yup.number()
			.nullable(true)
			.transform(value => (isNaN(value) ? null : value))
			.when(['unitReceipt', 'unitRelease'], (unitReceipt, unitRelease, schema) => {
				return type === 'create' && (unitReceipt === 'pce' || unitRelease !== 'pce') ? schema.min(1).required() : schema.strip();
			}),
		quantityPackages: Yup.number()
			.nullable(true)
			.transform(value => (isNaN(value) ? null : value))
			.when(['unitReceipt', 'unitRelease'], (unitReceipt, unitRelease, schema) => {
				return type === 'create' && unitReceipt === 'nmp' && unitRelease === 'pce' ? schema.min(1).required() : schema.strip();
			}),
		quantityInUnit: Yup.number()
			.nullable(true)
			.transform(value => (isNaN(value) ? null : value))
			.when(['unitReceipt', 'unitRelease'], (unitReceipt, unitRelease, schema) => {
				return unitReceipt === 'nmp' && unitRelease === 'pce' ? schema.min(1).required() : schema.strip();
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
			.when(['unitReceipt', 'unitRelease'], (unitReceipt, unitRelease, schema) => {
				return unitReceipt === 'pce' || unitRelease !== 'pce' ? schema.min(0).required() : schema.strip();
			}),
		unitSellingPrice: Yup.number()
			.nullable(true)
			.transform(value => (isNaN(value) ? null : value))
			.when(['unitReceipt', 'unitRelease'], (unitReceipt, unitRelease, schema) => {
				return unitReceipt === 'nmp' && unitRelease === 'pce' ? schema.min(0).required() : schema.strip();
			}),
		extraCharge: Yup.number()
			.min(0)
			.required(),
		shopName: Yup.string().required(),
		shopLink: Yup.string(),
		characteristics: Yup.array()
			.when('empty', (empty, schema) => (depopulate ? schema.of(Yup.string()) : schema))
			.transform((currentValue, originalValue) => {
				return depopulate ? currentValue.map(characteristic => characteristic._id) : currentValue;
			}),
		characteristicTemp: Yup.object().when('empty', (empty, schema) => (!depopulate ? schema : schema.strip())),
	});
};

export default positionSchema;
