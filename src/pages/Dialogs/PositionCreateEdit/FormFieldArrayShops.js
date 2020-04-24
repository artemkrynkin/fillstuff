import React, { useState } from 'react';
import loadable from '@loadable/component';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';

import { SelectAutocomplete } from 'src/components/selectAutocomplete';
import Chips from 'src/components/Chips';

const DialogShopCreate = loadable(() => import('src/pages/Dialogs/ShopCreateEdit' /* webpackChunkName: "Dialog_ShopCreateEdit" */));

const FormFieldArrayReceipts = props => {
	const {
		labelStyle,
		shops: {
			data: shops,
			isFetching: isLoadingShops,
			// error: errorShops
		},
		arrayHelpers: { push, remove },
		formikProps: { isSubmitting, values },
	} = props;
	const [dialogShopCreate, setDialogShopCreate] = useState(false);
	const [shopTempName, setShopTempName] = useState('');

	const onOpenDialogShopCreate = () => setDialogShopCreate(true);

	const onCloseDialogShopCreate = () => setDialogShopCreate(false);

	const shopsAvailable =
		!isLoadingShops && shops
			? shops.filter(shop => !values.shops.some(selectedShop => selectedShop.shop && selectedShop.shop._id === shop._id))
			: [];

	return (
		<Grid wrap="nowrap" alignItems="flex-start" container>
			<InputLabel style={labelStyle} data-inline>
				Магазины
			</InputLabel>
			<Grid direction="column" container>
				{values.shops.length ? (
					<Grid style={{ marginTop: 7, marginBottom: 10 }} container>
						<Chips
							chips={values.shops.sort((shopA, shopB) => shopA.numberReceipts - shopB.numberReceipts)}
							onRenderChipLabel={value => <span>{value.shop.name}</span>}
							onRemoveChip={(chips, index) => remove(index)}
							disabled={isSubmitting}
						/>
					</Grid>
				) : null}

				<Grid alignItems="center" spacing={2} container>
					<Grid style={{ flex: '1 1' }} item>
						<SelectAutocomplete
							isDisabled={isSubmitting}
							isLoading={isLoadingShops}
							value={shopTempName}
							inputValue={shopTempName}
							onChange={shop => {
								if (shop) {
									push({
										shop,
										numberReceipts: 0,
									});

									setShopTempName('');
								}
							}}
							onInputChange={(value, { action }) => {
								if (action !== 'input-blur' && action !== 'menu-close') {
									setShopTempName(value);
								}
							}}
							onKeyDown={event => {
								if (event.keyCode === 13 && !setShopTempName) return event.preventDefault();
							}}
							getOptionValue={option => option._id}
							getOptionLabel={option => option.name}
							menuPlacement="auto"
							menuPosition="fixed"
							placeholder="Выберите"
							noOptionsMessage={() =>
								shopsAvailable.length === 0 ? 'Нет магазинов для выбора. Создайте магазин' : 'Среди магазинов совпадений не найдено.'
							}
							options={shopsAvailable}
							isClearable
						/>
					</Grid>
					<Grid item>
						<Button onClick={onOpenDialogShopCreate} variant="outlined" color="primary" disabled={isSubmitting}>
							Новый магазин
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

						push({
							shop,
							numberReceipts: 0,
						});
					}
				}}
			/>
		</Grid>
	);
};

export default FormFieldArrayReceipts;
