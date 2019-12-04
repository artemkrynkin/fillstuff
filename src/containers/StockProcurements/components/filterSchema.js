import * as Yup from 'yup';

const filterSchema = Yup.object().shape({
	dateStartView: Yup.date().strip(),
	dateEndView: Yup.date().strip(),
	amountFromView: Yup.string().strip(),
	amountToView: Yup.string().strip(),
});

export default filterSchema;
