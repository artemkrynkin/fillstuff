import * as Yup from 'yup';

const positionSchema = (depopulate = false) => {
	return Yup.object().shape({
		name: Yup.string()
			.min(2)
			.max(60)
			.required(),
		characteristics: Yup.array().transform((currentValue, originalValue) => {
			return depopulate
				? currentValue.sort((characteristicA, characteristicB) => characteristicA.type.localeCompare(characteristicB.type))
				: currentValue;
		}),
	});
};

export default positionSchema;
