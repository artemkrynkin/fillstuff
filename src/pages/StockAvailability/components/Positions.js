import React, { Component } from 'react';
import { connect } from 'react-redux';
import loadable from '@loadable/component';

import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { getCharacteristics } from 'src/actions/characteristics';
import { getPositionsInGroups } from 'src/actions/positionsInGroups';
import { getPositions } from 'src/actions/positions';

import { TableCell } from './styles';
import Position from './Position';
import PositionGroup from './PositionGroup';

import styles from './Positions.module.css';

const DialogPositionGroupCreateEditAdd = loadable(() =>
	import('src/pages/Dialogs/PositionGroupCreateEditAdd' /* webpackChunkName: "Dialog_PositionGroupCreateEditAdd" */)
);

const DialogPositionGroupEdit = DialogPositionGroupCreateEditAdd;

const DialogPositionGroupAdd = DialogPositionGroupCreateEditAdd;

const DialogPositionReceiptEdit = loadable(() =>
	import('src/pages/Dialogs/PositionReceiptCreateEdit' /* webpackChunkName: "Dialog_PositionReceiptCreateEdit" */)
);

const DialogPositionEdit = loadable(() =>
	import('src/pages/Dialogs/PositionCreateEdit' /* webpackChunkName: "Dialog_PositionCreateEdit" */)
);

const DialogPositionAddQuantity = loadable(() =>
	import('src/pages/Dialogs/PositionAddQuantity' /* webpackChunkName: "Dialog_PositionAddQuantity" */)
);

const DialogPositionRemoveFromGroup = loadable(() =>
	import('src/pages/Dialogs/PositionRemoveFromGroup' /* webpackChunkName: "Dialog_PositionRemoveFromGroup" */)
);

const DialogPositionArchive = loadable(() => import('src/pages/Dialogs/PositionArchive' /* webpackChunkName: "Dialog_PositionArchive" */));

const DialogPositionOrGroupQRCodeGeneration = loadable(() =>
	import('src/pages/Dialogs/PositionOrGroupQRCodeGeneration' /* webpackChunkName: "Dialog_PositionOrGroupQRCodeGeneration" */)
);

const DialogPositionGroupQRCodeGeneration = DialogPositionOrGroupQRCodeGeneration;

const DialogPositionQRCodeGeneration = DialogPositionOrGroupQRCodeGeneration;

const DialogWriteOffCreate = loadable(() => import('src/pages/Dialogs/WriteOffCreate' /* webpackChunkName: "Dialog_WriteOffCreate" */));

const compareByName = (a, b) => {
	if (a.name > b.name) return 1;
	else if (a.name < b.name) return -1;
	else return 0;
};

class Positions extends Component {
	state = {
		positionGroup: null,
		position: null,
		dialogOpenedName: '',
		dialogPositionGroupEdit: false,
		dialogPositionGroupAdd: false,
		dialogPositionGroupQRCodeGeneration: false,
		dialogPositionReceiptEdit: false,
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
		this.props.getCharacteristics();
		this.props.getPositionsInGroups();
		this.props.getPositions();
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
			dialogPositionReceiptEdit,
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
								Цена покупки
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
				<DialogPositionReceiptEdit
					type="edit"
					dialogOpen={dialogPositionReceiptEdit}
					onCloseDialog={() => this.onCloseDialogByName('dialogPositionReceiptEdit')}
					onExitedDialog={this.onPositionDrop}
					currentStockId={currentStock._id}
					selectedPosition={dialogOpenedName === 'dialogPositionReceiptEdit' ? position : null}
				/>

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
	const {
		positionsInGroups: {
			data: positionsInGroups,
			isFetching: isLoadingPositionsInGroups,
			// error: errorPositions
		},
	} = state;

	let positionsInGroupsSort = {
		data: null,
		isFetching: isLoadingPositionsInGroups,
	};

	if (!isLoadingPositionsInGroups && positionsInGroups) {
		positionsInGroupsSort.data = positionsInGroups.sort(compareByName);
	}

	return {
		positionsInGroups: positionsInGroupsSort,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentStock } = ownProps;

	return {
		getCharacteristics: () => dispatch(getCharacteristics(currentStock._id)),
		getPositionsInGroups: () => dispatch(getPositionsInGroups(currentStock._id)),
		getPositions: () => dispatch(getPositions(currentStock._id)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Positions);
