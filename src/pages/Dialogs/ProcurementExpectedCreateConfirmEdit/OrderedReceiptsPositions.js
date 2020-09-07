import React, { useState } from 'react';
import loadable from '@loadable/component';

import { procurementPositionTransform } from 'src/helpers/utils';

import { SelectAutocompleteCreate } from 'src/components/selectAutocomplete';

import OrderedReceiptPosition from './OrderedReceiptPosition';

import styles from './index.module.css';

const DialogPositionCreate = loadable(() => import('src/pages/Dialogs/PositionCreateEdit' /* webpackChunkName: "Dialog_PositionCreate" */));

const DialogPositionCreateReplacement = loadable(() =>
	import('src/pages/Dialogs/PositionCreateEdit' /* webpackChunkName: "Dialog_PositionCreateReplacement" */)
);

const DialogPositionEditReplacement = loadable(() =>
	import('src/pages/Dialogs/PositionCreateEdit' /* webpackChunkName: "Dialog_PositionEditReplacement" */)
);

const OrderedReceiptsPositions = props => {
	const {
		dialogRef,
		receiptInitialValues,
		positions: {
			data: positions,
			isFetching: isLoadingPositions,
			// error: errorPositions
		},
		arrayHelpers: { push, replace },
		formikProps: { errors, isSubmitting, values },
	} = props;
	const [textSearchPosition, setTextSearchPosition] = useState('');
	const [positionIndexInProcurement, setPositionIndexInProcurement] = useState(undefined);
	const [dialogData, setDialogData] = useState({
		position: null,
		positionReplacement: null,
	});
	const [dialogOpenedName, setDialogOpenedName] = useState('');
	const [dialogs, setDialogs] = useState({
		dialogPositionCreate: false,
		dialogPositionCreateReplacement: false,
		dialogPositionEditReplacement: false,
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
			? positions.filter(
					position => !values.orderedReceiptsPositions.some(selectedPosition => selectedPosition.position._id === position._id)
			  )
			: [];

	return (
		<div className={styles.positions}>
			<div className="sentinel-topAddPositionContainer" />
			<div className={styles.addPositionContainer}>
				<div className={styles.addPositionWrap}>
					<SelectAutocompleteCreate
						TextFieldProps={{
							error: typeof errors.orderedReceiptsPositions === 'string',
							helperText: typeof errors.orderedReceiptsPositions === 'string' && errors.orderedReceiptsPositions,
						}}
						isDisabled={isSubmitting}
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
				</div>
			</div>

			{values.orderedReceiptsPositions.length ? (
				<div className={styles.positionsItems}>
					{values.orderedReceiptsPositions.map((orderedReceiptPosition, index) => (
						<OrderedReceiptPosition
							key={orderedReceiptPosition.position._id}
							setPositionIndexInProcurement={setPositionIndexInProcurement}
							onOpenDialogByName={onOpenDialogByName}
							index={index}
							orderedReceiptPosition={orderedReceiptPosition}
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
						push(receiptInitialValues(procurementPositionTransform(position)));

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

			<DialogPositionCreateReplacement
				type="create-replacement"
				dialogOpen={dialogs.dialogPositionCreateReplacement}
				onCloseDialog={() => onCloseDialogByName('dialogPositionCreateReplacement')}
				onExitedDialog={() => onExitedDialogByName('positionReplacement')}
				onCallback={position => {
					const orderedReceiptPosition = values.orderedReceiptsPositions[positionIndexInProcurement];

					replace(positionIndexInProcurement, { ...orderedReceiptPosition, position: procurementPositionTransform(position) });

					setPositionIndexInProcurement(undefined);
				}}
				sendRequest={false}
				selectedPosition={dialogOpenedName === 'dialogPositionCreateReplacement' ? dialogData.positionReplacement : null}
			/>

			<DialogPositionEditReplacement
				type="edit-replacement"
				dialogOpen={dialogs.dialogPositionEditReplacement}
				onCloseDialog={() => onCloseDialogByName('dialogPositionEditReplacement')}
				onExitedDialog={() => onExitedDialogByName('positionReplacement')}
				onCallback={position => {
					const orderedReceiptPosition = values.orderedReceiptsPositions[positionIndexInProcurement];

					replace(positionIndexInProcurement, { ...orderedReceiptPosition, position: procurementPositionTransform(position) });

					setPositionIndexInProcurement(undefined);
				}}
				sendRequest={false}
				selectedPosition={dialogOpenedName === 'dialogPositionEditReplacement' ? dialogData.positionReplacement : null}
			/>
		</div>
	);
};

export default OrderedReceiptsPositions;
