import * as Yup from 'yup';

const filterSchema = Yup.object().shape({
	amountFromView: Yup.string().strip(),
	amountToView: Yup.string().strip(),
	shopNameView: Yup.string().strip(),
});

export default filterSchema;
