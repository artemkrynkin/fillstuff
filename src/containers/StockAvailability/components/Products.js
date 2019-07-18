import React, { Component } from 'react';
import { connect } from 'react-redux';
import ClassNames from 'classnames';

import QRCode from 'qrcode';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
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
import Popover from '@material-ui/core/Popover';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import DialogContentText from '@material-ui/core/DialogContentText';

import { PDDialogActions, PDDialogTitle } from 'src/components/Dialog';
import { LoadingComponent } from 'src/components/Loading';

import { getStockStatus } from 'src/actions/stocks';
import { getProducts, deleteProduct } from 'src/actions/products';

import './Products.styl';
import Loadable from 'react-loadable';

const DialogProductCreate = Loadable({
	loader: () => import('src/containers/Dialogs/ProductCreateEdit' /* webpackChunkName: "Dialog_ProductCreateEdit" */),
	loading: () => null,
	delay: 200,
});

class Products extends Component {
	state = {
		productActionsMenuOpen: null,
		selectedProduct: null,
		selectedProductQRCode: null,
		dialogProductEdit: false,
		dialogProductDelete: false,
		dialogProductQRCode: false,
	};

	onOpenProductActionsMenu = (event, product) =>
		this.setState({
			productActionsMenuOpen: event.currentTarget,
			selectedProduct: product,
		});

	onCloseProductActionsMenu = saveProduct => {
		if (!saveProduct) {
			this.setState({
				productActionsMenuOpen: null,
				selectedProduct: null,
			});
		} else {
			this.setState({ productActionsMenuOpen: null });
		}
	};

	onOpenDialogProductEdit = () =>
		this.setState({
			dialogProductEdit: true,
		});

	onCloseDialogProductEdit = () =>
		this.setState({
			dialogProductEdit: false,
		});

	onOpenDialogProductDelete = () =>
		this.setState({
			dialogProductDelete: true,
		});

	onCloseDialogProductDelete = () =>
		this.setState({
			dialogProductDelete: false,
		});

	onExitedDialogProductDelete = () =>
		this.setState({
			selectedProduct: null,
		});

	onOpenDialogProductQRCode = () => {
		const { selectedProduct } = this.state;

		this.setState({
			dialogProductQRCode: true,
		});

		QRCode.toDataURL(
			JSON.stringify({
				type: 'product',
				productId: selectedProduct._id,
			}),
			{
				margin: 10,
				width: 1000,
			}
		)
			.then(url => {
				this.setState({ selectedProductQRCode: url });
			})
			.catch(err => {
				console.error(err);
			});
	};

	onCloseDialogProductQRCode = () =>
		this.setState({
			dialogProductQRCode: false,
		});

	onExitedDialogProductQRCode = () =>
		this.setState({
			selectedProduct: null,
			selectedProductQRCode: null,
		});

	UNSAFE_componentWillMount() {
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
			productActionsMenuOpen,
			selectedProduct,
			selectedProductQRCode,
			dialogProductEdit,
			dialogProductDelete,
			dialogProductQRCode,
		} = this.state;

		const quantityIndicator = (quantity, minimumBalance) =>
			ClassNames({
				'sa-products__quantity-indicator': true,
				'sa-products__quantity-indicator_red': (quantity / minimumBalance) * 100 <= 100,
				'sa-products__quantity-indicator_yellow':
					(quantity / minimumBalance) * 100 > 100 && (quantity / minimumBalance) * 100 <= 200,
				'sa-products__quantity-indicator_green': (quantity / minimumBalance) * 100 > 200,
			});

