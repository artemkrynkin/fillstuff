import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';

import { characteristicsTypes as characteristicsTypesInitial, characteristicTypeTransform } from 'shared/checkPositionAndReceipt';

import { SelectAutocompleteCreate } from 'src/components/selectAutocomplete';
import Chips from 'src/components/Chips';
import MenuItem from 'src/components/MenuItem';

import { createCharacteristic, getCharacteristics } from 'src/actions/characteristics';

const Characteristics = props => {
	const {
		characteristics: {
			data: characteristics,
			isFetching: isLoadingCharacteristics,
			// error: errorCharacteristics
		},
		arrayHelpers: { push, remove },
		formikProps: { isSubmitting, values },
	} = props;
	const [characteristicTemp, setCharacteristicTemp] = useState({
		type: '',
		name: '',
	});
	const [characteristicsTypes, setCharacteristicsTypes] = useState([]);
	const [allCharacteristicsTypesUsed, setAllCharacteristicsTypesUsed] = useState(false);

	const onGetCharacteristics = characteristicType => props.getCharacteristics({ type: characteristicType });

	const onCreateCharacteristic = (characteristic, callback) => {
		props.createCharacteristic(characteristic).then(({ status, data: characteristic }) => {
			if (status === 'success' && callback) {
				callback(characteristic);
			}
		});
	};

	useEffect(() => {
		setCharacteristicsTypes(
			characteristicsTypesInitial.map(characteristicType => {
				const newCharacteristicType = {
					name: characteristicType,
					hidden: false,
				};

				if (values.characteristics.some(characteristic => characteristic.type === characteristicType)) {
					newCharacteristicType.hidden = true;
				}

				return newCharacteristicType;
			})
		);
	}, [values.characteristics]);

	useEffect(() => {
		setAllCharacteristicsTypesUsed(!characteristicsTypes.every(characteristicType => characteristicType.hidden));
	}, [characteristicsTypes]);

	return (
		<>
			<Grid xs={3} item>
				<InputLabel data-inline>Характеристики</InputLabel>
			</Grid>
			<Grid xs={9} item>
				<Grid direction="column" container>
					{values.characteristics.length ? (
						<Chips
							chips={values.characteristics.sort((characteristicA, characteristicB) =>
								characteristicA.type.localeCompare(characteristicB.type)
							)}
							onRenderChipLabel={value => (
								<>
									<span style={{ fontWeight: 600 }}>{characteristicTypeTransform(value.type)}</span>: {value.name}
								</>
							)}
							onRemoveChip={(chips, index) => remove(index)}
							disabled={isSubmitting}
							style={{ marginTop: 7, marginBottom: allCharacteristicsTypesUsed ? 10 : -5 }}
						/>
					) : null}

					{allCharacteristicsTypesUsed ? (
						<Grid alignItems="center" spacing={2} container>
							<Grid xs={4} item>
								<Select
									value={characteristicTemp.type}
									onChange={({ target: { value } }) => {
										if (!characteristicTemp.type || characteristicTemp.type !== value) {
											onGetCharacteristics(value);
											setCharacteristicTemp({
												type: value,
												name: '',
											});
										}
									}}
									renderValue={value => {
										if (!value) return 'Выберите';
										else return characteristicTypeTransform(value);
									}}
									fullWidth
								>
									{characteristicsTypes.map(characteristicType => (
										<MenuItem key={characteristicType.name} value={characteristicType.name} hidden={characteristicType.hidden}>
											{characteristicTypeTransform(characteristicType.name)}
										</MenuItem>
									))}
								</Select>
							</Grid>
							<Grid xs={8} item>
								<SelectAutocompleteCreate
									isDisabled={isSubmitting || !characteristicTemp.type}
									isLoading={isLoadingCharacteristics}
									value={characteristicTemp.name}
									inputValue={characteristicTemp.name}
									onChange={characteristic => {
										if (characteristic) {
											push(characteristic);

											setCharacteristicTemp({ type: '', name: '' });
										}
									}}
									onInputChange={(value, { action }) => {
										if (action !== 'input-blur' && action !== 'menu-close') {
											setCharacteristicTemp({
												type: characteristicTemp.type,
												name: value,
											});
										}
									}}
									onCreateOption={value =>
										onCreateCharacteristic(
											{
												type: characteristicTemp.type,
												name: value,
											},
											characteristic => {
												if (characteristic) {
													push(characteristic);

													setCharacteristicTemp({ type: '', name: '' });
												}
											}
										)
									}
									onKeyDown={event => {
										if (event.keyCode === 13 && !characteristicTemp.name) return event.preventDefault();
									}}
									getOptionValue={option => option._id}
									getOptionLabel={option => option.name}
									getNewOptionData={(value, option) => {
										if (characteristics.some(characteristic => characteristic.name === value)) return undefined;

										return {
											name: option,
											_id: value,
											__isNew__: true,
										};
									}}
									menuPlacement="auto"
									menuPosition="fixed"
									placeholder="Выберите или создайте"
									noOptionsMessage={() => 'Не создано ни одного значения, введите текст, чтобы создать'}
									options={characteristics}
									isClearable
								/>
							</Grid>
						</Grid>
					) : null}
				</Grid>
			</Grid>
		</>
	);
};

const mapStateToProps = state => {
	return {
		characteristics: state.characteristics,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getCharacteristics: params => dispatch(getCharacteristics({ params })),
		createCharacteristic: characteristic => dispatch(createCharacteristic({ data: { characteristic } })),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Characteristics);
