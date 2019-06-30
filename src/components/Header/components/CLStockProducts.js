import React, { Component } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@material-ui/core/Button';

import DialogCreateProduct from 'src/containers/Dialogs/CreateEditProduct';

import TitlePageOrLogo from './TitlePageOrLogo';

class CLProjectPublications extends Component {
	state = {
		dialogCreateProduct: false,
	};

	onOpenDialogCreateProduct = () =>
		this.setState({
			dialogCreateProduct: true,
		});

	onCloseDialogCreateProduct = () =>
		this.setState({
			dialogCreateProduct: false,
		});

	render() {
		const {
			pageTitle,
			theme,
			// currentUser,
			currentStock,
		} = this.props;
		const { dialogCreateProduct } = this.state;

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
						&nbsp;&nbsp;Товар
					</Button>
					<Button className="mui-btn-ct400" variant="contained" color="primary">
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
			</div>
		);
	}
}

export default CLProjectPublications;
