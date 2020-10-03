import React from 'react';
import momentTz from 'moment-timezone';
import { Field, Form } from 'formik';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import InputLabel from '@material-ui/core/InputLabel';

import CheckboxWithLabel from 'src/components/CheckboxWithLabel';
import MenuItem from 'src/components/MenuItem';

import stylesGlobal from 'src/styles/globals.module.css';
// import { checkPermissions } from 'shared/roles-access-rights';

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

const FormGeneralSettings = props => {
	const {
		// currentUserRole,
		formikProps: { errors, isSubmitting, touched },
	} = props;

	// const timezone = timezones.find(timezone => timezone.name === currentStudio.timezone);

	const labelStyle = { width: 130 };

	return (
		<Form>
			<Grid className={stylesGlobal.formLabelControl} wrap="nowrap" alignItems="flex-start" style={{ maxWidth: 500 }} container>
				<InputLabel error={Boolean(touched.name && errors.name)} style={labelStyle} data-inline>
					Название:
				</InputLabel>
				{/*{checkPermissions(currentUserRole, ['studio.full_control']) ? (*/}
				<Field
					name="name"
					error={Boolean(touched.name && errors.name)}
					helperText={(touched.name && errors.name) || ''}
					as={TextField}
					inputProps={{
						maxLength: 60,
					}}
					fullWidth
				/>
				{/*) : (*/}
				{/*	<TextField*/}
				{/*		className="padding-none"*/}
				{/*		InputProps={{*/}
				{/*			readOnly: true,*/}
				{/*			value: currentStudio.name,*/}
				{/*		}}*/}
				{/*		fullWidth*/}
				{/*	/>*/}
				{/*)}*/}
			</Grid>
			<Grid className={stylesGlobal.formLabelControl} wrap="nowrap" alignItems="flex-start" style={{ maxWidth: 500 }} container>
				<InputLabel error={Boolean(touched.timezone && errors.timezone)} style={labelStyle} data-inline>
					Часовой пояс:
				</InputLabel>
				<FormControl fullWidth>
					{/*{checkPermissions(currentUserRole, ['studio.full_control']) ? (*/}
					<Field
						name="timezone"
						as={Select}
						error={Boolean(touched.timezone && errors.timezone)}
						renderValue={value => {
							if (!value) return 'Выберите';
							else return value;
						}}
					>
						<MenuItem value="">Не выбран</MenuItem>
						{timezones.map((timezone, index) => (
							<MenuItem key={index} value={timezone.name}>
								({timezone.offset}) {timezone.name}
							</MenuItem>
						))}
					</Field>
					{/*) : (*/}
					{/*	<TextField*/}
					{/*		className="padding-none"*/}
					{/*		InputProps={{*/}
					{/*			readOnly: true,*/}
					{/*			value: `(${timezone.offset}) ${timezone.name}`,*/}
					{/*		}}*/}
					{/*		fullWidth*/}
					{/*	/>*/}
					{/*)}*/}
					{touched.timezone && errors.timezone ? <FormHelperText error>{errors.timezone}</FormHelperText> : null}
				</FormControl>
			</Grid>
			<Divider style={{ marginBottom: 10 }} />
			<Grid wrap="nowrap" alignItems="flex-start" style={{ maxWidth: 500 }} container>
				<InputLabel error={Boolean(touched.timezone && errors.timezone)} style={labelStyle} data-inline>
					Настройки закупок:
				</InputLabel>
				<Grid direction="column" container>
					<Grid item>
						<Field
							type="checkbox"
							name="settings.procurements.compensateCostDelivery"
							Label={{ label: 'Компенсировать стоимость доставки' }}
							as={CheckboxWithLabel}
							disabled={isSubmitting}
						/>
					</Grid>
				</Grid>
			</Grid>
			{/*{checkPermissions(currentUserRole, ['studio.full_control']) ? (*/}
			<Grid className={stylesGlobal.gridFormFooter} justify="flex-end" style={{ marginTop: 20 }} container>
				<Button type="submit" disabled={isSubmitting} variant="contained" color="primary">
					{isSubmitting ? <CircularProgress size={20} style={{ position: 'absolute' }} /> : null}
					<span className="loading-button-label" style={{ opacity: Number(!isSubmitting) }}>
						Сохранить
					</span>
				</Button>
			</Grid>
			{/*) : null}*/}
		</Form>
	);
};

export default FormGeneralSettings;
