import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import queryString from 'query-string';
import { Formik } from 'formik';

import Paper from '@material-ui/core/Paper';

import { sleep } from 'shared/utils';

import { history } from 'src/helpers/history';

import { deleteParamsCoincidence } from 'src/components/Pagination/utils';

import { getMembers } from 'src/actions/members';
import { getPositions } from 'src/actions/positions';
import { getWriteOffs } from 'src/actions/writeOffs';

import FormFilter from './FormFilter';
import filterSchema from './filterSchema';

import styles from './Filter.module.css';

class Filter extends Component {
	static propTypes = {
		filterOptions: PropTypes.object.isRequired,
		paging: PropTypes.object.isRequired,
	};

	state = {
		dropdownDate: false,
		dropdownDateRange: false,
		dropdownPosition: false,
		dropdownRole: false,
	};

	refDropdownDate = createRef();
	refDropdownDateRange = createRef();
	refDropdownPosition = createRef();
	refDropdownRole = createRef();

	handlerDropdown = (name, value, callback) =>
		this.setState(
			{
				[name]: value === null || value === undefined ? !this.state[name] : value,
			},
			callback
		);

	onChangeFilterDate = (intervalDate, setFieldValue, submitForm) => {
		const momentDate = moment();

		this.handlerDropdown('dropdownDate');

		switch (intervalDate) {
			case 'currentMonth': {
				const startMonth = momentDate.startOf('month').valueOf();
				const endMonth = momentDate.endOf('month').valueOf();

				setFieldValue('dateStart', startMonth);
				setFieldValue('dateEnd', endMonth);
				break;
			}
			case 'currentWeek': {
				const startWeek = momentDate.startOf('isoWeek').valueOf();
				const endWeek = momentDate.endOf('isoWeek').valueOf();

				setFieldValue('dateStart', startWeek);
				setFieldValue('dateEnd', endWeek);
				break;
			}
			case 'allTime':
			default: {
				setFieldValue('dateStart', null);
				setFieldValue('dateEnd', null);
				break;
			}
		}
		submitForm();
	};

	onChangeFilterPosition = (position, setFieldValue, submitForm) => {
		this.handlerDropdown('dropdownPosition');

		setFieldValue('position', position);
		submitForm();
	};

	onChangeFilterRole = (role, setFieldValue, submitForm) => {
		this.handlerDropdown('dropdownRole');

		setFieldValue('role', role);
		submitForm();
	};

	onChangeFilterOnlyCanceled = (onlyCanceled, setFieldValue, submitForm) => {
		setFieldValue('onlyCanceled', onlyCanceled);
		submitForm();
	};

	onResetAllFilters = (setFieldValue, submitForm) => {
		setFieldValue('dateStart', null);
		setFieldValue('dateEnd', null);
		setFieldValue('dateStartView', null);
		setFieldValue('dateEndView', null);
		setFieldValue('position', 'all');
		setFieldValue('role', 'all');
		setFieldValue('onlyCanceled', false);
		submitForm();
	};

	onSubmit = async (values, actions) => {
		const {
			filterOptions: { delete: filterDeleteParams },
		} = this.props;

		const dropdownNameList = ['dropdownDate', 'dropdownDateRange', 'dropdownPosition', 'dropdownRole'];

		actions.setFieldValue('dateStartView', values.dateStart);
		actions.setFieldValue('dateEndView', values.dateEnd);

		for (let i = 0; i < dropdownNameList.length; i++) {
			this.handlerDropdown(dropdownNameList[i], false);
		}

		const query = deleteParamsCoincidence({ ...filterSchema.cast(values) }, { type: 'search', ...filterDeleteParams });

		if (!query.onlyCanceled) delete query.onlyCanceled;

		history.replace({
			search: queryString.stringify(query),
		});

		actions.setSubmitting(true);

		await sleep(150);

		actions.setSubmitting(false);
	};

	componentDidUpdate({ filterOptions: { params: prevPropsFilterParams } }, prevState) {
		const {
			filterOptions: { params: filterParams, delete: filterDeleteParams },
			paging,
		} = this.props;

		if (
			prevPropsFilterParams.dateStart !== filterParams.dateStart ||
			prevPropsFilterParams.dateEnd !== filterParams.dateEnd ||
			prevPropsFilterParams.position !== filterParams.position ||
			prevPropsFilterParams.role !== filterParams.role ||
			prevPropsFilterParams.onlyCanceled !== filterParams.onlyCanceled
		) {
			paging.setPage(1);

			const query = deleteParamsCoincidence({ ...filterParams }, { type: 'server', ...filterDeleteParams });

			if (!query.onlyCanceled) delete query.onlyCanceled;

			this.props.getWriteOffs(query);
		}
	}

	componentDidMount() {
		this.props.getMembers();
		this.props.getPositions();
	}

	render() {
		const {
			currentStudio,
			members,
			positions,
			filterOptions: { params: filterParams },
		} = this.props;
		const { dropdownDate, dropdownDateRange, dropdownPosition, dropdownRole } = this.state;

		const initialValues = { ...filterParams };

		if (initialValues.dateStart) initialValues.dateStartView = initialValues.dateStart;
		if (initialValues.dateEnd) initialValues.dateEndView = initialValues.dateEnd;

		console.log(currentStudio);

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
							currentStudio={currentStudio}
							handlerDropdown={this.handlerDropdown}
							onChangeFilterDate={this.onChangeFilterDate}
							onChangeFilterPosition={this.onChangeFilterPosition}
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
		members.data = membersData.data;
	}

	return {
		members: members,
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
