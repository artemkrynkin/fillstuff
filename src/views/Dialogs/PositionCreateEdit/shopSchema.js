import * as Yup from 'yup';

const shopSchema = Yup.object().shape({
	shop: Yup.string().required(),
	link: Yup.string(),
	comment: Yup.string(),
});

export default shopSchema;
