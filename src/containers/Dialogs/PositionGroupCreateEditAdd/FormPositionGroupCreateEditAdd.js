import React from 'react';
import ClassNames from 'classnames';

import { Form, Field, FieldArray } from 'formik';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogContent from '@material-ui/core/DialogContent';
import ButtonBase from '@material-ui/core/ButtonBase';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import { DialogActions } from 'src/components/Dialog';
import NumberFormat from 'src/components/NumberFormat';
import Chips from 'src/components/Chips';
import CheckboxWithLabel from 'src/components/CheckboxWithLabel';

import { SearchTextField } from './styles';
import stylesGlobal from 'src/styles/globals.module.css';
import styles from './index.module.css';

const selectPositionsClasses = (selectedPositions, positionId) => {
	return ClassNames({
		[styles.selectPosition]: true,
		[styles.selectPositionSelected]: selectedPositions.some(selectedPosition => selectedPosition._id === positionId),
	});
};

const findOnlyPositionByName = (position, string) => {
	if (position.positionGroup) return false;

	const searchString = String(string).toLowerCase();
	const characteristics = position.characteristics.reduce(
		(fullCharacteristics, characteristic) => `${fullCharacteristics} ${characteristic.label}`,
		''
	);
	const positionName = String(position.name + ' ' + characteristics).toLowerCase();

	return positionName.indexOf(searchString) !== -1;
};

const compareByName = (a, b) => {
	if (a.name > b.name) return 1;
	else if (a.name < b.name) return -1;
	else return 0;
};

const FormPositionGroupCreateEditAdd = props => {
	const {
		onCloseDialog,
		onTypeSearch,
		onClearSearch,
		type,
		positions: {
			data: allPositions,
			isFetching: isLoadingAllPositions,
			// error: errorPositions
		},
		searchField: { searchString, searchInputRef },
		formikProps: { errors, isSubmitting, touched, values },
	} = props;

	const positions =
		!isLoadingAllPositions && allPositions
			? allPositions.filter(position => findOnlyPositionByName(position, searchString)).sort(compareByName)
			: [];

	return (
		<Form>
			<DialogContent style={{ overflow: 'initial' }}>
				{type === 'create' || type === 'edit' ? (
					<div>
						<Grid className={stylesGlobal.formLabelControl} style={{ marginBottom: 12 }} wrap="nowrap" alignItems="flex-start" container>
							<InputLabel error={Boolean(touched.name && errors.name)} style={{ minWidth: 100 }}>
								Наименование:
							</InputLabel>
							<Field
								name="name"
								error={Boolean(touched.name && errors.name)}
								helperText={(touched.name && errors.name) || ''}
								as={TextField}
								autoFocus
								fullWidth
							/>
						</Grid>

						<Grid className={stylesGlobal.formLabelControl} style={{ marginBottom: 12, paddingLeft: 110 }}>
							<Field type="checkbox" name="dividedPositions" Label={{ label: 'Считать позиции раздельно' }} as={CheckboxWithLabel} />
						</Grid>

						{!values.dividedPositions ? (
							<Grid className={stylesGlobal.formLabelControl} wrap="nowrap" alignItems="flex-start" container>
								<InputLabel error={Boolean(touched.minimumBalance && errors.minimumBalance)} style={{ minWidth: 100 }}>
									Мин. остаток:
								</InputLabel>
								<FormControl fullWidth>
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
								</FormControl>
							</Grid>
						) : null}
					</div>
				) : null}

				{type === 'create' || type === 'add' ? (
					<Grid className={styles.selectPositions} direction="column" wrap="nowrap" container>
						<InputLabel error={typeof errors.positions === 'string'} style={{ minWidth: 151 }}>
							Выберите позиции: {typeof errors.positions === 'string' ? errors.positions : null}
						</InputLabel>
						<div className={styles.textFieldSearchContainer}>
							<SearchTextField
								inputRef={searchInputRef}
								placeholder="Поиск позиций"
								value={searchString}
								onChange={onTypeSearch}
								fullWidth
							/>
							{searchString ? (
								<ButtonBase onClick={onClearSearch} className={styles.textFieldSearchClear}>
									<FontAwesomeIcon icon={['fal', 'times']} />
								</ButtonBase>
							) : null}
						</div>
						<FieldArray
							name="positions"
							validateOnChange={false}
							render={arrayHelpers => (
								<div className={styles.selectPositionsWrap}>
									{!isLoadingAllPositions ? (
										positions.length ? (
											positions.map((position, index) => (
												<div
													key={index}
													className={selectPositionsClasses(values.positions, position._id)}
													onClick={() => {
														const selectedPositionIndex = values.positions.findIndex(
															selectedPosition => selectedPosition._id === position._id
														);

														searchInputRef.current.focus();

														if (!!~selectedPositionIndex) return arrayHelpers.remove(selectedPositionIndex);
														else return arrayHelpers.push(position);
													}}
												>
													<div className={styles.selectPositionCheckbox}>
														<FontAwesomeIcon icon={['far', 'check']} />
													</div>
													<div>
														{position.characteristics.reduce(
															(fullCharacteristics, characteristic) => `${fullCharacteristics} ${characteristic.label}`,
															position.name
														)}
													</div>
												</div>
											))
										) : !positions.length && searchString ? (
											<Typography variant="caption" align="center" display="block" style={{ marginTop: 20 }}>
												Среди позиций совпадений не найдено.
											</Typography>
										) : (
											<Typography variant="caption" align="center" display="block" style={{ marginTop: 20 }}>
												Нет позиций для группировки.
											</Typography>
										)
									) : (
										<div children={<CircularProgress size={20} />} style={{ marginTop: 20, textAlign: 'center' }} />
									)}
									{values.positions.length ? (
										<Chips
											className={styles.selectedPositions}
											chips={values.positions}
											onRenderChipLabel={position => (
												<span>
													{position.characteristics.reduce(
														(fullCharacteristics, characteristic) => `${fullCharacteristics} ${characteristic.label}`,
														position.name
													)}
												</span>
											)}
											onRemoveChip={(chips, index) => arrayHelpers.remove(index)}
										/>
									) : null}
								</div>
							)}
						/>
					</Grid>
				) : null}
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
					text: type === 'create' ? 'Создать' : type === 'edit' ? 'Сохранить' : 'Добавить',
					isLoading: isSubmitting,
				}}
			/>
		</Form>
	);
};

export default FormPositionGroupCreateEditAdd;
