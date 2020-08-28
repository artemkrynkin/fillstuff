import React from 'react';
import { connect } from 'react-redux';
import { Formik } from 'formik';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogActions from '@material-ui/core/DialogActions';

import { getStudioStore } from 'src/actions/studio';
import { createPosition, editPosition } from 'src/actions/positions';
import { enqueueSnackbar } from 'src/actions/snackbars';

import PositionTab from './PositionTab';
import ShopsTab from './ShopsTab';
import positionSchema from './positionSchema';

const PositionForm = props => {
	const { onCloseDialog, type, selectedPosition, tabName } = props;

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
		const { type, sendRequest } = props;
		const position = positionSchema(true).cast(values);

		if (!sendRequest) return handleSuccess(sendRequest, position, actions);

		if (type === 'create') {
			props.createPosition(position).then(response => handleSuccess(sendRequest, response, actions));
		} else {
			props.editPosition(position._id, position).then(response => handleSuccess(sendRequest, response, actions));
		}
	};

	const handleSuccess = (sendRequest, response, actions) => {
		const { type, onCloseDialog, onCallback } = props;

		actions.setSubmitting(false);

		if (onCallback !== undefined) onCallback(response);

		if (!sendRequest) return onCloseDialog();

		if (response.status === 'success') {
			const { data: position } = response;

			props.enqueueSnackbar({
				message: (
					<div>
						Позиция <b>{position.name}</b> успешно {type === 'create' ? 'создана' : 'отредактирована'}.
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

	return (
		<Formik
			initialValues={initialValues}
			validationSchema={positionSchema}
			validateOnBlur={false}
			validateOnChange={false}
			onSubmit={onSubmit}
		>
			{formikProps => {
				const { isSubmitting, submitForm } = formikProps;

				return (
					<>
						{tabName === 'position' ? (
							<PositionTab type={type} formikProps={formikProps} />
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
									<Button onClick={() => submitForm()} disabled={isSubmitting} variant="contained" color="primary" size="large" fullWidth>
										{isSubmitting ? <CircularProgress size={20} style={{ position: 'absolute' }} /> : null}
										<span className="loading-button-label" style={{ opacity: Number(!isSubmitting) }}>
											{/^(create|create-replacement)$/.test(type) ? 'Создать' : 'Сохранить'}
										</span>
									</Button>
								</Grid>
							</Grid>
						</DialogActions>
					</>
				);
			}}
		</Formik>
	);
};

const mapDispatchToProps = dispatch => {
	return {
		getStudioStore: () => dispatch(getStudioStore()),
		createPosition: position => dispatch(createPosition({ data: { position } })),
		editPosition: (positionId, position) => dispatch(editPosition({ params: { positionId }, data: { position } })),
		enqueueSnackbar: (...args) => dispatch(enqueueSnackbar(...args)),
	};
};

export default connect(null, mapDispatchToProps)(PositionForm);
