import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@material-ui/core/Button';

import TitlePageOrLogo from './TitlePageOrLogo';

import { getCharacteristics } from 'src/actions/characteristics';

const DialogProductAndMarkersCreate = Loadable({
	loader: () => import('src/containers/Dialogs/ProductAndMarkersCreate' /* webpackChunkName: "Dialog_ProductAndMarkersCreate" */),
	loading: () => null,
	delay: 200,
});

const DialogPrintQRCodesProduct = Loadable({
	loader: () => import('src/containers/Dialogs/ProductOrMarkerQRCodePrint' /* webpackChunkName: "Dialog_PrintQRCodesProduct" */),
	loading: () => null,
	delay: 200,
});

class CLStockAvailability extends Component {
	state = {
		dialogProductAndMarkersCreate: false,
		dialogPrintQRCodesProduct: false,
	};

	onOpenDialogProductAndMarkersCreate = async () => {
		await this.props.getCharacteristics();

		this.setState({ dialogProductAndMarkersCreate: true });
	};

	onCloseDialogProductAndMarkersCreate = () => this.setState({ dialogProductAndMarkersCreate: false });

	onOpenDialogPrintQRCodesProduct = () => this.setState({ dialogPrintQRCodesProduct: true });

	onCloseDialogPrintQRCodesProduct = () => this.setState({ dialogPrintQRCodesProduct: false });

	render() {
		const { pageTitle, theme, currentStock } = this.props;
		const { dialogProductAndMarkersCreate, dialogPrintQRCodesProduct } = this.state;

		return (
			<div className="header__column_left">
				<TitlePageOrLogo pageTitle={pageTitle} theme={theme} />
				<div className="header__column-group_left">
					<Button
						className="mui-btn-ct400"
						variant="contained"
						color="primary"
						style={{ marginRight: 8 }}
						onClick={this.onOpenDialogProductAndMarkersCreate}
					>
						<FontAwesomeIcon icon={['far', 'plus']} style={{ marginRight: 10 }} />
						Создать позицию
					</Button>
					{/*<Button className="mui-btn-ct400" variant="contained" color="primary" onClick={this.onOpenDialogPrintQRCodesProduct}>*/}
					{/*	<FontAwesomeIcon icon={['fal', 'qrcode']} style={{ marginRight: 10 }} />*/}
					{/*	Печать QR-кодов*/}
					{/*</Button>*/}
				</div>

				<DialogProductAndMarkersCreate
					dialogOpen={dialogProductAndMarkersCreate}
					onCloseDialog={this.onCloseDialogProductAndMarkersCreate}
					currentStock={currentStock}
				/>

				<DialogPrintQRCodesProduct
					dialogOpen={dialogPrintQRCodesProduct}
					onCloseDialog={this.onCloseDialogPrintQRCodesProduct}
					currentStock={currentStock}
				/>
			</div>
		);
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentStock } = ownProps;

	return {
		getCharacteristics: () => dispatch(getCharacteristics(currentStock._id)),
	};
};

export default connect(
	null,
	mapDispatchToProps
)(CLStockAvailability);
