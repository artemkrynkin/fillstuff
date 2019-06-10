import React, { Component } from 'react';
import { connect } from 'react-redux';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase/ButtonBase';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import { checkPermissions, findMemberInProject } from 'shared/roles-access-rights';

import { SERVER_URL } from 'src/api/constants';

import CardPaper from 'src/components/CardPaper';
import { PDDialogActions, PDDialogTitle } from 'src/components/Dialog';

import { updateSocialPage, disconnectSocialPage } from 'src/actions/projects';

import './socialPages.styl';

const ListSocialNetworks = props => {
	const { showTitle = false, currentProject } = props;

	return (
		<div className="ps-social-pages__authenticate-social">
			{showTitle ? (
				<Typography variant="h6" align="center" gutterBottom>
					Подключите аккаунт социальной сети
				</Typography>
			) : null}
			<div className="ps-social-pages__list-social-networks">
				<ButtonBase
					href={`${SERVER_URL}/auth-social/vk?projectId=${currentProject._id}`}
					className="ps-social-pages__social-network-item ps-social-pages__social-network-item_vk"
				>
					<FontAwesomeIcon icon={['fab', 'vk']} />
				</ButtonBase>
			</div>
		</div>
	);
};

class SocialPages extends Component {
	state = {
		selectedSocialPage: null,
		dialogConnectSocialNetwork: false,
		dialogDisconnectSocialPage: false,
		synchronizedLoader: false,
	};

	onOpenDialogConnectSocialNetwork = () =>
		this.setState({
			dialogConnectSocialNetwork: true,
		});

	onCloseDialogConnectSocialNetwork = () =>
		this.setState({
			dialogConnectSocialNetwork: false,
		});

	onOpenDialogDisconnectSocialPage = socialPage =>
		this.setState({
			selectedSocialPage: socialPage,
			dialogDisconnectSocialPage: true,
		});

	onCloseDialogDisconnectSocialPage = () =>
		this.setState({
			dialogDisconnectSocialPage: false,
		});

	onExitedDialogDisconnectSocialPage = () =>
		this.setState({
			selectedSocialPage: null,
		});

	onSyncSocialPageData = socialPage => {
		if (!socialPage.updated && !this.state.synchronizedLoader) {
			this.setState({
				selectedSocialPage: socialPage,
				synchronizedLoader: true,
			});

			this.props
				.updateSocialPage(socialPage.pageId)
				.then(() =>
					this.setState({
						selectedSocialPage: null,
						synchronizedLoader: false,
					})
				)
				.catch(() =>
					this.setState({
						selectedSocialPage: null,
						synchronizedLoader: false,
					})
				);
		}
	};

