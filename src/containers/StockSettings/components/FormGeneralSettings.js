import React from 'react';
import momentTz from 'moment-timezone';
import { Field, Form } from 'formik';

import stylesGlobal from 'src/styles/globals.module.css';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';

import CheckboxWithLabel from 'src/components/CheckboxWithLabel';

import { checkPermissions } from 'shared/roles-access-rights';

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
		stocks,
		currentStock,
		currentUserRole,
		formikProps: { errors, isSubmitting, touched },
	} = props;

	const timezone = timezones.find(timezone => timezone.name === currentStock.timezone);

	return (
		<Form>
			<Grid className={stylesGlobal.formLabelControl} wrap="nowrap" alignItems="flex-start" container>
				<InputLabel error={Boolean(touched.name && errors.name)} style={{ minWidth: 130 }}>
					Название:
				</InputLabel>
				{checkPermissions(currentUserRole, ['stock.full_control']) ? (
					<Field
						name="name"
						error={Boolean(touched.name && errors.name)}
						helperText={(touched.name && errors.name) || ''}
						as={TextField}
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
					<TextField
						className="padding-none"
						InputProps={{
							readOnly: true,
							value: currentStock.name,
						}}
						fullWidth
					/>
				)}
			</Grid>
			<Grid className={stylesGlobal.formLabelControl} wrap="nowrap" alignItems="flex-start" container>
				<InputLabel error={Boolean(touched.timezone && errors.timezone)} style={{ minWidth: 130 }}>
					Часовой пояс:
				</InputLabel>
				<FormControl fullWidth>
					{checkPermissions(currentUserRole, ['stock.full_control']) ? (
						<Field name="timezone" as={Select} error={Boolean(touched.timezone && errors.timezone)}>
							<MenuItem value="">Не выбран</MenuItem>
							{timezones.map((timezone, index) => {
								return (
									<MenuItem key={index} value={timezone.name}>
										({timezone.offset}) {timezone.name}
									</MenuItem>
								);
							})}
						</Field>
					) : (
						<TextField
							className="padding-none"
							InputProps={{
								readOnly: true,
								value: `(${timezone.offset}) ${timezone.name}`,
							}}
							fullWidth
						/>
					)}
					{touched.timezone && errors.timezone ? <FormHelperText error>{errors.timezone}</FormHelperText> : null}
				</FormControl>
			</Grid>
			<Divider style={{ marginBottom: 10 }} />
			<Grid className={stylesGlobal.formLabelControl} wrap="nowrap" alignItems="flex-start" style={{ marginBottom: 0 }} container>
				<InputLabel error={Boolean(touched.timezone && errors.timezone)} style={{ minWidth: 130 }}>
					Настройки закупок:
				</InputLabel>
				<Grid direction="column" container>
					<Grid item>
						<Field
							type="checkbox"
							name="actualSellingPriceInProcurementCreate"
							Label={{ label: 'При создании новой закупки всегда использовать актуальную цену продажи' }}
							as={CheckboxWithLabel}
							disabled={isSubmitting}
						/>
					</Grid>
				</Grid>
			</Grid>
			{checkPermissions(currentUserRole, ['stock.full_control']) ? (
				<Grid className={stylesGlobal.gridFormFooter} justify="flex-end" style={{ marginTop: 20 }} container>
					<Button type="submit" disabled={isSubmitting} variant="contained" color="primary">
						{isSubmitting ? <CircularProgress size={20} style={{ position: 'absolute' }} /> : null}
						<span className="loading-button-label" style={{ opacity: Number(!isSubmitting) }}>
							Сохранить
						</span>
					</Button>
				</Grid>
			) : null}
		</Form>
	);
};

export default FormGeneralSettings;
