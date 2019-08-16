import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';

import QuantityIndicator from 'src/components/QuantityIndicator';
import Popover from 'src/components/Popover';

import { getCharacteristics } from 'src/actions/characteristics';

import { TableCell } from './styles';

const DialogMarkerEdit = Loadable({
	loader: () => import('src/containers/Dialogs/MarkerEdit' /* webpackChunkName: "Dialog_MarkerEdit" */),
	loading: () => null,
	delay: 200,
});

const DialogMarkerArchive = Loadable({
	loader: () => import('src/containers/Dialogs/ProductOrMarkerArchive' /* webpackChunkName: "Dialog_ProductOrMarkerArchive" */),
	loading: () => null,
	delay: 200,
});

const DialogMarkerQRCodePrint = Loadable({
	loader: () => import('src/containers/Dialogs/ProductOrMarkerQRCodePrint' /* webpackChunkName: "Dialog_ProductOrMarkerQRCodePrint" */),
	loading: () => null,
	delay: 200,
});

const DialogCreateWriteOff = Loadable({
	loader: () => import('src/containers/Dialogs/CreateWriteOff' /* webpackChunkName: "Dialog_CreateWriteOff" */),
	loading: () => null,
	delay: 200,
});

class MarkerRow extends Component {
	static propTypes = {
		currentStockId: PropTypes.string.isRequired,
		product: PropTypes.object.isRequired,
		marker: PropTypes.object.isRequired,
	};

	state = {
		markerMenu: null,
		dialogMarkerEdit: false,
		dialogMarkerArchive: false,
		dialogMarkerQRCodePrint: false,
		dialogCreateWriteOff: false,
	};

	onOpenMarkerActionsMenu = event => this.setState({ markerMenu: event.currentTarget });

	onCloseMarkerActionsMenu = () => this.setState({ markerMenu: null });

	onOpenDialogMarkerEdit = async () => {
		await this.props.getCharacteristics();

		this.setState({ dialogMarkerEdit: true });
	};

	onCloseDialogMarkerEdit = () => this.setState({ dialogMarkerEdit: false });

	onOpenDialogMarkerArchive = () => this.setState({ dialogMarkerArchive: true });

	onCloseDialogMarkerArchive = callback => {
		this.setState({ dialogMarkerArchive: false }, () => {
			if (callback) callback();
		});
	};

	onOpenDialogMarkerQRCodePrint = () => this.setState({ dialogMarkerQRCodePrint: true });

	onCloseDialogMarkerQRCodePrint = () => this.setState({ dialogMarkerQRCodePrint: false });

	onOpenDialogCreateWriteOff = () => this.setState({ dialogCreateWriteOff: true });

	onCloseDialogCreateWriteOff = () => this.setState({ dialogCreateWriteOff: false });

	render() {
		const { currentStockId, product, marker } = this.props;
		const { markerMenu, dialogMarkerEdit, dialogMarkerArchive, dialogMarkerQRCodePrint, dialogCreateWriteOff } = this.state;

		return (
			<TableRow className="sa-products__row-marker">
				<TableCell width={41} style={{ paddingLeft: 5, paddingRight: 0 }} />
				<TableCell style={{ paddingLeft: 5 }}>
					{marker.mainCharacteristic.label}{' '}
					{marker.characteristics.reduce((fullCharacteristics, characteristic) => `${fullCharacteristics} ${characteristic.label}`, '')}
				</TableCell>
				<TableCell align="right" width={160}>
					<QuantityIndicator
						type="marker"
						dividedMarkers={product.dividedMarkers}
						receiptUnits={product.receiptUnits}
						unitIssue={product.unitIssue}
						quantity={marker.quantity}
						minimumBalance={marker.minimumBalance}
					/>
				</TableCell>
				<TableCell align="right" width={130}>
					{marker.minimumBalance}
				</TableCell>
				<TableCell align="right" width={140}>
					{marker.unitPurchasePrice ? `${marker.unitPurchasePrice} ₽` : '-'}
				</TableCell>
				<TableCell align="right" width={140}>
					{marker.unitSellingPrice ? `${marker.unitSellingPrice} ₽` : '-'}
				</TableCell>
				<TableCell align="right" width={50} style={{ padding: '0 7px' }}>
					<div className="sa-products__marker-actions">
						<IconButton
							className="sa-products__marker-actions-button"
							aria-haspopup="true"
							onClick={event => this.onOpenMarkerActionsMenu(event)}
							size="small"
						>
							<FontAwesomeIcon icon={['far', 'ellipsis-h']} />
						</IconButton>

						<Popover anchorEl={markerMenu} open={Boolean(markerMenu)} onClose={this.onCloseMarkerActionsMenu} disablePortal>
							<MenuList>
								<MenuItem
									onClick={() => {
										this.onOpenDialogMarkerQRCodePrint();
										this.onCloseMarkerActionsMenu();
									}}
								>
									Печать QR-кода
								</MenuItem>
								<MenuItem
									onClick={() => {
										this.onCloseMarkerActionsMenu();
									}}
								>
									Добавить количество
								</MenuItem>
								<MenuItem
									onClick={() => {
										this.onOpenDialogCreateWriteOff();
										this.onCloseMarkerActionsMenu();
									}}
								>
									Списать количество
								</MenuItem>
								<MenuItem
									onClick={() => {
										this.onOpenDialogMarkerEdit();
										this.onCloseMarkerActionsMenu();
									}}
								>
									Редактировать
								</MenuItem>
								<MenuItem
									onClick={() => {
										this.onOpenDialogMarkerArchive();
										this.onCloseMarkerActionsMenu();
									}}
								>
									Архивировать
								</MenuItem>
							</MenuList>
						</Popover>
					</div>
				</TableCell>

				{dialogMarkerEdit ? (
					<DialogMarkerEdit
						dialogOpen={dialogMarkerEdit}
						onCloseDialog={this.onCloseDialogMarkerEdit}
						currentStockId={currentStockId}
						selectedProduct={product}
						selectedMarker={marker}
					/>
				) : null}

				{dialogMarkerArchive ? (
					<DialogMarkerArchive
						dialogOpen={dialogMarkerArchive}
						onCloseDialog={this.onCloseDialogMarkerArchive}
						currentStockId={currentStockId}
						dataType={'marker'}
						selectedProduct={product}
						selectedMarker={marker}
					/>
				) : null}

				{dialogMarkerQRCodePrint ? (
					<DialogMarkerQRCodePrint
						dialogOpen={dialogMarkerQRCodePrint}
						onCloseDialog={this.onCloseDialogMarkerQRCodePrint}
						currentStockId={currentStockId}
						dataType={'marker'}
						QRCodeData={{
							type: 'marker',
							markerId: marker._id,
						}}
						selectedProduct={product}
						selectedMarker={marker}
					/>
				) : null}

				{dialogCreateWriteOff ? (
					<DialogCreateWriteOff
						dialogOpen={dialogCreateWriteOff}
						onCloseDialog={this.onCloseDialogCreateWriteOff}
						currentStockId={currentStockId}
						selectedProduct={product}
						selectedMarker={marker}
					/>
				) : null}
			</TableRow>
		);
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentStockId } = ownProps;

	return {
		getCharacteristics: () => dispatch(getCharacteristics(currentStockId)),
	};
};

export default connect(
	null,
	mapDispatchToProps
)(MarkerRow);
