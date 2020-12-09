import * as Yup from 'yup';

const studioSchema = Yup.object().shape({
	name: Yup.string()
		.min(2)
		.max(60)
		.required(),
});

export default studioSchema;
