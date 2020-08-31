import React, { useState } from 'react';
import ClassNames from 'classnames';
import loadable from '@loadable/component';

import FormHelperText from '@material-ui/core/FormHelperText';

import { procurementPositionTransform } from 'src/helpers/utils';

import { SelectAutocompleteCreate } from 'src/components/selectAutocomplete';

import FormFieldArrayReceipt from './FormFieldArrayReceipt';

import styles from './index.module.css';
import { isEqual } from 'lodash';

const DialogPositionCreate = loadable(() =>
	import('src/pages/Dialogs/PositionCreateEdit' /* webpackChunkName: "Dialog_PositionCreateEdit" */)
);

const ProcurementPositionEdit = loadable(() =>
	import('src/pages/Dialogs/ProcurementPositionEdit' /* webpackChunkName: "Dialog_ProcurementPositionEdit" */)
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
		arrayHelpers: { push, remove, replace },
		formikProps: { errors, isSubmitting, setFieldValue, touched, values },
	} = props;
	const [textSearchPosition, setTextSearchPosition] = useState('');
	const [dialogData, setDialogData] = useState({
		position: null,
		procurementPosition: null,
	});
	const [dialogOpenedName, setDialogOpenedName] = useState('');
	const [dialogs, setDialogs] = useState({
		dialogPositionCreate: false,
		dialogProcurementPositionEdit: false,
	});

	const onOpenDialogByName = (dialogName, dataType, data) => {
		setDialogOpenedName(dialogName);

		setDialogs({
			...dialogs,
			[dialogName]: true,
		});

		if (dataType && data) {
			setDialogData({
				...dialogData,
				[dataType]: data,
			});
		}
	};

	const onCloseDialogByName = dialogName => {
		setDialogs({
			...dialogs,
			[dialogName]: false,
		});
	};

	const onExitedDialogByName = dataType => {
		setDialogOpenedName('');

		if (dataType) {
			setDialogData({
				...dialogData,
				[dataType]: null,
			});
		}
	};

	const onChangeTextSearchPosition = value => setTextSearchPosition(value);

	const positionsAvailable =
		!isLoadingPositions && positions
			? positions.filter(position => !values.receipts.some(receipt => receipt.position._id === position._id))
			: [];

	return (
		<div className={styles.receipts}>
			<div className="sentinel-topAddPositionContainer" />
			<div className={addPositionContainerClasses(formEditable, values.status)}>
				<div className={styles.addPositionWrap}>
					<SelectAutocompleteCreate
						TextFieldProps={{
							error: Boolean(touched.positions && errors.positions),
						}}
						isDisabled={isSubmitting || !formEditable}
						isLoading={isLoadingPositions}
						value={textSearchPosition}
						onChange={(option, { action }) => {
							if (action === 'select-option') {
								push(receiptInitialValues({ position: option }));
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
						onCreateOption={value => onOpenDialogByName('dialogPositionCreate', 'position', { name: value })}
						getOptionValue={option => option._id}
						getOptionLabel={option => option.label}
						getNewOptionData={(value, option) => {
							if (positionsAvailable.some(position => position.name === value)) return undefined;

							return {
								label: option,
								_id: value,
								__isNew__: true,
							};
						}}
						menuPlacement="auto"
						menuPosition="fixed"
						placeholder="Выберите позицию или создайте"
						noOptionsMessage={() => 'Ничего не найдено.'}
						options={positionsAvailable}
						isClearable
					/>
					{typeof errors.receipts === 'string' ? <FormHelperText error>{errors.receipts}</FormHelperText> : null}
				</div>
			</div>

			{values.receipts.length ? (
				<div className={styles.receiptsItems}>
					{values.receipts.map((receipt, index) => (
						<FormFieldArrayReceipt
							key={receipt.position._id}
							onOpenDialogByName={onOpenDialogByName}
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
				dialogOpen={dialogs.dialogPositionCreate}
				onCloseDialog={() => onCloseDialogByName('dialogPositionCreate')}
				onCallback={response => {
					if (response.status === 'success') {
						const position = response.data;

						push(receiptInitialValues(procurementPositionTransform(position, true)));

						setTimeout(() => {
							dialogRef.current.querySelector('.sentinel-bottom').scrollIntoView({
								behavior: 'smooth',
								block: 'end',
							});
						}, 0);
					}
				}}
				onExitedDialog={() => onExitedDialogByName('position')}
				selectedPosition={dialogOpenedName === 'dialogPositionCreate' ? dialogData.position : null}
			/>

			<ProcurementPositionEdit
				dialogOpen={dialogs.dialogProcurementPositionEdit}
				onCloseDialog={() => onCloseDialogByName('dialogProcurementPositionEdit')}
				onCallback={({ positionIndexInProcurement: index, ...positionEdited }) => {
					const receipt = values.receipts[index];

					const name = positionEdited.name && positionEdited.name !== receipt.position.name ? positionEdited.name : '';
					const characteristics =
						positionEdited.characteristics &&
						positionEdited.characteristics.length &&
						!isEqual(receipt.position.characteristics, positionEdited.characteristics)
							? positionEdited.characteristics
							: '';

					replace(index, {
						...receipt,
						positionChanges: {
							name,
							characteristics,
						},
					});
				}}
				onExitedDialog={() => onExitedDialogByName('procurementPosition')}
				selectedPosition={dialogOpenedName === 'dialogProcurementPositionEdit' ? dialogData.procurementPosition : null}
			/>
		</div>
	);
};

export default FormFieldArrayReceipts;
