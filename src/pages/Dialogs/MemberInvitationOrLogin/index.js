import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import QRCode from 'qrcode';

import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';

import { Dialog, DialogTitle } from 'src/components/Dialog';
import { LoadingComponent } from 'src/components/Loading';

import { invitationMember } from 'src/actions/members';

class MemberInvitationOrLogin extends Component {
	static propTypes = {
		dialogOpen: PropTypes.bool.isRequired,
		onCloseDialog: PropTypes.func.isRequired,
		onExitedDialog: PropTypes.func,
		currentStudio: PropTypes.object.isRequired,
		selectedMember: PropTypes.object,
	};

	initialState = {
		QRCode: null,
	};

	state = this.initialState;

	onEnterDialog = () => {
		const { currentStudio, selectedMember } = this.props;

		const QRCodeGenerate = memberData => {
			return QRCode.toDataURL(JSON.stringify(memberData), {
				margin: 0,
				width: 400,
			})
				.then(url => this.setState({ QRCode: url }))
				.catch(err => console.error(err));
		};

		if (!selectedMember) {
			this.props.invitationMember().then(response => {
				const member = response.data;

				QRCodeGenerate({
					type: 'invitation-member',
					studioId: member.studio,
					memberId: member._id,
					roles: member.roles,
				});
			});
		} else {
			QRCodeGenerate({
				type: 'login',
				userId: selectedMember.user._id,
				studioId: currentStudio._id,
				memberId: selectedMember._id,
				roles: selectedMember.roles,
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
		const { dialogOpen, onCloseDialog } = this.props;
		const { QRCode } = this.state;

		return (
			<Dialog open={dialogOpen} onEnter={this.onEnterDialog} onClose={onCloseDialog} onExited={this.onExitedDialog} maxWidth="md">
				<DialogTitle onClose={onCloseDialog}>QR-код для входа</DialogTitle>
				<DialogContent>
					{QRCode ? (
						<div style={{ textAlign: 'center' }}>
							<img src={QRCode} alt="" />
						</div>
					) : (
						<Grid
							children={<LoadingComponent />}
							style={{
								height: 402,
								margin: 'auto',
								width: 400,
							}}
							alignItems="center"
							container
						/>
					)}
				</DialogContent>
			</Dialog>
		);
	}
}

const mapStateToProps = state => {
	return {};
};

const mapDispatchToProps = dispatch => {
	return {
		invitationMember: () => dispatch(invitationMember()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(MemberInvitationOrLogin);
