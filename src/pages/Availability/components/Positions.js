import React, { Component } from 'react';
import { connect } from 'react-redux';
import loadable from '@loadable/component';

import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { getCharacteristics } from 'src/actions/characteristics';
import { getPositions } from 'src/actions/positions';
import { getPositionGroups } from 'src/actions/positionGroups';

import { TableCell } from './styles';
import Position from './Position';
import PositionGroup from './PositionGroup';

import styles from './Positions.module.css';

const DialogPositionGroupCreateEditAdd = loadable(() =>
	import('src/pages/Dialogs/PositionGroupCreateEditAdd' /* webpackChunkName: "Dialog_PositionGroupCreateEditAdd" */)
);

const DialogPositionGroupEdit = DialogPositionGroupCreateEditAdd;

const DialogPositionGroupAdd = DialogPositionGroupCreateEditAdd;

const DialogPositionEdit = loadable(() =>
	import('src/pages/Dialogs/PositionCreateEdit' /* webpackChunkName: "Dialog_PositionCreateEdit" */)
);

const DialogReceiptActiveAddQuantity = loadable(() =>
	import('src/pages/Dialogs/ReceiptActiveAddQuantity' /* webpackChunkName: "Dialog_ReceiptActiveAddQuantity" */)
);

const DialogPositionRemoveFromGroup = loadable(() =>
	import('src/pages/Dialogs/PositionRemoveFromGroup' /* webpackChunkName: "Dialog_PositionRemoveFromGroup" */)
);

const DialogPositionArchiveDelete = loadable(() =>
	import('src/pages/Dialogs/PositionArchiveDelete' /* webpackChunkName: "Dialog_PositionArchiveDelete" */)
);

const DialogPositionOrGroupQRCodeGeneration = loadable(() =>
	import('src/pages/Dialogs/PositionOrGroupQRCodeGeneration' /* webpackChunkName: "Dialog_PositionOrGroupQRCodeGeneration" */)
);

const DialogPositionGroupQRCodeGeneration = DialogPositionOrGroupQRCodeGeneration;

const DialogPositionQRCodeGeneration = DialogPositionOrGroupQRCodeGeneration;

const DialogWriteOffCreate = loadable(() => import('src/pages/Dialogs/WriteOffCreate' /* webpackChunkName: "Dialog_WriteOffCreate" */));

class Positions extends Component {
	state = {
		positionGroup: null,
		position: null,
		dialogOpenedName: '',
		dialogPositionGroupEdit: false,
		dialogPositionGroupAdd: false,
		dialogPositionGroupQRCodeGeneration: false,
		dialogPositionEdit: false,
		dialogPositionRemoveFromGroup: false,
		dialogPositionArchiveDelete: false,
		dialogPositionQRCodeGeneration: false,
		dialogReceiptActiveAddQuantity: false,
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
		this.props.getPositions();
		this.props.getPositionGroups();
	}

