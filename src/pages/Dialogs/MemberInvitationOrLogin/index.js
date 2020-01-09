import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import QRCode from 'qrcode';

import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';

import { Dialog, DialogTitle } from 'src/components/Dialog';
import { memberInvitation } from 'src/actions/stocks';
import { LoadingComponent } from 'src/components/Loading';

class MemberEdit extends Component {
	static propTypes = {
		dialogOpen: PropTypes.bool.isRequired,
		onCloseDialog: PropTypes.func.isRequired,
		onExitedDialog: PropTypes.func,
		currentStock: PropTypes.object.isRequired,
		selectedMember: PropTypes.object,
	};

	state = {
		QRCode: null,
	};

	onEnterDialog = () => {
		const { currentStock, selectedMember } = this.props;

		const QRCodeGenerate = memberData => {
			return QRCode.toDataURL(JSON.stringify(memberData), {
				margin: 0,
				width: 400,
			})
				.then(url => this.setState({ QRCode: url }))
				.catch(err => console.error(err));
		};

		if (!selectedMember) {
			this.props.memberInvitation().then(response => {
				QRCodeGenerate({
					type: 'member-invitation',
					memberId: response.data._id,
				});
			});
		} else {
			QRCodeGenerate({
				type: 'login',
				userId: selectedMember.user._id,
				stockId: currentStock._id,
				role: selectedMember.role,
			});
		}
	};

	onExitedDialog = () => {
		const { onExitedDialog } = this.props;

		this.setState({ QRCode: null });

		onExitedDialog();
	};

	render() {
		const { dialogOpen, onCloseDialog } = this.props;
		const { QRCode } = this.state;

		return (
			<Dialog open={dialogOpen} onEnter={this.onEnterDialog} onClose={onCloseDialog} onExited={this.onExitedDialog} maxWidth="md">
				<DialogTitle onClose={this.onCloseDialog}>QR-код для входа</DialogTitle>
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
	return {
		currentUser: state.user.data,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentStock } = ownProps;

	return {
		memberInvitation: () => dispatch(memberInvitation(currentStock._id)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(MemberEdit);
