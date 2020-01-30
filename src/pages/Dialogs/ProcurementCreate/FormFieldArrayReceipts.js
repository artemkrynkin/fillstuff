import React, { useState } from 'react';
import { connect } from 'react-redux';
import { ErrorMessage } from 'formik';
import ClassNames from 'classnames';
import loadable from '@loadable/component';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import FormHelperText from '@material-ui/core/FormHelperText';

import { SelectAutocomplete } from 'src/components/selectAutocomplete';

import { getCharacteristics } from 'src/actions/characteristics';

import { positionTransform } from './utils';
import FormFieldArrayReceipt from './FormFieldArrayReceipt';

import styles from './index.module.css';

const DialogPositionCreate = loadable(() =>
	import('src/pages/Dialogs/PositionCreateEdit' /* webpackChunkName: "Dialog_PositionCreateEdit" */)
);

const addPositionContainerClasses = formEditable =>
	ClassNames({
		[styles.addPositionContainer]: true,
		[styles.disabled]: !formEditable,
	});

const FormFieldArrayReceipts = props => {
	const {
		dialogRef,
		currentStudioId,
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

	const onOpenDialogPositionCreate = async () => {
		await props.getCharacteristics();

		setDialogPositionCreate(true);
	};

	const onCloseDialogPositionCreate = () => setDialogPositionCreate(false);

	const positionsAvailable =
		!isLoadingPositions && positions
			? positions.filter(position => !values.receipts.some(receipt => receipt.position && receipt.position._id === position._id))
			: [];

	return (
		<div className={styles.receipts}>
			<div className="sentinel-topAddPositionContainer" />
			<div className={addPositionContainerClasses(formEditable)}>
				<div className={styles.addPositionWrap}>
					<Grid alignItems="flex-start" spacing={2} container>
						<Grid xs={9} item>
							<SelectAutocomplete
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
								isDisabled={isSubmitting || !formEditable}
								isClearable
							/>
							{typeof errors.receipts === 'string' ? <FormHelperText error>{errors.receipts}</FormHelperText> : null}
						</Grid>
						<Grid xs={3} item>
							<Button
								onClick={onOpenDialogPositionCreate}
								variant="outlined"
								color="primary"
								startIcon={<FontAwesomeIcon icon={['far', 'plus']} fixedWidth />}
								disabled={isSubmitting}
								fullWidth
							>
								Создать позицию
							</Button>
						</Grid>
					</Grid>
					<ErrorMessage name="pricePositions">
						{message => (
							<Grid style={{ padding: '5px 0 10px' }} container>
								<FormHelperText error>{message}</FormHelperText>
							</Grid>
						)}
					</ErrorMessage>
				</div>
			</div>

			{values.receipts.length ? (
				<div className={styles.receiptsItems}>
					{values.receipts.map((receipt, index) => (
						<FormFieldArrayReceipt
							key={index}
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
				currentStudioId={currentStudioId}
			/>
		</div>
	);
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentStudioId } = ownProps;

	return {
		getCharacteristics: () => dispatch(getCharacteristics(currentStudioId)),
	};
};

export default connect(null, mapDispatchToProps)(FormFieldArrayReceipts);