	render() {
		const {
			currentStudio,
			positions: {
				data: positions,
				isFetching: isLoadingPositions,
				// error: errorPositions
			},
			positionGroups: {
				data: positionGroups,
				isFetching: isLoadingPositionGroups,
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
			dialogPositionRemoveFromGroup,
			dialogPositionArchiveDelete,
			dialogPositionQRCodeGeneration,
			dialogReceiptActiveAddQuantity,
			dialogWriteOffCreate,
		} = this.state;

		return (
			<div className={styles.container}>
				{!isLoadingPositions && !isLoadingPositionGroups && positions && positionGroups ? (
					!positions.length && !positionGroups.length ? (
						<div className={styles.none}>Еще не создано ни одной позиции</div>
					) : positions.every(position => position.isArchived) ? (
						<div className={styles.none}>Все созданные позиции находятся в архиве</div>
					) : (
						<Paper>
							<Table style={{ tableLayout: 'fixed' }}>
								<TableHead className={styles.tableHeaderSticky}>
									<TableRow>
										<TableCell>Позиция</TableCell>
										<TableCell align="right" width={240}>
											Количество
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
									{positionGroups.map(positionGroup => (
										<PositionGroup
											key={positionGroup._id}
											positionGroup={positionGroup}
											onOpenDialogPositionGroup={this.onOpenDialogByName}
											onOpenDialogPosition={this.onOpenDialogByName}
										/>
									))}
									{positions.map(position => {
										if (position.positionGroup || position.isArchived) return null;

										return <Position key={position._id} position={position} onOpenDialogPosition={this.onOpenDialogByName} />;
									})}
								</TableBody>
							</Table>
						</Paper>
					)
				) : isLoadingPositions || isLoadingPositionGroups ? (
					<div children={<CircularProgress size={20} />} style={{ textAlign: 'center' }} />
				) : null}

				{/* Dialogs PositionGroups */}
				<DialogPositionGroupEdit
					type="edit"
					dialogOpen={dialogPositionGroupEdit}
					onCloseDialog={() => this.onCloseDialogByName('dialogPositionGroupEdit')}
					onExitedDialog={this.onPositionGroupDrop}
					selectedPositionGroup={dialogOpenedName === 'dialogPositionGroupEdit' ? positionGroup : null}
				/>

				<DialogPositionGroupAdd
					type="add"
					dialogOpen={dialogPositionGroupAdd}
					onCloseDialog={() => this.onCloseDialogByName('dialogPositionGroupAdd')}
					onExitedDialog={this.onPositionGroupDrop}
					selectedPositionGroup={dialogOpenedName === 'dialogPositionGroupAdd' ? positionGroup : null}
				/>

				<DialogPositionGroupQRCodeGeneration
					dialogOpen={dialogPositionGroupQRCodeGeneration}
					onCloseDialog={() => this.onCloseDialogByName('dialogPositionGroupQRCodeGeneration')}
					onExitedDialog={this.onPositionGroupDrop}
					type="positionGroup"
					selectedPositionOrGroup={dialogOpenedName === 'dialogPositionGroupQRCodeGeneration' ? positionGroup : null}
				/>

				{/* Dialogs Positions */}
				<DialogPositionEdit
					type="edit"
					dialogOpen={dialogPositionEdit}
					onCloseDialog={() => this.onCloseDialogByName('dialogPositionEdit')}
					onExitedDialog={this.onPositionDrop}
					currentStudioId={currentStudio._id}
					selectedPosition={dialogOpenedName === 'dialogPositionEdit' ? position : null}
				/>

				<DialogPositionRemoveFromGroup
					dialogOpen={dialogPositionRemoveFromGroup}
					onCloseDialog={() => this.onCloseDialogByName('dialogPositionRemoveFromGroup')}
					onExitedDialog={this.onPositionDrop}
					selectedPosition={dialogOpenedName === 'dialogPositionRemoveFromGroup' ? position : null}
				/>

				<DialogPositionArchiveDelete
					dialogOpen={dialogPositionArchiveDelete}
					onCloseDialog={() => this.onCloseDialogByName('dialogPositionArchiveDelete')}
					onExitedDialog={this.onPositionDrop}
					selectedPosition={dialogOpenedName === 'dialogPositionArchiveDelete' ? position : null}
				/>

				<DialogPositionQRCodeGeneration
					dialogOpen={dialogPositionQRCodeGeneration}
					onCloseDialog={() => this.onCloseDialogByName('dialogPositionQRCodeGeneration')}
					onExitedDialog={this.onPositionDrop}
					type="position"
					selectedPositionOrGroup={dialogOpenedName === 'dialogPositionQRCodeGeneration' ? position : null}
				/>

				<DialogReceiptActiveAddQuantity
					dialogOpen={dialogReceiptActiveAddQuantity}
					onCloseDialog={() => this.onCloseDialogByName('dialogReceiptActiveAddQuantity')}
					onExitedDialog={this.onPositionDrop}
					selectedPosition={dialogOpenedName === 'dialogReceiptActiveAddQuantity' ? position : null}
				/>

				<DialogWriteOffCreate
					dialogOpen={dialogWriteOffCreate}
					onCloseDialog={() => this.onCloseDialogByName('dialogWriteOffCreate')}
					onExitedDialog={this.onPositionDrop}
					selectedPosition={dialogOpenedName === 'dialogWriteOffCreate' ? position : null}
				/>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		positions: state.positions,
		positionGroups: state.positionGroups,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getCharacteristics: () => dispatch(getCharacteristics()),
		getPositions: () => dispatch(getPositions()),
		getPositionGroups: () => dispatch(getPositionGroups()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Positions);
