import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Formik } from 'formik';

import { declensionNumber } from 'src/helpers/utils';

import { DialogSticky, DialogTitle } from 'src/components/Dialog';

import { createPositionGroup, editPositionGroup, addPositionInGroup } from 'src/actions/positionGroups';
import { enqueueSnackbar } from 'src/actions/snackbars';

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
		const { type, onCloseDialog, positionGroup = positionGroupSchema(type, true).cast(values), selectedPositionGroup } = this.props;

		let positionNumbersOld = 0;

		if (type === 'add') {
			positionNumbersOld = selectedPositionGroup.positions.length;
		}

		const callback = response => {
			actions.setSubmitting(false);

			if (response.status === 'success') {
				onCloseDialog();

				if (type === 'add') {
					const numbersPosition = positionNumbersOld - selectedPositionGroup.positions.length;

					this.props.enqueueSnackbar({
						message: (
							<div>
								В группу <b>{positionGroup.name}</b> {declensionNumber(Math.abs(numbersPosition), ['добавлена', 'добавлено', 'добавлено'])}{' '}
								{declensionNumber(Math.abs(numbersPosition), ['позиция', 'позиции', 'позиций'], true)}.
							</div>
						),
						options: {
							variant: 'success',
						},
					});
				}

				if (type === 'create') {
					this.props.enqueueSnackbar({
						message: (
							<div>
								Группа <b>{positionGroup.name}</b> успешно создана.
							</div>
						),
						options: {
							variant: 'success',
						},
					});
				}
			}

			if (response.status === 'error') {
				this.props.enqueueSnackbar({
					message: response.message || 'Неизвестная ошибка.',
					options: {
						variant: 'error',
					},
				});
			}
		};

		switch (type) {
			case 'add':
				return this.props.addPositionInGroup(positionGroup._id, positionGroup).then(callback);
			case 'edit':
				return this.props.editPositionGroup(positionGroup._id, positionGroup).then(callback);
			case 'create':
			default:
				return this.props.createPositionGroup(positionGroup).then(callback);
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
			<DialogSticky open={dialogOpen} onClose={onCloseDialog} onExited={this.onExitedDialog} scroll="body" stickyActions>
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
		enqueueSnackbar: (...args) => dispatch(enqueueSnackbar(...args)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DialogPositionGroupCreateEditAdd);
