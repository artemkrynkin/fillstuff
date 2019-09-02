import React, { Component } from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import Loadable from 'react-loadable';

import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import { history } from 'src/helpers/history';

import { getWriteOffs } from 'src/actions/writeOffs';

import WriteOff from './WriteOff';
import { TableCell } from './styles';

import './WriteOffs.styl';

const DialogWriteOffDelete = Loadable({
	loader: () => import('src/containers/Dialogs/WriteOffDelete' /* webpackChunkName: "Dialog_WriteOffDelete" */),
	loading: () => null,
	delay: 200,
});

class WriteOffs extends Component {
	state = {
		writeOff: null,
		dialogOpenedName: '',
		dialogWriteOffDelete: false,
	};

	onWriteOffDrop = () => this.setState({ position: null, dialogOpenedName: '' });

	onOpenDialogByName = (dialogName, writeOff) =>
		this.setState({
			writeOff: writeOff,
			dialogOpenedName: dialogName,
			[dialogName]: true,
		});

	onCloseDialogByName = dialogName => this.setState({ [dialogName]: false });

	componentDidMount() {
		const { endDate, startDate } = queryString.parse(history.location.search);

		this.props.getWriteOffs({ userId: this.props.selectedUserId, endDate, startDate });
	}

	UNSAFE_componentWillUpdate(nextProps, nextState, nextContext) {
		const { endDate, startDate } = queryString.parse(history.location.search);

		if (this.props.selectedUserId !== nextProps.selectedUserId) {
			this.props.getWriteOffs({ userId: nextProps.selectedUserId, endDate, startDate });
		}
	}

	render() {
		const {
			currentStock,
			writeOffs: {
				data: writeOffs,
				isFetching: isLoadingWriteOffs,
				// error: errorWriteOffs
			},
		} = this.props;
		const { writeOff, dialogOpenedName, dialogWriteOffDelete } = this.state;

		return (
			<Grid item xs={9}>
				<Paper className="swo-write-offs">
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Наименование</TableCell>
								<TableCell width={150}>Имя</TableCell>
								<TableCell align="right" width={115}>
									Количество
								</TableCell>
								<TableCell align="right" width={150}>
									Дата
								</TableCell>
								<TableCell align="right" width={50} />
							</TableRow>
						</TableHead>
						<TableBody className="swo-write-offs__table-body">
							{!isLoadingWriteOffs ? (
								writeOffs && writeOffs.length ? (
									writeOffs.map(writeOff => (
										<WriteOff
											key={writeOff._id}
											currentStockId={currentStock._id}
											writeOff={writeOff}
											onOpenDialogWriteOff={this.onOpenDialogByName}
										/>
									))
								) : (
									<TableRow>
										<TableCell colSpan={4}>
											<Typography variant="caption" align="center" component="div" style={{ padding: '1px 0' }}>
												Еще не было списаний по позициям.
											</Typography>
										</TableCell>
									</TableRow>
								)
							) : (
								<TableRow>
									<TableCell colSpan={4} style={{ padding: 12 }}>
										<div children={<CircularProgress size={20} />} style={{ textAlign: 'center' }} />
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>

					<DialogWriteOffDelete
						dialogOpen={dialogWriteOffDelete}
						onCloseDialog={() => this.onCloseDialogByName('dialogWriteOffDelete')}
						onExitedDialog={this.onPositionDrop}
						currentStockId={currentStock._id}
						selectedWriteOff={dialogOpenedName === 'dialogWriteOffDelete' ? writeOff : null}
					/>
				</Paper>
			</Grid>
		);
	}
}

const mapStateToProps = state => {
	return {
		writeOffs: state.writeOffs,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentStock } = ownProps;

	return {
		getWriteOffs: params => dispatch(getWriteOffs(currentStock._id, params)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(WriteOffs);
