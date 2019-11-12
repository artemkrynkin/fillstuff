import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import validator from 'validator';
import { Formik } from 'formik';

import { PDDialog, PDDialogTitle } from 'src/components/Dialog';

import { getStockStatus } from 'src/actions/stocks';
import { createCharacteristic } from 'src/actions/characteristics';
import { createPosition, editPosition } from 'src/actions/positions';

import FormPositionCreateEdit from './FormPositionCreateEdit';
import positionSchema from './positionSchema';

let shopNameFieldTimer;

class DialogPositionCreateEdit extends Component {
	static propTypes = {
		type: PropTypes.oneOf(['create', 'edit']).isRequired,
		dialogOpen: PropTypes.bool.isRequired,
		onCloseDialog: PropTypes.func.isRequired,
		onExitedDialog: PropTypes.func,
		currentStockId: PropTypes.string.isRequired,
		selectedPosition: PropTypes.object,
	};

	initialState = {
		shopLinkVisible: false,
		isLoadingCharacteristics: false,
	};

	state = this.initialState;

	onChangeShopFields = (value, setFieldValue) => {
		setFieldValue('shopName', value);

		clearTimeout(shopNameFieldTimer);

		shopNameFieldTimer = setTimeout(() => {
			if (validator.isURL(value)) {
				setFieldValue('shopName', '');
				setFieldValue('shopLink', value);

				this.setState({ shopLinkVisible: true });
			}
		}, 300);
	};

	onCreateCharacteristic = (values, setFieldValue) => {
		this.setState({ isLoadingCharacteristics: true }, () => {
			this.props.createCharacteristic(values).then(response => {
				const characteristic = response.data;

				this.setState({ isLoadingCharacteristics: false });

				setFieldValue('characteristicTemp.value', characteristic);
			});
		});
	};

	onPositionCreateEdit = (values, actions) => {
		const { type, onCloseDialog, position = positionSchema(true).cast(values) } = this.props;

		if (type === 'create') {
			this.props.createPosition(position).then(response => {
				if (response.status === 'success') {
					this.props.getStockStatus();
					onCloseDialog();
				} else actions.setSubmitting(false);
			});
		} else {
			this.props.editPosition(position._id, position).then(response => {
				if (response.status === 'success') {
					this.props.getStockStatus();
					onCloseDialog();
				} else actions.setSubmitting(false);
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
		const { type, dialogOpen, onCloseDialog, currentStockId, characteristics, selectedPosition } = this.props;
		const { shopLinkVisible, isLoadingCharacteristics } = this.state;

		if (type === 'edit' && !selectedPosition) return null;

		let initialValues =
			type === 'create'
				? {
						name: '',
						divided: true,
						unitReceipt: '',
						unitIssue: '',
						minimumBalance: '',
						isFree: false,
						extraCharge: '',
						shopName: '',
						shopLink: '',
						characteristics: [],
						characteristicTemp: {
							type: '',
							value: '',
							valueTemp: '',
						},
				  }
				: {
						characteristicTemp: {
							type: '',
							value: '',
							valueTemp: '',
						},
						...selectedPosition,
				  };

		return (
			<PDDialog
				open={dialogOpen}
				onEnter={this.onEnterDialog}
				onClose={onCloseDialog}
				onExited={this.onExitedDialog}
				maxWidth="lg"
				scroll="body"
				stickyActions
			>
				<PDDialogTitle theme="primary" onClose={onCloseDialog}>
					{type === 'create' ? 'Создание новой позиции' : 'Редактирование позиции'}
				</PDDialogTitle>
				<Formik
					initialValues={initialValues}
					validationSchema={() => positionSchema()}
					validateOnBlur={false}
					validateOnChange={false}
					onSubmit={(values, actions) => this.onPositionCreateEdit(values, actions)}
				>
					{props => (
						<FormPositionCreateEdit
							onCloseDialog={onCloseDialog}
							onChangeShopFields={this.onChangeShopFields}
							onCreateCharacteristic={this.onCreateCharacteristic}
							currentStockId={currentStockId}
							characteristics={characteristics}
							type={type}
							shopLinkVisible={shopLinkVisible}
							isLoadingCharacteristics={isLoadingCharacteristics}
							formikProps={props}
						/>
					)}
				</Formik>
			</PDDialog>
		);
	}
}

const mapStateToProps = state => {
	return {
		characteristics: state.characteristics.data,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentStockId } = ownProps;

	return {
		getStockStatus: () => dispatch(getStockStatus(currentStockId)),
		createCharacteristic: values => dispatch(createCharacteristic(values)),
		createPosition: position => dispatch(createPosition(currentStockId, position)),
		editPosition: (positionId, position) => dispatch(editPosition(positionId, position)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(DialogPositionCreateEdit);
