import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import queryString from 'query-string';

import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { history } from 'src/helpers/history';

import { getWriteOffs } from 'src/actions/writeOffs';

import './WriteOffs.styl';

class WriteOffs extends Component {
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
							<TableCell>Имя</TableCell>
							<TableCell align="right" width="130px">
								Количество
							</TableCell>
							<TableCell align="right" width="180px">
								Дата
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{!isLoadingWriteOffs ? (
							writeOffs && writeOffs.length ? (
								writeOffs.map(writeOff => (
									<TableRow key={writeOff._id}>
										<TableCell>
											{writeOff.position.name}{' '}
											{writeOff.position.characteristics.reduce(
												(fullCharacteristics, characteristic) => `${fullCharacteristics} ${characteristic.label}`,
												''
											)}
										</TableCell>
										<TableCell>{writeOff.user.name || writeOff.user.email}</TableCell>
										<TableCell align="right">{writeOff.quantity}</TableCell>
										{/* показывать дату, только если списание не за текущий год */}
										<TableCell align="right">{moment(writeOff.createdAt).format('DD MMM в HH:mm')}</TableCell>
									</TableRow>
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
		getWriteOffs: params => dispatch(getWriteOffs(currentStock._id, params)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(WriteOffs);
