import React from 'react';
import validator from 'validator';

import { Form, Field, FieldArray } from 'formik';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import translitRu from 'shared/translit/ru';
import { unitTypes, unitTypeTransform, characteristicTypeTransform } from 'shared/checkPositionAndReceipt';

import { onAddCharacteristicInPosition, checkCharacteristicsOnAbsenceInPosition } from 'src/helpers/positionUtils';

import CheckboxWithLabel from 'src/components/CheckboxWithLabel';
import { DialogActions } from 'src/components/Dialog';
import NumberFormat from 'src/components/NumberFormat';
import { SelectAutocompleteCreate } from 'src/components/selectAutocomplete';
import Chips from 'src/components/Chips';

import stylesGlobal from 'src/styles/globals.module.css';
import styles from './index.module.css';
import InputAdornment from '@material-ui/core/InputAdornment';

const FormPositionCreateEdit = props => {
	const {
		onCloseDialog,
		onChangeShopFields,
		onCreateCharacteristic,
		currentStockId,
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
						inputProps={{
							maxLength: 60,
						}}
						autoFocus
						fullWidth
					/>
				</Grid>

				<Grid className={stylesGlobal.formLabelControl} wrap="nowrap" alignItems="flex-start" container>
					<InputLabel error={Boolean(touched.unitReceipt && errors.unitReceipt)} style={{ minWidth: 146 }}>
						Единица поступления
					</InputLabel>
					<FormControl fullWidth>
						<Field
							name="unitReceipt"
							as={Select}
							inputProps={{
								onChange: ({ target: { value } }) => {
									setFieldValue('unitReceipt', value);

									if (value === 'pce') setFieldValue('unitIssue', value);
								},
							}}
							error={Boolean(touched.unitReceipt && errors.unitReceipt)}
						>
							<MenuItem value="" disabled>
								Выберите
							</MenuItem>
							{unitTypes.map((unitType, index) => (
								<MenuItem key={index} value={unitType}>
									{unitTypeTransform(unitType)}
								</MenuItem>
							))}
						</Field>
						{touched.unitReceipt && errors.unitReceipt ? <FormHelperText error>{errors.unitReceipt}</FormHelperText> : null}
					</FormControl>
				</Grid>

				<Grid className={stylesGlobal.formLabelControl} wrap="nowrap" alignItems="flex-start" container>
					<InputLabel error={Boolean(touched.unitIssue && errors.unitIssue)} style={{ minWidth: 146 }}>
						Единица отпуска
					</InputLabel>
					<Grid>
						<FormControl fullWidth>
							<Field
								name="unitIssue"
								as={Select}
								inputProps={{
									onChange: ({ target: { value } }) => {
										setFieldValue('unitIssue', value);

										if (value === 'nmp') setFieldValue('unitReceipt', value);
									},
								}}
								error={Boolean(touched.unitIssue && errors.unitIssue)}
							>
								<MenuItem value="" disabled>
									Выберите
								</MenuItem>
								{unitTypes.map((unitType, index) => (
									<MenuItem key={index} value={unitType}>
										{unitTypeTransform(unitType)}
									</MenuItem>
								))}
							</Field>
							{touched.unitIssue && errors.unitIssue ? <FormHelperText error>{errors.unitIssue}</FormHelperText> : null}
						</FormControl>
						<Field type="checkbox" name="isFree" Label={{ label: 'Предоставляется студией бесплатно' }} as={CheckboxWithLabel} />
					</Grid>
				</Grid>

				<Grid className={stylesGlobal.formLabelControl} wrap="nowrap" alignItems="flex-start" container>
					<InputLabel error={Boolean(touched.minimumBalance && errors.minimumBalance)} style={{ minWidth: 146 }}>
						Мин. остаток
						<br />
						{`в ${values.unitReceipt === 'nmp' && values.unitIssue !== 'pce' ? 'упаковках' : 'штуках'}`}
					</InputLabel>
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
						fullWidth
					/>
				</Grid>

				{!values.isFree ? (
					<Grid className={stylesGlobal.formLabelControl} wrap="nowrap" alignItems="flex-start" container>
						<InputLabel error={Boolean(touched.extraCharge && errors.extraCharge)} style={{ minWidth: 146 }}>
							Процент студии
						</InputLabel>
						<Field
							name="extraCharge"
							placeholder="0"
							error={Boolean(touched.extraCharge && errors.extraCharge)}
							helperText={(touched.extraCharge && errors.extraCharge) || ''}
							as={TextField}
							InputProps={{
								endAdornment: <InputAdornment position="end">%</InputAdornment>,
								inputComponent: NumberFormat,
								inputProps: {
									decimalScale: 0,
									allowNegative: false,
									isAllowed: values => {
										const { formattedValue, floatValue } = values;
										return formattedValue === '' || floatValue <= 1000;
									},
								},
							}}
							fullWidth
						/>
					</Grid>
				) : null}

				<Grid
					className={stylesGlobal.formLabelControl}
					style={{ marginBottom: 12 }}
					wrap="nowrap"
					alignItems="flex-start"
					spacing={2}
					container
				>
					<Grid className={stylesGlobal.formLabelControl} xs={shopLinkVisible ? 6 : 12} style={{ marginBottom: 0 }} item>
						<InputLabel error={Boolean(touched.shopName && errors.shopName)} style={{ display: 'inline-flex', minWidth: 146 }}>
							Магазин / Ссылка
						</InputLabel>
						<Field
							name="shopName"
							error={Boolean(touched.shopName && errors.shopName)}
							helperText={(touched.shopName && errors.shopName) || ''}
							as={TextField}
							placeholder={shopLinkVisible ? 'Название' : 'Ссылка на товар или название магазина'}
							inputProps={{
								onChange: ({ target: { value } }) => onChangeShopFields(value, setFieldValue),
							}}
							style={{ width: 'calc(100% - 156px)' }}
							fullWidth
						/>
					</Grid>
					{shopLinkVisible ? (
						<Grid className={stylesGlobal.formLabelControl} xs={6} style={{ marginBottom: 0 }} item>
							<Field
								name="shopLink"
								as={TextField}
								placeholder="Ссылка на товар"
								autoFocus={type === 'create'}
								style={{ width: 'calc(100% - 42px)' }}
							/>
							<div className={styles.externalLink}>
								<IconButton size="small" disabled={!validator.isURL(values.shopLink)} disableRipple disableFocusRipple>
									{validator.isURL(values.shopLink) ? (
										<a
											// eslint-disable-next-line
											href={!~values.shopLink.search(/^http[s]?\:\/\//) ? `//${values.shopLink}` : `${values.shopLink}`}
											target="_blank"
											rel="noreferrer noopener"
										>
											<FontAwesomeIcon icon={['fal', 'external-link-square']} />
										</a>
									) : (
										<FontAwesomeIcon icon={['fal', 'external-link-square']} />
									)}
								</IconButton>
							</div>
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
											>
												<MenuItem value="" disabled>
													Выберите
												</MenuItem>
												{checkCharacteristicsOnAbsenceInPosition(values).map((characteristicType, index) => (
													<MenuItem key={index} value={characteristicType}>
														{characteristicTypeTransform(characteristicType)}
													</MenuItem>
												))}
											</Field>
										</FormControl>
									</Grid>

									<Grid xs={6} item>
										<FormControl style={{ width: 'calc(100% - 42px)' }}>
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
															stock: currentStockId,
															type: values.characteristicTemp.type,
															value: translitRu(value),
															label: value,
														},
														setFieldValue
													)
												}
												menuPlacement="auto"
												menuPosition="fixed"
												placeholder="Выберите или создайте"
												noOptionsMessage={() => 'Не создано ни одного значения, введите текст, чтобы создать'}
												options={characteristics.filter(value => value.type === values.characteristicTemp.type)}
											/>
										</FormControl>
										<div className={styles.addCharacteristic}>
											<IconButton
												size="small"
												onClick={() => onAddCharacteristicInPosition(values, setFieldValue, arrayHelpersCharacteristics)}
												disabled={values.characteristicTemp.type === '' || values.characteristicTemp.value === ''}
												disableRipple
												disableFocusRipple
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
			<DialogActions
				leftHandleProps={{
					handleProps: {
						onClick: onCloseDialog,
					},
					text: 'Отмена',
				}}
				rightHandleProps={{
					handleProps: {
						type: 'submit',
						disabled: isSubmitting,
					},
					text: type === 'create' ? 'Создать' : 'Сохранить',
					isLoading: isSubmitting,
				}}
			/>
		</Form>
	);
};

export default FormPositionCreateEdit;
