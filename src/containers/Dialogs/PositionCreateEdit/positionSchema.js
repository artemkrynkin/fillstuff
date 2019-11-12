import * as Yup from 'yup';

const positionSchema = (depopulate = false) => {
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
		minimumBalance: Yup.number()
			.nullable(true)
			.transform(value => (isNaN(value) ? null : value))
			.when('divided', (divided, schema) => {
				return divided ? schema.min(1).required() : schema;
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
