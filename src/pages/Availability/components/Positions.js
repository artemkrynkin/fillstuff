import React, { Component } from 'react';
import { connect } from 'react-redux';
import loadable from '@loadable/component';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { LoadingComponent } from 'src/components/Loading';
import Empty from 'src/components/Empty';

import { getPositions } from 'src/actions/positions';
import { getPositionGroups } from 'src/actions/positionGroups';

import { TableCell } from './styles';
import Position from './Position';
import PositionGroup from './PositionGroup';

import styles from './Positions.module.css';

import emptyImage from 'public/img/stubs/procurements.svg';

const DialogPositionGroupCreateEditAdd = loadable(() =>
	import('src/pages/Dialogs/PositionGroupCreateEditAdd' /* webpackChunkName: "Dialog_PositionGroupCreateEditAdd" */)
);

const DialogPositionGroupEdit = DialogPositionGroupCreateEditAdd;

const DialogPositionGroupAdd = DialogPositionGroupCreateEditAdd;

const DialogPositionEdit = loadable(() =>
	import('src/pages/Dialogs/PositionCreateEdit' /* webpackChunkName: "Dialog_PositionCreateEdit" */)
);

const DialogPositionRemoveFromGroup = loadable(() =>
	import('src/pages/Dialogs/PositionRemoveFromGroup' /* webpackChunkName: "Dialog_PositionRemoveFromGroup" */)
);

const DialogPositionArchiveDelete = loadable(() =>
	import('src/pages/Dialogs/PositionArchiveDelete' /* webpackChunkName: "Dialog_PositionArchiveDelete" */)
);

const DialogPositionOrGroupQRCode = loadable(() =>
	import('src/pages/Dialogs/PositionOrGroupQRCode' /* webpackChunkName: "Dialog_PositionOrGroupQRCode" */)
);

const DialogPositionGroupQRCode = DialogPositionOrGroupQRCode;

const DialogPositionQRCode = DialogPositionOrGroupQRCode;

const DialogReceiptActiveAddQuantity = loadable(() =>
	import('src/pages/Dialogs/ReceiptActiveAddQuantity' /* webpackChunkName: "Dialog_ReceiptActiveAddQuantity" */)
);

const DialogReceiptCreate = loadable(() => import('src/pages/Dialogs/ReceiptCreate' /* webpackChunkName: "Dialog_ReceiptCreate" */));

const DialogWriteOffCreate = loadable(() => import('src/pages/Dialogs/WriteOffCreate' /* webpackChunkName: "Dialog_WriteOffCreate" */));

class Positions extends Component {
	state = {
		positionGroup: null,
		position: null,
		dialogOpenedName: '',
		dialogPositionGroupEdit: false,
		dialogPositionGroupAdd: false,
		dialogPositionGroupQRCode: false,
		dialogPositionEdit: false,
		dialogPositionRemoveFromGroup: false,
		dialogPositionArchiveDelete: false,
		dialogPositionQRCode: false,
		dialogReceiptActiveAddQuantity: false,
		dialogReceiptCreate: false,
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
		this.props.getPositions();
		this.props.getPositionGroups();
	}

	render() {
		const {
			positions: {
				data: positions,
				// isFetching: isLoadingPositions,
				// error: errorPositions
			},
			positionGroups: {
				data: positionGroups,
				// isFetching: isLoadingPositionGroups,
				// error: errorPositions
			},
		} = this.props;
		const {
			positionGroup,
			position,
			dialogOpenedName,
			dialogPositionGroupEdit,
			dialogPositionGroupAdd,
			dialogPositionGroupQRCode,
			dialogPositionEdit,
			dialogPositionRemoveFromGroup,
			dialogPositionArchiveDelete,
			dialogPositionQRCode,
			dialogReceiptActiveAddQuantity,
			dialogReceiptCreate,
			dialogWriteOffCreate,
		} = this.state;

		if (!positions || !positionGroups) return <LoadingComponent className={styles.container} />;

		if (positions && !positions.length && !positionGroups.length) {
			return (
				<Empty
					className={styles.empty}
					imageSrc={emptyImage}
					content={
						<Typography variant="h6" gutterBottom>
							Похоже, у вас еще нет позиций
						</Typography>
					}
					actions={
						<Button variant="contained" color="primary">
							Создать позицию
						</Button>
					}
				/>
			);
		}

		if (positions && positions.every(position => position.isArchived)) {
			return (
				<Empty
					className={styles.empty}
					imageSrc={emptyImage}
					content={
						<Typography variant="h6" gutterBottom>
							Похоже, все ваши позиции находятся в архиве
						</Typography>
					}
					actions={
						<Button variant="contained" color="primary">
							Создать новую позицию
						</Button>
					}
				/>
			);
		}

		return (
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

				<DialogPositionGroupQRCode
					dialogOpen={dialogPositionGroupQRCode}
					onCloseDialog={() => this.onCloseDialogByName('dialogPositionGroupQRCode')}
					onExitedDialog={this.onPositionGroupDrop}
					type="positionGroup"
					selectedPositionOrGroup={dialogOpenedName === 'dialogPositionGroupQRCode' ? positionGroup : null}
				/>

				{/* Dialogs Positions */}
				<DialogPositionEdit
					type="edit"
					dialogOpen={dialogPositionEdit}
					onCloseDialog={() => this.onCloseDialogByName('dialogPositionEdit')}
					onExitedDialog={this.onPositionDrop}
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

				<DialogPositionQRCode
					dialogOpen={dialogPositionQRCode}
					onCloseDialog={() => this.onCloseDialogByName('dialogPositionQRCode')}
					onExitedDialog={this.onPositionDrop}
					type="position"
					selectedPositionOrGroup={dialogOpenedName === 'dialogPositionQRCode' ? position : null}
				/>

				<DialogReceiptActiveAddQuantity
					dialogOpen={dialogReceiptActiveAddQuantity}
					onCloseDialog={() => this.onCloseDialogByName('dialogReceiptActiveAddQuantity')}
					onExitedDialog={this.onPositionDrop}
					selectedPosition={dialogOpenedName === 'dialogReceiptActiveAddQuantity' ? position : null}
				/>

				<DialogReceiptCreate
					dialogOpen={dialogReceiptCreate}
					onCloseDialog={() => this.onCloseDialogByName('dialogReceiptCreate')}
					onExitedDialog={this.onPositionDrop}
					selectedPosition={dialogOpenedName === 'dialogReceiptCreate' ? position : null}
				/>

				<DialogWriteOffCreate
					dialogOpen={dialogWriteOffCreate}
					onCloseDialog={() => this.onCloseDialogByName('dialogWriteOffCreate')}
					onExitedDialog={this.onPositionDrop}
					selectedPosition={dialogOpenedName === 'dialogWriteOffCreate' ? position : null}
				/>
			</Paper>
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
		getPositions: () => dispatch(getPositions()),
		getPositionGroups: () => dispatch(getPositionGroups()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Positions);
