import * as Yup from 'yup';

const positionGroupSchema = (type, depopulate = false) => {
	return Yup.object().shape({
		name: Yup.string().when('empty', (empty, schema) => {
			return type !== 'add'
				? schema
						.min(2)
						.max(60)
						.required()
				: schema;
		}),
		positions: Yup.array()
			// eslint-disable-next-line
			.min(1, 'Необходимо выбрать минимум ${min} позицию')
			.when('empty', (empty, schema) => (depopulate ? schema.of(Yup.string()) : schema))
			.transform((currentValue, originalValue) => {
				return depopulate ? currentValue.map(position => position._id) : currentValue;
			}),
	});
};

export default positionGroupSchema;
