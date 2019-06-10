import React, { Component } from 'react';
import { connect } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import CircularProgress from '@material-ui/core/CircularProgress';

import { SERVER_URL, CLIENT_URL } from 'src/api/constants';

import CardPaper from 'src/components/CardPaper';

import { editUser } from 'src/actions/user';

import './SocialNetworkAccounts.styl';

class SocialNetworkAccounts extends Component {
	state = {
		unbindVkAccountLoading: false,
	};

	unbindVkAccount = () => {
		this.setState({ unbindVkAccountLoading: true });

		setTimeout(() => {
			this.props.editUser({ 'vkProvider.userId': null }).then(response => {
				if (response.status === 'status') {
					this.setState({ unbindVkAccountLoading: false });
				}
			});
		}, 500);
	};

	render() {
		const { user } = this.props;
		const { unbindVkAccountLoading } = this.state;

		return (
			<CardPaper elevation={1} leftContent="Вход через социальные сети" title>
				<div className="us-social-network-accounts__item">
					<div className="us-social-network-accounts__icon us-social-network-accounts__icon_vk">
						<FontAwesomeIcon icon={['fab', 'vk']} />
					</div>
					<div className="us-social-network-accounts__name">ВКонтакте</div>
					<div className="us-social-network-accounts__actions">
						{user.vkProvider.userId && unbindVkAccountLoading ? <CircularProgress size={15} style={{ marginRight: 10 }} /> : null}
						{user.vkProvider.userId ? (
							user.email ? (
								<ButtonBase className="button-link-500" component="span" disableRipple onClick={this.unbindVkAccount}>
									Отвязать
								</ButtonBase>
							) : null
						) : (
							<Button href={`${SERVER_URL}/auth/vk?r=${CLIENT_URL}/settings`} variant="contained" color="primary">
								Привязать
							</Button>
						)}
					</div>
				</div>
			</CardPaper>
		);
	}
}

const mapStateToProps = state => {
	return {
		user: state.user.data,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		editUser: (values, actions) => dispatch(editUser(values, actions)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SocialNetworkAccounts);
