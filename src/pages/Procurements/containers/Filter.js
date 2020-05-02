import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import queryString from 'query-string';
import { Formik } from 'formik';
import { debounce } from 'lodash';

import Paper from '@material-ui/core/Paper';

import { sleep } from 'shared/utils';

import { history } from 'src/helpers/history';

import { deleteParamsCoincidence } from 'src/components/Pagination/utils';

import { getMembers } from 'src/actions/members';
import { getPositions } from 'src/actions/positions';
import { getProcurementsReceived } from 'src/actions/procurements';

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
		dropdownMember: false,
	};

	refFilterInvoiceNumberInput = createRef();
	refDropdownDate = createRef();
	refDropdownDateRange = createRef();
	refDropdownPosition = createRef();
	refDropdownMember = createRef();

	handlerDropdown = (name, value, callback) =>
		this.setState(
			{
				[name]: value === null || value === undefined ? !this.state[name] : value,
			},
			callback
		);

	onChangeFilterInvoiceNumber = debounce(({ target: { value } }, setFieldValue, submitForm) => {
		setFieldValue('invoiceNumber', value);
		submitForm();
	}, 150);

	onClearFilterInvoiceNumber = (setFieldValue, submitForm) => {
		setFieldValue('invoiceNumber', '');

		this.refFilterInvoiceNumberInput.current.focus();

		submitForm();
	};

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

	onChangeFilterMember = (member, setFieldValue, submitForm) => {
		this.handlerDropdown('dropdownMember');

		setFieldValue('member', member);
		submitForm();
	};

	onResetAllFilters = (setFieldValue, submitForm) => {
		setFieldValue('dateStart', null);
		setFieldValue('dateEnd', null);
		setFieldValue('dateStartView', null);
		setFieldValue('dateEndView', null);
		setFieldValue('invoiceNumber', '');
		setFieldValue('position', 'all');
		setFieldValue('member', 'all');
		submitForm();
	};

	onSubmit = async (values, actions) => {
		const {
			filterOptions: { delete: filterDeleteParams },
		} = this.props;

		const dropdownNameList = ['dropdownDate', 'dropdownDateRange', 'dropdownPosition', 'dropdownMember'];

		actions.setFieldValue('dateStartView', values.dateStart);
		actions.setFieldValue('dateEndView', values.dateEnd);

		for (let i = 0; i < dropdownNameList.length; i++) {
			this.handlerDropdown(dropdownNameList[i], false);
		}

		const query = deleteParamsCoincidence({ ...filterSchema.cast(values) }, { type: 'search', ...filterDeleteParams });

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
			prevPropsFilterParams.invoiceNumber !== filterParams.invoiceNumber ||
			prevPropsFilterParams.dateStart !== filterParams.dateStart ||
			prevPropsFilterParams.dateEnd !== filterParams.dateEnd ||
			prevPropsFilterParams.position !== filterParams.position ||
			prevPropsFilterParams.member !== filterParams.member
		) {
			const query = deleteParamsCoincidence({ ...filterParams, page: 1 }, { type: 'server', ...filterDeleteParams });

			paging.setPage(1);

			this.props.getProcurementsReceived(query);
		}
	}

	componentDidMount() {
		this.props.getMembers();
		this.props.getPositions();
	}

	render() {
		const {
			members,
			positions,
			filterOptions: { params: filterParams },
		} = this.props;
		const { dropdownDate, dropdownDateRange, dropdownPosition, dropdownMember } = this.state;

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
							onChangeFilterInvoiceNumber={this.onChangeFilterInvoiceNumber}
							onClearFilterInvoiceNumber={this.onClearFilterInvoiceNumber}
							onChangeFilterDate={this.onChangeFilterDate}
							onChangeFilterPosition={this.onChangeFilterPosition}
							onChangeFilterMember={this.onChangeFilterMember}
							onResetAllFilters={this.onResetAllFilters}
							members={members}
							positions={positions}
							refFilterInvoiceNumberInput={this.refFilterInvoiceNumberInput}
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
		members.data = membersData.data.filter(member => member.roles.some(role => /owner|admin/.test(role)));
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
		getProcurementsReceived: query => dispatch(getProcurementsReceived({ query })),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Filter);
