import React, { Component, createRef } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { Formik } from 'formik';

import Paper from '@material-ui/core/Paper';

import { memberRoleTransform } from 'shared/roles-access-rights';
import { sleep } from 'shared/utils';

import { history } from 'src/helpers/history';

import { getProcurements } from 'src/actions/procurements';

import FormFilter from './FormFilter';
import filterSchema from './filterSchema';

import styles from './Filter.module.css';

let filterNumberFieldTimer;

class Filter extends Component {
	state = {
		dropdown1: false,
		dropdown4: false,
	};

	refDropdown1 = createRef();
	refDropdown4 = createRef();
	refFilterNumberInput = createRef();

	handlerDropdown = ({ name, value }, values, setFieldValue) => {
		this.setState({ [name]: value === null || value === undefined ? !this.state[name] : value });

		if (values) {
			switch (name) {
				case 'dropdown1':
					if (!values.amountFromView || !values.amountToView) {
						setFieldValue('amountFrom', '', false);
						setFieldValue('amountTo', '', false);
					} else {
						setFieldValue('amountFrom', values.amountFromView, false);
						setFieldValue('amountTo', values.amountToView, false);
					}
					break;
				case 'dropdown4':
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
		this.handlerDropdown({ name: 'dropdown1' });

		setFieldValue('amountFrom', '', false);
		setFieldValue('amountTo', '', false);
		setFieldValue('amountFromView', '', false);
		setFieldValue('amountToView', '', false);

		submitForm();
	};

	onChangeFilterRole = (role, setFieldValue, submitForm) => {
		this.handlerDropdown({ name: 'dropdown4' });

		setFieldValue('role', role, false);
		submitForm();
	};

	onResetAllFilters = (setFieldValue, submitForm) => {
		setFieldValue('number', '', false);
		setFieldValue('amountFrom', '', false);
		setFieldValue('amountTo', '', false);
		setFieldValue('amountFromView', '', false);
		setFieldValue('amountToView', '', false);
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
			prevProps.procurementsQueryParams.role !== this.props.procurementsQueryParams.role
		) {
			const filterParams = Object.assign({}, this.props.procurementsQueryParams);

			Object.keys(filterParams).forEach(key => filterParams[key] === '' && delete filterParams[key]);

			this.props.getProcurements(filterParams);
		}
	}

	render() {
		const {
			currentStock,
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
		const { dropdown1, dropdown4 } = this.state;

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
							onChangeFilterRole={this.onChangeFilterRole}
							onResetAllFilters={this.onResetAllFilters}
							members={members}
							dropdown1={{
								state: dropdown1,
								ref: this.refDropdown1,
							}}
							dropdown4={{
								state: dropdown4,
								ref: this.refDropdown4,
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

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentStock } = ownProps;

	return {
		getProcurements: params => dispatch(getProcurements(currentStock._id, params)),
	};
};

export default connect(
	null,
	mapDispatchToProps
)(Filter);
