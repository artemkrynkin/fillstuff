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

import { deleteParamsCoincidence } from 'src/components/Pagination/utils';

import { getMembers } from 'src/actions/members';

import FormFilter from './FormFilter';
import filterSchema from './filterSchema';

import styles from './Filter.module.css';

class Filter extends Component {
	static propTypes = {
		filterOptions: PropTypes.object.isRequired,
	};

	state = {
		dropdownRole: false,
	};

	refFilterNameInput = createRef();
	refDropdownRole = createRef();

	handlerDropdown = (name, value, callback) =>
		this.setState(
			{
				[name]: value === null || value === undefined ? !this.state[name] : value,
			},
			callback
		);

	onChangeFilterName = debounce(({ target: { value } }, setFieldValue, submitForm) => {
		setFieldValue('name', value);
		submitForm();
	}, 150);

	onClearFilterName = (setFieldValue, submitForm) => {
		setFieldValue('name', '');

		this.refFilterNameInput.current.focus();

		submitForm();
	};

	onChangeFilterRole = (role, setFieldValue, submitForm) => {
		this.handlerDropdown('dropdownRole');

		setFieldValue('role', role);
		submitForm();
	};

	onResetAllFilters = (setFieldValue, submitForm) => {
		setFieldValue('name', '');
		setFieldValue('role', 'all');
		submitForm();
	};

	onSubmit = async (values, actions) => {
		const {
			filterOptions: { delete: filterDeleteParams },
		} = this.props;

		const dropdownNameList = ['dropdownRole'];

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
		} = this.props;

		if (prevPropsFilterParams.name !== filterParams.name || prevPropsFilterParams.role !== filterParams.role) {
			const query = deleteParamsCoincidence({ ...filterParams, page: 1 }, { type: 'server', ...filterDeleteParams });

			this.props.getMembers(query);
		}
	}

	render() {
		const {
			tabName,
			onChangeTab,
			filterOptions: { params: filterParams },
			currentMembersCount,
		} = this.props;
		const { dropdownRole } = this.state;

		const initialValues = { ...filterParams };

		return (
			<Paper className={styles.container}>
				<Tabs className={styles.tabs} value={tabName} onChange={onChangeTab} aria-label="simple tabs example">
					<Tab value="" label="Постоянные" id="regular-members" />
					<Tab value="guests" label="Гостевые" id="guest-members" />
				</Tabs>
				{currentMembersCount ? (
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
								refFilterNameInput={this.refFilterNameInput}
								dropdownRole={{
									state: dropdownRole,
									ref: this.refDropdownRole,
								}}
								formikProps={props}
							/>
						)}
					</Formik>
				) : null}
			</Paper>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getMembers: query => dispatch(getMembers({ query })),
	};
};

export default connect(null, mapDispatchToProps)(Filter);
