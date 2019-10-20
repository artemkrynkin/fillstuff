import React from 'react';
import { connect } from 'react-redux';
import momentTz from 'moment-timezone';

import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import * as Yup from 'yup';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import MuiTextField from '@material-ui/core/TextField';

import { checkPermissions, findMemberInStock } from 'shared/roles-access-rights';

import CardPaper from 'src/components/CardPaper';
import { SelectField } from 'src/components/SelectField';

import { editStock } from 'src/actions/stocks';

import stylesGlobal from 'src/styles/globals.module.css';
import styles from './generalSettings.module.css';

const timezones = require('shared/timezones')
	.map(timezone => {
		return {
			name: timezone,
			offset: `GTM${momentTz.tz(timezone).format('Z')}`,
			offsetNumber: momentTz.tz.zone(timezone).parse(),
		};
	})
	.sort((timezoneA, timezoneB) => {
		return timezoneA.offsetNumber - timezoneB.offsetNumber;
	});

const PersonalDataSchema = Yup.object().shape({
	name: Yup.string()
		.min(2)
		.required(),
	timezone: Yup.string().required(),
});

const GeneralSettings = props => {
	const { stocks, currentUser, currentStock, currentUserRole = findMemberInStock(currentUser._id, currentStock).role } = props;

	const timezoneIndex = timezones.findIndex(timezone => timezone.name === currentStock.timezone);

	return (
		<CardPaper elevation={1} leftContent="Общие" title style={{ marginBottom: 16 }}>
			<Formik
				initialValues={{
					name: currentStock.name,
					timezone: currentStock.timezone,
				}}
				validationSchema={PersonalDataSchema}
				validateOnBlur={false}
				enableReinitialize
				onSubmit={(values, actions) => {
					props.editStock(values).then(response => {
						if (response.status === 'success') {
							actions.resetForm();
						} else {
							if (response.data.formErrors) {
								response.data.formErrors.forEach(error => {
									actions.setFieldError(error.field, error.message);
								});
							}

							actions.setSubmitting(false);
						}
					});
				}}
				render={({ errors, touched, isSubmitting }) => (
					<Form>
						<Grid className={stylesGlobal.formLabelControl} wrap="nowrap" container>
							<FormLabel style={{ minWidth: 124 }}>Название:</FormLabel>
							{checkPermissions(currentUserRole, ['stock.full_control']) ? (
								<Field
									name="name"
									component={TextField}
									validate={value => {
										if (stocks && stocks.some(stock => stock._id !== currentStock._id && stock.name === value)) {
											return 'Склад с таким названием уже существует';
										}
									}}
									inputProps={{
										maxLength: 60,
									}}
								/>
							) : (
								<MuiTextField
									name="name"
									InputProps={{
										readOnly: true,
										value: currentStock.name,
									}}
									fullWidth
								/>
							)}
						</Grid>
						<Grid className={stylesGlobal.formLabelControl} wrap="nowrap" style={{ marginBottom: 0 }} container>
							<FormLabel style={{ minWidth: 124 }}>Часовой пояс:</FormLabel>
							<FormControl fullWidth>
								{checkPermissions(currentUserRole, ['stock.full_control']) ? (
									<SelectField name="timezone" error={Boolean(errors.timezone)}>
										<MenuItem value="">Не выбран</MenuItem>
										{timezones.map((timezone, index) => {
											return (
												<MenuItem key={index} value={timezone.name}>
													({timezone.offset}) {timezone.name}
												</MenuItem>
											);
										})}
									</SelectField>
								) : (
									<MuiTextField
										name="timezone"
										InputProps={{
											readOnly: true,
											value: `(${timezones[timezoneIndex].offset}) ${timezones[timezoneIndex].name}`,
										}}
										fullWidth
									/>
								)}
								{Boolean(errors.timezone) ? <FormHelperText error>{errors.timezone}</FormHelperText> : null}
							</FormControl>
						</Grid>
						{checkPermissions(currentUserRole, ['stock.full_control']) ? (
							<Grid className={styles.gridFormFooter} justify="flex-end" style={{ marginTop: 20 }} container>
								<Button type="submit" disabled={isSubmitting} variant="contained" color="primary">
									{isSubmitting ? <CircularProgress size={20} style={{ position: 'absolute' }} /> : null}
									<span style={{ opacity: Number(!isSubmitting) }}>Сохранить</span>
								</Button>
							</Grid>
						) : null}
					</Form>
				)}
			/>
		</CardPaper>
	);
};

const mapStateToProps = state => {
	return {
		stocks: state.stocks.data,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentStock } = ownProps;

	return {
		editStock: newValues => dispatch(editStock(currentStock._id, newValues)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(GeneralSettings);
