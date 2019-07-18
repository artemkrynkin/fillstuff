import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';

import { PDDialogActions, PDDialogTitle } from 'src/components/Dialog';

import { deleteMember } from 'src/actions/stocks';
import DialogContentText from '@material-ui/core/DialogContentText';
import Dialog from '@material-ui/core/Dialog';

import './index.styl';

class MemberDelete extends Component {
	static propTypes = {
		dialogOpen: PropTypes.bool.isRequired,
		onCloseDialog: PropTypes.func.isRequired,
		onExitedDialog: PropTypes.func,
		currentStock: PropTypes.object.isRequired,
		selectedMember: PropTypes.object,
	};

	render() {
		const { dialogOpen, onCloseDialog, onExitedDialog, currentUser, selectedMember } = this.props;

		let photoImgClasses = (member, dialog) => {
			return ClassNames({
				'D-member-delete__member-photo': dialog,
				'D-member-delete__member-photo_null': dialog ? member.isWaiting || !member.user.profilePhoto : false,
			});
		};

		if (!selectedMember) return null;
		else
			return (
				<Dialog open={dialogOpen} onClose={onCloseDialog} onExited={onExitedDialog} fullWidth>
					<PDDialogTitle theme="primary" onClose={onCloseDialog}>
						{selectedMember.user._id !== currentUser._id ? 'Удаление участника' : 'Выход из команды'}
					</PDDialogTitle>
					<DialogContent>
						<Grid alignItems="flex-start" wrap="nowrap" container>
							<div className={photoImgClasses(selectedMember, true)}>
								{selectedMember.user.profilePhoto ? (
									<img src={selectedMember.user.profilePhoto} alt="" />
								) : (
									<FontAwesomeIcon icon={['fas', 'user-alt']} />
								)}
							</div>
							<div className="D-member-delete__member-details">
								{selectedMember.user._id !== currentUser._id ? (
									<DialogContentText>
										Вы уверены, что хотите удалить участника <b>{selectedMember.user.email}</b> из команды?
									</DialogContentText>
								) : (
									<DialogContentText>Вы уверены, что хотите выйти из команды?</DialogContentText>
								)}
							</div>
						</Grid>
					</DialogContent>
					<PDDialogActions
						leftHandleProps={{
							handleProps: {
								onClick: onCloseDialog,
							},
							text: 'Закрыть',
						}}
						rightHandleProps={{
							handleProps: {
								onClick: () =>
									this.props.deleteMember(selectedMember).then(response => {
										if (!response) onCloseDialog();
									}),
							},
							text: selectedMember.user._id !== currentUser._id ? 'Удалить' : 'Выйти из команды',
						}}
					/>
				</Dialog>
			);
	}
}

const mapStateToProps = state => {
	return {
		currentUser: state.user.data,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentUser, currentStock } = ownProps;

	return {
		deleteMember: member => dispatch(deleteMember(currentStock._id, member._id, member.user._id, currentUser._id)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(MemberDelete);
