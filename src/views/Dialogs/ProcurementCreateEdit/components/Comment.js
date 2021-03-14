import React from 'react';
import { Field } from 'formik';

import TextField from '@material-ui/core/TextField';

function Comment({ formikProps: { isSubmitting, touched, errors } }) {
	return (
		<Field
			name="comment"
			error={touched.comment && Boolean(errors.comment)}
			helperText={touched.comment && errors.comment}
			as={TextField}
			placeholder="Номер телефона курьера, трек-номер заказа, любая полезная информация о доставке"
			rows={2}
			rowsMax={4}
			disabled={isSubmitting}
			multiline
			fullWidth
		/>
	);
}

export default Comment;
