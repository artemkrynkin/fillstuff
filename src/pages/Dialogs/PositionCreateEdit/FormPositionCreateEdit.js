import React from 'react';
import { Form, Field, FieldArray } from 'formik';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import { unitTypes, unitTypeTransform } from 'shared/checkPositionAndReceipt';

import NumberFormat from 'src/components/NumberFormat';
import Tooltip from 'src/components/Tooltip';

import FormFieldArrayCharacteristics from './FormFieldArrayCharacteristics';
import FormFieldArrayShops from './FormFieldArrayShops';

import stylesGlobal from 'src/styles/globals.module.css';
import styles from './index.module.css';

const FormPositionCreateEdit = props => {
	const {
		onCloseDialog,
		onGetCharacteristics,
		onCreateCharacteristic,
		characteristics,
		shops,
		type,
		formikProps: { errors, isSubmitting, setFieldValue, touched, values },
	} = props;

	const labelStyle = { width: 150 };

	return (
		<Form>
			<DialogContent>
				<Grid className={stylesGlobal.formLabelControl} wrap="nowrap" alignItems="flex-start" container>
					<InputLabel error={Boolean(touched.name && errors.name)} style={labelStyle} data-inline>
						Наименование
					</InputLabel>
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

				<Grid className={stylesGlobal.formLabelControl} wrap="nowrap" alignItems="flex-start" container>
					<InputLabel error={Boolean(touched.unitReceipt && errors.unitReceipt)} style={labelStyle} data-inline>
						Единица поступления
					</InputLabel>
					<Grid>
						<Grid alignItems="center" container>
							{type === 'create' || !values.hasReceipts ? (
								<ToggleButtonGroup
									value={values.unitReceipt}
									onChange={(event, value) => {
										if (value === null) return;

										setFieldValue('unitReceipt', value);

										if (value === 'pce') setFieldValue('unitRelease', 'pce');
									}}
									size="small"
									exclusive
								>
									{unitTypes.map(unitType => (
										<ToggleButton key={unitType} value={unitType}>
											{unitTypeTransform(unitType)}
										</ToggleButton>
									))}
								</ToggleButtonGroup>
							) : (
								<Tooltip
									title={<div style={{ width: 250 }}>Можно изменять только до&nbsp;внесения первого поступления.</div>}
									placement="bottom"
								>
									<ToggleButtonGroup value={values.unitReceipt} size="small" exclusive>
										{unitTypes.map(unitType => (
											<ToggleButton key={unitType} value={unitType} disabled={true}>
												{unitTypeTransform(unitType)}
											</ToggleButton>
										))}
									</ToggleButtonGroup>
								</Tooltip>
							)}
						</Grid>
					</Grid>
				</Grid>

				<Grid className={stylesGlobal.formLabelControl} wrap="nowrap" alignItems="flex-start" container>
					<InputLabel error={Boolean(touched.unitRelease && errors.unitRelease)} style={labelStyle} data-inline>
						Единица отпуска
					</InputLabel>
					<Grid>
						<Grid alignItems="center" container>
							{type === 'create' || !values.hasReceipts ? (
								<ToggleButtonGroup
									value={values.unitRelease}
									onChange={(event, value) => {
										if (value === null) return;

										setFieldValue('unitRelease', value);

										if (value === 'nmp') {
											setFieldValue('unitReceipt', 'nmp');
										}
									}}
									size="small"
									exclusive
								>
									{unitTypes.map(unitType => (
										<ToggleButton key={unitType} value={unitType}>
											{unitTypeTransform(unitType)}
										</ToggleButton>
									))}
								</ToggleButtonGroup>
							) : (
								<Tooltip
									title={<div style={{ width: 250 }}>Можно изменять только до&nbsp;внесения первого поступления.</div>}
									placement="bottom"
								>
									<ToggleButtonGroup value={values.unitRelease} size="small" exclusive>
										{unitTypes.map(unitType => (
											<ToggleButton key={unitType} value={unitType} disabled={true}>
												{unitTypeTransform(unitType)}
											</ToggleButton>
										))}
									</ToggleButtonGroup>
								</Tooltip>
							)}
						</Grid>
					</Grid>
				</Grid>

				<Grid className={stylesGlobal.formLabelControl} wrap="nowrap" alignItems="flex-start" container>
					<InputLabel error={Boolean(touched.isFree && errors.isFree)} style={labelStyle} data-inline>
						Вид реализации
					</InputLabel>
					<ToggleButtonGroup
						value={values.isFree}
						onChange={(event, value) => {
							if (value === null) return;

							setFieldValue('isFree', value);
						}}
						size="small"
						exclusive
					>
						<ToggleButton value={false}>Платный</ToggleButton>
						<ToggleButton value={true}>Бесплатный</ToggleButton>
					</ToggleButtonGroup>
				</Grid>

				<Grid className={stylesGlobal.formLabelControl} wrap="nowrap" alignItems="flex-start" container>
					<InputLabel error={Boolean(touched.minimumBalance && errors.minimumBalance)} style={labelStyle} data-inline>
						Минимальный остаток
					</InputLabel>
					<Grid alignItems="center" container>
						<Field
							name="minimumBalance"
							placeholder="0"
							error={Boolean(touched.minimumBalance && errors.minimumBalance)}
							helperText={(touched.minimumBalance && errors.minimumBalance) || ''}
							as={TextField}
							InputProps={{
								inputComponent: NumberFormat,
								inputProps: {
									allowNegative: false,
								},
							}}
						/>
						<Tooltip
							title={
								<div style={{ width: 270 }}>
									Достигнув этого значения вы&nbsp;получите сигнал о&nbsp;необходимости пополнить запасы позиции.
									<br />
									<br />
									При расчете учитывайте время необходимое для закупки (заказ, доставку и&nbsp;тд.) и&nbsp;интенсивность расхода позиции.
								</div>
							}
							placement="bottom"
							style={{ marginLeft: 8 }}
							interactive
						>
							<FontAwesomeIcon className={styles.iconHelp} icon={['fal', 'question-circle']} />
						</Tooltip>
					</Grid>
				</Grid>

				<Divider style={{ margin: '8px 0 20px' }} />

				<Typography variant="h6" gutterBottom>
					Информация для закупок
				</Typography>

				<FieldArray name="characteristics" validateOnChange={false}>
					{props => (
						<FormFieldArrayCharacteristics
							labelStyle={labelStyle}
							onGetCharacteristics={onGetCharacteristics}
							onCreateCharacteristic={onCreateCharacteristic}
							characteristics={characteristics}
							arrayHelpers={props}
							formikProps={{ errors, isSubmitting, setFieldValue, touched, values }}
						/>
					)}
				</FieldArray>

				<FieldArray name="shops" validateOnChange={false}>
					{props => (
						<FormFieldArrayShops
							labelStyle={labelStyle}
							shops={shops}
							arrayHelpers={props}
							formikProps={{ errors, isSubmitting, setFieldValue, touched, values }}
						/>
					)}
				</FieldArray>
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

export default FormPositionCreateEdit;
