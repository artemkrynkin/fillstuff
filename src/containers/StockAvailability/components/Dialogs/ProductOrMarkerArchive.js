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
	else
		return (
			<Dialog open={dialogOpen} onClose={onCloseDialog} onExited={onExitedDialog} fullWidth>
				<PDDialogTitle theme="primary" onClose={onCloseDialog}>
					{actionType === 'product' ? 'Архивирование позиции' : 'Архивирование маркера'}
				</PDDialogTitle>
				<DialogContent>
					<DialogContentText style={{ marginBottom: 0 }}>
						Вы уверены, что хотите архивировать{' '}
						{actionType === 'product' ? (
							<span>
								позицию <b>{selectedProductOrMarker.name}</b>
							</span>
						) : (
							<span>
								маркер{' '}
								<b>
									{selectedProductOrMarker.manufacturer.label}{' '}
									{selectedProductOrMarker.specifications.reduce(
										(fullSpecifications, specification) => `${fullSpecifications} ${specification.label}`,
										''
									)}
								</b>
							</span>
						)}
						?
						<br />
						{actionType === 'product' ? 'При архивировании позиции также архивируются все её маркеры.' : null}
					</DialogContentText>
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
										? props.archiveProduct(selectedProductOrMarker._id)
										: props.archiveMarker(selectedProductOrMarker.product, selectedProductOrMarker._id);

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
	actionType: PropTypes.oneOfType([PropTypes.object.isRequired, PropTypes.string.isRequired]),
	dialogOpen: PropTypes.bool.isRequired,
	onCloseDialog: PropTypes.func.isRequired,
	onExitedDialog: PropTypes.func,
	currentStock: PropTypes.object.isRequired,
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
