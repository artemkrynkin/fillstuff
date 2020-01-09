import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { DialogSticky, DialogTitle } from 'src/components/Dialog';

import { editMember } from 'src/actions/stocks';

import FormMemberEdit from './FormMemberEdit';

const memberInvitationOrEditSchema = Yup.object().shape({
	user: Yup.object().shape({
		name: Yup.string()
			.min(2)
			.required(),
		email: Yup.string()
			.nullable(true)
			.transform(value => (value === null ? '' : value))
			.email()
			.required(),
	}),
	role: Yup.string()
		.oneOf(['owner', 'admin', 'user'])
		.required(),
});

const MemberEdit = props => {
	const { dialogOpen, onCloseDialog, onExitedDialog, selectedMember, currentUserRole } = props;

	if (!selectedMember) return null;
	else
		return (
			<DialogSticky open={dialogOpen} onClose={onCloseDialog} onExited={onExitedDialog} maxWidth="md" scroll="body" stickyActions>
				<DialogTitle onClose={onCloseDialog}>Изменение роли участника</DialogTitle>
				<Formik
					initialValues={selectedMember}
					validationSchema={memberInvitationOrEditSchema}
					validateOnBlur={false}
					validateOnChange={false}
					onSubmit={(values, actions) => {
						props.editMember(selectedMember._id, values).then(response => {
							if (response.status === 'success') onCloseDialog();
							else actions.setSubmitting(false);
						});
					}}
				>
					{props => (
						<FormMemberEdit
							onCloseDialog={onCloseDialog}
							selectedMember={selectedMember}
							currentUserRole={currentUserRole}
							formikProps={props}
						/>
					)}
				</Formik>
			</DialogSticky>
		);
};

MemberEdit.propTypes = {
	dialogOpen: PropTypes.bool.isRequired,
	onCloseDialog: PropTypes.func.isRequired,
	onExitedDialog: PropTypes.func,
	currentStock: PropTypes.object.isRequired,
	selectedMember: PropTypes.object,
};

const mapStateToProps = state => {
	return {
		currentUser: state.user.data,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentStock } = ownProps;

	return {
		editMember: (memberId, values) => dispatch(editMember(currentStock._id, memberId, values)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(MemberEdit);
