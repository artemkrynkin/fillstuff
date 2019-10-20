import * as Yup from 'yup';

const purchaseSchema = Yup.object().shape({
	shopName: Yup.string().required(),
	fare: Yup.number().required(),
});

export default purchaseSchema;
