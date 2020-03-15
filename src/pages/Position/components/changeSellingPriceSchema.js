import * as Yup from 'yup';

const changeSellingPriceSchema = Yup.object().shape({
	sellingPrice: Yup.number()
		.nullable(true)
		.transform(value => (isNaN(value) ? null : value))
		.min(0),
	unitSellingPrice: Yup.number()
		.nullable(true)
		.transform(value => (isNaN(value) ? null : value))
		.min(0),
	markupPercent: Yup.number()
		.transform(value => (isNaN(value) ? 0 : value))
		.min(0),
	markup: Yup.number()
		.transform(value => (isNaN(value) ? 0 : value))
		.min(0),
	unitMarkup: Yup.number()
		.transform(value => (isNaN(value) ? 0 : value))
		.min(0),
});

export default changeSellingPriceSchema;
