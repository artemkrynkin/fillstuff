import React, { Component } from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import loadable from '@loadable/component';

import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { history } from 'src/helpers/history';

import { getWriteOffs } from 'src/actions/writeOffs';

import WriteOff from './WriteOff';
import { TableCell } from './styles';

import styles from './WriteOffs.module.css';

const DialogWriteOffDelete = loadable(() =>
	import('src/containers/Dialogs/WriteOffDelete' /* webpackChunkName: "Dialog_WriteOffDelete" */)
);

class WriteOffs extends Component {
	state = {
		writeOff: null,
		dialogOpenedName: '',
		dialogWriteOffDelete: false,
	};

	onWriteOffDrop = () => this.setState({ writeOff: null, dialogOpenedName: '' });

	onOpenDialogByName = (dialogName, writeOff) =>
		this.setState({
			writeOff: writeOff,
			dialogOpenedName: dialogName,
			[dialogName]: true,
		});

	onCloseDialogByName = dialogName => this.setState({ [dialogName]: false });

	componentDidMount() {
		this.props.getWriteOffs();
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.selectedUserId !== this.props.selectedUserId) {
			this.props.getWriteOffs();
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
			<Paper>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Наименование</TableCell>
							<TableCell width={150}>Имя</TableCell>
							<TableCell align="right" width={80}>
								Кол-во
							</TableCell>
							<TableCell align="right" width={80}>
								Цена
							</TableCell>
							<TableCell align="right" width={140}>
								Дата
							</TableCell>
							<TableCell align="right" width={50} />
						</TableRow>
					</TableHead>
					<TableBody className={styles.tableBody}>
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
								<TableCell colSpan={5} style={{ padding: 12 }}>
									<div children={<CircularProgress size={20} />} style={{ textAlign: 'center' }} />
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>

				<DialogWriteOffDelete
					dialogOpen={dialogWriteOffDelete}
					onCloseDialog={() => this.onCloseDialogByName('dialogWriteOffDelete')}
					onExitedDialog={this.onWriteOffDrop}
					currentStockId={currentStock._id}
					selectedWriteOff={dialogOpenedName === 'dialogWriteOffDelete' ? writeOff : null}
				/>
			</Paper>
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

	const { endDate, startDate } = queryString.parse(history.location.search);
	const params = {
		userId: ownProps.selectedUserId,
		endDate,
		startDate,
	};

	return {
		getWriteOffs: () => dispatch(getWriteOffs(currentStock._id, params)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(WriteOffs);
