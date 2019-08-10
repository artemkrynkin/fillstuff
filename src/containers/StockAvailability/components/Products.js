import React, { Component } from 'react';
import { connect } from 'react-redux';
import ClassNames from 'classnames';
import Loadable from 'react-loadable';
import { cloneDeep } from 'lodash';

// import QRCode from 'qrcode';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
// import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
// import DialogContent from '@material-ui/core/DialogContent';
// import Dialog from '@material-ui/core/Dialog';
// import DialogContentText from '@material-ui/core/DialogContentText';
import { withStyles } from '@material-ui/core/styles';

import colorPalette from 'shared/colorPalette';

import CustomPopover from 'src/components/CustomPopover';
// import { PDDialogActions, PDDialogTitle } from 'src/components/Dialog';
// import { LoadingComponent } from 'src/components/Loading';

import { getCharacteristics } from 'src/actions/characteristics';
import { getProducts } from 'src/actions/products';

import './Products.styl';

const DialogProductEdit = Loadable({
	loader: () => import('src/containers/Dialogs/ProductEdit' /* webpackChunkName: "Dialog_ProductEdit" */),
	loading: () => null,
	delay: 200,
});

const DialogMarkerEdit = Loadable({
	loader: () => import('src/containers/Dialogs/MarkerEdit' /* webpackChunkName: "Dialog_MarkerEdit" */),
	loading: () => null,
	delay: 200,
});

const DialogProductOrMarkerArchive = Loadable({
	loader: () => import('src/containers/Dialogs/ProductOrMarkerArchive' /* webpackChunkName: "Dialog_ProductOrMarkerArchive" */),
	loading: () => null,
	delay: 200,
});

const DialogProductOrMarkerQRCodePrint = Loadable({
	loader: () => import('src/containers/Dialogs/ProductOrMarkerQRCodePrint' /* webpackChunkName: "Dialog_ProductOrMarkerQRCodePrint" */),
	loading: () => null,
	delay: 200,
});

const DialogCreateWriteOff = Loadable({
	loader: () => import('src/containers/Dialogs/CreateWriteOff' /* webpackChunkName: "Dialog_CreateWriteOff" */),
	loading: () => null,
	delay: 200,
});

