import React, { Component } from 'react';
import Loadable from 'react-loadable';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@material-ui/core/Button';

import { DisplayLoadingComponent } from 'src/components/Loading';

import TitlePageOrLogo from './TitlePageOrLogo';

const DialogCreateProduct = Loadable({
	loader: () => import('src/containers/Dialogs/CreateEditProduct' /* webpackChunkName: "Dialog_CreateEditProduct" */),
	loading: DisplayLoadingComponent,
	delay: 200,
});

const PrintQRCodesProduct = Loadable({
	loader: () => import('src/containers/Dialogs/PrintQRCodesProduct' /* webpackChunkName: "Dialog_PrintQRCodesProduct" */),
	loading: DisplayLoadingComponent,
	delay: 200,
});

class CLStockAvailability extends Component {
	state = {
		dialogCreateProduct: false,
		dialogPrintQRCodesProduct: false,
	};

	onOpenDialogCreateProduct = () =>
		this.setState({
			dialogCreateProduct: true,
		});

	onCloseDialogCreateProduct = () =>
		this.setState({
			dialogCreateProduct: false,
		});

	onOpenDialogPrintQRCodesProduct = () =>
		this.setState({
			dialogPrintQRCodesProduct: true,
		});

	onCloseDialogPrintQRCodesProduct = () =>
		this.setState({
			dialogPrintQRCodesProduct: false,
		});

	render() {
		const { pageTitle, theme, currentStock } = this.props;
		const { dialogCreateProduct, dialogPrintQRCodesProduct } = this.state;

		return (
			<div className="header__column_left">
				<TitlePageOrLogo pageTitle={pageTitle} theme={theme} />
				<div className="header__column-group_left">
					<Button
						className="mui-btn-ct400"
						variant="contained"
						color="primary"
						style={{ marginRight: 8 }}
						onClick={this.onOpenDialogCreateProduct}
					>
						<FontAwesomeIcon icon={['far', 'plus']} style={{ marginRight: 10 }} />
						Позиция
					</Button>
					<Button className="mui-btn-ct400" variant="contained" color="primary" onClick={this.onOpenDialogPrintQRCodesProduct}>
						<FontAwesomeIcon icon={['fal', 'qrcode']} style={{ marginRight: 10 }} />
						Печать QR-кодов
					</Button>
				</div>

				<DialogCreateProduct
					actionType="create"
					dialogOpen={dialogCreateProduct}
					onCloseDialog={this.onCloseDialogCreateProduct}
					currentStock={currentStock}
				/>

				<PrintQRCodesProduct
					dialogOpen={dialogPrintQRCodesProduct}
					onCloseDialog={this.onCloseDialogPrintQRCodesProduct}
					currentStock={currentStock}
				/>
			</div>
		);
	}
}

export default CLStockAvailability;
