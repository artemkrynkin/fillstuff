import React, { Component } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@material-ui/core/Button';

import DialogCreateProduct from 'src/containers/Dialogs/CreateEditProduct';
import PrintQRCodesProduct from 'src/containers/Dialogs/PrintQRCodesProduct';

import TitlePageOrLogo from './TitlePageOrLogo';

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
		const { pageTitle, theme, currentStock, pageParams } = this.props;
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
						<FontAwesomeIcon icon={['far', 'plus']} />
						&nbsp;&nbsp;Позиция
					</Button>
					<Button className="mui-btn-ct400" variant="contained" color="primary" onClick={this.onOpenDialogPrintQRCodesProduct}>
						<FontAwesomeIcon icon={['fal', 'qrcode']} />
						&nbsp;&nbsp;Печать QR-кодов
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
