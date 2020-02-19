import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import ClassNames from 'classnames';

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import ButtonBase from '@material-ui/core/ButtonBase';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';

import { editMember } from 'src/actions/members';

import styles from './Settings.module.css';

const Settings = props => {
	const { member } = props;

	return (
		<div>
			{/*<FormControlLabel*/}
			{/*  control={*/}
			{/*    <Switch*/}
			{/*      checked={member.purchaseExpenseStudio}*/}
			{/*      onChange={() => props.editMember({ purchaseExpenseStudio: member.purchaseExpenseStudio })}*/}
			{/*      value="purchaseExpenseStudio"*/}
			{/*      color="primary"*/}
			{/*      disableRipple*/}
			{/*    />*/}
			{/*  }*/}
			{/*  label="Покупки за счет студии"*/}
			{/*/>*/}
			Настройки
		</div>
	);
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const { member } = ownProps;

	return {
		editMember: memberData => dispatch(editMember({ params: { memberId: member._id }, data: { member: memberData } })),
	};
};

export default connect(null, mapDispatchToProps)(Settings);
