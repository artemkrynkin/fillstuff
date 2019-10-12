import React, { Component } from 'react';
import { connect } from 'react-redux';

import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { getCharacteristics } from 'src/actions/characteristics';
import { getPositionsInGroups } from 'src/actions/positions';

import styles from './Purchases.module.css';

class Purchases extends Component {
	render() {
		// const {
		//   currentStock,
		// } = this.props;

		return <Paper></Paper>;
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentStock } = ownProps;

	return {
		getCharacteristics: () => dispatch(getCharacteristics(currentStock._id)),
		getPositionsInGroups: () => dispatch(getPositionsInGroups(currentStock._id)),
	};
};

export default connect(
	null,
	mapDispatchToProps
)(Purchases);
