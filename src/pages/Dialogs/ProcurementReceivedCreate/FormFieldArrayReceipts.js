import React, { useState } from 'react';
import ClassNames from 'classnames';
import loadable from '@loadable/component';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import FormHelperText from '@material-ui/core/FormHelperText';

import { SelectAutocomplete } from 'src/components/selectAutocomplete';

import { positionTransform } from './utils';
import FormFieldArrayReceipt from './FormFieldArrayReceipt';

import styles from './index.module.css';

const DialogPositionCreate = loadable(() =>
	import('src/pages/Dialogs/PositionCreateEdit' /* webpackChunkName: "Dialog_PositionCreateEdit" */)
);

const addPositionContainerClasses = (formEditable, status) =>
	ClassNames({
		[styles.addPositionContainer]: true,
		[styles.disabled]: !formEditable || status === 'expected',
	});

const FormFieldArrayReceipts = props => {
	const {
		dialogRef,
		receiptInitialValues,
		positions: {
			data: positions,
			isFetching: isLoadingPositions,
			// error: errorPositions
		},
		formEditable,
		arrayHelpers: { push, remove },
		formikProps: { errors, isSubmitting, setFieldValue, touched, values },
	} = props;
	const [textSearchPosition, setTextSearchPosition] = useState('');
	const [dialogPositionCreate, setDialogPositionCreate] = useState(false);

	const onChangeTextSearchPosition = value => setTextSearchPosition(value);

	const onOpenDialogPositionCreate = () => setDialogPositionCreate(true);

	const onCloseDialogPositionCreate = () => setDialogPositionCreate(false);

	const positionsAvailable =
		!isLoadingPositions && positions
			? positions.filter(position => !values.receipts.some(receipt => receipt.position && receipt.position._id === position._id))
			: [];

	return (
		<div className={styles.receipts}>
			<div className="sentinel-topAddPositionContainer" />
			<div className={addPositionContainerClasses(formEditable, values.status)}>
				<div className={styles.addPositionWrap}>
					<Grid alignItems="flex-start" spacing={2} container>
						<Grid style={{ flex: '1 1' }} item>
							<SelectAutocomplete
								isDisabled={isSubmitting || !formEditable}
								isLoading={isLoadingPositions}
								value={textSearchPosition}
								onChange={(option, { action }) => {
									if (action === 'select-option') {
										push(receiptInitialValues(option));
										onChangeTextSearchPosition(textSearchPosition);

										setTimeout(() => {
											dialogRef.current.querySelector('.sentinel-bottom').scrollIntoView({
												behavior: 'smooth',
												block: 'end',
											});
										}, 0);
									}
								}}
								onInputChange={(value, { action }) => {
									if (action !== 'input-blur' && action !== 'menu-close') {
										onChangeTextSearchPosition(value);
									}
								}}
								menuPlacement="auto"
								menuPosition="fixed"
								placeholder="Выберите позицию"
								noOptionsMessage={() =>
									positionsAvailable.length === 0 ? 'Нет позиций для выбора. Создайте позицию' : 'Среди позиций совпадений не найдено.'
								}
								options={positionsAvailable}
								isClearable
							/>
							{typeof errors.receipts === 'string' ? <FormHelperText error>{errors.receipts}</FormHelperText> : null}
						</Grid>
						<Grid item>
							<Button onClick={onOpenDialogPositionCreate} variant="outlined" color="primary" tabIndex={-1}>
								Новая позиция
							</Button>
						</Grid>
					</Grid>
				</div>
			</div>

			{values.receipts.length ? (
				<div className={styles.receiptsItems}>
					{values.receipts.map((receipt, index) => (
						<FormFieldArrayReceipt
							key={receipt.position._id}
							receipt={receipt}
							index={index}
							formEditable={formEditable}
							arrayHelpers={{ remove }}
							formikProps={{ errors, isSubmitting, setFieldValue, touched, values }}
						/>
					))}
				</div>
			) : null}

			<DialogPositionCreate
				type="create"
				dialogOpen={dialogPositionCreate}
				onCloseDialog={onCloseDialogPositionCreate}
				onCallback={response => {
					if (response.status === 'success') {
						const position = response.data;

						push(receiptInitialValues(positionTransform(position)));

						setTimeout(() => {
							dialogRef.current.querySelector('.sentinel-bottom').scrollIntoView({
								behavior: 'smooth',
								block: 'end',
							});
						}, 0);
					}
				}}
			/>
		</div>
	);
};

export default FormFieldArrayReceipts;