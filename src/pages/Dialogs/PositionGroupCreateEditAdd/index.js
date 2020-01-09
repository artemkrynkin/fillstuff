import React, { Component, createRef } from 'react';
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
		currentStockId: PropTypes.string.isRequired,
		selectedPositionGroup: PropTypes.object,
	};

	initialState = {
		searchString: '',
	};

	state = this.initialState;

	searchInputRef = createRef();

	onTypeSearch = ({ target: { value } }) => this.setState({ searchString: value });

	onClearSearch = () => {
		this.setState({ searchString: '' });

		this.searchInputRef.current.focus();
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

		this.setState(this.initialState, () => {
			if (onExitedDialog) onExitedDialog();
		});
	};

	render() {
		const { type, dialogOpen, onCloseDialog, positions, selectedPositionGroup } = this.props;
		const { searchString } = this.state;

		if ((type === 'edit' || type === 'add') && !selectedPositionGroup) return null;

		let initialValues =
			type === 'create'
				? {
						name: '',
						dividedPositions: true,
						minimumBalance: '',
						positions: [],
				  }
				: type === 'edit'
				? {
						minimumBalance: '',
						...selectedPositionGroup,
				  }
				: {
						minimumBalance: '',
						...selectedPositionGroup,
						positions: [],
				  };

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
					{props => (
						<FormPositionGroupCreateEditAdd
							onCloseDialog={onCloseDialog}
							onTypeSearch={this.onTypeSearch}
							onClearSearch={this.onClearSearch}
							type={type}
							positions={positions}
							searchField={{
								searchString: searchString,
								searchInputRef: this.searchInputRef,
							}}
							formikProps={props}
						/>
					)}
				</Formik>
			</DialogSticky>
		);
	}
}

const mapStateToProps = state => {
	return {
		positions: state.positions,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentStockId } = ownProps;

	return {
		createPositionGroup: positionGroup => dispatch(createPositionGroup(currentStockId, positionGroup)),
		editPositionGroup: (positionGroupId, newValues) => dispatch(editPositionGroup(positionGroupId, newValues)),
		addPositionInGroup: (positionGroupId, newValues) => dispatch(addPositionInGroup(positionGroupId, newValues)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DialogPositionGroupCreateEditAdd);
