import React, { Component, createRef } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
		dropdownAmount: false,
		dropdownPosition: false,
		dropdownRole: false,
	};

	refDropdownAmount = createRef();
	refDropdownPosition = createRef();
	refDropdownRole = createRef();
	refFilterNumberInput = createRef();

	handlerDropdown = ({ name, value }, values, setFieldValue) => {
		this.setState({ [name]: value === null || value === undefined ? !this.state[name] : value });

		if (values) {
			switch (name) {
				case 'dropdownAmount':
					if (!values.amountFromView || !values.amountToView) {
						setFieldValue('amountFrom', '', false);
						setFieldValue('amountTo', '', false);
					} else {
						setFieldValue('amountFrom', values.amountFromView, false);
						setFieldValue('amountTo', values.amountToView, false);
					}
					break;
				case 'dropdownPosition':
					break;
				case 'dropdownRole':
					break;
				default:
					return;
			}
		}
	};

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

	onResetFilterAmount = (setFieldValue, submitForm) => {
		this.handlerDropdown({ name: 'dropdownAmount' });

		setFieldValue('amountFrom', '', false);
		setFieldValue('amountTo', '', false);
		setFieldValue('amountFromView', '', false);
		setFieldValue('amountToView', '', false);

		submitForm();
	};

	onChangeFilterRole = (role, setFieldValue, submitForm) => {
		this.handlerDropdown({ name: 'dropdownRole' });

		setFieldValue('role', role, false);
		submitForm();
	};

	onChangeFilterPosition = (position, setFieldValue, submitForm) => {
		this.handlerDropdown({ name: 'dropdownPosition' });

		setFieldValue('position', position, false);
		submitForm();
	};

	onResetAllFilters = (setFieldValue, submitForm) => {
		setFieldValue('number', '', false);
		setFieldValue('amountFrom', '', false);
		setFieldValue('amountTo', '', false);
		setFieldValue('amountFromView', '', false);
		setFieldValue('amountToView', '', false);
		setFieldValue('position', 'all', false);
		setFieldValue('role', 'all', false);
		submitForm();
	};

	onSubmit = async (values, actions) => {
		actions.setFieldValue('amountFromView', values.amountFrom, false);
		actions.setFieldValue('amountToView', values.amountTo, false);

		const filterParams = filterSchema.cast(values);

		for (let i = 0; i < 4; i++) this.handlerDropdown({ name: `dropdown${i + 1}`, value: false });

		Object.keys(filterParams).forEach(key => filterParams[key] === '' && delete filterParams[key]);

		history.push({
			search: queryString.stringify(filterParams),
		});
		actions.setSubmitting(true);

		await sleep(150);

		actions.setSubmitting(false);
	};

	componentDidUpdate(prevProps, prevState) {
		if (
			prevProps.procurementsQueryParams.number !== this.props.procurementsQueryParams.number ||
			prevProps.procurementsQueryParams.amountFrom !== this.props.procurementsQueryParams.amountFrom ||
			prevProps.procurementsQueryParams.amountTo !== this.props.procurementsQueryParams.amountTo ||
			prevProps.procurementsQueryParams.position !== this.props.procurementsQueryParams.position ||
			prevProps.procurementsQueryParams.role !== this.props.procurementsQueryParams.role
		) {
			const filterParams = Object.assign({}, this.props.procurementsQueryParams);

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
			procurementsQueryParams,
		} = this.props;
		const { dropdownAmount, dropdownPosition, dropdownRole } = this.state;

		return (
			<Paper className={styles.container}>
				<Formik
					initialValues={procurementsQueryParams}
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
							onResetFilterAmount={this.onResetFilterAmount}
							onChangeFilterPosition={this.onChangeFilterPosition}
							onChangeFilterRole={this.onChangeFilterRole}
							onResetAllFilters={this.onResetAllFilters}
							positions={positions}
							members={members}
							dropdownAmount={{
								state: dropdownAmount,
								ref: this.refDropdownAmount,
							}}
							dropdownPosition={{
								state: dropdownPosition,
								ref: this.refDropdownPosition,
							}}
							dropdownRole={{
								state: dropdownRole,
								ref: this.refDropdownRole,
							}}
							refFilterNumberInput={this.refFilterNumberInput}
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
