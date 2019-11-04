import * as Yup from 'yup';

const filterSchema = Yup.object().shape({
	amountFromView: Yup.string().strip(),
	amountToView: Yup.string().strip(),
});

export default filterSchema;
