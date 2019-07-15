import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import './WriteOffs.styl';

import { getWriteOffs } from 'src/actions/writeOffs';

class WriteOffs extends Component {
	UNSAFE_componentWillMount() {
		this.props.getWriteOffs(this.props.selectedUserId);
	}

	UNSAFE_componentWillUpdate(nextProps, nextState, nextContext) {
		if (this.props.selectedUserId !== nextProps.selectedUserId) {
			this.props.getWriteOffs(nextProps.selectedUserId);
		}
	}

	render() {
		const {
			writeOffs: {
				data: writeOffs,
				isFetching: isLoadingWriteOffs,
				// error: errorWriteOffs
			},
		} = this.props;

		return (
			<Paper>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Наименование</TableCell>
							<TableCell align="right">Имя</TableCell>
							<TableCell align="right" width="130px">
								Количество
							</TableCell>
							<TableCell align="right" width="180px">
								Дата расхода
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{!isLoadingWriteOffs ? (
							writeOffs && writeOffs.length ? (
								writeOffs.map(writeOff => (
									<TableRow key={writeOff._id}>
										<TableCell>{writeOff.product.name}</TableCell>
										<TableCell align="right">{writeOff.user.name || writeOff.user.email}</TableCell>
										<TableCell align="right">{writeOff.quantity}</TableCell>
										<TableCell align="right">{moment(writeOff.createdAt).format('DD MMMM YYYY в HH:mm')}</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={4}>
										<Typography variant="caption" align="center" component="div" style={{ padding: '1px 0' }}>
											Еще не было расходов ни по одной позиции.
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

	return {
		getWriteOffs: userId => dispatch(getWriteOffs(currentStock._id, null, userId)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(WriteOffs);