const ExpansionPanel = withStyles({
	root: {
		backgroundColor: 'transparent',
		boxShadow: 'none',
		'&$expanded': {
			margin: 0,
		},
		'&$disabled': {
			backgroundColor: 'transparent',
		},
	},
	rounded: {
		'&:first-child': {
			borderRadius: 0,
		},
		'&:last-child': {
			borderRadius: 0,
		},
	},
	expanded: {},
	disabled: {},
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
	root: {
		backgroundColor: colorPalette.brightness.cBr1,
		borderTop: `1px solid ${colorPalette.brightness.cBr5}`,
		minHeight: 'initial',
		padding: 0,
		'&$expanded': {
			minHeight: 'initial',
		},
		'&$focused': {
			backgroundColor: 'transparent',
		},
		'&$disabled': {
			backgroundColor: 'transparent',
			opacity: 0.5,
		},
		'&$disabled $expandIcon': {
			opacity: 0,
		},
		'&:hover': {
			backgroundColor: colorPalette.brightness.cBr3,
		},
		'tr:first-child &': {
			borderTop: 'none',
		},
	},
	content: {
		margin: '0 0 0 -41px',
		'&$expanded': {
			margin: '0 0 0 -41px',
		},
	},
	expandIcon: {
		color: colorPalette.blueGrey.cBg200,
		order: -1,
		marginLeft: 5,
		marginRight: '0 !important',
		padding: 8,
		transform: 'rotate(-90deg)',
		width: 36,
		'&$expanded': {
			transform: 'rotate(0deg)',
		},
		'& svg': {
			fontSize: 20,
		},
	},
	expanded: {},
	focused: {},
	disabled: {},
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles({
	root: {
		padding: 0,
	},
})(MuiExpansionPanelDetails);

class Products extends Component {
	state = {
		productOrMarkerActionsMenuOpen: null,
		selectedActionType: null,
		selectedProductOrMarker: null,
		dialogProductEdit: false,
		dialogMarkerCreate: false,
		dialogMarkerEdit: false,
		dialogProductOrMarkerArchive: false,
		dialogProductOrMarkerQRCodePrint: false,
		dialogCreateWriteOff: false,
	};

	onOpenProductOrMarkersActionsMenu = (event, actionType, productOrMarker) => {
		const productOrMarkerClone = cloneDeep(productOrMarker);

		if (actionType === 'product') delete productOrMarkerClone.markers;

		this.setState({
			productOrMarkerActionsMenuOpen: event.currentTarget,
			selectedActionType: actionType,
			selectedProductOrMarker: productOrMarkerClone,
		});
	};

	onCloseProductOrMarkersActionsMenu = save => {
		if (!save) {
			this.setState({
				productOrMarkerActionsMenuOpen: null,
				selectedActionType: null,
				selectedProductOrMarker: null,
			});
		} else {
			this.setState({ productOrMarkerActionsMenuOpen: null });
		}
	};

	onOpenDialogProductEdit = () => this.setState({ dialogProductEdit: true });

	onCloseDialogProductEdit = () => this.setState({ dialogProductEdit: false });

	onExitedDialogProductEdit = () => {
		this.setState({
			// selectedActionType: null,
			selectedProductOrMarker: null,
		});
	};

	onOpenDialogMarkerEdit = async () => {
		await this.props.getCharacteristics();

		this.setState({ dialogMarkerEdit: true });
	};

	onCloseDialogMarkerEdit = () => this.setState({ dialogMarkerEdit: false });

	onOpenDialogProductOrMarkerArchive = () => this.setState({ dialogProductOrMarkerArchive: true });

	onCloseDialogProductOrMarkerArchive = () => this.setState({ dialogProductOrMarkerArchive: false });

	onExitedDialogProductOrMarkerArchive = () => this.setState({ selectedProductOrMarker: null });

	onOpenDialogProductOrMarkerQRCodePrint = () => this.setState({ dialogProductOrMarkerQRCodePrint: true });

	onCloseDialogProductOrMarkerQRCodePrint = () => this.setState({ dialogProductOrMarkerQRCodePrint: false });

	onExitedDialogProductOrMarkerQRCodePrint = () => {
		this.setState({
			selectedActionType: null,
			selectedProductOrMarker: null,
		});
	};

	onOpenDialogCreateWriteOff = () => this.setState({ dialogCreateWriteOff: true });

	onCloseDialogCreateWriteOff = () => this.setState({ dialogCreateWriteOff: false });

	onExitedDialogCreateWriteOff = () => this.setState({ selectedProductOrMarker: null });

	componentDidMount() {
		this.props.getProducts();
	}

	render() {
		const {
			currentStock,
			products: {
				data: products,
				isFetching: isLoadingProducts,
				// error: errorProducts
			},
		} = this.props;

		const {
			productOrMarkerActionsMenuOpen,
			selectedActionType,
			selectedProductOrMarker,
			dialogProductEdit,
			// dialogMarkerCreate,
			dialogMarkerEdit,
			dialogProductOrMarkerArchive,
			dialogProductOrMarkerQRCodePrint,
			dialogCreateWriteOff,
		} = this.state;

		const quantityIndicator = (quantity, minimumBalance) =>
			ClassNames({
				'sa-products__quantity-indicator': true,
				'sa-products__quantity-indicator_red': (quantity / minimumBalance) * 100 <= 100,
				'sa-products__quantity-indicator_yellow': (quantity / minimumBalance) * 100 > 100 && (quantity / minimumBalance) * 100 <= 150,
				'sa-products__quantity-indicator_green': (quantity / minimumBalance) * 100 > 150,
			});

		return (
			<Paper className="sa-products">
				<Table>
					<TableHead>
						<TableRow>
							<TableCell style={{ paddingLeft: 46 }}>Наименование</TableCell>
							<TableCell align="left" width={140}>
								Количество
							</TableCell>
							<TableCell align="center" width={150}>
								Мин. остаток
							</TableCell>
							<TableCell align="right" width={160}>
								Цена закупки
							</TableCell>
							<TableCell align="right" width={160}>
								Цена продажи
							</TableCell>
							<TableCell width={50} />
						</TableRow>
					</TableHead>
					<TableBody>
						{!isLoadingProducts ? (
							products && products.length ? (
								products.map(product => (
									<TableRow key={product._id} className="sa-products__row-product">
										<td colSpan={6} style={{ position: 'relative' }}>
											<ExpansionPanel
												TransitionProps={{
													timeout: 300,
												}}
												defaultExpanded={product.markers.length !== 0}
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
																	<span style={{ color: colorPalette.blueGrey.cBg600, fontWeight: 600 }}>{product.name}</span>
																</TableCell>
																<TableCell align="left" width={140}>
																	<div className={quantityIndicator(product.quantity, product.minimumBalance)} />
																	{product.quantity}
																</TableCell>
																<TableCell align="center" width={150}>
																	{product.minimumBalance}
																</TableCell>
																<TableCell width={320 + 50} />
															</TableRow>
														</TableBody>
													</Table>
												</ExpansionPanelSummary>
												{product.markers.length ? (
													<ExpansionPanelDetails>
														<Table>
															<TableBody>
																{product.markers.map(marker => (
																	<TableRow key={marker._id} className="sa-products__row-marker">
																		<TableCell width={41} style={{ paddingLeft: 5, paddingRight: 0 }} />
																		<TableCell style={{ paddingLeft: 5 }}>
																			{marker.mainCharacteristic.label}{' '}
																			{marker.characteristics.reduce(
																				(fullCharacteristics, characteristic) => `${fullCharacteristics} ${characteristic.label}`,
																				''
																			)}
																		</TableCell>
																		<TableCell align="left" width={140}>
																			<div className={quantityIndicator(marker.quantity, marker.minimumBalance)} />
																			{marker.quantity}
																		</TableCell>
																		<TableCell align="center" width={150}>
																			{marker.minimumBalance}
																		</TableCell>
																		<TableCell align="right" width={160}>
																			{marker.unitPurchasePrice ? `${marker.unitPurchasePrice} ₽` : '-'}
																		</TableCell>
																		<TableCell align="right" width={160}>
																			{marker.unitSellingPrice ? `${marker.unitSellingPrice} ₽` : '-'}
																		</TableCell>
																		<TableCell align="right" width={50} style={{ padding: '0 7px' }}>
																			<div className="sa-products__marker-actions">
																				<IconButton
																					className="sa-products__marker-actions-button"
																					aria-haspopup="true"
																					onClick={event => this.onOpenProductOrMarkersActionsMenu(event, 'marker', { product, marker })}
																					size="small"
																				>
																					<FontAwesomeIcon icon={['far', 'ellipsis-h']} />
																				</IconButton>
																			</div>
																		</TableCell>
																	</TableRow>
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
													onClick={event => this.onOpenProductOrMarkersActionsMenu(event, 'product', { product, marker: null })}
													size="small"
												>
													<FontAwesomeIcon icon={['far', 'ellipsis-h']} />
												</IconButton>
											</div>
										</td>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={5}>
										<Typography variant="caption" align="center" component="div" style={{ padding: '1px 0' }}>
											Еще не создано ни одной позиции.
										</Typography>
									</TableCell>
								</TableRow>
							)
						) : (
							<TableRow>
								<TableCell colSpan={5} style={{ padding: 12 }}>
									<div children={<CircularProgress size={20} />} style={{ textAlign: 'center' }} />
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>

				<CustomPopover
					anchorEl={productOrMarkerActionsMenuOpen}
					open={Boolean(productOrMarkerActionsMenuOpen)}
					onClose={this.onCloseProductOrMarkersActionsMenu}
				>
					<MenuList>
						<MenuItem
							onClick={() => {
								this.onOpenDialogProductOrMarkerQRCodePrint();
								this.onCloseProductOrMarkersActionsMenu(true);
							}}
						>
							Печать QR-кода
						</MenuItem>
						{selectedActionType === 'marker' ? (
							<MenuItem
								onClick={() => {
									// this.onOpenDialogProductEdit();
									this.onCloseProductOrMarkersActionsMenu(true);
								}}
							>
								Внести количество
							</MenuItem>
						) : null}
						{selectedActionType === 'marker' ? (
							<MenuItem
								disabled={selectedProductOrMarker && selectedProductOrMarker.marker ? selectedProductOrMarker.marker.quantity <= 0 : false}
								onClick={() => {
									this.onOpenDialogCreateWriteOff();
									this.onCloseProductOrMarkersActionsMenu(true);
								}}
							>
								Списать количество
							</MenuItem>
						) : null}
						<MenuItem
							onClick={() => {
								if (selectedActionType === 'product') this.onOpenDialogProductEdit();
								if (selectedActionType === 'marker') this.onOpenDialogMarkerEdit();

								this.onCloseProductOrMarkersActionsMenu(true);
							}}
						>
							Редактировать
						</MenuItem>
						<MenuItem
							onClick={() => {
								this.onOpenDialogProductOrMarkerArchive();
								this.onCloseProductOrMarkersActionsMenu(true);
							}}
						>
							Архивировать
						</MenuItem>
					</MenuList>
				</CustomPopover>

				<DialogProductEdit
					dialogOpen={dialogProductEdit}
					onCloseDialog={this.onCloseDialogProductEdit}
					onExitedDialog={this.onExitedDialogProductEdit}
					currentStock={currentStock}
					selectedProduct={selectedProductOrMarker && selectedProductOrMarker.product}
				/>

				<DialogMarkerEdit
					dialogOpen={dialogMarkerEdit}
					onCloseDialog={this.onCloseDialogMarkerEdit}
					currentStock={currentStock}
					selectedProduct={selectedProductOrMarker && selectedProductOrMarker.product}
					selectedMarker={selectedProductOrMarker && selectedProductOrMarker.marker}
				/>

				<DialogProductOrMarkerArchive
					actionType={selectedActionType}
					dialogOpen={dialogProductOrMarkerArchive}
					onCloseDialog={this.onCloseDialogProductOrMarkerArchive}
					onExitedDialog={this.onExitedDialogProductOrMarkerArchive}
					currentStock={currentStock}
					selectedProduct={selectedProductOrMarker && selectedProductOrMarker.product}
					selectedMarker={selectedProductOrMarker && selectedProductOrMarker.marker}
				/>

				<DialogProductOrMarkerQRCodePrint
					actionType={selectedActionType}
					dialogOpen={dialogProductOrMarkerQRCodePrint}
					onCloseDialog={this.onCloseDialogProductOrMarkerQRCodePrint}
					onExitedDialog={this.onExitedDialogProductOrMarkerQRCodePrint}
					currentStock={currentStock}
					selectedProduct={selectedProductOrMarker && selectedProductOrMarker.product}
					selectedMarker={selectedProductOrMarker && selectedProductOrMarker.marker}
				/>

				<DialogCreateWriteOff
					dialogOpen={dialogCreateWriteOff}
					onCloseDialog={this.onCloseDialogCreateWriteOff}
					onExitedDialog={this.onExitedDialogCreateWriteOff}
					currentStock={currentStock}
					selectedProduct={selectedProductOrMarker && selectedProductOrMarker.product}
					selectedMarker={selectedProductOrMarker && selectedProductOrMarker.marker}
				/>
			</Paper>
		);
	}
}

const mapStateToProps = state => {
	return {
		products: state.products,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentStock } = ownProps;

	return {
		getCharacteristics: () => dispatch(getCharacteristics(currentStock._id)),
		getProducts: () => dispatch(getProducts(currentStock._id)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Products);
