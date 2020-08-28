import React from 'react';
import { Field, FieldArray, Form } from 'formik';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import DialogContent from '@material-ui/core/DialogContent';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import { unitTypes, unitTypeTransform } from 'shared/checkPositionAndReceipt';

import NumberFormat from 'src/components/NumberFormat';
import PositionNameInList from 'src/components/PositionNameInList';

import Characteristics from './Characteristics';

import stylesGlobal from 'src/styles/globals.module.css';
import styles from './index.module.css';

const PositionTab = props => {
	const {
		type,
		formikProps: { errors, setFieldValue, touched, values },
	} = props;

	const typeIsCreateOrEdit = /^(create|edit)$/.test(type);

	return (
		<DialogContent dividers={typeIsCreateOrEdit}>
			<div className={styles.minHeightContent}>
				<Form>
					{!typeIsCreateOrEdit ? (
						<Grid className={stylesGlobal.formLabelControl} wrap="nowrap" alignItems="flex-start" container>
							<Grid xs={3} item>
								<InputLabel style={{ marginTop: 0 }} data-inline>
									Заменяемая позиция
								</InputLabel>
							</Grid>
							<Grid xs={9} item>
								<PositionNameInList name={values.childPosition.name} characteristics={values.childPosition.characteristics} size="sm" />
							</Grid>
						</Grid>
					) : null}

					<Grid className={stylesGlobal.formLabelControl} wrap="nowrap" alignItems="flex-start" container>
						<Grid xs={3} item>
							<InputLabel error={Boolean(touched.name && errors.name)} data-inline>
								Наименование
							</InputLabel>
						</Grid>
						<Grid xs={9} item>
							<Tooltip
								disableFocusListener={typeIsCreateOrEdit}
								disableHoverListener={typeIsCreateOrEdit}
								disableTouchListener={typeIsCreateOrEdit}
								title={<div style={{ textAlign: 'center', width: 220 }}>Можно изменить только при&nbsp;создании новой позиции</div>}
								placement="bottom"
							>
								<div>
									<Field
										name="name"
										error={Boolean(touched.name && errors.name)}
										helperText={(touched.name && errors.name) || ''}
										as={TextField}
										placeholder="Держатели одноразовые, перчатки, салфетки, ватные диски…"
										inputProps={{
											maxLength: 60,
										}}
										disabled={!typeIsCreateOrEdit}
										autoFocus
										fullWidth
									/>
								</div>
							</Tooltip>
						</Grid>
					</Grid>

					<Grid className={stylesGlobal.formLabelControl} wrap="nowrap" alignItems="flex-start" container>
						<FieldArray name="characteristics" validateOnChange={false}>
							{arrayHelpers => <Characteristics arrayHelpers={arrayHelpers} formikProps={props.formikProps} />}
						</FieldArray>
					</Grid>

					<Grid className={stylesGlobal.formLabelControl} wrap="nowrap" alignItems="flex-start" container>
						<Grid xs={3} item>
							<InputLabel error={Boolean(touched.unitReceipt && errors.unitReceipt)} data-inline>
								Единица поступления
							</InputLabel>
						</Grid>
						<Grid xs={9} item>
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
									title={
										<div style={{ textAlign: 'center', width: 220 }}>
											{typeIsCreateOrEdit ? (
												<>Можно изменить только до&nbsp;внесения первого поступления</>
											) : (
												<>Можно изменить только при создании новой позиции</>
											)}
										</div>
									}
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

					<Grid className={stylesGlobal.formLabelControl} wrap="nowrap" alignItems="flex-start" container>
						<Grid xs={3} item>
							<InputLabel error={Boolean(touched.unitRelease && errors.unitRelease)} data-inline>
								Единица отпуска
							</InputLabel>
						</Grid>
						<Grid xs={9} item>
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
									title={
										<div style={{ textAlign: 'center', width: 220 }}>
											{typeIsCreateOrEdit ? (
												<>Можно изменить только до&nbsp;внесения первого поступления</>
											) : (
												<>Можно изменить только при создании новой позиции</>
											)}
										</div>
									}
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

					<Grid className={stylesGlobal.formLabelControl} wrap="nowrap" alignItems="flex-start" container>
						<Grid xs={3} item>
							<InputLabel error={Boolean(touched.isFree && errors.isFree)} data-inline>
								Вид реализации
							</InputLabel>
						</Grid>
						<Grid xs={9} item>
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
					</Grid>

					<Grid wrap="nowrap" alignItems="flex-start" container>
						<Grid xs={3} item>
							<InputLabel error={Boolean(touched.minimumBalance && errors.minimumBalance)} data-inline>
								Минимальный остаток
							</InputLabel>
						</Grid>
						<Grid xs={9} item>
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
											<Typography variant="body2" paragraph>
												Достигнув этого значения вы&nbsp;получите сигнал о&nbsp;необходимости пополнить запасы позиции.
											</Typography>
											<Typography variant="body2">
												При расчете учитывайте время необходимое для закупки (заказ, доставку и&nbsp;тд.) и&nbsp;интенсивность расхода
												позиции.
											</Typography>
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
					</Grid>
				</Form>
			</div>
		</DialogContent>
	);
};

export default PositionTab;
