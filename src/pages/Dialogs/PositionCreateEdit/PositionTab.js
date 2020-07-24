import React from 'react';
import { Field, Form } from 'formik';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import DialogContent from '@material-ui/core/DialogContent';
import Tooltip from '@material-ui/core/Tooltip';

import { unitTypes, unitTypeTransform } from 'shared/checkPositionAndReceipt';

import NumberFormat from 'src/components/NumberFormat';

import stylesGlobal from 'src/styles/globals.module.css';
import styles from './index.module.css';

const PositionTab = props => {
	const {
		type,
		formikProps: { errors, setFieldValue, touched, values },
	} = props;

	const labelStyle = { width: 150 };

	return (
		<DialogContent dividers={true}>
			<div className={styles.minHeightContent}>
				<Form>
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

					<Grid wrap="nowrap" alignItems="flex-start" container>
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
								placement="top"
							>
								<span className={styles.helpIcon}>
									<FontAwesomeIcon icon={['fal', 'question-circle']} />
								</span>
							</Tooltip>
						</Grid>
					</Grid>
				</Form>
			</div>
		</DialogContent>
	);
};

export default PositionTab;
