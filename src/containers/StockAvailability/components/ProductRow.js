import React, { Component } from 'react';
import PropTypes from 'prop-types';

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

class ProductRow extends Component {
	static propTypes = {
		currentStockId: PropTypes.string.isRequired,
		product: PropTypes.object.isRequired,
	};

	state = {
		productMenu: null,
	};

	onOpenProductActionsMenu = event => this.setState({ productMenu: event.currentTarget });

	onCloseProductActionsMenu = () => this.setState({ productMenu: null });

	render() {
		const { currentStockId, product, productActions, markerActions } = this.props;
		const { productMenu } = this.state;

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
										{product.markers.map(marker => {
											const productClone = Object.assign({}, product);

											delete productClone.markers;

											return (
												<MarkerRow
													key={marker._id}
													currentStockId={currentStockId}
													product={productClone}
													marker={marker}
													markerActions={markerActions}
												/>
											);
										})}
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

						<Popover
							anchorEl={productMenu}
							open={Boolean(productMenu)}
							onClose={this.onCloseProductActionsMenu}
							disablePortal
							disableAutoFocus
						>
							<MenuList>
								<MenuItem
									onClick={() => {
										productActions.onOpenDialogProductQRCodePrint(product);
										this.onCloseProductActionsMenu();
									}}
								>
									Печать QR-кода
								</MenuItem>
								<MenuItem
									onClick={() => {
										productActions.onOpenDialogProductEdit(product);
										this.onCloseProductActionsMenu();
									}}
								>
									Редактировать
								</MenuItem>
								<MenuItem
									onClick={() => {
										productActions.onOpenDialogProductArchive(product);
										this.onCloseProductActionsMenu();
									}}
								>
									Архивировать
								</MenuItem>
							</MenuList>
						</Popover>
					</div>
				</td>
			</TableRow>
		);
	}
}

export default ProductRow;
