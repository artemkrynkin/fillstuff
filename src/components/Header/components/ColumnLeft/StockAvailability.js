import React, { Component } from 'react';
import { connect } from 'react-redux';
import loadable from '@loadable/component';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@material-ui/core/Button';

import TitlePageOrLogo from './TitlePageOrLogo';

import { getCharacteristics } from 'src/actions/characteristics';

import styles from 'src/components/Header/index.module.css';

const DialogPositionReceiptCreate = loadable(() =>
	import('src/containers/Dialogs/PositionReceiptCreateEdit' /* webpackChunkName: "Dialog_PositionReceiptCreateEdit" */)
);

const DialogPositionGroupCreate = loadable(() =>
	import('src/containers/Dialogs/PositionGroupCreateEditAdd' /* webpackChunkName: "Dialog_PositionGroupCreateEditAdd" */)
);

class StockAvailability extends Component {
	state = {
		dialogPositionReceiptCreate: false,
		dialogPositionGroupCreate: false,
	};

	onOpenDialogPositionReceiptCreate = async () => {
		await this.props.getCharacteristics();

		this.setState({ dialogPositionReceiptCreate: true });
	};

	onCloseDialogPositionReceiptCreate = () => this.setState({ dialogPositionReceiptCreate: false });

	onOpenDialogPositionGroupCreate = async () => this.setState({ dialogPositionGroupCreate: true });

	onCloseDialogPositionGroupCreate = () => this.setState({ dialogPositionGroupCreate: false });

	render() {
		const { pageTitle, theme, currentStock } = this.props;
		const { dialogPositionReceiptCreate, dialogPositionGroupCreate } = this.state;

		return (
			<div className={styles.column_left}>
				<TitlePageOrLogo pageTitle={pageTitle} theme={theme} />
				<div className={styles.columnGroup_left}>
					<Button
						className={styles.buttonColorTeal400}
						variant="contained"
						color="primary"
						style={{ marginRight: 8 }}
						onClick={this.onOpenDialogPositionReceiptCreate}
					>
						<FontAwesomeIcon icon={['far', 'plus']} style={{ marginRight: 10 }} />
						Создать позицию
					</Button>
					<Button
						className={styles.buttonColorTeal400}
						variant="contained"
						color="primary"
						style={{ marginRight: 8 }}
						onClick={this.onOpenDialogPositionGroupCreate}
					>
						<FontAwesomeIcon icon={['far', 'plus']} style={{ marginRight: 10 }} />
						Создать группу
					</Button>
				</div>

				<DialogPositionReceiptCreate
					type="create"
					dialogOpen={dialogPositionReceiptCreate}
					onCloseDialog={this.onCloseDialogPositionReceiptCreate}
					currentStockId={currentStock._id}
				/>

				<DialogPositionGroupCreate
					type="create"
					dialogOpen={dialogPositionGroupCreate}
					onCloseDialog={this.onCloseDialogPositionGroupCreate}
					currentStockId={currentStock._id}
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
)(StockAvailability);
