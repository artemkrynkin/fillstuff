import React, { Component } from 'react';
import { connect } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';

import CardPaper from 'src/components/CardPaper';

import { changeChannelOption } from 'src/actions/user';

import './NotificationPreferences.styl';

class NotificationPreferences extends Component {
	state = {
		...this.props.notifications,
	};

	onToggleSettingsParameter = parameter => {
		this.setState({ [parameter]: !this.state[parameter] }, () => {
			this.props.changeChannelOption({
				parameter: parameter,
				enabled: this.state[parameter],
			});
		});
	};

	onToggleChannelOption = (channel, option) => {
		this.setState(
			prevState => ({
				[channel]: {
					...prevState[channel],
					[option]: !prevState[channel][option],
				},
			}),
			() => {
				this.props.changeChannelOption({
					channel: channel,
					option: option,
					enabled: this.state[channel][option],
				});
			}
		);
	};

	render() {
		const { emailNotifications, browserNotifications, email, webapp } = this.state;

		return (
			<Grid className="user-settings__container" item xs={12} lg={5}>
				<CardPaper elevation={1} leftContent="Настройки оповещений" rightContent="" title>
					<Grid
						onClick={() => this.onToggleSettingsParameter('emailNotifications')}
						className="us-notification-preferences__row-button"
						container
						style={{ marginTop: -20 }}
					>
						<Typography variant="body2">Включить оповещения по Email</Typography>
						<div style={{ margin: '0 -15px 0 auto' }}>
							<Switch checked={emailNotifications} value="emailNotifications" color="primary" disableRipple />
						</div>
					</Grid>
					<Grid
						onClick={() => this.onToggleSettingsParameter('browserNotifications')}
						className="us-notification-preferences__row-button"
						container
						style={{ marginBottom: -20 }}
					>
						<Typography variant="body2">Включить оповещения в браузере</Typography>
						<div style={{ margin: '0 -15px 0 auto' }}>
							<Switch checked={browserNotifications} value="browserNotifications" color="primary" disableRipple />
						</div>
					</Grid>
				</CardPaper>

				<CardPaper elevation={1} leftContent="Оповещения на сайте" rightContent="" title style={{ marginTop: 16 }}>
					<Grid
						onClick={() => this.onToggleChannelOption('webapp', 'publishingErrors')}
						className="us-notification-preferences__row-button"
						container
						style={{ marginTop: -20 }}
					>
						<Typography variant="body2">Ошибки публикации постов и историй</Typography>
						<div style={{ margin: '0 -15px 0 auto' }}>
							<Switch checked={webapp.publishingErrors} value="webapp.publishingErrors" color="primary" disableRipple />
						</div>
					</Grid>
					<Grid
						onClick={() => this.onToggleChannelOption('webapp', 'updateCommentsInDrafts')}
						className="us-notification-preferences__row-button"
						container
					>
						<Typography variant="body2">Новые комментарии к черновикам</Typography>
						<div style={{ margin: '0 -15px 0 auto' }}>
							<Switch
								checked={webapp.updateCommentsInDrafts}
								value="webapp.updateCommentsInDrafts"
								color="primary"
								disableRipple
							/>
						</div>
					</Grid>
					<Grid
						onClick={() => this.onToggleChannelOption('webapp', 'changesInScheduledPublications')}
						className="us-notification-preferences__row-button"
						container
					>
						<Typography variant="body2">Изменения в запланированных публикациях</Typography>
						<div style={{ margin: '0 -15px 0 auto' }}>
							<Switch
								checked={webapp.changesInScheduledPublications}
								value="webapp.changesInScheduledPublications"
								color="primary"
								disableRipple
							/>
						</div>
					</Grid>
					<Grid
						onClick={() => this.onToggleChannelOption('webapp', 'changesInContentPlan')}
						className="us-notification-preferences__row-button"
						container
						style={{ marginBottom: -20 }}
					>
						<Typography variant="body2">Изменения в контент-плане</Typography>
						<div style={{ margin: '0 -15px 0 auto' }}>
							<Switch checked={webapp.changesInContentPlan} value="webapp.changesInContentPlan" color="primary" disableRipple />
						</div>
					</Grid>
				</CardPaper>

				{emailNotifications ? (
					<CardPaper elevation={1} leftContent="Оповещения по Email" rightContent="" title style={{ marginTop: 16 }}>
						<Grid
							onClick={() => this.onToggleChannelOption('email', 'publishingErrors')}
							className="us-notification-preferences__row-button"
							container
							style={{ marginTop: -20 }}
						>
							<Typography variant="body2">Ошибки публикации постов и историй</Typography>
							<div style={{ margin: '0 -15px 0 auto' }}>
								<Switch checked={email.publishingErrors} value="email.publishingErrors" color="primary" disableRipple />
							</div>
						</Grid>
						<Grid
							onClick={() => this.onToggleChannelOption('email', 'invitationProject')}
							className="us-notification-preferences__row-button"
							container
						>
							<Typography variant="body2">Приглашение в проект</Typography>
							<div style={{ margin: '0 -15px 0 auto' }}>
								<Switch checked={email.invitationProject} value="email.invitationProject" color="primary" disableRipple />
							</div>
						</Grid>
						<Grid
							onClick={() => this.onToggleChannelOption('email', 'updateApp')}
							className="us-notification-preferences__row-button"
							container
						>
							<Typography variant="body2">Обновления сервиса</Typography>
							<div style={{ margin: '0 -15px 0 auto' }}>
								<Switch checked={email.updateApp} value="email.updateApp" color="primary" disableRipple />
							</div>
						</Grid>
						<Grid
							onClick={() => this.onToggleChannelOption('email', 'personalOffers')}
							className="us-notification-preferences__row-button"
							container
							style={{ marginBottom: -20 }}
						>
							<Typography variant="body2">Персональные предложения</Typography>
							<div style={{ margin: '0 -15px 0 auto' }}>
								<Switch checked={email.personalOffers} value="email.personalOffers" color="primary" disableRipple />
							</div>
						</Grid>
					</CardPaper>
				) : null}
			</Grid>
		);
	}
}

const mapStateToProps = state => {
	return {
		notifications: state.user.data.notifications,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		changeChannelOption: values => dispatch(changeChannelOption(values)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(NotificationPreferences);
