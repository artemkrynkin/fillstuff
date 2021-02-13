import React, { useState, useEffect, Suspense, lazy } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import TextField from '@material-ui/core/TextField';
import { createFilterOptions } from '@material-ui/lab/Autocomplete';
import Grid from '@material-ui/core/Grid';

import Autocomplete from 'src/components/Autocomplete';

import { getShops } from 'src/actions/shops';

const DialogShopCreate = lazy(() => import('src/views/Dialogs/ShopCreateEdit'));

const filter = createFilterOptions();

const filterOptionsAutocomplete = (options, params) => {
	const filtered = filter(options, params);

	filtered.unshift({
		inputValue: params.inputValue,
		name: params.inputValue ? (
			<>
				Создать магазин <b>{params.inputValue}</b>
			</>
		) : (
			'Создать новый магазин'
		),
		itemCreation: true,
	});

	return filtered;
};

const getOptionLabelAutocomplete = option => {
	if (typeof option === 'string') {
		return option;
	}
	if (option.inputValue || option.itemCreation) {
		return option.inputValue;
	}
	return option.name;
};

function ShopAutocomplete({ formikProps: { isSubmitting, values, touched, errors, setFieldValue }, ...props }) {
	const [dialogShopCreate, setDialogShopCreate] = useState(false);
	const [newShop, setNewShop] = useState({ name: '' });
	const [options, setOptions] = useState([]);
	const [loading, setLoading] = useState(false);

	const onOpenAutocomplete = () => setLoading(true);

	const onChangeAutocomplete = (event, newValue) => {
		if (newValue?.itemCreation) {
			setNewShop({ name: newValue.inputValue });
			setTimeout(() => toggleVisibleDialogShopCreate());
		} else {
			setFieldValue('shop', newValue, false);
		}
	};

	const toggleVisibleDialogShopCreate = () => setDialogShopCreate(prevVisible => !prevVisible);

	const onCallbackDialogShopCreate = response => {
		if (response.status === 'success') {
			const { data: shop } = response;

			setFieldValue('shop', shop, false);
		}
	};

	useEffect(() => {
		if (!loading || options.length) {
			return setLoading(false);
		}

		(async () => {
			try {
				const response = await props.getShops();

				setOptions(response.data);
			} catch (error) {}

			setLoading(false);
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [loading]);

	return (
		<>
			<Grid alignItems="flex-start" container>
				<Autocomplete
					value={values.shop}
					onOpen={onOpenAutocomplete}
					onChange={onChangeAutocomplete}
					filterOptions={filterOptionsAutocomplete}
					getOptionLabel={getOptionLabelAutocomplete}
					renderOption={option => option.name}
					renderInput={params => (
						<TextField
							placeholder="Выберите магазин или создайте новый"
							{...params}
							error={touched.shop && Boolean(errors.shop)}
							helperText={touched.shop && errors.shop}
							InputProps={{ ...params.InputProps }}
						/>
					)}
					options={options}
					loading={loading}
					disabled={isSubmitting}
					clearOnBlur={false}
					selectOnFocus
					handleHomeEndKeys
					openOnFocus
					fullWidth
				/>
			</Grid>

			<Suspense fallback={null}>
				<DialogShopCreate
					type="create"
					dialogOpen={dialogShopCreate}
					onCloseDialog={toggleVisibleDialogShopCreate}
					onCallback={onCallbackDialogShopCreate}
					selectedShop={newShop}
				/>
			</Suspense>
		</>
	);
}

const mapDispatchToProps = {
	getShops,
};

export default compose(connect(null, mapDispatchToProps))(ShopAutocomplete);
