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
		minimumBalance: Yup.number()
			.nullable(true)
			.transform(value => (isNaN(value) ? null : value))
			.when('dividedPositions', (dividedPositions, schema) => {
				return type !== 'add' && !dividedPositions ? schema.min(1).required() : schema.strip();
			}),
		positions: Yup.array()
			.min(
				type !== 'add' ? 2 : 1,
				// eslint-disable-next-line
				type !== 'add' ? 'для создания группы необходимо выбрать минимум ${min} позиции' : 'необходимо выбрать минимум ${min} позицию'
			)
			.when('empty', (empty, schema) => (depopulate ? schema.of(Yup.string()) : schema))
			.transform((currentValue, originalValue) => {
				return depopulate ? currentValue.map(position => position._id) : currentValue;
			}),
	});
};

export default positionGroupSchema;
