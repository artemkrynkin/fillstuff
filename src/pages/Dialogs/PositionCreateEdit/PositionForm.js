import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import { isEqual } from 'lodash';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogActions from '@material-ui/core/DialogActions';
import Tooltip from '@material-ui/core/Tooltip';

import { getStudioStore } from 'src/actions/studio';
import { getPositions, createPosition, editPosition } from 'src/actions/positions';
import { enqueueSnackbar } from 'src/actions/snackbars';

import PositionTab from './PositionTab';
import ShopsTab from './ShopsTab';
import positionSchema from './positionSchema';

const PositionForm = props => {
	const { onCloseDialog, type, selectedPosition, childPosition, parentPosition, tabName } = props;

	let initialValues = {
		name: '',
		unitReceipt: '',
		unitRelease: '',
		minimumBalance: '',
		isFree: '',
		characteristics: [],
		shops: [],
	};

	if (selectedPosition) initialValues = { ...initialValues, ...selectedPosition };

	const onSubmit = (values, actions) => {
		const { type } = props;
		const position = positionSchema(true).cast(values);

		if (/^(create|create-replacement)$/.test(type)) {
			props.createPosition(position).then(response => handleSuccess(response, actions));
		}

		if (type === 'edit') {
			props.editPosition(position._id, position).then(response => handleSuccess(response, actions));
		}
	};

	const handleSuccess = (response, actions) => {
		const { type, onCloseDialog, onCallback } = props;

		actions.setSubmitting(false);

		if (onCallback !== undefined) onCallback(response);

		if (response.status === 'success') {
			const { data: position } = response;

			props.enqueueSnackbar({
				message: (
					<div>
						Позиция <b>{position.name}</b> успешно {/^(create|create-replacement)$/.test(type) ? 'создана' : 'отредактирована'}.
					</div>
				),
				options: {
					variant: 'success',
				},
			});

			props.getStudioStore();
			onCloseDialog();
		}

		if (response.status === 'error' && !response.data) {
			props.enqueueSnackbar({
				message: response.message || 'Неизвестная ошибка.',
				options: {
					variant: 'error',
				},
			});
		}
	};

	useEffect(() => {
		if (selectedPosition && (selectedPosition.childPosition || selectedPosition.parentPosition)) {
			props.getPositions();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedPosition]);

	return (
		<Formik
			initialValues={initialValues}
			validationSchema={positionSchema}
			validateOnBlur={false}
			validateOnChange={false}
			onSubmit={onSubmit}
		>
			{formikProps => {
				const { isSubmitting, submitForm, values } = formikProps;

				const isEqualCharacteristics = childPosition ? isEqual(values.characteristics, childPosition.characteristics) : false;

				return (
					<>
						{tabName === 'position' ? (
							<PositionTab type={type} childPosition={childPosition} parentPosition={parentPosition} formikProps={formikProps} />
						) : (
							<ShopsTab type={type} formikProps={formikProps} />
						)}
						<DialogActions>
							<Grid spacing={2} container>
								<Grid xs={4} item>
									<Button onClick={onCloseDialog} variant="outlined" size="large" fullWidth>
										Отмена
									</Button>
								</Grid>
								<Grid xs={8} item>
									{/^(create|edit)$/.test(type) ? (
										<Button onClick={() => submitForm()} variant="contained" color="primary" size="large" disabled={isSubmitting} fullWidth>
											{isSubmitting ? <CircularProgress size={20} style={{ position: 'absolute' }} /> : null}
											<span className="loading-button-label" style={{ opacity: Number(!isSubmitting) }}>
												{type === 'create' ? 'Создать' : 'Сохранить'}
											</span>
										</Button>
									) : (
										<Tooltip
											disableFocusListener={!isEqualCharacteristics}
											disableHoverListener={!isEqualCharacteristics}
											disableTouchListener={!isEqualCharacteristics}
											title="Измените характеристики чтобы создать позицию на замену"
											placement="top"
										>
											<div>
												<Button
													onClick={() => submitForm()}
													variant="contained"
													color="primary"
													size="large"
													disabled={isSubmitting || isEqualCharacteristics}
													fullWidth
												>
													{isSubmitting ? <CircularProgress size={20} style={{ position: 'absolute' }} /> : null}
													<span className="loading-button-label" style={{ opacity: Number(!isSubmitting) }}>
														Создать
													</span>
												</Button>
											</div>
										</Tooltip>
									)}
								</Grid>
							</Grid>
						</DialogActions>
					</>
				);
			}}
		</Formik>
	);
};

const mapStateToProps = (state, ownProps) => {
	const { type, selectedPosition } = ownProps;

	const stateReturn = {};

	if (state.positions.data && !/^(create)$/.test(type)) {
		const childOrParentPositionId = selectedPosition.childPosition || selectedPosition.parentPosition;

		if (childOrParentPositionId) {
			stateReturn['childPosition' in selectedPosition ? 'childPosition' : 'parentPosition'] = state.positions.data.find(
				position => position._id === childOrParentPositionId
			);
		}
	}

	return stateReturn;
};

const mapDispatchToProps = dispatch => {
	return {
		getStudioStore: () => dispatch(getStudioStore()),
		getPositions: () => dispatch(getPositions({ showRequest: false })),
		createPosition: position => dispatch(createPosition({ data: { position } })),
		editPosition: (positionId, position) => dispatch(editPosition({ params: { positionId }, data: { position } })),
		enqueueSnackbar: (...args) => dispatch(enqueueSnackbar(...args)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(PositionForm);
