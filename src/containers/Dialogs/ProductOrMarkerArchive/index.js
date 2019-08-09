import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DialogContent from '@material-ui/core/DialogContent';

import { PDDialogActions, PDDialogTitle } from 'src/components/Dialog';

import DialogContentText from '@material-ui/core/DialogContentText';
import Dialog from '@material-ui/core/Dialog';

import { getStockStatus } from 'src/actions/stocks';
import { archiveProduct } from 'src/actions/products';
import { archiveMarker } from 'src/actions/markers';

const ProductOrMarkerArchive = props => {
	const { dialogOpen, onCloseDialog, onExitedDialog, actionType, selectedProductOrMarker } = props;

	if (!selectedProductOrMarker) return null;

	const { product: selectedProduct, marker: selectedMarker } = selectedProductOrMarker;

	return (
		<Dialog open={dialogOpen} onClose={onCloseDialog} onExited={onExitedDialog}>
			<PDDialogTitle theme="primary" onClose={onCloseDialog}>
				{actionType === 'product' ? 'Архивирование позиции' : actionType === 'marker' ? 'Архивирование маркера' : null}
			</PDDialogTitle>
			<DialogContent>
				<DialogContentText gutterBottom={actionType === 'product'}>
					Вы действительно хотите архивировать{' '}
					{actionType === 'product' ? (
						<span>
							позицию <b>{selectedProduct.name}</b>?
						</span>
					) : actionType === 'marker' ? (
						<span>
							маркер{' '}
							<b>
								{selectedMarker.mainCharacteristic.label}{' '}
								{selectedMarker.characteristics.reduce(
									(fullCharacteristics, characteristic) => `${fullCharacteristics} ${characteristic.label}`,
									''
								)}
							</b>
							из позиции <b>{selectedProduct.name}</b>?
						</span>
					) : null}
				</DialogContentText>
				{actionType === 'product' ? (
					<DialogContentText style={{ marginBottom: 0 }}>При архивировании позиции также архивируются все её маркеры.</DialogContentText>
				) : null}
			</DialogContent>
			<PDDialogActions
				leftHandleProps={{
					handleProps: {
						onClick: onCloseDialog,
					},
					text: 'Отмена',
				}}
				rightHandleProps={{
					handleProps: {
						onClick: () => {
							const archiveProductOrMarker =
								actionType === 'product'
									? props.archiveProduct(selectedProduct._id)
									: props.archiveMarker(selectedMarker.product, selectedMarker._id);

							archiveProductOrMarker.then(response => {
								onCloseDialog();

								if (response.status === 'success') {
									props.getStockStatus();
								}
							});
						},
					},
					text: 'Архивировать',
				}}
			/>
		</Dialog>
	);
};

ProductOrMarkerArchive.propTypes = {
	dialogOpen: PropTypes.bool.isRequired,
	onCloseDialog: PropTypes.func.isRequired,
	onExitedDialog: PropTypes.func,
	currentStock: PropTypes.object.isRequired,
	actionType: PropTypes.oneOfType([PropTypes.object.isRequired, PropTypes.string.isRequired]),
	selectedProductOrMarker: PropTypes.object,
};

const mapStateToProps = state => {
	return {
		currentUser: state.user.data,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentStock } = ownProps;

	return {
		getStockStatus: () => dispatch(getStockStatus(currentStock._id)),
		archiveProduct: productId => dispatch(archiveProduct(currentStock._id, productId)),
		archiveMarker: (productId, markerId) => dispatch(archiveMarker(currentStock._id, productId, markerId)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ProductOrMarkerArchive);
