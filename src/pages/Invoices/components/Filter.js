import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import queryString from 'query-string';
import { Formik } from 'formik';

import Paper from '@material-ui/core/Paper';

import { sleep } from 'shared/utils';

import { history } from 'src/helpers/history';

import { getMembers } from 'src/actions/members';
import { getInvoices } from 'src/actions/invoices';

import FormFilter from './FormFilter';
import filterSchema from './filterSchema';

import styles from './Filter.module.css';

class Filter extends Component {
	static propTypes = {
		filterParams: PropTypes.object.isRequired,
		paging: PropTypes.object.isRequired,
	};

	state = {
		dropdownDate: false,
		dropdownDateRange: false,
		dropdownStatus: false,
		dropdownMember: false,
	};

	refDropdownDate = createRef();
	refDropdownDateRange = createRef();
	refDropdownStatus = createRef();
	refDropdownMember = createRef();

	handlerDropdown = (name, value) =>
		this.setState({
			[name]: value === null || value === undefined ? !this.state[name] : value,
		});

	onChangeFilterDate = (intervalDate, setFieldValue, submitForm) => {
		const momentDate = moment();

		this.handlerDropdown('dropdownDate');

		switch (intervalDate) {
			case 'currentWeek': {
				const startWeek = momentDate.startOf('isoWeek').valueOf();
				const endWeek = momentDate.endOf('isoWeek').valueOf();

				setFieldValue('dateStart', startWeek, false);
				setFieldValue('dateEnd', endWeek, false);
				break;
			}
			case 'currentMonth':
			default: {
				const startMonth = momentDate.startOf('month').valueOf();
				const endMonth = momentDate.endOf('month').valueOf();

				setFieldValue('dateStart', startMonth, false);
				setFieldValue('dateEnd', endMonth, false);
				break;
			}
		}
		submitForm();
	};

	onChangeFilterStatus = (status, setFieldValue, submitForm) => {
		this.handlerDropdown('dropdownStatus');

		setFieldValue('status', status, false);
		submitForm();
	};

	onChangeFilterMember = (member, setFieldValue, submitForm) => {
		this.handlerDropdown('dropdownMember');

		setFieldValue('member', member, false);
		submitForm();
	};

	onResetAllFilters = (setFieldValue, submitForm) => {
		const momentDate = moment();
		const startMonth = momentDate.startOf('month').valueOf();
		const endMonth = momentDate.endOf('month').valueOf();

		setFieldValue('dateStart', startMonth, false);
		setFieldValue('dateEnd', endMonth, false);
		setFieldValue('dateStartView', startMonth, false);
		setFieldValue('dateEndView', endMonth, false);
		setFieldValue('status', 'all', false);
		setFieldValue('member', 'all', false);
		submitForm();
	};

	onSubmit = async (values, actions) => {
		const { paging } = this.props;

		const momentDate = moment();
		const dropdownNameList = ['dropdownDate', 'dropdownDateRange', 'dropdownStatus', 'dropdownMember'];

		paging.onChangeLoadedDocs(true);

		actions.setFieldValue('dateStartView', values.dateStart, false);
		actions.setFieldValue('dateEndView', values.dateEnd, false);

		for (let i = 0; i < dropdownNameList.length; i++) {
			this.handlerDropdown(dropdownNameList[i], false);
		}

		const query = { ...filterSchema.cast(values) };

		Object.keys(query).forEach(key => (query[key] === '' || query[key] === 'all') && delete query[key]);

		if (momentDate.startOf('month').isSame(query.dateStart, 'day') && momentDate.endOf('month').isSame(query.dateEnd, 'day')) {
			delete query.dateStart;
			delete query.dateEnd;
		}

		history.replace({
			search: queryString.stringify(query),
		});

		actions.setSubmitting(true);

		await sleep(150);

		actions.setSubmitting(false);
	};

	componentDidUpdate(prevProps, prevState) {
		const { filterParams } = this.props;

		if (
			prevProps.filterParams.dateStart !== filterParams.dateStart ||
			prevProps.filterParams.dateEnd !== filterParams.dateEnd ||
			prevProps.filterParams.status !== filterParams.status ||
			prevProps.filterParams.member !== filterParams.member
		) {
			const query = { ...filterParams };

			Object.keys(query).forEach(key => (query[key] === '' || query[key] === 'all') && delete query[key]);

			this.props.getInvoices(query);
		}
	}

	componentDidMount() {
		this.props.getMembers();
	}

	render() {
		const { members, filterParams } = this.props;
		const { dropdownDate, dropdownDateRange, dropdownStatus, dropdownMember } = this.state;

		const initialValues = { ...filterParams };

		if (initialValues.dateStart) initialValues.dateStartView = initialValues.dateStart;
		if (initialValues.dateEnd) initialValues.dateEndView = initialValues.dateEnd;

		return (
			<Paper className={styles.container}>
				<Formik
					initialValues={initialValues}
					validationSchema={filterSchema}
					validateOnBlur={false}
					validateOnChange={false}
					enableReinitialize
					onSubmit={(values, actions) => this.onSubmit(values, actions)}
				>
					{props => (
						<FormFilter
							handlerDropdown={this.handlerDropdown}
							onChangeFilterDate={this.onChangeFilterDate}
							onChangeFilterStatus={this.onChangeFilterStatus}
							onChangeFilterMember={this.onChangeFilterMember}
							onResetAllFilters={this.onResetAllFilters}
							members={members}
							dropdownDate={{
								state: dropdownDate,
								ref: this.refDropdownDate,
							}}
							dropdownDateRange={{
								state: dropdownDateRange,
								ref: this.refDropdownDateRange,
							}}
							dropdownStatus={{
								state: dropdownStatus,
								ref: this.refDropdownStatus,
							}}
							dropdownMember={{
								state: dropdownMember,
								ref: this.refDropdownMember,
							}}
							formikProps={props}
						/>
					)}
				</Formik>
			</Paper>
		);
	}
}

const mapStateToProps = state => {
	const {
		members: {
			data: membersData,
			isFetching: isLoadingMembers,
			// error: errorMembers
		},
	} = state;

	const members = {
		data: null,
		isFetching: isLoadingMembers,
	};

	if (!isLoadingMembers && membersData) {
		members.data = membersData.filter(member => member.roles.some(role => /artist/.test(role)));
	}

	return {
		members: members,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getMembers: () => dispatch(getMembers()),
		getInvoices: query => dispatch(getInvoices({ query })),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Filter);
