import React, { Component } from 'react';
import { connect } from 'react-redux';

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

class Products extends Component {
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
								products.map(product => <ProductRow key={product._id} currentStockId={currentStock._id} product={product} />)
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
