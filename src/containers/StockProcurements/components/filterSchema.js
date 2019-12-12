import * as Yup from 'yup';

const filterSchema = Yup.object().shape({
	dateStartView: Yup.date().strip(),
	dateEndView: Yup.date().strip(),
});

export default filterSchema;
