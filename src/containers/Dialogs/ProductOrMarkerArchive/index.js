import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import { Dialog, PDDialogActions, PDDialogTitle } from 'src/components/Dialog';

import { getStockStatus } from 'src/actions/stocks';
import { archiveProduct } from 'src/actions/products';
import { archiveMarker } from 'src/actions/markers';

const ProductOrMarkerArchiveDialogActions = props => {
	const { onCloseDialog, onSubmit } = props;

	return (
		<PDDialogActions
			leftHandleProps={{
				handleProps: {
					onClick: onCloseDialog,
				},
				text: 'Отмена',
			}}
			rightHandleProps={{
				handleProps: {
					onClick: onSubmit,
				},
				text: 'Архивировать',
			}}
		/>
	);
};

const ProductOrMarkerArchive = props => {
	const { dialogOpen, onCloseDialog, onExitedDialog, dataType, selectedProduct, selectedMarker } = props;

	if (dataType === 'product' && selectedProduct)
		return (
			<Dialog open={dialogOpen} onClose={() => onCloseDialog()} onExited={onExitedDialog}>
				<PDDialogTitle theme="primary" onClose={() => onCloseDialog()}>
					Архивирование позиции
				</PDDialogTitle>
				<DialogContent>
					<DialogContentText gutterBottom={dataType === 'product'}>
						Вы действительно хотите архивировать{' '}
						<span>
							позицию <b>{selectedProduct.name}</b>?
						</span>
					</DialogContentText>
					<DialogContentText style={{ marginBottom: 0 }}>При архивировании позиции также архивируются все её маркеры.</DialogContentText>
				</DialogContent>
				<ProductOrMarkerArchiveDialogActions
					onCloseDialog={() => onCloseDialog()}
					onSubmit={() =>
						onCloseDialog(() =>
							setTimeout(
								() =>
									props.archiveProduct(selectedProduct._id).then(response => {
										if (response.status === 'success') props.getStockStatus();
									}),
								150
							)
						)
					}
				/>
			</Dialog>
		);

	if (dataType === 'marker' && selectedProduct && selectedMarker)
		return (
			<Dialog open={dialogOpen} onClose={() => onCloseDialog()} onExited={onExitedDialog}>
				<PDDialogTitle theme="primary" onClose={() => onCloseDialog()}>
					Архивирование маркера
				</PDDialogTitle>
				<DialogContent>
					<DialogContentText gutterBottom={dataType === 'product'}>
						Вы действительно хотите архивировать{' '}
						<span>
							маркер{' '}
							<b>
								{selectedMarker.mainCharacteristic.label}{' '}
								{selectedMarker.characteristics.reduce((fullCharacteristics, characteristic) => {
									return `${fullCharacteristics} ${characteristic.label}`;
								}, '')}
							</b>
							из позиции <b>{selectedProduct.name}</b>?
						</span>
					</DialogContentText>
				</DialogContent>
				<ProductOrMarkerArchiveDialogActions
					onCloseDialog={() => onCloseDialog()}
					onSubmit={() =>
						onCloseDialog(() =>
							setTimeout(
								() =>
									props.archiveMarker(selectedMarker.product, selectedMarker._id).then(response => {
										if (response.status === 'success') props.getStockStatus();
									}),
								150
							)
						)
					}
				/>
			</Dialog>
		);

	if (!dataType || !selectedProduct || !selectedMarker) return null;
};

ProductOrMarkerArchive.propTypes = {
	dialogOpen: PropTypes.bool.isRequired,
	onCloseDialog: PropTypes.func.isRequired,
	onExitedDialog: PropTypes.func,
	currentStockId: PropTypes.string.isRequired,
	dataType: PropTypes.oneOf(['product', 'marker']).isRequired,
	selectedProduct: PropTypes.object,
	selectedMarker: PropTypes.object,
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentStockId } = ownProps;

	return {
		getStockStatus: () => dispatch(getStockStatus(currentStockId)),
		archiveProduct: productId => dispatch(archiveProduct(currentStockId, productId)),
		archiveMarker: (productId, markerId) => dispatch(archiveMarker(currentStockId, productId, markerId)),
	};
};

export default connect(
	null,
	mapDispatchToProps
)(ProductOrMarkerArchive);
