import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';

import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { getCharacteristics } from 'src/actions/characteristics';
import { getProducts } from 'src/actions/products';

import { TableCell } from './styles';
import ProductRow from './ProductRow';

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

class Products extends Component {
	state = {
		product: null,
		marker: null,
		dialogProductEdit: false,
		dialogProductArchive: false,
		dialogProductQRCodePrint: false,
		dialogMarkerEdit: false,
		dialogMarkerArchive: false,
		dialogMarkerQRCodePrint: false,
		dialogCreateWriteOff: false,
	};

	onProductSet = product => {
		const productClone = Object.assign({}, product);

		delete productClone.markers;

		return productClone;
	};

	onProductDrop = () => this.setState({ product: null });

	onProductAndMarkerDrop = () => this.setState({ product: null, marker: null });

	onOpenDialogProductEdit = product =>
		this.setState({
			product: this.onProductSet(product),
			dialogProductEdit: true,
		});

	onCloseDialogProductEdit = () => this.setState({ dialogProductEdit: false });

	onOpenDialogProductArchive = product =>
		this.setState({
			product: this.onProductSet(product),
			dialogProductArchive: true,
		});

	onCloseDialogProductArchive = () => this.setState({ dialogProductArchive: false });

	onOpenDialogProductQRCodePrint = product =>
		this.setState({
			product: this.onProductSet(product),
			dialogProductQRCodePrint: true,
		});

	onCloseDialogProductQRCodePrint = () => this.setState({ dialogProductQRCodePrint: false });

	onOpenDialogMarkerEdit = async (product, marker) => {
		await this.props.getCharacteristics();

		this.setState({
			product: product,
			marker: marker,
			dialogMarkerEdit: true,
		});
	};

	onCloseDialogMarkerEdit = () => this.setState({ dialogMarkerEdit: false });

	onOpenDialogMarkerArchive = (product, marker) =>
		this.setState({
			product: product,
			marker: marker,
			dialogMarkerArchive: true,
		});

	onCloseDialogMarkerArchive = () => this.setState({ dialogMarkerArchive: false });

	onOpenDialogMarkerQRCodePrint = (product, marker) =>
		this.setState({
			product: product,
			marker: marker,
			dialogMarkerQRCodePrint: true,
		});

	onCloseDialogMarkerQRCodePrint = () => this.setState({ dialogMarkerQRCodePrint: false });

	onOpenDialogCreateWriteOff = (product, marker) =>
		this.setState({
			product: product,
			marker: marker,
			dialogCreateWriteOff: true,
		});

	onCloseDialogCreateWriteOff = () => this.setState({ dialogCreateWriteOff: false });

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
			product,
			marker,
			dialogProductEdit,
			dialogProductArchive,
			dialogProductQRCodePrint,
			dialogMarkerEdit,
			dialogMarkerArchive,
			dialogMarkerQRCodePrint,
			dialogCreateWriteOff,
		} = this.state;

		return (
			<Paper className="sa-products">
				<Table>
					<TableHead className="sa-products__table-header-sticky">
						<TableRow>
							<TableCell style={{ paddingLeft: 46 }}>Наименование</TableCell>
							<TableCell align="right" width={160}>
								Количество
							</TableCell>
							<TableCell align="right" width={130}>
								Мин. остаток
							</TableCell>
							<TableCell align="right" width={140}>
								Цена закупки
							</TableCell>
							<TableCell align="right" width={140}>
								Цена продажи
							</TableCell>
							<TableCell width={50} />
						</TableRow>
					</TableHead>
					<TableBody>
						{!isLoadingProducts ? (
							products && products.length ? (
								products.map(product => (
									<ProductRow
										key={product._id}
										currentStockId={currentStock._id}
										product={product}
										productActions={{
											onOpenDialogProductEdit: this.onOpenDialogProductEdit,
											onOpenDialogProductArchive: this.onOpenDialogProductArchive,
											onOpenDialogProductQRCodePrint: this.onOpenDialogProductQRCodePrint,
										}}
										markerActions={{
											onOpenDialogMarkerEdit: this.onOpenDialogMarkerEdit,
											onOpenDialogMarkerArchive: this.onOpenDialogMarkerArchive,
											onOpenDialogMarkerQRCodePrint: this.onOpenDialogMarkerQRCodePrint,
											onOpenDialogCreateWriteOff: this.onOpenDialogCreateWriteOff,
										}}
									/>
								))
							) : (
								<TableRow>
									<TableCell colSpan={5} style={{ borderBottom: 'none' }}>
										<Typography variant="caption" align="center" component="div" style={{ padding: '1px 0' }}>
											Еще не создано ни одной позиции.
										</Typography>
									</TableCell>
								</TableRow>
							)
						) : (
							<TableRow>
								<TableCell colSpan={5} style={{ borderBottom: 'none', padding: 12 }}>
									<div children={<CircularProgress size={20} />} style={{ textAlign: 'center' }} />
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>

				{/* Dialogs Products */}
				<DialogProductEdit
					dialogOpen={dialogProductEdit}
					onCloseDialog={this.onCloseDialogProductEdit}
					onExitedDialog={this.onProductDrop}
					currentStockId={currentStock._id}
					selectedProduct={product}
				/>

				<DialogProductOrMarkerArchive
					dialogOpen={dialogProductArchive}
					onCloseDialog={this.onCloseDialogProductArchive}
					onExitedDialog={this.onProductDrop}
					currentStockId={currentStock._id}
					dataType={'product'}
					selectedProduct={product}
				/>

				<DialogProductOrMarkerQRCodePrint
					dialogOpen={dialogProductQRCodePrint}
					onCloseDialog={this.onCloseDialogProductQRCodePrint}
					onExitedDialog={this.onProductDrop}
					currentStockId={currentStock._id}
					dataType={'product'}
					QRCodeData={
						product
							? {
									type: 'product',
									productId: product._id,
							  }
							: {}
					}
					selectedProduct={product}
				/>

				{/* Dialogs Markers */}
				<DialogMarkerEdit
					dialogOpen={dialogMarkerEdit}
					onCloseDialog={this.onCloseDialogMarkerEdit}
					onExitedDialog={this.onProductAndMarkerDrop}
					currentStockId={currentStock._id}
					selectedProduct={product}
					selectedMarker={marker}
				/>

				<DialogProductOrMarkerArchive
					dialogOpen={dialogMarkerArchive}
					onCloseDialog={this.onCloseDialogMarkerArchive}
					onExitedDialog={this.onProductAndMarkerDrop}
					currentStockId={currentStock._id}
					dataType={'marker'}
					selectedProduct={product}
					selectedMarker={marker}
				/>

				<DialogProductOrMarkerQRCodePrint
					dialogOpen={dialogMarkerQRCodePrint}
					onCloseDialog={this.onCloseDialogMarkerQRCodePrint}
					onExitedDialog={this.onProductAndMarkerDrop}
					currentStockId={currentStock._id}
					dataType={'marker'}
					QRCodeData={
						product && marker
							? {
									type: 'marker',
									markerId: marker._id,
							  }
							: {}
					}
					selectedProduct={product}
					selectedMarker={marker}
				/>

				<DialogCreateWriteOff
					dialogOpen={dialogCreateWriteOff}
					onCloseDialog={this.onCloseDialogCreateWriteOff}
					onExitedDialog={this.onProductAndMarkerDrop}
					currentStockId={currentStock._id}
					selectedProduct={product}
					selectedMarker={marker}
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