		return (
			<Paper>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell style={{ paddingLeft: 36 }}>Наименование</TableCell>
							<TableCell align="right" width="130px">
								Количество
							</TableCell>
							<TableCell align="right" width="140px">
								Цена закупки
							</TableCell>
							<TableCell align="right" width="145px">
								Цена продажи
							</TableCell>
							<TableCell align="right" size="small" width="55px" />
						</TableRow>
					</TableHead>
					<TableBody>
						{!isLoadingProducts ? (
							products && products.length ? (
								products.map(product => (
									<TableRow key={product._id}>
										<TableCell>
											<div className={quantityIndicator(product.quantity, product.minimumBalance)} />
											{product.name}
										</TableCell>
										<TableCell align="right">{product.quantity}</TableCell>
										<TableCell align="right">{product.unitPurchasePrice} ₽</TableCell>
										<TableCell align="right">{product.unitSellingPrice ? `${product.unitSellingPrice} ₽` : '-'}</TableCell>
										<TableCell align="right" size="small" style={{ paddingLeft: 0 }}>
											<IconButton
												className="sa-products__actions"
												aria-haspopup="true"
												onClick={event => this.onOpenProductActionsMenu(event, product)}
												size="small"
											>
												<FontAwesomeIcon icon={['far', 'ellipsis-h']} />
											</IconButton>
										</TableCell>
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

				<Popover
					anchorEl={productActionsMenuOpen}
					open={Boolean(productActionsMenuOpen)}
					onClose={this.onCloseProductActionsMenu}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'center',
					}}
					transformOrigin={{
						vertical: 'top',
						horizontal: 'center',
					}}
					transitionDuration={150}
					elevation={2}
				>
					<MenuList>
						<MenuItem
							onClick={() => {
								this.onOpenDialogProductQRCode();
								this.onCloseProductActionsMenu(true);
							}}
						>
							QR-код
						</MenuItem>
						<MenuItem
							onClick={() => {
								this.onOpenDialogProductEdit();
								this.onCloseProductActionsMenu(true);
							}}
						>
							Редактировать
						</MenuItem>
						<MenuItem
							onClick={() => {
								this.onOpenDialogProductDelete();
								this.onCloseProductActionsMenu(true);
							}}
						>
							Архивировать
						</MenuItem>
					</MenuList>
				</Popover>

				<DialogProductCreate
					actionType="edit"
					dialogOpen={dialogProductEdit}
					onCloseDialog={this.onCloseDialogProductEdit}
					onExitedDialog={this.onExitedDialogProductEdit}
					currentStock={currentStock}
					selectedProduct={selectedProduct}
				/>

				<Dialog
					open={dialogProductDelete}
					onClose={this.onCloseDialogProductDelete}
					onExited={this.onExitedDialogProductDelete}
					fullWidth
				>
					<PDDialogTitle theme="primary" onClose={this.onCloseDialogProductDelete}>
						Удаление позиции
					</PDDialogTitle>
					<DialogContent>
						{selectedProduct ? (
							<DialogContentText>
								Вы уверены, что хотите удалить <b>{selectedProduct.name}</b> со склада?
							</DialogContentText>
						) : null}
					</DialogContent>
					<PDDialogActions
						leftHandleProps={{
							handleProps: {
								onClick: this.onCloseDialogProductDelete,
							},
							text: 'Закрыть',
						}}
						rightHandleProps={{
							handleProps: {
								onClick: () =>
									this.props.deleteProduct(selectedProduct._id).then(() => {
										this.props.getStockStatus();
										this.onCloseDialogProductDelete();
									}),
							},
							text: 'Удалить',
						}}
					/>
				</Dialog>

				<Dialog
					open={dialogProductQRCode}
					onClose={this.onCloseDialogProductQRCode}
					onExited={this.onExitedDialogProductQRCode}
					fullWidth
				>
					<PDDialogTitle onClose={this.onCloseDialogProductQRCode} />
					<DialogContent>
						{selectedProduct ? (
							<div style={{ textAlign: 'center' }}>
								<Button variant="contained" color="primary" aria-haspopup="true" style={{ marginBottom: 30 }}>
									Печать QR-кода
								</Button>
								<div>
									{selectedProductQRCode ? (
										<img src={selectedProductQRCode} alt="" style={{ width: '100%' }} />
									) : (
										<Grid children={<LoadingComponent />} alignItems="center" container />
									)}
									{/*<div*/}
									{/*	size={250}*/}
									{/*	value={JSON.stringify({*/}
									{/*		type: 'product',*/}
									{/*		productId: selectedProduct._id,*/}
									{/*	})}*/}
									{/*/>*/}
								</div>
							</div>
						) : null}
					</DialogContent>
				</Dialog>
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
		getStockStatus: () => dispatch(getStockStatus(currentStock._id)),
		getProducts: () => dispatch(getProducts(currentStock._id)),
		deleteProduct: productId => dispatch(deleteProduct(currentStock._id, productId)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Products);
