import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { Formik } from 'formik';
import { debounce } from 'lodash';

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { sleep } from 'shared/utils';

import { history } from 'src/helpers/history';

import { getMembers } from 'src/actions/members';

import FormFilter from './FormFilter';
import filterSchema from './filterSchema';

import styles from './Filter.module.css';

class Filter extends Component {
	static propTypes = {
		filterParams: PropTypes.object.isRequired,
	};

	state = {
		dropdownRole: false,
	};

	refFilterNameInput = createRef();
	refDropdownRole = createRef();

	handlerDropdown = (name, value) =>
		this.setState({
			[name]: value === null || value === undefined ? !this.state[name] : value,
		});

	onChangeFilterName = debounce(({ target: { value } }, setFieldValue, submitForm) => {
		setFieldValue('name', value);
		submitForm();
	}, 150);

	onClearFilterName = (setFieldValue, submitForm) => {
		setFieldValue('name', '', false);

		this.refFilterNameInput.current.focus();

		submitForm();
	};

	onChangeFilterRole = (role, setFieldValue, submitForm) => {
		this.handlerDropdown('dropdownRole');

		setFieldValue('role', role, false);
		submitForm();
	};

	onResetAllFilters = (setFieldValue, submitForm) => {
		setFieldValue('name', '', false);
		setFieldValue('role', 'all', false);
		submitForm();
	};

	onSubmit = async (values, actions) => {
		const dropdownNameList = ['dropdownRole'];

		for (let i = 0; i < dropdownNameList.length; i++) {
			this.handlerDropdown(dropdownNameList[i], false);
		}

		const query = { ...filterSchema.cast(values) };

		Object.keys(query).forEach(key => (query[key] === '' || query[key] === 'all') && delete query[key]);

		history.replace({
			search: queryString.stringify(query),
		});

		actions.setSubmitting(true);

		await sleep(150);

		actions.setSubmitting(false);
	};

	componentDidUpdate(prevProps, prevState) {
		const { filterParams } = this.props;

		if (prevProps.filterParams.name !== filterParams.name || prevProps.filterParams.role !== filterParams.role) {
			const query = { ...filterParams };

			Object.keys(query).forEach(key => (query[key] === '' || query[key] === 'all') && delete query[key]);

			this.props.getMembers(query, false);
		}
	}

	render() {
		const { tabName, onChangeTab, members, filterParams } = this.props;
		const { dropdownRole } = this.state;

		const initialValues = { ...filterParams };

		return (
			<Paper className={styles.container}>
				<Tabs className={styles.tabs} value={tabName} onChange={onChangeTab} aria-label="simple tabs example">
					<Tab value="" label="Постоянные" id="regular-members" />
					<Tab value="guests" label="Гостевые" id="guest-members" />
				</Tabs>
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
							onChangeFilterName={this.onChangeFilterName}
							onClearFilterName={this.onClearFilterName}
							onChangeFilterRole={this.onChangeFilterRole}
							onResetAllFilters={this.onResetAllFilters}
							members={members}
							refFilterNameInput={this.refFilterNameInput}
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
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getMembers: (query, showRequest) => dispatch(getMembers({ query, showRequest })),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Filter);
