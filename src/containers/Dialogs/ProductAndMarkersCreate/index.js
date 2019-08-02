import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { cloneDeep } from 'lodash';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { PDDialog, PDDialogTitle } from 'src/components/Dialog';

import { getStockStatus } from 'src/actions/stocks';
import { createProductAndMarkers } from 'src/actions/products';

import { productSchema, markersSchema } from './components/FormScheme';
import ProductForm from './components/ProductForm';
import ProductMarkersForm from './components/ProductMarkersForm';

import { getManufacturers } from 'src/actions/manufacturers';
import { getSpecifications } from 'src/actions/specifications';

import './index.styl';

class DialogProductAndMarkersCreate extends Component {
	static propTypes = {
		dialogOpen: PropTypes.bool.isRequired,
		selectedData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
		onCloseDialog: PropTypes.func.isRequired,
		currentStock: PropTypes.object.isRequired,
	};

	initialState = {
		activeStep: 0,
		product: null,
		productMarkers: null,
	};

	constructor(props) {
		super(props);

		this.state = this.initialState;

		this.props.getManufacturers();
		this.props.getSpecifications();
	}

	onPrevStep = values => {
		this.setState({ activeStep: 0, productMarkers: cloneDeep(values) });
	};

	onNextStep = async (values, actions) => {
		this.setState({ product: cloneDeep(values) }, () => {
			actions.setSubmitting(false);

			this.setState({ activeStep: 1 });
		});
	};

	onProductAndMarkersCreate = async (values, actions) => {
		const {
			onCloseDialog,
			product = productSchema.cast(this.state.product),
			markers = markersSchema(this.state.product).cast(values).markers,
		} = this.props;

		this.props.createProductAndMarkers(product, markers).then(response => {
			if (response.status === 'success') {
				this.props.getStockStatus();
				onCloseDialog();
			} else actions.setSubmitting(false);
		});
	};

	onExitedDialog = () => {
		this.setState(this.initialState);
	};

	render() {
		const { dialogOpen, onCloseDialog, currentStock, manufacturers, specifications } = this.props;
		const { activeStep, product, productMarkers } = this.state;

		return (
			<PDDialog
				open={dialogOpen}
				onClose={onCloseDialog}
				onExited={this.onExitedDialog}
				maxWidth="lg"
				scroll="body"
				fullWidth
				stickyActions
			>
				<PDDialogTitle
					theme="primary"
					// titlePositionCenter={activeStep === 1}
					// leftHandleProps={activeStep === 1 ? {
					//   handleProps: {
					//     onClick: this.onPrevStep
					//   },
					//   text: 'Назад',
					//   icon: <FontAwesomeIcon icon={['far', 'angle-left']} />,
					//   iconPositionLeft: true
					// } : null}
					onClose={onCloseDialog}
					children={['Создание новой позиции', 'Добавление маркера'][activeStep]}
				/>
				{activeStep === 0 ? (
					<ProductForm
						onCloseDialog={onCloseDialog}
						currentStock={currentStock}
						initialValuesFrom={product}
						onSubmit={this.onNextStep}
					/>
				) : activeStep === 1 ? (
					<ProductMarkersForm
						currentStock={currentStock}
						product={product}
						manufacturers={manufacturers}
						specifications={specifications}
						initialValuesFrom={productMarkers}
						onPrevStep={this.onPrevStep}
						onSubmit={this.onProductAndMarkersCreate}
					/>
				) : null}
			</PDDialog>
		);
	}
}

const mapStateToProps = state => {
	return {
		manufacturers: state.manufacturers.data,
		specifications: state.specifications.data,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentStock } = ownProps;

	return {
		getStockStatus: () => dispatch(getStockStatus(currentStock._id)),
		getManufacturers: () => dispatch(getManufacturers(currentStock._id)),
		getSpecifications: () => dispatch(getSpecifications(currentStock._id)),
		createProductAndMarkers: (product, markers) => dispatch(createProductAndMarkers(currentStock._id, product, markers)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(DialogProductAndMarkersCreate);
