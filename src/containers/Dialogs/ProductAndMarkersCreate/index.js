import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { cloneDeep } from 'lodash';

import { PDDialog } from 'src/components/Dialog';

import { getStockStatus } from 'src/actions/stocks';
import { createProductAndMarkers } from 'src/actions/products';

import { productSchema, markersSchema } from './components/FormScheme';
import ProductForm from './components/ProductForm';
import MarkersForm from './components/MarkersForm';

import './index.styl';

const initialState = {
	activeStep: 0,
	saveProduct: null,
	saveMarkers: null,
};

class DialogProductAndMarkersCreate extends Component {
	static propTypes = {
		dialogOpen: PropTypes.bool.isRequired,
		selectedData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
		onCloseDialog: PropTypes.func.isRequired,
		currentStock: PropTypes.object.isRequired,
	};

	constructor(props) {
		super(props);

		this.state = initialState;
	}

	onPrevStep = values => {
		this.setState({ activeStep: 0, saveMarkers: cloneDeep(values) });
	};

	onNextStep = async (values, actions) => {
		this.setState({ saveProduct: cloneDeep(values) }, () => {
			actions.setSubmitting(false);

			this.setState({ activeStep: 1 });
		});
	};

	onProductAndMarkersCreate = async (values, actions) => {
		const {
			onCloseDialog,
			product = productSchema.cast(this.state.saveProduct),
			markers = markersSchema(this.state.saveProduct, true).cast(values).markers,
		} = this.props;

		this.props.createProductAndMarkers(product, markers).then(response => {
			if (response.status === 'success') {
				this.props.getStockStatus();
				onCloseDialog();
			} else actions.setSubmitting(false);
		});
	};

	onExitedDialog = () => {
		this.setState(initialState);
	};

	render() {
		const { dialogOpen, onCloseDialog, currentStock } = this.props;
		const { activeStep, saveProduct, saveMarkers } = this.state;

		return (
			<PDDialog
				open={dialogOpen}
				onClose={onCloseDialog}
				onExited={this.onExitedDialog}
				maxWidth="lg"
				scroll="body"
				stickyTitle
				stickyActions
			>
				{activeStep === 0 ? (
					<ProductForm onCloseDialog={onCloseDialog} onSubmit={this.onNextStep} saveProduct={saveProduct} />
				) : activeStep === 1 ? (
					<MarkersForm
						onCloseDialog={onCloseDialog}
						onPrevStep={this.onPrevStep}
						currentStock={currentStock}
						saveProduct={saveProduct}
						saveMarkers={saveMarkers}
						onSubmit={this.onProductAndMarkersCreate}
					/>
				) : null}
			</PDDialog>
		);
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentStock } = ownProps;

	return {
		getStockStatus: () => dispatch(getStockStatus(currentStock._id)),
		createProductAndMarkers: (product, markers) => dispatch(createProductAndMarkers(currentStock._id, product, markers)),
	};
};

export default connect(
	null,
	mapDispatchToProps
)(DialogProductAndMarkersCreate);
