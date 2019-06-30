import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as Yup from 'yup';
import QRCode from 'qrcode.react';
import ReactToPrint from 'react-to-print';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CircularProgress from '@material-ui/core/CircularProgress';
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
import DialogEditProduct from 'src/containers/Dialogs/CreateEditProduct';

// import { checkPermissions, findMemberInStock } from 'shared/roles-access-rights';

import './Products.styl';

import { getProducts, deleteProduct } from 'src/actions/products';
import Button from '@material-ui/core/Button';

class Products extends Component {
	state = {
		productActionsMenuOpen: null,
		selectedProduct: null,
		dialogEditProduct: false,
		dialogDeleteProduct: false,
		dialogQRCodeProduct: false,
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

	onOpenDialogEditProduct = () =>
		this.setState({
			dialogEditProduct: true,
		});

	onCloseDialogEditProduct = () =>
		this.setState({
			dialogEditProduct: false,
		});

	onOpenDialogDeleteProduct = () =>
		this.setState({
			dialogDeleteProduct: true,
		});

	onCloseDialogDeleteProduct = () =>
		this.setState({
			dialogDeleteProduct: false,
		});

	onExitedDialogDeleteProduct = () =>
		this.setState({
			selectedProduct: null,
		});

	onOpenDialogQRCodeProduct = () =>
		this.setState({
			dialogQRCodeProduct: true,
		});

	onCloseDialogQRCodeProduct = () =>
		this.setState({
			dialogQRCodeProduct: false,
		});

	onExitedDialogQRCodeProduct = () =>
		this.setState({
			selectedProduct: null,
		});

	UNSAFE_componentWillMount() {
		this.props.getProducts(this.props.currentCategory);
	}

	UNSAFE_componentWillUpdate(nextProps, nextState, nextContext) {
		if (this.props.currentCategory !== nextProps.currentCategory) {
			this.props.getProducts(nextProps.currentCategory);
		}
	}

	render() {
		const {
			// currentUser,
			currentStock,
			// currentUserRole = findMemberInStock(currentUser._id, currentStock).role,
			products: {
				data: products,
				isFetching: isLoadingProducts,
				// error: errorProducts
			},
			// categories = currentStock.categories,
		} = this.props;

		const { productActionsMenuOpen, selectedProduct, dialogEditProduct, dialogDeleteProduct, dialogQRCodeProduct } = this.state;

		return (
			<Paper>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Наименование</TableCell>
							<TableCell align="right" width="130px">
								Количество
							</TableCell>
							<TableCell align="right" width="140px">
								Цена закупки
							</TableCell>
							<TableCell align="right" width="145px">
								Цена продажи
							</TableCell>
							<TableCell align="right" size="small" width="72px" />
						</TableRow>
					</TableHead>
					<TableBody>
						{!isLoadingProducts ? (
							products && products.length ? (
								products.map(product => (
									<TableRow key={product._id}>
										<TableCell>{product.name}</TableCell>
										<TableCell align="right">{product.amount}</TableCell>
										<TableCell align="right">{product.purchasePrice}₽</TableCell>
										<TableCell align="right">{product.sellingPrice}₽</TableCell>
										<TableCell align="right" size="small">
											<IconButton
												className="sp-products__actions"
												aria-haspopup="true"
												onClick={event => this.onOpenProductActionsMenu(event, product)}
											>
												<FontAwesomeIcon icon={['far', 'ellipsis-h']} />
											</IconButton>
										</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={5}>
										<Typography variant="caption" align="center" component="div">
											Еще не создано ни одного товара.
										</Typography>
									</TableCell>
								</TableRow>
							)
						) : (
							<TableRow>
								<TableCell colSpan={5}>
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
								this.onOpenDialogQRCodeProduct();
								this.onCloseProductActionsMenu(true);
							}}
						>
							QR-код
						</MenuItem>
						<MenuItem
							onClick={() => {
								this.onOpenDialogEditProduct();
								this.onCloseProductActionsMenu(true);
							}}
						>
							Редактировать
						</MenuItem>
						<MenuItem
							onClick={() => {
								this.onOpenDialogDeleteProduct();
								this.onCloseProductActionsMenu(true);
							}}
						>
							Удалить
						</MenuItem>
					</MenuList>
				</Popover>

				<DialogEditProduct
					actionType="edit"
					dialogOpen={dialogEditProduct}
					selectedProduct={selectedProduct}
					onCloseDialog={this.onCloseDialogEditProduct}
					currentStock={currentStock}
				/>

				<Dialog
					open={dialogDeleteProduct}
					onClose={this.onCloseDialogDeleteProduct}
					onExited={this.onExitedDialogDeleteProduct}
					fullWidth
				>
					<PDDialogTitle theme="primary" onClose={this.onCloseDialogDeleteProduct}>
						Удаление товара
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
								onClick: this.onCloseDialogDeleteProduct,
							},
							text: 'Закрыть',
						}}
						rightHandleProps={{
							handleProps: {
								onClick: () => this.props.deleteProduct(selectedProduct._id).then(() => this.onCloseDialogDeleteProduct()),
							},
							text: 'Удалить',
						}}
					/>
				</Dialog>

				<Dialog
					open={dialogQRCodeProduct}
					onClose={this.onCloseDialogQRCodeProduct}
					onExited={this.onExitedDialogQRCodeProduct}
					fullWidth
				>
					<PDDialogTitle onClose={this.onCloseDialogQRCodeProduct} />
					<DialogContent>
						{selectedProduct ? (
							<div style={{ textAlign: 'center' }}>
								<ReactToPrint
									trigger={() => (
										<Button variant="contained" color="primary" aria-haspopup="true" style={{ marginBottom: 30 }}>
											Печать QR-кода
										</Button>
									)}
									content={() => this.printQRCodeProductRef}
								/>
								<div ref={element => (this.printQRCodeProductRef = element)}>
									<QRCode
										size={250}
										value={JSON.stringify({
											type: 'product',
											productId: selectedProduct._id,
										})}
									/>
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
		getProducts: currentCategory => dispatch(getProducts(currentStock._id, currentCategory)),
		deleteProduct: productId => dispatch(deleteProduct(currentStock._id, productId)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Products);
