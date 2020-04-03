import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import validator from 'validator';
import { Formik } from 'formik';
import { debounce } from 'lodash';

import { DialogSticky, DialogTitle } from 'src/components/Dialog';

import { getStudioStock } from 'src/actions/studio';
import { createCharacteristic } from 'src/actions/characteristics';
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
		currentStudioId: PropTypes.string.isRequired,
		selectedPosition: PropTypes.object,
	};

	initialState = {
		shopLinkVisible: false,
		isLoadingCharacteristics: false,
	};

	state = this.initialState;

	onChangeShopFields = debounce((value, setFieldValue) => {
		setFieldValue('shopName', value);

		if (validator.isURL(value)) {
			setFieldValue('shopName', '');
			setFieldValue('shopLink', value);

			this.setState({ shopLinkVisible: true });
		}
	}, 300);

	onCreateCharacteristic = (characteristic, setFieldValue) => {
		this.setState({ isLoadingCharacteristics: true }, () => {
			this.props.createCharacteristic(characteristic).then(response => {
				const characteristic = response.data;

				this.setState({ isLoadingCharacteristics: false });

				setFieldValue('characteristicTemp.value', characteristic);
			});
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

					this.props.getStudioStock();
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
					this.props.getStudioStock();
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
		const { type, selectedPosition } = this.props;

		if (type === 'edit' && selectedPosition) {
			if (validator.isURL(selectedPosition.shopLink)) this.setState({ shopLinkVisible: true });
		}
	};

	onExitedDialog = () => {
		const { onExitedDialog } = this.props;

		this.setState(this.initialState, () => {
			if (onExitedDialog) onExitedDialog();
		});
	};

	render() {
		const { type, dialogOpen, onCloseDialog, currentStudioId, characteristics, selectedPosition } = this.props;
		const { shopLinkVisible, isLoadingCharacteristics } = this.state;

		if (type === 'edit' && !selectedPosition) return null;

		let initialValues = {
			name: '',
			unitReceipt: '',
			unitRelease: '',
			minimumBalance: '',
			isFree: '',
			shopName: '',
			shopLink: '',
			characteristics: [],
			characteristicTemp: {
				type: '',
				value: '',
				valueTemp: '',
			},
		};

		if (selectedPosition) initialValues = { ...initialValues, ...selectedPosition };

		return (
			<DialogSticky
				open={dialogOpen}
				onEnter={this.onEnterDialog}
				onClose={onCloseDialog}
				onExited={this.onExitedDialog}
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
							onChangeShopFields={this.onChangeShopFields}
							onCreateCharacteristic={this.onCreateCharacteristic}
							currentStudioId={currentStudioId}
							characteristics={characteristics}
							type={type}
							shopLinkVisible={shopLinkVisible}
							isLoadingCharacteristics={isLoadingCharacteristics}
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
		characteristics: state.characteristics.data,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getStudioStock: () => dispatch(getStudioStock()),
		createCharacteristic: characteristic => dispatch(createCharacteristic({ data: { characteristic } })),
		createPosition: position => dispatch(createPosition({ data: { position } })),
		editPosition: (positionId, position) => dispatch(editPosition({ params: { positionId }, data: { position } })),
		enqueueSnackbar: (...args) => dispatch(enqueueSnackbar(...args)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DialogPositionCreateEdit);
