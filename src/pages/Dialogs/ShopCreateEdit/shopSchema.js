import * as Yup from 'yup';

const shopSchema = Yup.object().shape({
	name: Yup.string()
		.min(2)
		.max(60)
		.required(),
	link: Yup.string(),
});

export default shopSchema;
