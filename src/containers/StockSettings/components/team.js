import React, { Component } from 'react';
import { connect } from 'react-redux';
import ClassNames from 'classnames';

import { Formik, Form, Field } from 'formik';
import { TextField, RadioGroup } from 'formik-material-ui';
import * as Yup from 'yup';
import QRCode from 'qrcode.react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Popover from '@material-ui/core/Popover';
import Radio from '@material-ui/core/Radio';
// import Typography from '@material-ui/core/Typography';

import { memberRoleTransform, checkPermissions, findMemberInStock } from 'shared/roles-access-rights';

import CardPaper from 'src/components/CardPaper';
import { PDDialog, PDDialogActions, PDDialogTitle } from 'src/components/Dialog';
import { LoadingComponent } from 'src/components/Loading';

import { memberInvitation, editMember, deleteMember } from 'src/actions/stocks';

import './team.styl';

const memberInvitationOrEditSchema = Yup.object().shape({
	role: Yup.string()
		.oneOf(['admin', 'user'], 'Значение отсутствует в списке доступных ролей')
		.required('Обязательное поле'),
	invitationEmail: Yup.string()
		.email('Некорректный Email')
		.required('Обязательное поле'),
});

class Team extends Component {
	state = {
		memberActionsMenuOpen: null,
		selectedMember: null,
		memberInvitationData: null,
		dialogMemberInvitationOrEditActionType: null,
		dialogMemberInvitationOrEdit: false,
		dialogDeleteMember: false,
		dialogQRCodeMember: false,
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

	onOpenDialogMemberInvitationOrEdit = actionType =>
		this.setState({
			dialogMemberInvitationOrEditActionType: actionType,
			dialogMemberInvitationOrEdit: true,
		});

	onCloseDialogMemberInvitationOrEdit = () =>
		this.setState({
			dialogMemberInvitationOrEdit: false,
		});

	onExitedDialogMemberInvitationOrEdit = () =>
		this.setState({
			selectedMember: null,
			dialogMemberInvitationOrEditActionType: null,
		});

	onOpenDialogDeleteMember = () => {
		this.setState({
			dialogDeleteMember: true,
		});
	};

	onCloseDialogDeleteMember = () =>
		this.setState({
			dialogDeleteMember: false,
		});

	onExitedDialogDeleteMember = () =>
		this.setState({
			selectedMember: null,
		});

	onOpenDialogQRCodeMember = actionType => {
		this.setState({
			dialogQRCodeMember: true,
		});

		if (actionType === 'invitation') {
			this.props.memberInvitation().then(response => {
				this.setState({
					memberInvitationData: response.data,
				});
			});
		}
	};

	onCloseDialogQRCodeMember = () =>
		this.setState({
			dialogQRCodeMember: false,
		});

	onExitedDialogQRCodeMember = () =>
		this.setState({
			selectedMember: null,
			memberInvitationData: null,
		});

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

		const {
			memberActionsMenuOpen,
			selectedMember,
			memberInvitationData,
			dialogMemberInvitationOrEditActionType,
			dialogMemberInvitationOrEdit,
			dialogDeleteMember,
			dialogQRCodeMember,
		} = this.state;

		let photoImgClasses = (member, dialog) => {
			return ClassNames({
				'ps-team__member-photo': !dialog,
				'ps-team__member-photo_null': !dialog ? member.isWaiting || !member.user.profilePhoto : false,
				'ps-team-dialog__member-photo': dialog,
				'ps-team-dialog__member-photo_null': dialog ? member.isWaiting || !member.user.profilePhoto : false,
			});
		};

		return (
			<CardPaper
				elevation={1}
				leftContent="Команда"
				title
				rightContent={
					checkPermissions(currentUserRole, ['stock.control']) ? (
						<Button variant="outlined" color="primary" onClick={() => this.onOpenDialogQRCodeMember('invitation')}>
							Пригласить участника
						</Button>
					) : null
				}
				style={{ marginBottom: 16 }}
			>
				<div className="ps-team__list">
					{members.map((member, index) =>
						!member.isWaiting ? (
							<div className="ps-team__member-item" key={index}>
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
									{member.isWaiting || (member.user.email && member.user.name) ? (
										<div className="ps-team__member-subtitle">
											{!member.isWaiting ? member.user.email : 'Приглашение отправлено'}
										</div>
									) : null}
								</div>
								{(member.user && member.user._id === currentUser._id) || checkPermissions(currentUserRole, ['stock.control']) ? (
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

				<Popover
					anchorEl={memberActionsMenuOpen}
					open={Boolean(memberActionsMenuOpen)}
					onClose={this.onCloseMemberActionsMenu}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'center',
					}}
					transformOrigin={{
						vertical: 'top',
						horizontal: 'center',
					}}
					transitionDuration={150}
					elevation={2}
				>
					<MenuList>
						<MenuItem
							onClick={() => {
								this.onOpenDialogQRCodeMember();
								this.onCloseMemberActionsMenu(true);
							}}
						>
							QR-код для входа
						</MenuItem>
						{selectedMember && (selectedMember.isWaiting || selectedMember.user._id !== currentUser._id) ? (
							<MenuItem
								onClick={() => {
									this.onOpenDialogMemberInvitationOrEdit('edit');
									this.onCloseMemberActionsMenu(true);
								}}
							>
								Изменить роль участника
							</MenuItem>
						) : null}
						<MenuItem
							onClick={() => {
								this.onOpenDialogDeleteMember();
								this.onCloseMemberActionsMenu(true);
							}}
						>
							{selectedMember
								? !selectedMember.isWaiting
									? selectedMember.user._id !== currentUser._id
										? 'Удалить из команды'
										: 'Выйти из команды'
									: 'Отменить приглашение'
								: null}
						</MenuItem>
					</MenuList>
				</Popover>

				<PDDialog
					open={dialogMemberInvitationOrEdit}
					onClose={this.onCloseDialogMemberInvitationOrEdit}
					onExited={this.onExitedDialogMemberInvitationOrEdit}
					fullWidth
					maxWidth="md"
					scroll="body"
					stickyActions
				>
					<PDDialogTitle theme="primary" onClose={this.onCloseDialogMemberInvitationOrEdit}>
						{dialogMemberInvitationOrEditActionType === 'invitation'
							? 'Приглашение участника команды'
							: 'Изменение роли участника'}
					</PDDialogTitle>
					<Formik
						initialValues={
							dialogMemberInvitationOrEditActionType === 'invitation'
								? {
										invitationEmail: '',
										invitationName: '',
										role: 'user',
								  }
								: {
										role: selectedMember ? selectedMember.role : '',
								  }
						}
						validationSchema={dialogMemberInvitationOrEditActionType === 'invitation' ? memberInvitationOrEditSchema : null}
						validateOnBlur={false}
						validateOnChange={false}
						onSubmit={(values, actions) => {
							switch (dialogMemberInvitationOrEditActionType) {
								case 'invitation':
									return this.props.memberInvitation(values).then(response => {
										if (response.status === 'success') this.onCloseDialogMemberInvitationOrEdit();
										else actions.setSubmitting(false);
									});
								case 'edit':
									return this.props.editMember(selectedMember._id, values).then(response => {
										if (response.status === 'success') this.onCloseDialogMemberInvitationOrEdit();
										else actions.setSubmitting(false);
									});
								default:
									return;
							}
						}}
						render={({ errors, isSubmitting, values }) => (
							<Form>
								<DialogContent>
									{dialogMemberInvitationOrEditActionType === 'invitation' ? (
										<Grid className="pd-rowGridFormLabelControl">
											<Field
												name="invitationEmail"
												label="Email"
												component={TextField}
												validate={value => {
													if (
														members &&
														members.some(
															member => (member.user && member.user.email === value) || member.invitationEmail === value
														)
													) {
														return 'Участник с таким email уже приглашен в склад';
													}
												}}
												InputLabelProps={{
													shrink: true,
												}}
												autoComplete="off"
												autoFocus
												fullWidth
											/>
										</Grid>
									) : (
										<Grid alignItems="center" wrap="nowrap" container>
											<div className={photoImgClasses(selectedMember, true)}>
												{!selectedMember.isWaiting && selectedMember.user.profilePhoto ? (
													<img src={selectedMember.user.profilePhoto} alt="" />
												) : (
													<FontAwesomeIcon icon={['fas', 'user-alt']} />
												)}
											</div>
											<div className="ps-team-dialog__member-details">
												<div className="ps-team-dialog__member-title">
													{!selectedMember.isWaiting
														? selectedMember.user.name
															? selectedMember.user.name
															: selectedMember.user.email
														: selectedMember.invitationEmail}
												</div>
												{selectedMember.isWaiting || (selectedMember.user.email && selectedMember.user.name) ? (
													<div className="ps-team-dialog__member-subtitle">
														{!selectedMember.isWaiting ? selectedMember.user.email : 'Приглашение отправлено'}
													</div>
												) : null}
											</div>
										</Grid>
									)}
									<Grid className="pd-rowGridFormLabelControl">
										<Field
											name="invitationName"
											label="Имя"
											component={TextField}
											InputLabelProps={{
												shrink: true,
											}}
											autoComplete="off"
											fullWidth
										/>
									</Grid>
									<Grid style={{ marginTop: 20 }}>
										<FormLabel>Роли</FormLabel>
										<Field name="role" component={RadioGroup}>
											<FormControlLabel
												className="pd-formControlLabelRadioTitleSubtitle"
												value="user"
												control={
													<Radio
														color="primary"
														disableRipple
														icon={<FontAwesomeIcon icon={['far', 'circle']} />}
														checkedIcon={<FontAwesomeIcon icon={['far', 'dot-circle']} />}
													/>
												}
												label={
													<div className="pd-formControlLabelRadioTitleSubtitle__label">
														<div className="pd-formControlLabelRadioTitleSubtitle__title">Сотрудник</div>
														{dialogMemberInvitationOrEditActionType === 'invitation' ||
														(dialogMemberInvitationOrEditActionType === 'edit' && values.role === 'user') ? (
															<div className="pd-formControlLabelRadioTitleSubtitle__subtitle">
																{/*<ul className="pd-listing">*/}
																{/*	<li><Typography variant="body2" color="inherit">Просмотр публикаций, событий в контент-плане и черновиков;</Typography></li>*/}
																{/*	<li><Typography variant="body2" color="inherit">Комментирование черновиков;</Typography></li>*/}
																{/*	<li><Typography variant="body2" color="inherit">Создание, редактирование и удаление публикаций;</Typography></li>*/}
																{/*	<li><Typography variant="body2" color="inherit">Создание, редактирование и удаление событий в контент-плане;</Typography></li>*/}
																{/*	<li><Typography variant="body2" color="inherit">Создание черновиков, редактирование и удаление всех черновиков;</Typography></li>*/}
																{/*</ul>*/}
															</div>
														) : null}
													</div>
												}
												disabled={isSubmitting}
											/>
											<FormControlLabel
												className="pd-formControlLabelRadioTitleSubtitle"
												value="admin"
												control={
													<Radio
														color="primary"
														disableRipple
														icon={<FontAwesomeIcon icon={['far', 'circle']} />}
														checkedIcon={<FontAwesomeIcon icon={['far', 'dot-circle']} />}
													/>
												}
												label={
													<div className="pd-formControlLabelRadioTitleSubtitle__label">
														<div className="pd-formControlLabelRadioTitleSubtitle__title">Администратор</div>
														{dialogMemberInvitationOrEditActionType === 'invitation' ||
														(dialogMemberInvitationOrEditActionType === 'edit' && values.role === 'admin') ? (
															<div className="pd-formControlLabelRadioTitleSubtitle__subtitle">
																{/*<ul className="pd-listing">*/}
																{/*	<li><Typography variant="body2" color="inherit">Управление страницами социальных сетей;</Typography></li>*/}
																{/*	<li><Typography variant="body2" color="inherit">Управление участниками команды;</Typography></li>*/}
																{/*	<li><Typography variant="body2" color="inherit">Просмотр публикаций, событий в контент-плане и черновиков;</Typography></li>*/}
																{/*	<li><Typography variant="body2" color="inherit">Комментирование черновиков;</Typography></li>*/}
																{/*	<li><Typography variant="body2" color="inherit">Создание, редактирование и удаление публикаций;</Typography></li>*/}
																{/*	<li><Typography variant="body2" color="inherit">Создание, редактирование и удаление событий в контент-плане;</Typography></li>*/}
																{/*	<li><Typography variant="body2" color="inherit">Создание черновиков, редактирование и удаление всех черновиков;</Typography></li>*/}
																{/*</ul>*/}
															</div>
														) : null}
													</div>
												}
												disabled={isSubmitting}
											/>
										</Field>
										{Boolean(errors.role) ? <FormHelperText error={true}>{errors.role}</FormHelperText> : null}
									</Grid>
								</DialogContent>
								<PDDialogActions
									leftHandleProps={{
										handleProps: {
											onClick: this.onCloseDialogMemberInvitationOrEdit,
										},
										text: 'Закрыть',
									}}
									rightHandleProps={{
										handleProps: {
											type: 'submit',
											disabled: isSubmitting,
										},
										text: isSubmitting ? (
											<CircularProgress size={20} />
										) : dialogMemberInvitationOrEditActionType === 'invitation' ? (
											'Пригласить'
										) : (
											'Изменить'
										),
									}}
								/>
							</Form>
						)}
					/>
				</PDDialog>

				<Dialog
					open={dialogDeleteMember}
					onClose={this.onCloseDialogDeleteMember}
					onExited={this.onExitedDialogDeleteMember}
					fullWidth
				>
					<PDDialogTitle theme="primary" onClose={this.onCloseDialogDeleteMember}>
						{selectedMember
							? !selectedMember.isWaiting
								? selectedMember.user._id !== currentUser._id
									? 'Удаление участника'
									: 'Выход из команды'
								: 'Отмена приглашения'
							: null}
					</PDDialogTitle>
					<DialogContent>
						{selectedMember ? (
							<Grid alignItems="flex-start" wrap="nowrap" container>
								<div className={photoImgClasses(selectedMember, true)}>
									{!selectedMember.isWaiting && selectedMember.user.profilePhoto ? (
										<img src={selectedMember.user.profilePhoto} alt="" />
									) : (
										<FontAwesomeIcon icon={['fas', 'user-alt']} />
									)}
								</div>
								<div className="ps-team-dialog__member-details">
									{selectedMember ? (
										!selectedMember.isWaiting ? (
											selectedMember.user._id !== currentUser._id ? (
												<DialogContentText>
													Вы уверены, что хотите удалить участника <b>{selectedMember.user.email}</b> из команды?
												</DialogContentText>
											) : (
												<DialogContentText>Вы уверены, что хотите выйти из команды?</DialogContentText>
											)
										) : (
											<DialogContentText>
												Вы уверены, что хотите отменить приглашение участника <b>{selectedMember.invitationEmail}</b> в команду?
											</DialogContentText>
										)
									) : null}
								</div>
							</Grid>
						) : null}
					</DialogContent>
					<PDDialogActions
						leftHandleProps={{
							handleProps: {
								onClick: this.onCloseDialogDeleteMember,
							},
							text: 'Закрыть',
						}}
						rightHandleProps={{
							handleProps: {
								onClick: () =>
									this.props.deleteMember(selectedMember).then(response => {
										if (!response) this.onCloseDialogDeleteMember();
									}),
							},
							text: selectedMember
								? !selectedMember.isWaiting
									? selectedMember.user._id !== currentUser._id
										? 'Удалить'
										: 'Выйти из команды'
									: 'Отменить приглашение'
								: null,
						}}
					/>
				</Dialog>

				<Dialog
					open={dialogQRCodeMember}
					onClose={this.onCloseDialogQRCodeMember}
					onExited={this.onExitedDialogQRCodeMember}
					maxWidth="md"
					fullWidth
				>
					<PDDialogTitle theme="primary" onClose={this.onCloseDialogQRCodeMember}>
						QR-код для входа
					</PDDialogTitle>
					<DialogContent>
						{selectedMember ? (
							<div style={{ textAlign: 'center' }}>
								<QRCode
									size={400}
									value={JSON.stringify({
										type: 'login',
										userId: selectedMember.user._id,
										stockId: currentStock._id,
										role: selectedMember.role,
									})}
								/>
							</div>
						) : !selectedMember && memberInvitationData ? (
							<div style={{ textAlign: 'center' }}>
								<QRCode
									size={400}
									value={JSON.stringify({
										type: 'member-invitation',
										memberId: memberInvitationData._id,
									})}
								/>
							</div>
						) : (
							<Grid
								children={<LoadingComponent />}
								style={{ height: 402, margin: 'auto', width: 400 }}
								alignItems="center"
								container
							/>
						)}
					</DialogContent>
				</Dialog>
			</CardPaper>
		);
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentUser, currentStock } = ownProps;

	return {
		memberInvitation: () => dispatch(memberInvitation(currentStock._id)),
		editMember: (memberId, values) => dispatch(editMember(currentStock._id, memberId, values)),
		deleteMember: member =>
			dispatch(deleteMember(currentStock._id, member._id, member.user ? member.user._id : null, currentUser._id)),
	};
};

export default connect(
	null,
	mapDispatchToProps
)(Team);
