import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';

import QuantityIndicator from 'src/components/QuantityIndicator';
import Popover from 'src/components/Popover';

import { getCharacteristics } from 'src/actions/characteristics';

import { TableCell } from './styles';

class MarkerRow extends Component {
	static propTypes = {
		currentStockId: PropTypes.string.isRequired,
		product: PropTypes.object.isRequired,
		marker: PropTypes.object.isRequired,
	};

	state = {
		markerMenu: null,
	};

	onOpenMarkerActionsMenu = event => this.setState({ markerMenu: event.currentTarget });

	onCloseMarkerActionsMenu = () => this.setState({ markerMenu: null });

	render() {
		const { product, marker, markerActions } = this.props;
		const { markerMenu } = this.state;

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
										markerActions.onOpenDialogMarkerQRCodePrint(product, marker);
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
										markerActions.onOpenDialogCreateWriteOff(product, marker);
										this.onCloseMarkerActionsMenu();
									}}
								>
									Списать количество
								</MenuItem>
								<MenuItem
									onClick={() => {
										markerActions.onOpenDialogMarkerEdit(product, marker);
										this.onCloseMarkerActionsMenu();
									}}
								>
									Редактировать
								</MenuItem>
								<MenuItem
									onClick={() => {
										markerActions.onOpenDialogMarkerArchive(product, marker);
										this.onCloseMarkerActionsMenu();
									}}
								>
									Архивировать
								</MenuItem>
							</MenuList>
						</Popover>
					</div>
				</TableCell>
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
