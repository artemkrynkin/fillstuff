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
import { getPositionsInGroups } from 'src/actions/positions';

import { TableCell } from './styles';
import Position from './Position';
import PositionGroup from './PositionGroup';

import styles from './Positions.module.css';

const DialogPositionGroupCreateEditAdd = Loadable({
	loader: () => import('src/containers/Dialogs/PositionGroupCreateEditAdd' /* webpackChunkName: "Dialog_PositionGroupCreateEditAdd" */),
	loading: () => null,
	delay: 200,
});

const DialogPositionGroupEdit = DialogPositionGroupCreateEditAdd;

const DialogPositionGroupAdd = DialogPositionGroupCreateEditAdd;

const DialogPositionEdit = Loadable({
	loader: () => import('src/containers/Dialogs/PositionCreateEdit' /* webpackChunkName: "Dialog_PositionCreateEdit" */),
	loading: () => null,
	delay: 200,
});

const DialogPositionAddQuantity = Loadable({
	loader: () => import('src/containers/Dialogs/PositionAddQuantity' /* webpackChunkName: "Dialog_PositionAddQuantity" */),
	loading: () => null,
	delay: 200,
});

const DialogPositionRemoveFromGroup = Loadable({
	loader: () => import('src/containers/Dialogs/PositionRemoveFromGroup' /* webpackChunkName: "Dialog_PositionRemoveFromGroup" */),
	loading: () => null,
	delay: 200,
});

const DialogPositionArchive = Loadable({
	loader: () => import('src/containers/Dialogs/PositionArchive' /* webpackChunkName: "Dialog_PositionArchive" */),
	loading: () => null,
	delay: 200,
});

const DialogPositionOrGroupQRCodeGeneration = Loadable({
	loader: () =>
		import('src/containers/Dialogs/PositionOrGroupQRCodeGeneration' /* webpackChunkName: "Dialog_PositionOrGroupQRCodeGeneration" */),
	loading: () => null,
	delay: 200,
});

const DialogPositionGroupQRCodeGeneration = DialogPositionOrGroupQRCodeGeneration;

const DialogPositionQRCodeGeneration = DialogPositionOrGroupQRCodeGeneration;

const DialogWriteOffCreate = Loadable({
	loader: () => import('src/containers/Dialogs/WriteOffCreate' /* webpackChunkName: "Dialog_WriteOffCreate" */),
	loading: () => null,
	delay: 200,
});

class Positions extends Component {
	state = {
		positionGroup: null,
		position: null,
		dialogOpenedName: '',
		dialogPositionGroupEdit: false,
		dialogPositionGroupAdd: false,
		dialogPositionGroupQRCodeGeneration: false,
		dialogPositionEdit: false,
		dialogPositionAddQuantity: false,
		dialogPositionRemoveFromGroup: false,
		dialogPositionArchive: false,
		dialogPositionQRCodeGeneration: false,
		dialogWriteOffCreate: false,
	};

	onPositionGroupDrop = () => this.setState({ positionGroup: null, dialogOpenedName: '' });
	onPositionDrop = () => this.setState({ position: null, dialogOpenedName: '' });

	onOpenDialogByName = (dialogName, positionOrGroup) =>
		this.setState({
			[positionOrGroup.positions ? 'positionGroup' : 'position']: positionOrGroup,
			dialogOpenedName: dialogName,
			[dialogName]: true,
		});

	onCloseDialogByName = dialogName => this.setState({ [dialogName]: false });

	componentDidMount() {
		this.props.getPositionsInGroups();
		this.props.getCharacteristics();
	}

