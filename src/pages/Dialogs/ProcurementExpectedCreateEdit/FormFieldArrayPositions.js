import React, { useState } from 'react';
import loadable from '@loadable/component';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import FormHelperText from '@material-ui/core/FormHelperText';

import { SelectAutocomplete } from 'src/components/selectAutocomplete';
import PositionNameInList from 'src/components/PositionNameInList';

import { positionTransform } from './utils';

import styles from './index.module.css';

const DialogPositionCreate = loadable(() =>
	import('src/pages/Dialogs/PositionCreateEdit' /* webpackChunkName: "Dialog_PositionCreateEdit" */)
);

const FormFieldArrayPositions = props => {
	const {
		dialogRef,
		positions: {
			data: positions,
			isFetching: isLoadingPositions,
			// error: errorPositions
		},
		arrayHelpers: { push, remove },
		formikProps: { errors, isSubmitting, values },
	} = props;
	const [textSearchPosition, setTextSearchPosition] = useState('');
	const [dialogPositionCreate, setDialogPositionCreate] = useState(false);

	const onChangeTextSearchPosition = value => setTextSearchPosition(value);

	const onOpenDialogPositionCreate = () => setDialogPositionCreate(true);

	const onCloseDialogPositionCreate = () => setDialogPositionCreate(false);

	const positionsAvailable =
		!isLoadingPositions && positions
			? positions.filter(position => !values.positions.some(selectedPosition => selectedPosition._id === position._id))
			: [];

	return (
		<div className={styles.positions}>
			<div className="sentinel-topAddPositionContainer" />
			<div className={styles.addPositionContainer}>
				<div className={styles.addPositionWrap}>
					<Grid alignItems="flex-start" spacing={2} container>
						<Grid style={{ flex: '1 1' }} item>
							<SelectAutocomplete
								isDisabled={isSubmitting}
								isLoading={isLoadingPositions}
								value={textSearchPosition}
								onChange={(option, { action }) => {
									if (action === 'select-option') {
										push(option);
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
							{typeof errors.positions === 'string' ? <FormHelperText error>{errors.positions}</FormHelperText> : null}
						</Grid>
						<Grid item>
							<Button onClick={onOpenDialogPositionCreate} variant="outlined" color="primary" tabIndex={-1}>
								Новая позиция
							</Button>
						</Grid>
					</Grid>
				</div>
			</div>

			{values.positions.length ? (
				<div className={styles.positionsItems}>
					{values.positions.map((position, index) => (
						<Grid className={styles.positionItem} key={position._id} wrap="nowrap" alignItems="center" container>
							<Grid style={{ flex: '1 1' }} zeroMinWidth item>
								<PositionNameInList name={position.name} characteristics={position.characteristics} size="md" />
							</Grid>
							<Grid className={styles.removePosition} item>
								<IconButton className={styles.removePositionButton} onClick={() => remove(index)} tabIndex={-1}>
									<FontAwesomeIcon icon={['fal', 'times']} />
								</IconButton>
							</Grid>
						</Grid>
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

						push(positionTransform(position));

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

export default FormFieldArrayPositions;
