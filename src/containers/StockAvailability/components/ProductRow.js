import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Loadable from 'react-loadable';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';

import { declensionNumber } from 'src/helpers/utils';

import QuantityIndicator from 'src/components/QuantityIndicator';
import Popover from 'src/components/Popover';

import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, TableCell } from './styles';
import MarkerRow from './MarkerRow';

const DialogProductEdit = Loadable({
	loader: () => import('src/containers/Dialogs/ProductEdit' /* webpackChunkName: "Dialog_ProductEdit" */),
	loading: () => null,
	delay: 200,
});

const DialogProductArchive = Loadable({
	loader: () => import('src/containers/Dialogs/ProductOrMarkerArchive' /* webpackChunkName: "Dialog_ProductOrMarkerArchive" */),
	loading: () => null,
	delay: 200,
});

const DialogProductQRCodePrint = Loadable({
	loader: () => import('src/containers/Dialogs/ProductOrMarkerQRCodePrint' /* webpackChunkName: "Dialog_ProductOrMarkerQRCodePrint" */),
	loading: () => null,
	delay: 200,
});

class ProductRow extends Component {
	static propTypes = {
		currentStockId: PropTypes.string.isRequired,
		product: PropTypes.object.isRequired,
	};

	state = {
		productMenu: null,
		dialogProductEdit: false,
		dialogProductArchive: false,
		dialogProductQRCodePrint: false,
	};

	onOpenProductActionsMenu = event => this.setState({ productMenu: event.currentTarget });

	onCloseProductActionsMenu = () => this.setState({ productMenu: null });

	onOpenDialogProductEdit = () => this.setState({ dialogProductEdit: true });

	onCloseDialogProductEdit = () => this.setState({ dialogProductEdit: false });

	onOpenDialogProductArchive = () => this.setState({ dialogProductArchive: true });

	onCloseDialogProductArchive = callback => {
		this.setState({ dialogProductArchive: false }, () => {
			if (callback) callback();
		});
	};

	onOpenDialogProductQRCodePrint = () => this.setState({ dialogProductQRCodePrint: true });

	onCloseDialogProductQRCodePrint = () => this.setState({ dialogProductQRCodePrint: false });

	render() {
		const { currentStockId, product } = this.props;
		const { productMenu, dialogProductEdit, dialogProductArchive, dialogProductQRCodePrint } = this.state;

		return (
			<TableRow className="sa-products__row-product">
				<td colSpan={6} style={{ position: 'relative' }}>
					<ExpansionPanel
						TransitionProps={{
							timeout: 300,
						}}
						defaultExpanded={product.markers.length !== 0 && product.dividedMarkers}
						disabled={!product.markers.length}
					>
						<ExpansionPanelSummary
							expandIcon={<FontAwesomeIcon icon={['far', 'angle-down']} />}
							IconButtonProps={{
								disableRipple: true,
								size: 'small',
							}}
						>
							<Table>
								<TableBody>
									<TableRow>
										<TableCell width={41} style={{ paddingLeft: 5, paddingRight: 0 }} />
										<TableCell style={{ paddingLeft: 5 }}>
											<span className="sa-products__product-name">{product.name}</span>
											<span className="sa-products__markers-count">
												{product.markers.length + ' ' + declensionNumber(product.markers.length, ['маркер', 'маркера', 'маркеров'])}
											</span>
										</TableCell>
										<TableCell align="right" width={160}>
											{product.markers.length ? (
												<QuantityIndicator
													type="product"
													dividedMarkers={product.dividedMarkers}
													receiptUnits={product.receiptUnits}
													unitIssue={product.unitIssue}
													quantity={product.quantity}
													minimumBalance={product.minimumBalance}
													markers={product.markers.map(marker => {
														let markerObj = {
															quantity: marker.quantity,
														};

														if (product.dividedMarkers) markerObj.minimumBalance = marker.minimumBalance;
														if (product.receiptUnits === 'nmp') markerObj.quantityPackages = marker.quantityPackages;

														return markerObj;
													})}
												/>
											) : null}
										</TableCell>
										<TableCell align="right" width={130}>
											{product.markers.length ? product.minimumBalance : null}
										</TableCell>
										<TableCell width={280 + 50} />
									</TableRow>
								</TableBody>
							</Table>
						</ExpansionPanelSummary>
						{product.markers.length ? (
							<ExpansionPanelDetails>
								<Table>
									<TableBody>
										{product.markers.map(marker => (
											<MarkerRow key={marker._id} currentStockId={currentStockId} product={product} marker={marker} />
										))}
									</TableBody>
								</Table>
							</ExpansionPanelDetails>
						) : null}
					</ExpansionPanel>
					<div className="sa-products__product-actions">
						<IconButton className="sa-products__product-add-marker-button" aria-haspopup="true" size="small">
							<FontAwesomeIcon icon={['fal', 'plus']} />
						</IconButton>
						<IconButton
							className="sa-products__product-actions-button"
							aria-haspopup="true"
							onClick={event => this.onOpenProductActionsMenu(event)}
							size="small"
						>
							<FontAwesomeIcon icon={['far', 'ellipsis-h']} />
						</IconButton>

						<Popover anchorEl={productMenu} open={Boolean(productMenu)} onClose={this.onCloseProductActionsMenu} disablePortal>
							<MenuList>
								<MenuItem
									onClick={() => {
										this.onOpenDialogProductQRCodePrint();
										this.onCloseProductActionsMenu();
									}}
								>
									Печать QR-кода
								</MenuItem>
								<MenuItem
									onClick={() => {
										this.onOpenDialogProductEdit();
										this.onCloseProductActionsMenu();
									}}
								>
									Редактировать
								</MenuItem>
								<MenuItem
									onClick={() => {
										this.onOpenDialogProductArchive();
										this.onCloseProductActionsMenu();
									}}
								>
									Архивировать
								</MenuItem>
							</MenuList>
						</Popover>
					</div>
				</td>

				{dialogProductEdit ? (
					<DialogProductEdit
						dialogOpen={dialogProductEdit}
						onCloseDialog={this.onCloseDialogProductEdit}
						currentStockId={currentStockId}
						selectedProduct={product}
					/>
				) : null}

				{dialogProductArchive ? (
					<DialogProductArchive
						dialogOpen={dialogProductArchive}
						onCloseDialog={this.onCloseDialogProductArchive}
						currentStockId={currentStockId}
						dataType={'product'}
						selectedProduct={product}
					/>
				) : null}

				{dialogProductQRCodePrint ? (
					<DialogProductQRCodePrint
						dialogOpen={dialogProductQRCodePrint}
						onCloseDialog={this.onCloseDialogProductQRCodePrint}
						currentStockId={currentStockId}
						dataType={'product'}
						QRCodeData={{
							type: 'product',
							productId: product._id,
						}}
						selectedProduct={product}
					/>
				) : null}
			</TableRow>
		);
	}
}

export default ProductRow;
