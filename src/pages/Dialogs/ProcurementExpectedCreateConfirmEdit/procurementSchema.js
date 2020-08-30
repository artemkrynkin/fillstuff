import * as Yup from 'yup';
import moment from 'moment';

const procurementSchema = (depopulate = false) => {
	return Yup.object().shape({
		shop: Yup.mixed()
			.required()
			.transform(value => (depopulate ? value._id : value)),
		deliveryDate: Yup.mixed().when(['isConfirmed', 'isUnknownDeliveryDate'], (isConfirmed, isUnknownDeliveryDate, schema) => {
			return isConfirmed && !isUnknownDeliveryDate
				? schema.required().transform((value, originalValue) => (moment(value).isValid() ? value : originalValue))
				: schema.strip();
		}),
		deliveryTimeFrom: Yup.mixed().when(['isConfirmed', 'isUnknownDeliveryDate'], (isConfirmed, isUnknownDeliveryDate, schema) => {
			return isConfirmed && !isUnknownDeliveryDate && !schema.isValidSync('') ? schema : schema.strip();
		}),
		deliveryTimeTo: Yup.mixed().when(['isConfirmed', 'isUnknownDeliveryDate'], (isConfirmed, isUnknownDeliveryDate, schema) => {
			return isConfirmed && !isUnknownDeliveryDate && !schema.isValidSync('') ? schema : schema.strip();
		}),
		costDelivery: Yup.number()
			.transform(value => (isNaN(value) ? 0 : value))
			.min(0),
		pricePositions: Yup.number().min(0),
		receiptsTempPositions: Yup.array(
			Yup.object().shape({
				position: Yup.mixed()
					.required()
					.transform(position => {
						const { _id, notCreated, childPosition, ...remainingParams } = position;

						const positionReplacement = {
							...remainingParams,
							childPosition: _id,
							notCreated,
						};

						return depopulate ? (notCreated ? positionReplacement : _id) : position;
					}),
				quantity: Yup.number()
					.nullable(true)
					.transform(value => (isNaN(value) ? null : value))
					.min(1)
					.required(),
			})
		)
			// eslint-disable-next-line
			.min(1, 'Необходимо выбрать минимум ${min} позицию'),
		positions: Yup.array().of(Yup.string()),
	});
};

export default procurementSchema;
