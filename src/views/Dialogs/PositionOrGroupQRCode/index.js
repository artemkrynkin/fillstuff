import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { DialogSticky, DialogTitle } from 'src/components/Dialog';

import QrCodeForm from './containers/QrCodeForm';

class DialogPositionOrGroupQRCode extends Component {
	static propTypes = {
		dialogOpen: PropTypes.bool.isRequired,
		onCloseDialog: PropTypes.func.isRequired,
		type: PropTypes.oneOf(['positionGroup', 'position']),
		selectedPositionOrGroup: PropTypes.object,
	};

	onExitedDialog = () => {
		const { onExitedDialog } = this.props;

		if (onExitedDialog) onExitedDialog();
	};

	render() {
		const { dialogOpen, onCloseDialog, selectedPositionOrGroup } = this.props;

		if (!selectedPositionOrGroup) return null;

		return (
			<DialogSticky open={dialogOpen} onClose={onCloseDialog} onExited={this.onExitedDialog} maxWidth="xl" scroll="body" stickyActions>
				<DialogTitle onClose={onCloseDialog} theme="primary">
					Печать QR-кода
				</DialogTitle>
				<QrCodeForm {...this.props} />
			</DialogSticky>
		);
	}
}

export default DialogPositionOrGroupQRCode;
