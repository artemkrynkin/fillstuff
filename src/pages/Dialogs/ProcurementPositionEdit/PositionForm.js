import React from 'react';
import { Field, FieldArray, Form } from 'formik';

import Grid from '@material-ui/core/Grid';
import DialogContent from '@material-ui/core/DialogContent';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import stylesGlobal from 'src/styles/globals.module.css';

import Characteristics from './Characteristics';

const PositionForm = props => {
	const {
		onCloseDialog,
		formikProps: { errors, isSubmitting, submitForm, touched },
	} = props;

	return (
		<>
			<DialogContent>
				<Form>
					<Grid className={stylesGlobal.formLabelControl} wrap="nowrap" alignItems="flex-start" container>
						<Grid xs={3} item>
							<InputLabel error={Boolean(touched.name && errors.name)} data-inline>
								Наименование
							</InputLabel>
						</Grid>
						<Grid xs={9} item>
							<Field
								name="name"
								error={Boolean(touched.name && errors.name)}
								helperText={(touched.name && errors.name) || ''}
								as={TextField}
								placeholder="Держатели одноразовые, перчатки, салфетки, ватные диски…"
								inputProps={{
									maxLength: 60,
								}}
								autoFocus
								fullWidth
							/>
						</Grid>
					</Grid>

					<Grid className={stylesGlobal.formLabelControl} wrap="nowrap" alignItems="flex-start" container>
						<FieldArray name="characteristics" validateOnChange={false}>
							{arrayHelpers => <Characteristics arrayHelpers={arrayHelpers} formikProps={props.formikProps} />}
						</FieldArray>
					</Grid>
				</Form>
			</DialogContent>
			<DialogActions>
				<Grid spacing={2} container>
					<Grid xs={4} item>
						<Button onClick={onCloseDialog} variant="outlined" size="large" fullWidth>
							Отмена
						</Button>
					</Grid>
					<Grid xs={8} item>
						<Button onClick={() => submitForm()} disabled={isSubmitting} variant="contained" color="primary" size="large" fullWidth>
							{isSubmitting ? <CircularProgress size={20} style={{ position: 'absolute' }} /> : null}
							<span className="loading-button-label" style={{ opacity: Number(!isSubmitting) }}>
								Сохранить
							</span>
						</Button>
					</Grid>
				</Grid>
			</DialogActions>
		</>
	);
};

export default PositionForm;
