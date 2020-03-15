import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Formik } from 'formik';

import { DialogSticky, DialogTitle } from 'src/components/Dialog';

import { createPositionGroup, editPositionGroup, addPositionInGroup } from 'src/actions/positionGroups';

import FormPositionGroupCreateEditAdd from './FormPositionGroupCreateEditAdd';
import positionGroupSchema from './positionGroupSchema';

class DialogPositionGroupCreateEditAdd extends Component {
	static propTypes = {
		type: PropTypes.oneOf(['create', 'edit', 'add']).isRequired,
		dialogOpen: PropTypes.bool.isRequired,
		onCloseDialog: PropTypes.func.isRequired,
		onExitedDialog: PropTypes.func,
		selectedPositionGroup: PropTypes.object,
	};

	onSubmit = (values, actions) => {
		const { type, onCloseDialog, positionGroup = positionGroupSchema(type, true).cast(values) } = this.props;

		switch (type) {
			case 'add':
				return this.props.addPositionInGroup(positionGroup._id, positionGroup).then(response => {
					if (response.status === 'success') {
						actions.setSubmitting(false);
						onCloseDialog();
					}
				});
			case 'edit':
				return this.props.editPositionGroup(positionGroup._id, positionGroup).then(response => {
					if (response.status === 'success') {
						actions.setSubmitting(false);
						onCloseDialog();
					}
				});
			case 'create':
			default:
				return this.props.createPositionGroup(positionGroup).then(response => {
					if (response.status === 'success') {
						actions.setSubmitting(false);
						onCloseDialog();
					}
				});
		}
	};

	onExitedDialog = () => {
		const { onExitedDialog } = this.props;

		if (onExitedDialog) onExitedDialog();
	};

	render() {
		const { type, dialogOpen, onCloseDialog, positions, selectedPositionGroup } = this.props;

		if (/edit|add/.test(type) && !selectedPositionGroup) return null;

		let initialValues = {
			name: '',
			positions: [],
		};

		if (/edit|add/.test(type)) initialValues = { ...initialValues, ...selectedPositionGroup };
		if (type === 'add') initialValues.positions = [];

		return (
			<DialogSticky open={dialogOpen} onClose={onCloseDialog} onExited={this.onExitedDialog} maxWidth="md" scroll="body" stickyActions>
				<DialogTitle onClose={onCloseDialog}>
					{type === 'create' ? 'Создание группы' : type === 'edit' ? 'Редактирование группы' : 'Добавление позиций в группу'}
				</DialogTitle>
				<Formik
					initialValues={initialValues}
					validationSchema={() => positionGroupSchema(type)}
					validateOnBlur={false}
					validateOnChange={false}
					onSubmit={(values, actions) => this.onSubmit(values, actions)}
				>
					{props => <FormPositionGroupCreateEditAdd onCloseDialog={onCloseDialog} type={type} positions={positions} formikProps={props} />}
				</Formik>
			</DialogSticky>
		);
	}
}

const mapStateToProps = state => {
	const positions = { ...state.positions };

	if (positions.data && positions.data.length > 0) {
		positions.data = positions.data.filter(position => !position.isArchived);
	}

	return {
		positions: positions,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		createPositionGroup: data => dispatch(createPositionGroup({ data })),
		editPositionGroup: (positionGroupId, data) => dispatch(editPositionGroup({ params: { positionGroupId }, data })),
		addPositionInGroup: (positionGroupId, data) => dispatch(addPositionInGroup({ params: { positionGroupId }, data })),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DialogPositionGroupCreateEditAdd);
