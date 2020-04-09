import React from 'react';
import { Form, Field } from 'formik';
import validator from 'validator';

import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import stylesGlobal from 'src/styles/globals.module.css';

const FormShopCreateEdit = props => {
	const {
		onCloseDialog,
		type,
		formikProps: { errors, isSubmitting, touched },
	} = props;

	return (
		<Form>
			<DialogContent>
				<Grid className={stylesGlobal.formLabelControl}>
					<Field
						name="name"
						error={Boolean(touched.name && errors.name)}
						helperText={(touched.name && errors.name) || ''}
						label="Название магазина"
						as={TextField}
						inputProps={{
							maxLength: 60,
						}}
						autoFocus
						fullWidth
					/>
				</Grid>
				<Grid>
					<Field
						name="link"
						error={Boolean(touched.link && errors.link)}
						helperText={(touched.link && errors.link) || ''}
						label="Сайт магазина"
						as={TextField}
						inputProps={{
							maxLength: 60,
						}}
						validate={value => {
							if (!validator.isURL(value)) return 'Неккоректная ссылка';
						}}
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
						<Button type="submit" disabled={isSubmitting} variant="contained" color="primary" size="large" fullWidth>
							{isSubmitting ? <CircularProgress size={20} style={{ position: 'absolute' }} /> : null}
							<span className="loading-button-label" style={{ opacity: Number(!isSubmitting) }}>
								{type === 'create' ? 'Создать' : 'Сохранить'}
							</span>
						</Button>
					</Grid>
				</Grid>
			</DialogActions>
		</Form>
	);
};

export default FormShopCreateEdit;
