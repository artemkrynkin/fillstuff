import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Formik } from 'formik';

import { DialogSticky, DialogTitle } from 'src/components/Dialog';

import { getStudioStore } from 'src/actions/studio';
import { getCharacteristics, createCharacteristic } from 'src/actions/characteristics';
import { getShops } from 'src/actions/shops';
import { createPosition, editPosition } from 'src/actions/positions';
import { enqueueSnackbar } from 'src/actions/snackbars';

import FormPositionCreateEdit from './FormPositionCreateEdit';
import positionSchema from './positionSchema';

class DialogPositionCreateEdit extends Component {
	static propTypes = {
		type: PropTypes.oneOf(['create', 'edit']).isRequired,
		dialogOpen: PropTypes.bool.isRequired,
		onCloseDialog: PropTypes.func.isRequired,
		onExitedDialog: PropTypes.func,
		onCallback: PropTypes.func,
		selectedPosition: PropTypes.object,
	};

	onGetCharacteristics = characteristicType => this.props.getCharacteristics({ type: characteristicType });

	onCreateCharacteristic = (characteristic, callback) => {
		this.props.createCharacteristic(characteristic).then(response => {
			if (response.status === 'success') {
				const characteristic = response.data;

				if (callback) callback(characteristic);
			}
		});
	};

	onSubmit = (values, actions) => {
		const { type, onCloseDialog, onCallback, position = positionSchema(true).cast(values) } = this.props;

		actions.setSubmitting(false);

		if (type === 'create') {
			this.props.createPosition(position).then(response => {
				if (onCallback !== undefined) onCallback(response);

				actions.setSubmitting(false);

				if (response.status === 'success') {
					const { data: position } = response;

					this.props.enqueueSnackbar({
						message: (
							<div>
								Позиция <b>{position.name}</b> успешно создана.
							</div>
						),
						options: {
							variant: 'success',
						},
					});

					this.props.getStudioStore();
					onCloseDialog();
				}

				if (response.status === 'error' && !response.data) {
					this.props.enqueueSnackbar({
						message: response.message || 'Неизвестная ошибка.',
						options: {
							variant: 'error',
						},
					});
				}
			});
		} else {
			this.props.editPosition(position._id, position).then(response => {
				if (onCallback !== undefined) onCallback(response);

				actions.setSubmitting(false);

				if (response.status === 'success') {
					this.props.getStudioStore();
					onCloseDialog();
				}

				if (response.status === 'error' && !response.data) {
					this.props.enqueueSnackbar({
						message: response.message || 'Неизвестная ошибка.',
						options: {
							variant: 'error',
						},
					});
				}
			});
		}
	};

	onEnterDialog = () => {
		this.props.getShops();
	};

	onExitedDialog = () => {
		const { onExitedDialog } = this.props;

		if (onExitedDialog) onExitedDialog();
	};

	render() {
		const { type, dialogOpen, onCloseDialog, characteristics, shops, selectedPosition } = this.props;

		if (type === 'edit' && !selectedPosition) return null;

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

		return (
			<DialogSticky
				open={dialogOpen}
				onClose={onCloseDialog}
				onExited={this.onExitedDialog}
				onEnter={this.onEnterDialog}
				maxWidth="lg"
				scroll="body"
				stickyActions
			>
				<DialogTitle onClose={onCloseDialog}>{type === 'create' ? 'Создание позиции' : 'Редактирование позиции'}</DialogTitle>
				<Formik
					initialValues={initialValues}
					validationSchema={positionSchema}
					validateOnBlur={false}
					validateOnChange={false}
					onSubmit={(values, actions) => this.onSubmit(values, actions)}
				>
					{props => (
						<FormPositionCreateEdit
							onCloseDialog={onCloseDialog}
							onGetCharacteristics={this.onGetCharacteristics}
							onCreateCharacteristic={this.onCreateCharacteristic}
							characteristics={characteristics}
							shops={shops}
							type={type}
							formikProps={props}
						/>
					)}
				</Formik>
			</DialogSticky>
		);
	}
}

const mapStateToProps = state => {
	return {
		characteristics: state.characteristics,
		shops: state.shops,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getStudioStore: () => dispatch(getStudioStore()),
		getCharacteristics: params => dispatch(getCharacteristics({ params })),
		createCharacteristic: characteristic => dispatch(createCharacteristic({ data: { characteristic } })),
		getShops: () => dispatch(getShops()),
		createPosition: position => dispatch(createPosition({ data: { position } })),
		editPosition: (positionId, position) => dispatch(editPosition({ params: { positionId }, data: { position } })),
		enqueueSnackbar: (...args) => dispatch(enqueueSnackbar(...args)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DialogPositionCreateEdit);
