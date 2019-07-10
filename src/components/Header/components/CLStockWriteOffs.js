import React, { Component } from 'react';
import { connect } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@material-ui/core/Button';

import CreateWriteOff from 'src/containers/Dialogs/CreateWriteOff';

import TitlePageOrLogo from './TitlePageOrLogo';

import { getProducts } from 'src/actions/products';

class CLStockWriteOffs extends Component {
	state = {
		dialogCreateWriteOff: false,
	};

	onOpenDialogCreateWriteOff = () => {
		this.props.getProducts();

		this.setState({
			dialogCreateWriteOff: true,
		});
	};

	onCloseDialogCreateWriteOff = () =>
		this.setState({
			dialogCreateWriteOff: false,
		});

	render() {
		const { pageTitle, theme, currentStock, pageParams } = this.props;
		const { dialogCreateWriteOff } = this.state;

		return (
			<div className="header__column_left">
				<TitlePageOrLogo pageTitle={pageTitle} theme={theme} />
				<div className="header__column-group_left">
					<Button
						className="mui-btn-ct400"
						variant="contained"
						color="primary"
						style={{ marginRight: 8 }}
						onClick={this.onOpenDialogCreateWriteOff}
					>
						<FontAwesomeIcon icon={['far', 'plus']} />
						&nbsp;&nbsp;Расход позиции
					</Button>
				</div>

				<CreateWriteOff
					dialogOpen={dialogCreateWriteOff}
					onCloseDialog={this.onCloseDialogCreateWriteOff}
					currentStock={currentStock}
					selectedUserId={pageParams.selectedUserId}
				/>
			</div>
		);
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentStock } = ownProps;

	return {
		getProducts: () => dispatch(getProducts(currentStock._id)),
	};
};

export default connect(
	null,
	mapDispatchToProps
)(CLStockWriteOffs);
