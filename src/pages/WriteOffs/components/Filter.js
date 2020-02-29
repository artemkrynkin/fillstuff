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
import { getPositions } from 'src/actions/positions';
import { getWriteOffs } from 'src/actions/writeOffs';

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
		dropdownPosition: false,
		dropdownPrice: false,
		dropdownRole: false,
	};

	refDropdownDate = createRef();
	refDropdownDateRange = createRef();
	refDropdownPosition = createRef();
	refDropdownPrice = createRef();
	refDropdownRole = createRef();

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

	onChangeFilterPosition = (position, setFieldValue, submitForm) => {
		this.handlerDropdown('dropdownPosition');

		setFieldValue('position', position, false);
		submitForm();
	};

	onChangeFilterPrice = (price, setFieldValue, submitForm) => {
		this.handlerDropdown('dropdownPrice');

		setFieldValue('price', price, false);
		submitForm();
	};

	onChangeFilterRole = (role, setFieldValue, submitForm) => {
		this.handlerDropdown('dropdownRole');

		setFieldValue('role', role, false);
		submitForm();
	};

	onChangeFilterOnlyCanceled = (onlyCanceled, setFieldValue, submitForm) => {
		setFieldValue('onlyCanceled', onlyCanceled, false);
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
		setFieldValue('position', 'all', false);
		setFieldValue('price', 'all', false);
		setFieldValue('role', 'all', false);
		setFieldValue('onlyCanceled', false, false);
		submitForm();
	};

	onSubmit = async (values, actions) => {
		const { paging } = this.props;

		const momentDate = moment();
		const dropdownNameList = ['dropdownDate', 'dropdownDateRange', 'dropdownPosition', 'dropdownPrice', 'dropdownRole'];

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

		console.log(query);

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
			prevProps.filterParams.position !== filterParams.position ||
			prevProps.filterParams.price !== filterParams.price ||
			prevProps.filterParams.role !== filterParams.role ||
			prevProps.filterParams.onlyCanceled !== filterParams.onlyCanceled
		) {
			const query = { ...filterParams };

			Object.keys(query).forEach(key => (query[key] === '' || query[key] === 'all') && delete query[key]);

			this.props.getWriteOffs(query);
		}
	}

	componentDidMount() {
		this.props.getMembers();
		this.props.getPositions();
	}

	render() {
		const { members, positions, filterParams } = this.props;
		const { dropdownDate, dropdownDateRange, dropdownPosition, dropdownPrice, dropdownRole } = this.state;

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
							onChangeFilterPosition={this.onChangeFilterPosition}
							onChangeFilterPrice={this.onChangeFilterPrice}
							onChangeFilterRole={this.onChangeFilterRole}
							onChangeFilterOnlyCanceled={this.onChangeFilterOnlyCanceled}
							onResetAllFilters={this.onResetAllFilters}
							members={members}
							positions={positions}
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
							dropdownPrice={{
								state: dropdownPrice,
								ref: this.refDropdownPrice,
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
	return {
		members: state.members,
		positions: state.positions,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getMembers: () => dispatch(getMembers()),
		getPositions: () => dispatch(getPositions()),
		getWriteOffs: query => dispatch(getWriteOffs({ query })),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Filter);
