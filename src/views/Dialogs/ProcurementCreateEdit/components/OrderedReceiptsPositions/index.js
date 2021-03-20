import React, { lazy, Suspense, useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { createFilterOptions } from '@material-ui/lab/Autocomplete';

import { procurementPositionTransform } from 'src/helpers/utils';

import Autocomplete from 'src/components/Autocomplete';

import { getPositions } from 'src/actions/positions';

import { receiptInitialValues, scrollToDialogElement } from '../../helpers/utils';

import Receipt from './Receipt';

import procurementsEmpty from 'public/img/stubs/procurements_empty.svg';

const DialogPositionCreate = lazy(() => import('src/views/Dialogs/PositionCreateEdit'));

const filter = createFilterOptions();

export const useStyles = makeStyles(theme => ({
	container: {
		margin: '-10px 0 -12px',
	},
	addPositionContainer: {
		backgroundColor: '#fff',
		margin: '0 -20px 10px',
		position: 'sticky',
		top: 73,
		zIndex: 1,
		// '&.stuck': {
		//   boxShadow: '0 2px 2px 0 rgba(var(--c-rgb-blueGrey-300), 0.2)',
		// }
	},
	addPositionWrap: {
		padding: '10px 20px',
	},
	stubImage: {
		maxWidth: 200,
		margin: '0 auto',
	},
	stubCaption: {
		marginTop: 20,
	},
}));

const positionTransform = positions => {
	return positions
		.filter(position => !position.isArchived && !position.archivedAfterEnded)
		.map(position => procurementPositionTransform(position, true));
};

const filterOptionsAutocomplete = (options, params, receipts) => {
	const filterOptions = options.filter(option => !receipts.some(receipt => option._id === receipt.position._id));
	const filtered = filter(filterOptions, params);

	filtered.unshift({
		inputValue: params.inputValue,
		name: params.inputValue ? (
			<>
				Создать позицию <b>{params.inputValue}</b>
			</>
		) : (
			'Создать новую позицию'
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

function OrderedReceiptsPositions({
	positions: { data: positions, isFetching: isLoadingPositions },
	dialogRef,
	formikProps,
	arrayHelpers,
	formikProps: { isSubmitting, values, touched, errors },
	arrayHelpers: { push },
	...props
}) {
	const classes = useStyles();
	const [inputValue, setInputValue] = useState(null);
	const [dialogPositionCreate, setDialogPositionCreate] = useState(false);
	const [newPosition, setNewPosition] = useState({ name: '' });
	const [options, setOptions] = useState(positionTransform(positions || []));
	const [autocompleteOpen, setAutocompleteOpen] = useState(false);
	const [loaded, setLoaded] = useState(false);

	const addPositionInReceipts = position => {
		push(receiptInitialValues({ position, ordered: true }));

		scrollToDialogElement(dialogRef, 'sentinel-bottom', 'end');
	};

	const onOpenAutocomplete = () => setAutocompleteOpen(true);

	const onChangeAutocomplete = (event, newValue) => {
		setInputValue(null);

		if (newValue?.itemCreation) {
			setNewPosition({ name: newValue.inputValue });
			setTimeout(() => toggleVisibleDialogPositionCreate());
		} else {
			addPositionInReceipts(newValue);
		}
	};

	const onInputChangeAutocomplete = (event, newValue) => {
		setInputValue(newValue);
	};

	const toggleVisibleDialogPositionCreate = () => setDialogPositionCreate(prevVisible => !prevVisible);

	const onExitedDialogPositionCreate = () => setNewPosition({ name: '' });

	const onCallbackDialogPositionCreate = ({ status, data: position }) => {
		if (status === 'success') {
			const newPosition = procurementPositionTransform(position, true);

			addPositionInReceipts(newPosition);

			setOptions(prevPositions => [...prevPositions, newPosition]);
		}
	};

	useEffect(() => {
		if (!autocompleteOpen || loaded) return;

		(async () => {
			try {
				const response = await props.getPositions();

				const positions = positionTransform(response.data);

				setOptions(positions);
			} catch (error) {}

			setLoaded(false);
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [autocompleteOpen]);

	return (
		<>
			<div className={classes.container}>
				<div className="sentinel-topAddPositionContainer" />
				<div className={classes.addPositionContainer}>
					<div className={classes.addPositionWrap}>
						<Autocomplete
							value={null}
							inputValue={inputValue || ''}
							onOpen={onOpenAutocomplete}
							onChange={onChangeAutocomplete}
							onInputChange={onInputChangeAutocomplete}
							filterOptions={(options, params) => filterOptionsAutocomplete(options, params, values.orderedReceiptsPositions)}
							getOptionLabel={getOptionLabelAutocomplete}
							renderOption={option => option.name}
							renderInput={params => (
								<TextField
									placeholder="Выберите позицию или создайте новую"
									{...params}
									error={touched.orderedReceiptsPositions && typeof errors.orderedReceiptsPositions === 'string'}
									helperText={
										touched.orderedReceiptsPositions && typeof errors.orderedReceiptsPositions === 'string'
											? errors.orderedReceiptsPositions
											: null
									}
									InputProps={{ ...params.InputProps }}
								/>
							)}
							options={options}
							loading={isLoadingPositions}
							disabled={isSubmitting}
							clearOnBlur={false}
							selectOnFocus
							handleHomeEndKeys
							openOnFocus
							fullWidth
						/>
					</div>
				</div>

				{values.orderedReceiptsPositions.length ? (
					<div>
						{values.orderedReceiptsPositions.map((receipt, index) => (
							<Receipt key={receipt.id} index={index} receipt={receipt} formikProps={formikProps} arrayHelpers={arrayHelpers} />
						))}
					</div>
				) : (
					<div>
						<div className={classes.stubImage}>
							<img src={procurementsEmpty} alt="" />
						</div>
						<Typography className={classes.stubCaption} variant="caption" align="center" component="div">
							Не выбрано ни одной позиции для закупки
						</Typography>
					</div>
				)}
			</div>

			<Suspense fallback={null}>
				<DialogPositionCreate
					type="create"
					dialogOpen={dialogPositionCreate}
					onCloseDialog={toggleVisibleDialogPositionCreate}
					onCallback={onCallbackDialogPositionCreate}
					onExitedDialog={onExitedDialogPositionCreate}
					selectedPosition={newPosition}
				/>
			</Suspense>
		</>
	);
}

const mapStateToProps = state => ({
	positions: state.positions,
});

const mapDispatchToProps = {
	getPositions,
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(OrderedReceiptsPositions);
