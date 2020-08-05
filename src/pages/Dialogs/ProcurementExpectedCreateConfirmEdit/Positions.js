import React, { useState } from 'react';
import loadable from '@loadable/component';
import { isEqual } from 'lodash';

import FormHelperText from '@material-ui/core/FormHelperText';

import { procurementPositionTransform } from 'src/helpers/utils';

import { SelectAutocompleteCreate } from 'src/components/selectAutocomplete';

import ReceiptTempPosition from './ReceiptTempPosition';

import styles from './index.module.css';

const DialogPositionCreate = loadable(() =>
	import('src/pages/Dialogs/PositionCreateEdit' /* webpackChunkName: "Dialog_PositionCreateEdit" */)
);

const ProcurementPositionEdit = loadable(() =>
	import('src/pages/Dialogs/ProcurementPositionEdit' /* webpackChunkName: "Dialog_ProcurementPositionEdit" */)
);

const FormFieldArrayPositions = props => {
	const {
		dialogRef,
		positions: {
			data: positions,
			isFetching: isLoadingPositions,
			// error: errorPositions
		},
		arrayHelpers: { push, replace },
		formikProps: { errors, isSubmitting, touched, values },
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
			? positions.filter(position => !values.receiptsTempPositions.some(selectedPosition => selectedPosition.position._id === position._id))
			: [];

	return (
		<div className={styles.positions}>
			<div className="sentinel-topAddPositionContainer" />
			<div className={styles.addPositionContainer}>
				<div className={styles.addPositionWrap}>
					<SelectAutocompleteCreate
						TextFieldProps={{
							error: Boolean(touched.receiptsTempPositions && errors.receiptsTempPositions),
						}}
						isDisabled={isSubmitting}
						isLoading={isLoadingPositions}
						value={textSearchPosition}
						onChange={(option, { action }) => {
							if (action === 'select-option') {
								push({
									position: option,
									name: '',
									characteristics: [],
									quantity: '',
								});
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
					{typeof errors.receiptsTempPositions === 'string' ? <FormHelperText error>{errors.receiptsTempPositions}</FormHelperText> : null}
				</div>
			</div>

			{values.receiptsTempPositions.length ? (
				<div className={styles.positionsItems}>
					{values.receiptsTempPositions.map((receiptTempPosition, index) => (
						<ReceiptTempPosition
							key={receiptTempPosition.position._id}
							onOpenDialogByName={onOpenDialogByName}
							index={index}
							receiptTempPosition={receiptTempPosition}
							arrayHelpers={props.arrayHelpers}
							formikProps={props.formikProps}
						/>
					))}
				</div>
			) : null}

			<DialogPositionCreate
				type="create"
				dialogOpen={dialogs.dialogPositionCreate}
				onCloseDialog={() => onCloseDialogByName('dialogPositionCreate')}
				onCallback={({ status, data: position }) => {
					if (status === 'success') {
						const positionTransform = procurementPositionTransform(position);

						push({
							position: positionTransform,
							name: '',
							characteristics: [],
							quantity: '',
						});

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
					const position = values.receiptsTempPositions[index];

					const name = positionEdited.name && positionEdited.name !== position.position.name ? positionEdited.name : '';
					const characteristics =
						positionEdited.characteristics &&
						positionEdited.characteristics.length &&
						!isEqual(position.position.characteristics, positionEdited.characteristics)
							? positionEdited.characteristics
							: '';

					replace(index, {
						...position,
						name,
						characteristics,
					});
				}}
				onExitedDialog={() => onExitedDialogByName('procurementPosition')}
				selectedPosition={dialogOpenedName === 'dialogProcurementPositionEdit' ? dialogData.procurementPosition : null}
			/>
		</div>
	);
};

export default FormFieldArrayPositions;
