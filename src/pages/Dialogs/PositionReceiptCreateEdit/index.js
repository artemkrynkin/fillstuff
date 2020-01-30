import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import validator from 'validator';

import { Formik } from 'formik';

import { DialogSticky, DialogTitle } from 'src/components/Dialog';

import { getStudioStock } from 'src/actions/studio';
import { createCharacteristic } from 'src/actions/characteristics';
import { createPositionReceipt, editPositionReceipt } from 'src/actions/positions';

import FormPositionReceiptCreateEdit from './FormPositionReceiptCreateEdit';
import positionSchema from './positionSchema';

let shopNameFieldTimer;

class DialogPositionReceiptCreateEdit extends Component {
	static propTypes = {
		type: PropTypes.oneOf(['create', 'edit']).isRequired,
		dialogOpen: PropTypes.bool.isRequired,
		onCloseDialog: PropTypes.func.isRequired,
		onExitedDialog: PropTypes.func,
		currentStudioId: PropTypes.string.isRequired,
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

	onCreateCharacteristic = (characteristic, setFieldValue) => {
		this.setState({ isLoadingCharacteristics: true }, () => {
			this.props.createCharacteristic(characteristic).then(response => {
				const characteristic = response.data;

				this.setState({ isLoadingCharacteristics: false });

				setFieldValue('characteristicTemp.value', characteristic);
			});
		});
	};

	onPositionCreate = (values, actions) => {
		const { type, onCloseDialog, positionAndReceipt = positionSchema(type, true).cast(values) } = this.props;

		const { quantity, quantityPackages, quantityInUnit, purchasePrice, sellingPrice, unitSellingPrice, ...position } = positionAndReceipt;

		let receipt = {
			initial: {},
		};

		if (!isNaN(quantity)) receipt.initial.quantity = quantity;
		if (!isNaN(quantityPackages)) receipt.initial.quantityPackages = quantityPackages;
		if (!isNaN(quantityInUnit)) receipt.quantityInUnit = quantityInUnit;
		if (!isNaN(purchasePrice)) receipt.purchasePrice = purchasePrice;
		if (!isNaN(sellingPrice)) receipt.sellingPrice = sellingPrice;
		if (!isNaN(unitSellingPrice)) receipt.unitSellingPrice = unitSellingPrice;

		this.props.createPositionReceipt(position, receipt).then(response => {
			if (response.status === 'success') {
				this.props.getStudioStock();
				onCloseDialog();
			} else actions.setSubmitting(false);
		});
	};

	onPositionEdit = (values, actions) => {
		const {
			type,
			onCloseDialog,
			selectedPosition: {
				activeReceipt: {
					quantityInUnit: quantityInUnitOld,
					purchasePrice: purchasePriceOld,
					sellingPrice: sellingPriceOld,
					unitSellingPrice: unitSellingPriceOld,
				},
			},
			positionAndReceipt = positionSchema(type, true).cast(values),
		} = this.props;

		const { activeReceipt, receipts, quantityInUnit, purchasePrice, sellingPrice, unitSellingPrice, ...position } = positionAndReceipt;

		let receipt = {};

		if (!isNaN(quantityInUnit) && quantityInUnit !== quantityInUnitOld) receipt.quantityInUnit = quantityInUnit;
		if (!isNaN(purchasePrice) && purchasePrice !== purchasePriceOld) receipt.purchasePrice = purchasePrice;
		if (!isNaN(sellingPrice) && sellingPrice !== sellingPriceOld) receipt.sellingPrice = sellingPrice;
		if (!isNaN(unitSellingPrice) && unitSellingPrice !== unitSellingPriceOld) receipt.unitSellingPrice = unitSellingPrice;

		this.props.editPositionReceipt(position._id, position, receipt).then(response => {
			if (response.status === 'success') {
				this.props.getStudioStock();
				onCloseDialog();
			} else actions.setSubmitting(false);
		});
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
						quantity: '',
						quantityPackages: '',
						quantityInUnit: '',
						purchasePrice: '',
						sellingPrice: '',
						unitSellingPrice: '',
				  }
				: {
						characteristicTemp: {
							type: '',
							value: '',
							valueTemp: '',
						},
						quantityInUnit: selectedPosition.activeReceipt.quantityInUnit,
						purchasePrice: selectedPosition.activeReceipt.purchasePrice,
						sellingPrice: selectedPosition.activeReceipt.sellingPrice,
						unitSellingPrice: selectedPosition.activeReceipt.unitSellingPrice,
						...selectedPosition,
				  };

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
					validationSchema={() => positionSchema(type)}
					validateOnBlur={false}
					validateOnChange={false}
					onSubmit={(values, actions) =>
						type === 'create' ? this.onPositionCreate(values, actions) : this.onPositionEdit(values, actions)
					}
				>
					{props => (
						<FormPositionReceiptCreateEdit
							onCloseDialog={onCloseDialog}
							onChangeShopFields={this.onChangeShopFields}
							onCreateCharacteristic={this.onCreateCharacteristic}
							type={type}
							currentStudioId={currentStudioId}
							characteristics={characteristics}
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
		createPositionReceipt: (position, receipt) => dispatch(createPositionReceipt({ data: { position, receipt } })),
		editPositionReceipt: (positionId, position, receipt) =>
			dispatch(editPositionReceipt({ params: { positionId }, data: { position, receipt } })),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DialogPositionReceiptCreateEdit);