	render() {
		const {
			currentUser,
			currentProject,
			currentUserRole = findMemberInProject(currentUser._id, currentProject).role,
			socialPages = currentProject.socialPages,
		} = this.props;
		const { selectedSocialPage, dialogConnectSocialNetwork, dialogDisconnectSocialPage, synchronizedLoader } = this.state;

		let socialPageActionSync = socialPage => {
			return ClassNames({
				'ps-social-pages__page-action-sync': true,
				'ps-social-pages__page-action-sync_synchronized fa-spin':
					synchronizedLoader && selectedSocialPage.pageId === socialPage.pageId && !socialPage.updated,
				'ps-social-pages__page-action-sync_synced': socialPage.updated,
			});
		};

		return (
			<CardPaper
				elevation={1}
				leftContent="Страницы социальных сетей"
				title
				rightContent={
					socialPages.length && checkPermissions(currentUserRole, ['project.control']) ? (
						<Button variant="outlined" color="primary" onClick={() => this.onOpenDialogConnectSocialNetwork()}>
							Подключить страницу
						</Button>
					) : null
				}
			>
				{socialPages.length ? (
					<div className="ps-social-pages__list">
						{socialPages.map((socialPage, index) => (
							<div className="ps-social-pages__page-item" key={index}>
								<a className="ps-social-pages__page-social" href={socialPage.url} target="_blank" rel="noreferrer noopener">
									<div className="ps-social-pages__social-network ps-social-pages__social-network_vk">
										<FontAwesomeIcon icon={['fab', 'vk']} />
									</div>
									<div className="ps-social-pages__page-social-photo">
										<img src={socialPage.photo} alt="" />
									</div>
								</a>
								<div className="ps-social-pages__page-details">
									<a className="ps-social-pages__page-title" href={socialPage.url} target="_blank" rel="noreferrer noopener">
										{socialPage.name}
									</a>
								</div>
								{checkPermissions(currentUserRole, ['project.control']) ? (
									<div className="ps-social-pages__page-actions">
										<Tooltip
											title={!socialPage.updated ? 'Обновить данные страницы' : 'Данные страницы обновлены'}
											placement="top"
											enterDelay={50}
											disableFocusListener
										>
											<IconButton
												className={socialPageActionSync(socialPage)}
												aria-haspopup="true"
												onClick={() => this.onSyncSocialPageData(socialPage)}
											>
												<div className="ps-social-pages__page-action-sync-icons">
													<FontAwesomeIcon icon={['far', 'check']} />
													<FontAwesomeIcon icon={['far', 'sync-alt']} />
												</div>
											</IconButton>
										</Tooltip>
										<Tooltip title="Удалить страницу" placement="top" enterDelay={50} disableFocusListener>
											<IconButton
												className="ps-social-pages__page-action-disconnect"
												aria-haspopup="true"
												onClick={() => this.onOpenDialogDisconnectSocialPage(socialPage)}
												disabled={synchronizedLoader}
											>
												<FontAwesomeIcon icon={['fal', 'times']} />
											</IconButton>
										</Tooltip>
									</div>
								) : null}
							</div>
						))}
					</div>
				) : checkPermissions(currentUserRole, ['project.control']) ? (
					<ListSocialNetworks currentProject={currentProject} showTitle={true} />
				) : (
					<Typography variant="caption" align="center">
						К проекту не подключено еще ни одной страницы.
					</Typography>
				)}

				<Dialog open={dialogConnectSocialNetwork} onClose={this.onCloseDialogConnectSocialNetwork} maxWidth="md" fullWidth>
					<PDDialogTitle theme="grey" onClose={this.onCloseDialogConnectSocialNetwork}>
						Подключение аккаунта социальной сети
					</PDDialogTitle>
					<DialogContent>
						<ListSocialNetworks currentProject={currentProject} />
					</DialogContent>
				</Dialog>

				<Dialog
					open={dialogDisconnectSocialPage}
					onClose={this.onCloseDialogDisconnectSocialPage}
					onExited={this.onExitedDialogDisconnectSocialPage}
					fullWidth
				>
					<PDDialogTitle theme="primary" onClose={this.onCloseDialogDisconnectSocialPage}>
						Отключение страницы
					</PDDialogTitle>
					<DialogContent>
						{selectedSocialPage ? (
							<Grid alignItems="flex-start" wrap="nowrap" container>
								<div className="ps-social-pages__page-social">
									<div className="ps-social-pages__social-network ps-social-pages__social-network_vk">
										<FontAwesomeIcon icon={['fab', 'vk']} />
									</div>
									<div className="ps-social-pages__page-social-photo">
										<img src={selectedSocialPage.photo} alt="" />
									</div>
								</div>
								<div className="ps-social-pages__page-details">
									<DialogContentText>
										Вы уверены, что хотите отключить страницу <b>{selectedSocialPage.name}</b> от проекта?
									</DialogContentText>
								</div>
							</Grid>
						) : null}
					</DialogContent>
					<PDDialogActions
						leftHandleProps={{
							handleProps: {
								onClick: this.onCloseDialogDisconnectSocialPage,
							},
							text: 'Закрыть',
						}}
						rightHandleProps={{
							handleProps: {
								onClick: () =>
									this.props.disconnectSocialPage(selectedSocialPage.pageId).then(() => this.onCloseDialogDisconnectSocialPage()),
							},
							text: 'Отключить',
						}}
					/>
				</Dialog>
			</CardPaper>
		);
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentProject } = ownProps;

	return {
		updateSocialPage: socialPageId => dispatch(updateSocialPage(currentProject._id, socialPageId)),
		disconnectSocialPage: socialPageId => dispatch(disconnectSocialPage(currentProject._id, socialPageId)),
	};
};

export default connect(
	null,
	mapDispatchToProps
)(SocialPages);
