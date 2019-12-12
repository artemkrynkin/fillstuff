import React, { Component, createRef } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import queryString from 'query-string';
import { Formik } from 'formik';

import Paper from '@material-ui/core/Paper';

import { memberRoleTransform } from 'shared/roles-access-rights';
import { sleep } from 'shared/utils';

import { history } from 'src/helpers/history';

import { getPositions } from 'src/actions/positions';
import { getProcurements } from 'src/actions/procurements';

import FormFilter from './FormFilter';
import filterSchema from './filterSchema';

import styles from './Filter.module.css';

let filterNumberFieldTimer;

class Filter extends Component {
	state = {
		dropdownDate: false,
		dropdownDateRange: false,
		dropdownPosition: false,
		dropdownRole: false,
	};

	refFilterNumberInput = createRef();
	refDropdownDate = createRef();
	refDropdownDateRange = createRef();
	refDropdownPosition = createRef();
	refDropdownRole = createRef();

	handlerDropdown = (name, value) =>
		this.setState({
			[name]: value === null || value === undefined ? !this.state[name] : value,
		});

	onChangeFilterNumber = ({ target: { value } }, setFieldValue, submitForm) => {
		setFieldValue('number', value);

		clearTimeout(filterNumberFieldTimer);

		filterNumberFieldTimer = setTimeout(() => submitForm(), 150);
	};

	onClearFilterNumber = (setFieldValue, submitForm) => {
		setFieldValue('number', '', false);

		this.refFilterNumberInput.current.focus();

		submitForm();
	};

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

	onChangeFilterPosition = (position, setFieldValue, submitForm) => {
		this.handlerDropdown('dropdownPosition');

		setFieldValue('position', position, false);
		submitForm();
	};

	onChangeFilterRole = (role, setFieldValue, submitForm) => {
		this.handlerDropdown('dropdownRole');

		setFieldValue('role', role, false);
		submitForm();
	};

	onResetAllFilters = (setFieldValue, submitForm) => {
		const momentDate = moment();
		const startMonth = momentDate.startOf('month').valueOf();
		const endMonth = momentDate.endOf('month').valueOf();

		setFieldValue('number', '', false);
		setFieldValue('dateStart', startMonth, false);
		setFieldValue('dateEnd', endMonth, false);
		setFieldValue('dateStartView', startMonth, false);
		setFieldValue('dateEndView', endMonth, false);
		setFieldValue('position', 'all', false);
		setFieldValue('role', 'all', false);
		submitForm();
	};

	onSubmit = async (values, actions) => {
		const { paging } = this.props;

		const momentDate = moment();
		const dropdownNameList = ['dropdownDate', 'dropdownDateRange', 'dropdownPosition', 'dropdownRole'];

		paging.onChangeLoadedDocs(true);

		actions.setFieldValue('dateStartView', values.dateStart, false);
		actions.setFieldValue('dateEndView', values.dateEnd, false);

		for (let i = 0; i < dropdownNameList.length; i++) {
			this.handlerDropdown(dropdownNameList[i], false);
		}

		const filterParams = filterSchema.cast(values);

		Object.keys(filterParams).forEach(key => filterParams[key] === '' && delete filterParams[key]);

		if (
			momentDate.startOf('month').isSame(filterParams.dateStart, 'day') &&
			momentDate.endOf('month').isSame(filterParams.dateEnd, 'day')
		) {
			delete filterParams.dateStart;
			delete filterParams.dateEnd;
		}
		if (filterParams.position === 'all') delete filterParams.position;
		if (filterParams.role === 'all') delete filterParams.role;

		history.replace({
			search: queryString.stringify(filterParams),
		});

		actions.setSubmitting(true);

		await sleep(150);

		actions.setSubmitting(false);
	};

	componentDidUpdate(prevProps, prevState) {
		if (
			prevProps.queryParams.number !== this.props.queryParams.number ||
			prevProps.queryParams.dateStart !== this.props.queryParams.dateStart ||
			prevProps.queryParams.dateEnd !== this.props.queryParams.dateEnd ||
			prevProps.queryParams.position !== this.props.queryParams.position ||
			prevProps.queryParams.role !== this.props.queryParams.role
		) {
			const filterParams = filterSchema.cast(Object.assign({}, this.props.queryParams));

			Object.keys(filterParams).forEach(key => filterParams[key] === '' && delete filterParams[key]);

			this.props.getProcurements(filterParams);
		}
	}

	componentDidMount() {
		this.props.getPositions();
	}

	render() {
		const {
			currentStock,
			positions,
			members = currentStock.members
				.filter(member => member.role.match(/owner|admin/))
				.map(member => {
					return {
						...member,
						roleBitMask: memberRoleTransform(member.role, true),
					};
				})
				.sort((memberA, memberB) => (memberA.roleBitMask > memberB.roleBitMask ? -1 : 1)),
			queryParams,
		} = this.props;
		const { dropdownDate, dropdownDateRange, dropdownPosition, dropdownRole } = this.state;

		return (
			<Paper className={styles.container}>
				<Formik
					initialValues={queryParams}
					validationSchema={filterSchema}
					validateOnBlur={false}
					validateOnChange={false}
					enableReinitialize
					onSubmit={(values, actions) => this.onSubmit(values, actions)}
				>
					{props => (
						<FormFilter
							handlerDropdown={this.handlerDropdown}
							onChangeFilterNumber={this.onChangeFilterNumber}
							onClearFilterNumber={this.onClearFilterNumber}
							onChangeFilterDate={this.onChangeFilterDate}
							onChangeFilterPosition={this.onChangeFilterPosition}
							onChangeFilterRole={this.onChangeFilterRole}
							onResetAllFilters={this.onResetAllFilters}
							positions={positions}
							members={members}
							refFilterNumberInput={this.refFilterNumberInput}
							dropdownDate={{
								state: dropdownDate,
								ref: this.refDropdownDate,
							}}
							dropdownDateRange={{
								state: dropdownDateRange,
								ref: this.refDropdownDateRange,
							}}
							dropdownPosition={{
								state: dropdownPosition,
								ref: this.refDropdownPosition,
							}}
							dropdownRole={{
								state: dropdownRole,
								ref: this.refDropdownRole,
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
		positions: {
			data: positionsData,
			isFetching: isLoadingPositions,
			// error: errorPositions
		},
	} = state;

	const positions = {
		data: null,
		isFetching: isLoadingPositions,
	};

	if (!isLoadingPositions && positionsData) {
		positions.data = positionsData.filter(position => position.receipts.length);
	}

	return {
		positions: positions,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentStock } = ownProps;

	return {
		getPositions: () => dispatch(getPositions(currentStock._id)),
		getProcurements: params => dispatch(getProcurements(currentStock._id, params)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Filter);
