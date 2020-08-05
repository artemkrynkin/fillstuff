import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import validator from 'validator';
import { Form, Field } from 'formik';
import loadable from '@loadable/component';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
// import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';

import { SelectAutocompleteCreate } from 'src/components/selectAutocomplete';

import { getShops } from 'src/actions/shops';

const DialogShopCreate = loadable(() => import('src/pages/Dialogs/ShopCreateEdit' /* webpackChunkName: "Dialog_ShopCreateEdit" */));

// const filter = createFilterOptions();

const ShopAddingForm = props => {
	const {
		shops: {
			data: shops,
			isFetching: isLoadingShops,
			// error: errorShops
		},
		formikPropsPosition: { values: valuesPosition },
		onToggleVisibleShopAddingForm,
		formikProps: { errors, setFieldValue, isSubmitting, touched, values },
	} = props;
	const [dialogShopCreate, setDialogShopCreate] = useState(false);
	const [shopsAvailable, setShopsAvailable] = useState([]);
	const [shopTemp, setShopTemp] = useState({});
	const [shopTempName, setShopTempName] = useState('');

	const onOpenDialogShopCreate = value => {
		setShopTemp({ name: value });
		setDialogShopCreate(true);
	};

	const onCloseDialogShopCreate = () => setDialogShopCreate(false);

	useEffect(() => {
		props.getShops();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!isLoadingShops && shops) {
			const shopsAvailable = shops.filter(
				shop => !valuesPosition.shops.some(selectedShop => selectedShop.shop && selectedShop.shop._id === shop._id)
			);

			setShopsAvailable(shopsAvailable);
		}
	}, [isLoadingShops, valuesPosition, shops]);

	return (
		<Form style={{ paddingTop: 1 }}>
			<Grid direction="column" spacing={2} container>
				<Grid item>
					<Grid alignItems="center" spacing={2} container>
						<Grid style={{ flex: '1 1' }} item>
							{/*<Autocomplete*/}
							{/*  value={values.shop}*/}
							{/*  onChange={(event, newShop) => {*/}
							{/*    if (typeof newShop === 'string') {*/}
							{/*      setFieldValue('shop', newShop);*/}
							{/*    } else if (newShop && newShop.inputValue) {*/}
							{/*      setFieldValue('shop', newShop);*/}
							{/*    } else {*/}
							{/*      setFieldValue('shop', newShop);*/}
							{/*    }*/}
							{/*  }}*/}
							{/*  filterOptions={(options, params) => {*/}
							{/*    const filtered = filter(options, params);*/}

							{/*    if (params.inputValue !== '') {*/}
							{/*      console.log(params);*/}
							{/*    }*/}

							{/*    return filtered;*/}
							{/*  }}*/}
							{/*  options={shopsAvailable}*/}
							{/*  getOptionLabel={option => option.name}*/}
							{/*  renderInput={params => <TextField {...params} />}*/}
							{/*  autoHighlight*/}
							{/*/>*/}
							<SelectAutocompleteCreate
								TextFieldProps={{
									error: Boolean(touched.shop && errors.shop),
								}}
								isDisabled={isSubmitting}
								isLoading={isLoadingShops}
								value={values.shop ? values.shop : undefined}
								inputValue={shopTempName}
								onChange={shop => {
									setFieldValue('shop', shop);

									setShopTempName('');
								}}
								onInputChange={(value, { action }) => {
									if (action !== 'input-blur' && action !== 'menu-close') {
										setShopTempName(value);
									}
								}}
								onCreateOption={value => onOpenDialogShopCreate(value)}
								onKeyDown={event => {
									if (event.keyCode === 13 && !shopTempName) return event.preventDefault();
								}}
								getOptionValue={option => option._id}
								getOptionLabel={option => option.name}
								getNewOptionData={(value, option) => {
									if (shopsAvailable.some(shop => shop.name === value)) return undefined;

									return {
										name: option,
										_id: value,
										__isNew__: true,
									};
								}}
								menuPlacement="auto"
								menuPosition="fixed"
								placeholder="Выберите или создайте"
								noOptionsMessage={() => 'Ничего не найдено.'}
								options={shopsAvailable}
								isClearable
								autoFocus={true}
							/>
						</Grid>
						<Grid style={{ flex: '1 1' }} item>
							<Field
								name="link"
								error={Boolean(touched.link && errors.link)}
								placeholder="Ссылка на товар"
								as={TextField}
								validate={value => {
									if (value !== '' && !validator.isURL(value)) return 'Некорректная ссылка';
								}}
								fullWidth
							/>
						</Grid>
					</Grid>
				</Grid>
				<Grid item>
					<Field
						name="comment"
						error={Boolean(touched.comment && errors.comment)}
						as={TextField}
						placeholder="Информация о скидке на позицию, номер менеджера, любая полезная информация"
						rows={2}
						rowsMax={4}
						multiline
						fullWidth
					/>
				</Grid>
				<Grid item>
					<Grid justify="flex-end" container>
						<Button
							onClick={() => onToggleVisibleShopAddingForm(false)}
							disabled={isSubmitting}
							variant="text"
							size="small"
							style={{ marginRight: 8 }}
						>
							Отмена
						</Button>
						<Button type="submit" disabled={isSubmitting} variant="outlined" color="primary" size="small">
							Добавить
						</Button>
					</Grid>
				</Grid>
			</Grid>

			<DialogShopCreate
				type="create"
				dialogOpen={dialogShopCreate}
				onCloseDialog={onCloseDialogShopCreate}
				onCallback={response => {
					if (response.status === 'success') {
						const shop = response.data;

						setFieldValue('shop', shop);
					}
				}}
				selectedShop={dialogShopCreate ? shopTemp : null}
			/>
		</Form>
	);
};

const mapStateToProps = state => {
	return {
		shops: state.shops,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getShops: () => dispatch(getShops()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ShopAddingForm);
