import * as Yup from 'yup';

const positionSchema = (depopulate = false) => {
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
		minimumBalance: Yup.number()
			.nullable(true)
			.transform(value => (isNaN(value) ? null : value))
			.min(1)
			.required(),
		isFree: Yup.bool().required(),
		characteristics: Yup.array()
			.when('empty', (empty, schema) => (depopulate ? schema.of(Yup.string()) : schema))
			.transform((currentValue, originalValue) => {
				return depopulate
					? currentValue
							.sort((characteristicA, characteristicB) => characteristicA.type.localeCompare(characteristicB.type))
							.map(characteristic => characteristic._id)
					: currentValue;
			}),
		shops: Yup.array()
			.when('empty', (empty, schema) => (depopulate ? schema.of(Yup.object()) : schema))
			.transform((currentValue, originalValue) => {
				return depopulate
					? currentValue
							.sort((shopA, shopB) => shopA.numberReceipts - shopB.numberReceipts)
							.map(shop => ({
								...shop,
								shop: shop.shop._id,
							}))
					: currentValue;
			}),
	});
};

export default positionSchema;
