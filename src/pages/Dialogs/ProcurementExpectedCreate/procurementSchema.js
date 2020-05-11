import * as Yup from 'yup';
import moment from 'moment';

const procurementSchema = (depopulate = false) => {
	return Yup.object().shape({
		shop: Yup.mixed()
			.required()
			.transform((currentValue, originalValue) => (depopulate ? currentValue._id : currentValue)),
		deliveryDate: Yup.mixed()
			.required()
			.transform((value, originalValue) => (moment(value).isValid() ? value : originalValue)),
		deliveryTimeFrom: Yup.mixed()
			.required()
			.transform((value, originalValue) => (moment(value).isValid() ? value : originalValue)),
		deliveryTimeTo: Yup.mixed()
			.required()
			.transform((value, originalValue) => (moment(value).isValid() ? value : originalValue)),
		costDelivery: Yup.number()
			.transform(value => (isNaN(value) ? 0 : value))
			.min(0),
		pricePositions: Yup.number().min(0),
		positions: Yup.array()
			// eslint-disable-next-line
			.min(1, 'Необходимо выбрать минимум ${min} позицию')
			.when('empty', (empty, schema) => (depopulate ? schema.of(Yup.string()) : schema))
			.transform((currentValue, originalValue) => {
				return depopulate ? currentValue.map(position => position._id) : currentValue;
			}),
	});
};

export default procurementSchema;
