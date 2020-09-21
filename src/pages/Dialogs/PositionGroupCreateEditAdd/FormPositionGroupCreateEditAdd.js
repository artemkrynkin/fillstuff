import React, { useState, useRef } from 'react';
import ClassNames from 'classnames';

import { Form, Field, FieldArray } from 'formik';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';

import Chips from 'src/components/Chips';
import PositionSummary from 'src/components/PositionSummary';

import { SearchTextField } from './styles';
import stylesGlobal from 'src/styles/globals.module.css';
import styles from './index.module.css';

const selectPositionsClasses = (selectedPositions, positionId) => {
	return ClassNames({
		[styles.selectPosition]: true,
		[styles.selectPositionSelected]: selectedPositions.some(selectedPosition => selectedPosition._id === positionId),
	});
};

const findPositionByFullName = (position, searchText) => {
	if (position.positionGroup) return false;

	const searchTextLowercase = String(searchText).toLowerCase();

	const positionName = position.characteristics
		.reduce((fullName, characteristic) => `${fullName} ${characteristic.name}`, position.name)
		.toLowerCase();

	return positionName.indexOf(searchTextLowercase) !== -1;
};

const FormPositionGroupCreateEditAdd = props => {
	const {
		onCloseDialog,
		type,
		positions: {
			data: allPositions,
			isFetching: isLoadingAllPositions,
			// error: errorPositions
		},
		formikProps: { errors, isSubmitting, touched, values },
	} = props;
	const searchTextFieldPosition = useRef(null);
	const [searchTextPosition, setSearchTextPosition] = useState('');

	const onTypeSearchTextPosition = ({ target: { value } }) => setSearchTextPosition(value);
	const onClearSearchTextPosition = () => {
		setSearchTextPosition('');

		searchTextFieldPosition.current.focus();
	};

	const positions =
		!isLoadingAllPositions && allPositions ? allPositions.filter(position => findPositionByFullName(position, searchTextPosition)) : [];

	return (
		<Form>
			<DialogContent style={{ overflow: 'initial' }}>
				{/create|edit/.test(type) ? (
					<Grid className={stylesGlobal.formLabelControl}>
						<Field
							name="name"
							error={Boolean(touched.name && errors.name)}
							helperText={(touched.name && errors.name) || ''}
							label="Название"
							as={TextField}
							inputProps={{
								maxLength: 60,
							}}
							autoFocus
							fullWidth
						/>
					</Grid>
				) : null}

				{/create|add/.test(type) ? (
					<Grid className={styles.selectPositions} direction="column" wrap="nowrap" container>
						<InputLabel error={typeof errors.positions === 'string'}>
							{typeof errors.positions === 'string' ? errors.positions : 'Выберите позиции'}
						</InputLabel>
						<div className={styles.searchTextFieldContainer}>
							<SearchTextField
								inputRef={searchTextFieldPosition}
								placeholder="Введите название позиции"
								value={searchTextPosition}
								onChange={onTypeSearchTextPosition}
								fullWidth
							/>
							{searchTextPosition ? (
								<ButtonBase onClick={onClearSearchTextPosition} className={styles.searchTextFieldClear}>
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
													key={position._id}
													className={selectPositionsClasses(values.positions, position._id)}
													onClick={() => {
														const selectedPositionIndex = values.positions.findIndex(
															selectedPosition => selectedPosition._id === position._id
														);

														searchTextFieldPosition.current.focus();

														if (!!~selectedPositionIndex) return arrayHelpers.remove(selectedPositionIndex);
														else return arrayHelpers.push(position);
													}}
												>
													<div className={styles.selectPositionCheckbox}>
														<FontAwesomeIcon icon={['far', 'check']} />
													</div>
													<PositionSummary
														className={styles.positionName}
														name={position.name}
														characteristics={position.characteristics}
													/>
												</div>
											))
										) : !positions.length && searchTextPosition ? (
											<Typography variant="caption" align="center" display="block" style={{ marginTop: 20 }}>
												Ничего не найдено
											</Typography>
										) : (
											<Typography variant="caption" align="center" display="block" style={{ marginTop: 20 }}>
												Нет позиций для группировки
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
													{position.name}
													{/*{position.characteristics.reduce(*/}
													{/*	(fullName, characteristic) => `${fullName} ${characteristic.name}`,*/}
													{/*	position.name*/}
													{/*)}*/}
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
								{type === 'create' ? 'Создать' : type === 'edit' ? 'Сохранить' : 'Добавить'}
							</span>
						</Button>
					</Grid>
				</Grid>
			</DialogActions>
		</Form>
	);
};

export default FormPositionGroupCreateEditAdd;
