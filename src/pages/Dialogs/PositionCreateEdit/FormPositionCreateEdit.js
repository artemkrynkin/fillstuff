import React from 'react';
import { Form, Field, FieldArray } from 'formik';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import translitRu from 'shared/translit/ru';
import { unitTypes, unitTypeTransform, characteristicTypeTransform } from 'shared/checkPositionAndReceipt';

import { onAddCharacteristicInPosition, checkCharacteristicsOnAbsenceInPosition } from 'src/helpers/positionUtils';

import NumberFormat from 'src/components/NumberFormat';
import { SelectAutocompleteCreate } from 'src/components/selectAutocomplete';
import Chips from 'src/components/Chips';
import Tooltip from 'src/components/Tooltip';
import MenuItem from 'src/components/MenuItem';

import stylesGlobal from 'src/styles/globals.module.css';
import styles from './index.module.css';

const FormPositionCreateEdit = props => {
	const {
		onCloseDialog,
		onChangeShopFields,
		onCreateCharacteristic,
		currentStudioId,
		characteristics,
		type,
		shopLinkVisible,
		isLoadingCharacteristics,
		formikProps: { errors, isSubmitting, setFieldValue, touched, values },
	} = props;

	return (
		<Form>
			<DialogContent>
				<Grid className={stylesGlobal.formLabelControl} wrap="nowrap" alignItems="flex-start" container>
					<InputLabel error={Boolean(touched.name && errors.name)} style={{ minWidth: 146 }}>
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
					<InputLabel error={Boolean(touched.unitReceipt && errors.unitReceipt)} style={{ width: 146 }}>
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
					<InputLabel error={Boolean(touched.unitRelease && errors.unitRelease)} style={{ minWidth: 146 }}>
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
					<InputLabel error={Boolean(touched.isFree && errors.isFree)} style={{ minWidth: 146 }}>
						Вид реализации
					</InputLabel>
					<Grid>
						<Grid alignItems="center" container>
							{type === 'create' || !values.activeReceipt ? (
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
							) : (
								<Tooltip
									title={<div style={{ width: 250 }}>Можно изменять только при отсутствии поступлений на&nbsp;реализации.</div>}
									placement="bottom"
								>
									<ToggleButtonGroup value={values.isFree} size="small" exclusive>
										<ToggleButton value={false} disabled={true}>
											Платный
										</ToggleButton>
										<ToggleButton value={true} disabled={true}>
											Бесплатный
										</ToggleButton>
									</ToggleButtonGroup>
								</Tooltip>
							)}
						</Grid>
					</Grid>
				</Grid>

				<Grid className={stylesGlobal.formLabelControl} wrap="nowrap" alignItems="flex-start" container>
					<InputLabel error={Boolean(touched.minimumBalance && errors.minimumBalance)} style={{ width: 146 }}>
						Минимальный остаток
					</InputLabel>
					<Grid>
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
								style={{ marginLeft: 10 }}
								interactive
							>
								<FontAwesomeIcon className={styles.helpIcon} icon={['fal', 'question-circle']} />
							</Tooltip>
						</Grid>
					</Grid>
				</Grid>

				<Divider style={{ margin: '8px 0 20px' }} />

				<Typography variant="h6" gutterBottom>
					Информация для закупок
				</Typography>

				<Grid
					className={stylesGlobal.formLabelControl}
					style={{ marginBottom: 12 }}
					wrap="nowrap"
					alignItems="flex-start"
					spacing={2}
					container
				>
					<Grid className={stylesGlobal.formLabelControl} xs={shopLinkVisible ? 7 : 12} style={{ marginBottom: 0 }} item>
						<InputLabel style={{ display: 'inline-flex', minWidth: 146 }}>Магазин / Ссылка</InputLabel>
						<Field
							name="shopName"
							as={TextField}
							placeholder={shopLinkVisible ? 'Название' : 'Название магазина или ссылка на товар'}
							inputProps={{
								onChange: ({ target: { value } }) => onChangeShopFields(value, setFieldValue),
							}}
							style={{ width: 'calc(100% - 156px)' }}
							fullWidth
						/>
					</Grid>
					{shopLinkVisible ? (
						<Grid className={stylesGlobal.formLabelControl} xs={5} style={{ marginBottom: 0 }} item>
							<Field name="shopLink" as={TextField} placeholder="Ссылка на товар" autoFocus={type === 'create'} fullWidth />
						</Grid>
					) : null}
				</Grid>

				<FieldArray
					name="characteristics"
					validateOnChange={false}
					render={arrayHelpersCharacteristics => (
						<Grid>
							{values.characteristics.length ? (
								<Grid
									className={stylesGlobal.formLabelControl}
									style={{ marginBottom: 11 }}
									wrap="nowrap"
									alignItems="flex-start"
									container
								>
									<InputLabel style={{ display: 'inline-flex', minWidth: 146 }}>Характеристики</InputLabel>
									<Grid style={{ marginTop: 7, width: 'calc(100% - 120px)' }} container>
										<Chips
											chips={values.characteristics}
											onRenderChipLabel={value => (
												<span>
													<span style={{ fontWeight: 600 }}>{characteristicTypeTransform(value.type)}</span>: {value.label}
												</span>
											)}
											onRemoveChip={(chips, index) => arrayHelpersCharacteristics.remove(index)}
										/>
									</Grid>
								</Grid>
							) : null}

							{checkCharacteristicsOnAbsenceInPosition(values).length ? (
								<Grid className={stylesGlobal.formLabelControl} wrap="nowrap" alignItems="flex-start" spacing={2} container>
									<Grid className={stylesGlobal.formLabelControl} xs={6} style={{ marginBottom: 0 }} item>
										{!values.characteristics.length ? (
											<InputLabel style={{ display: 'inline-flex', minWidth: 146 }}>Характеристики</InputLabel>
										) : (
											<InputLabel style={{ display: 'inline-flex', minWidth: 146 }} />
										)}
										<FormControl style={{ width: 'calc(100% - 156px)' }}>
											<Field
												name="characteristicTemp.type"
												as={Select}
												inputProps={{
													onChange: ({ target: { value } }) => {
														if (!values.characteristicTemp.type || values.characteristicTemp.type !== value) {
															setFieldValue('characteristicTemp', {
																type: value,
																value: '',
																valueTemp: '',
															});
														}
													},
												}}
												renderValue={value => {
													if (!value) return 'Выберите';
													else return characteristicTypeTransform(value);
												}}
											>
												{checkCharacteristicsOnAbsenceInPosition(values).map((characteristicType, index) => (
													<MenuItem key={index} value={characteristicType}>
														{characteristicTypeTransform(characteristicType)}
													</MenuItem>
												))}
											</Field>
										</FormControl>
									</Grid>

									<Grid xs={6} item>
										<FormControl style={{ width: 'calc(100% - 42px)', zIndex: 'initial' }}>
											<Field
												name="characteristicTemp.value"
												component={SelectAutocompleteCreate}
												isClearable
												isDisabled={isLoadingCharacteristics || !values.characteristicTemp.type}
												isLoading={isLoadingCharacteristics}
												value={values.characteristicTemp.value}
												inputValue={values.characteristicTemp.valueTemp}
												onChange={option => {
													setFieldValue('characteristicTemp.value', option);

													if (values.characteristicTemp.valueTemp) {
														setFieldValue('characteristicTemp.valueTemp', '');
													}
												}}
												onInputChange={(value, { action }) => {
													if (action !== 'input-blur' && action !== 'menu-close') {
														setFieldValue('characteristicTemp.valueTemp', value);

														if (values.characteristicTemp.value) {
															setFieldValue('characteristicTemp.value', '');
														}
													}
												}}
												onCreateOption={value =>
													onCreateCharacteristic(
														{
															studio: currentStudioId,
															type: values.characteristicTemp.type,
															value: translitRu(value),
															label: value,
														},
														setFieldValue
													)
												}
												onKeyDown={event => {
													if (event.keyCode === 13 && values.characteristicTemp.type && values.characteristicTemp.value) {
														onAddCharacteristicInPosition(values, setFieldValue, arrayHelpersCharacteristics);
													} else if (event.keyCode === 13 && !values.characteristicTemp.valueTemp) {
														return event.preventDefault();
													}
												}}
												menuPlacement="auto"
												menuPosition="fixed"
												placeholder="Выберите или создайте"
												noOptionsMessage={() => 'Не создано ни одного значения, введите текст, чтобы создать'}
												options={characteristics.filter(value => value.type === values.characteristicTemp.type)}
											/>
										</FormControl>
										<div className={styles.addCharacteristic}>
											<IconButton
												onClick={() => onAddCharacteristicInPosition(values, setFieldValue, arrayHelpersCharacteristics)}
												disabled={!values.characteristicTemp.type || !values.characteristicTemp.value}
											>
												<FontAwesomeIcon icon={['fal', 'check-circle']} />
											</IconButton>
										</div>
									</Grid>
								</Grid>
							) : null}
						</Grid>
					)}
				/>
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
