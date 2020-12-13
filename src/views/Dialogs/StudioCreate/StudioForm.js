import React from 'react';
import { connect } from 'react-redux';
import { Field, Form, Formik } from 'formik';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';

import history from 'src/helpers/history';

import { createStudio } from 'src/actions/studios';
import { enqueueSnackbar } from 'src/actions/snackbars';

import studioSchema from './studioSchema';

import stylesGlobal from 'src/styles/globals.module.css';

function StudioForm(props) {
	const { onCloseDialog } = props;

	let initialValues = {
		name: '',
	};

	const onSubmit = async values => {
		try {
			await props.createStudio(values);

			onCloseDialog();

			history.push('/');
		} catch (error) {
			props.enqueueSnackbar({
				message: error.message || 'Неизвестная ошибка.',
				options: {
					variant: 'error',
				},
			});
		}
	};

	return (
		<Formik
			initialValues={initialValues}
			validationSchema={studioSchema}
			validateOnBlur={false}
			validateOnChange={false}
			onSubmit={onSubmit}
		>
			{({ isSubmitting, touched, errors }) => (
				<Form>
					<DialogContent>
						<Grid className={stylesGlobal.formLabelControl}>
							<Field
								name="name"
								error={Boolean(touched.name && errors.name)}
								helperText={typeof errors.name === 'string' && touched.name && errors.name}
								label="Название"
								as={TextField}
								inputProps={{
									maxLength: 60,
								}}
								autoFocus
								fullWidth
							/>
						</Grid>
					</DialogContent>
					<DialogActions>
						<Grid spacing={2} container>
							<Grid xs={4} item>
								<Button onClick={onCloseDialog} variant="outlined" size="large" fullWidth>
									Отмена
								</Button>
							</Grid>
							<Grid xs={8} item>
								<Button type="submit" variant="contained" color="primary" size="large" disabled={isSubmitting} fullWidth>
									{isSubmitting ? <CircularProgress size={20} style={{ position: 'absolute' }} /> : null}
									<span className="loading-button-label" style={{ opacity: Number(!isSubmitting) }}>
										Создать
									</span>
								</Button>
							</Grid>
						</Grid>
					</DialogActions>
				</Form>
			)}
		</Formik>
	);
}

const mapDispatchToProps = dispatch => {
	return {
		createStudio: studio => dispatch(createStudio({ data: { studio } })),
		enqueueSnackbar: (...args) => dispatch(enqueueSnackbar(...args)),
	};
};

export default connect(null, mapDispatchToProps)(StudioForm);
