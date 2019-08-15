import React, { Component } from 'react';
import ClassNames from 'classnames';
import Loadable from 'react-loadable';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

import { memberRoleTransform, findMemberInStock, checkPermissions } from 'shared/roles-access-rights';

import CardPaper from 'src/components/CardPaper';
import Popover from 'src/components/Popover';

import './team.styl';

const MemberInvitationOrLogin = Loadable({
	loader: () => import('src/containers/Dialogs/MemberInvitationOrLogin' /* webpackChunkName: "Dialog_MemberInvitationOrLogin" */),
	loading: () => null,
	delay: 200,
});

const DialogMemberEdit = Loadable({
	loader: () => import('src/containers/Dialogs/MemberEdit' /* webpackChunkName: "Dialog_MemberEdit" */),
	loading: () => null,
	delay: 200,
});

const DialogMemberDelete = Loadable({
	loader: () => import('src/containers/Dialogs/MemberDelete' /* webpackChunkName: "Dialog_MemberDelete" */),
	loading: () => null,
	delay: 200,
});

class Team extends Component {
	state = {
		memberActionsMenuOpen: null,
		selectedMember: null,
		dialogMemberInvitationOrLogin: false,
		dialogMemberEdit: false,
		dialogMemberDelete: false,
	};

	onOpenMemberActionsMenu = (event, member) =>
		this.setState({
			memberActionsMenuOpen: event.currentTarget,
			selectedMember: member,
		});

	onCloseMemberActionsMenu = saveMember => {
		if (!saveMember) {
			this.setState({
				memberActionsMenuOpen: null,
				selectedMember: null,
			});
		} else {
			this.setState({ memberActionsMenuOpen: null });
		}
	};

	onOpenDialogMemberInvitationOrLogin = () => this.setState({ dialogMemberInvitationOrLogin: true });

	onCloseDialogMemberInvitationOrLogin = () => this.setState({ dialogMemberInvitationOrLogin: false });

	onExitedDialogMemberInvitationOrLogin = () => this.setState({ selectedMember: null });

	onOpenDialogMemberEdit = () => this.setState({ dialogMemberEdit: true });

	onCloseDialogMemberEdit = () => this.setState({ dialogMemberEdit: false });

	onExitedDialogMemberEdit = () => this.setState({ selectedMember: null });

	onOpenDialogMemberDelete = () => this.setState({ dialogMemberDelete: true });

	onCloseDialogMemberDelete = () => this.setState({ dialogMemberDelete: false });

	onExitedDialogMemberDelete = () => this.setState({ selectedMember: null });

	render() {
		const {
			currentUser,
			currentStock,
			currentUserRole = findMemberInStock(currentUser._id, currentStock).role,
			members = currentStock.members
				.map(member => {
					return {
						...member,
						roleBitMask: memberRoleTransform(member.role, true),
					};
				})
				.sort((memberA, memberB) => (memberA.roleBitMask > memberB.roleBitMask ? -1 : 1)),
		} = this.props;

		const { memberActionsMenuOpen, selectedMember, dialogMemberEdit, dialogMemberDelete, dialogMemberInvitationOrLogin } = this.state;

		let photoImgClasses = (member, dialog) => {
			return ClassNames({
				'ps-team__member-photo': !dialog,
				'ps-team__member-photo_null': !dialog ? member.isWaiting || !member.user.profilePhoto : false,
				'ps-team-dialog__member-photo': dialog,
				'ps-team-dialog__member-photo_null': dialog ? member.isWaiting || !member.user.profilePhoto : false,
			});
		};

		if (!checkPermissions(currentUserRole, ['stock.control'])) return null;
		else
			return (
				<CardPaper
					elevation={1}
					leftContent="Команда"
					title
					rightContent={
						<Button variant="outlined" color="primary" onClick={this.onOpenDialogMemberInvitationOrLogin}>
							Пригласить участника
						</Button>
					}
					style={{ marginBottom: 16 }}
				>
					<div className="ps-team__list">
						{members.map(member =>
							!member.isWaiting ? (
								<div className="ps-team__member-item" key={member._id}>
									<div className={photoImgClasses(member)}>
										{member.user.profilePhoto ? (
											<img src={member.user.profilePhoto} alt="" />
										) : (
											<FontAwesomeIcon icon={['fas', 'user-alt']} />
										)}
									</div>
									<div className="ps-team__member-details">
										<div className="ps-team__member-title">
											{member.user.name ? member.user.name : member.user.email}
											<div className="ps-team__member-role">{memberRoleTransform(member.role)}</div>
										</div>
										{member.user.name && member.user.email ? <div className="ps-team__member-subtitle">{member.user.email}</div> : null}
									</div>
									{member.role !== 'owner' || (member.role === 'owner' && checkPermissions(currentUserRole, ['stock.full_control'])) ? (
										<IconButton
											className="ps-team__member-actions"
											aria-haspopup="true"
											onClick={event => this.onOpenMemberActionsMenu(event, member)}
										>
											<FontAwesomeIcon icon={['far', 'ellipsis-h']} />
										</IconButton>
									) : null}
								</div>
							) : null
						)}
					</div>

					{selectedMember ? (
						<Popover anchorEl={memberActionsMenuOpen} open={Boolean(memberActionsMenuOpen)} onClose={this.onCloseMemberActionsMenu}>
							<MenuList>
								<MenuItem
									onClick={() => {
										this.onOpenDialogMemberInvitationOrLogin();
										this.onCloseMemberActionsMenu(true);
									}}
								>
									QR-код для входа
								</MenuItem>
								{selectedMember.user._id !== currentUser._id ? (
									<MenuItem
										onClick={() => {
											this.onOpenDialogMemberEdit();
											this.onCloseMemberActionsMenu(true);
										}}
									>
										Редактировать
									</MenuItem>
								) : null}
								<MenuItem
									onClick={() => {
										this.onOpenDialogMemberDelete();
										this.onCloseMemberActionsMenu(true);
									}}
								>
									{selectedMember.user._id !== currentUser._id ? 'Удалить из команды' : 'Выйти из команды'}
								</MenuItem>
							</MenuList>
						</Popover>
					) : null}

					<MemberInvitationOrLogin
						dialogOpen={dialogMemberInvitationOrLogin}
						onCloseDialog={this.onCloseDialogMemberInvitationOrLogin}
						onExitedDialog={this.onExitedDialogMemberInvitationOrLogin}
						currentStock={currentStock}
						selectedMember={selectedMember}
					/>

					<DialogMemberEdit
						dialogOpen={dialogMemberEdit}
						onCloseDialog={this.onCloseDialogMemberEdit}
						onExitedDialog={this.onExitedDialogMemberEdit}
						currentStock={currentStock}
						selectedMember={selectedMember}
						currentUserRole={currentUserRole}
					/>

					<DialogMemberDelete
						dialogOpen={dialogMemberDelete}
						onCloseDialog={this.onCloseDialogMemberDelete}
						onExitedDialog={this.onExitedDialogMemberDelete}
						currentStock={currentStock}
						selectedMember={selectedMember}
					/>
				</CardPaper>
			);
	}
}

export default Team;
