import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Grid from '@material-ui/core/Grid';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import { Dialog, DialogTitle, DialogActions } from 'src/components/Dialog';

import { deleteMember } from 'src/actions/studio';

import styles from './index.module.css';

class MemberDelete extends Component {
	static propTypes = {
		dialogOpen: PropTypes.bool.isRequired,
		onCloseDialog: PropTypes.func.isRequired,
		onExitedDialog: PropTypes.func,
		currentStudio: PropTypes.object.isRequired,
		selectedMember: PropTypes.object,
	};

	render() {
		const { dialogOpen, onCloseDialog, onExitedDialog, currentUser, selectedMember } = this.props;

		let photoImgClasses = (member, dialog) => {
			return ClassNames({
				[styles.photo]: dialog,
				[styles.photoEmpty]: dialog ? member.isWaiting || !member.user.avatar : false,
			});
		};

		if (!selectedMember) return null;
		else
			return (
				<Dialog open={dialogOpen} onClose={onCloseDialog} onExited={onExitedDialog}>
					<DialogTitle onClose={onCloseDialog}>
						{selectedMember.user._id !== currentUser._id ? 'Удаление участника' : 'Выход из команды'}
					</DialogTitle>
					<DialogContent>
						<Grid alignItems="flex-start" wrap="nowrap" container>
							<div className={photoImgClasses(selectedMember, true)}>
								{selectedMember.user.avatar ? (
									<img src={selectedMember.user.avatar} alt="" />
								) : (
									<FontAwesomeIcon icon={['fas', 'user-alt']} />
								)}
							</div>
							<div className={styles.details}>
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
					<DialogActions
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
	const { currentUser, currentStudio } = ownProps;

	return {
		deleteMember: member => dispatch(deleteMember(currentStudio._id, member._id, member.user._id, currentUser._id)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(MemberDelete);