	render() {
		const {
			currentStock,
			positionsInGroups: {
				data: positionsInGroups,
				isFetching: isLoadingPositionsInGroups,
				// error: errorPositions
			},
		} = this.props;
		const {
			positionGroup,
			position,
			dialogOpenedName,
			dialogPositionGroupEdit,
			dialogPositionGroupAdd,
			dialogPositionGroupQRCodeGeneration,
			dialogPositionEdit,
			dialogPositionAddQuantity,
			dialogPositionRemoveFromGroup,
			dialogPositionArchive,
			dialogPositionQRCodeGeneration,
			dialogWriteOffCreate,
		} = this.state;

		return (
			<Paper>
				<Table>
					<TableHead className={styles.tableHeaderSticky}>
						<TableRow>
							<TableCell>Наименование</TableCell>
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
					<TableBody className={styles.tableBody}>
						{!isLoadingPositionsInGroups ? (
							positionsInGroups && positionsInGroups.length ? (
								positionsInGroups.map(positionOrGroup =>
									!positionOrGroup.positions ? (
										<Position
											key={positionOrGroup._id}
											currentStockId={currentStock._id}
											position={positionOrGroup}
											onOpenDialogPosition={this.onOpenDialogByName}
										/>
									) : (
										<PositionGroup
											key={positionOrGroup._id}
											currentStockId={currentStock._id}
											positionGroup={positionOrGroup}
											onOpenDialogPositionGroup={this.onOpenDialogByName}
											onOpenDialogPosition={this.onOpenDialogByName}
										/>
									)
								)
							) : (
								<TableRow>
									<TableCell colSpan={6} style={{ borderBottom: 'none' }}>
										<Typography variant="caption" align="center" component="div">
											Еще не создано ни одной позиции.
										</Typography>
									</TableCell>
								</TableRow>
							)
						) : (
							<TableRow>
								<TableCell colSpan={6} style={{ borderBottom: 'none', padding: 11 }}>
									<div children={<CircularProgress size={20} />} style={{ textAlign: 'center' }} />
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>

				{/* Dialogs PositionGroups */}
				<DialogPositionGroupEdit
					type="edit"
					dialogOpen={dialogPositionGroupEdit}
					onCloseDialog={() => this.onCloseDialogByName('dialogPositionGroupEdit')}
					onExitedDialog={this.onPositionGroupDrop}
					currentStockId={currentStock._id}
					selectedPositionGroup={dialogOpenedName === 'dialogPositionGroupEdit' ? positionGroup : null}
				/>

				<DialogPositionGroupAdd
					type="add"
					dialogOpen={dialogPositionGroupAdd}
					onCloseDialog={() => this.onCloseDialogByName('dialogPositionGroupAdd')}
					onExitedDialog={this.onPositionGroupDrop}
					currentStockId={currentStock._id}
					selectedPositionGroup={dialogOpenedName === 'dialogPositionGroupAdd' ? positionGroup : null}
				/>

				<DialogPositionGroupQRCodeGeneration
					dialogOpen={dialogPositionGroupQRCodeGeneration}
					onCloseDialog={() => this.onCloseDialogByName('dialogPositionGroupQRCodeGeneration')}
					onExitedDialog={this.onPositionGroupDrop}
					currentStockId={currentStock._id}
					type="positionGroup"
					selectedPositionOrGroup={dialogOpenedName === 'dialogPositionGroupQRCodeGeneration' ? positionGroup : null}
				/>

				{/* Dialogs Positions */}
				<DialogPositionEdit
					type="edit"
					dialogOpen={dialogPositionEdit}
					onCloseDialog={() => this.onCloseDialogByName('dialogPositionEdit')}
					onExitedDialog={this.onPositionDrop}
					currentStockId={currentStock._id}
					selectedPosition={dialogOpenedName === 'dialogPositionEdit' ? position : null}
				/>

				<DialogPositionRemoveFromGroup
					dialogOpen={dialogPositionRemoveFromGroup}
					onCloseDialog={() => this.onCloseDialogByName('dialogPositionRemoveFromGroup')}
					onExitedDialog={this.onPositionDrop}
					currentStockId={currentStock._id}
					selectedPosition={dialogOpenedName === 'dialogPositionRemoveFromGroup' ? position : null}
				/>

				<DialogPositionArchive
					dialogOpen={dialogPositionArchive}
					onCloseDialog={() => this.onCloseDialogByName('dialogPositionArchive')}
					onExitedDialog={this.onPositionDrop}
					currentStockId={currentStock._id}
					selectedPosition={dialogOpenedName === 'dialogPositionArchive' ? position : null}
				/>

				<DialogPositionQRCodeGeneration
					dialogOpen={dialogPositionQRCodeGeneration}
					onCloseDialog={() => this.onCloseDialogByName('dialogPositionQRCodeGeneration')}
					onExitedDialog={this.onPositionDrop}
					currentStockId={currentStock._id}
					type="position"
					selectedPositionOrGroup={dialogOpenedName === 'dialogPositionQRCodeGeneration' ? position : null}
				/>

				<DialogPositionAddQuantity
					dialogOpen={dialogPositionAddQuantity}
					onCloseDialog={() => this.onCloseDialogByName('dialogPositionAddQuantity')}
					onExitedDialog={this.onPositionDrop}
					currentStockId={currentStock._id}
					selectedPosition={dialogOpenedName === 'dialogPositionAddQuantity' ? position : null}
				/>

				<DialogWriteOffCreate
					dialogOpen={dialogWriteOffCreate}
					onCloseDialog={() => this.onCloseDialogByName('dialogWriteOffCreate')}
					onExitedDialog={this.onPositionDrop}
					currentStockId={currentStock._id}
					selectedPosition={dialogOpenedName === 'dialogWriteOffCreate' ? position : null}
				/>
			</Paper>
		);
	}
}

const mapStateToProps = state => {
	return {
		positionsInGroups: state.positions,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentStock } = ownProps;

	return {
		getCharacteristics: () => dispatch(getCharacteristics(currentStock._id)),
		getPositionsInGroups: () => dispatch(getPositionsInGroups(currentStock._id)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Positions);
