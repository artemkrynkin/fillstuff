import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';

import { qrRender } from 'src/helpers/qrRender';

import { Dialog, DialogTitle } from 'src/components/Dialog';
import { withCurrentUser } from 'src/components/withCurrentUser';

import styles from './index.module.css';

function MemberInvitation(props) {
	const { currentStudio, dialogOpen, onCloseDialog } = props;
	const [qrCodeSvg, setQrCodeSvg] = useState(null);

	const onEnterDialog = () => {
		const qrData = JSON.stringify({
			type: 'm-i',
			id: currentStudio._id,
			code: uuidv4(),
		});

		const options = {
			color: 'colored',
			logo: currentStudio.avatar ? 'image' : 'fillstuff',
			image: currentStudio.avatar,
		};
		const qrSvg = qrRender(QRCode.create(qrData, { errorCorrectionLevel: 'Q' }), options);

		setQrCodeSvg(qrSvg);
	};

	const onExitedDialog = () => {
		const { onExitedDialog } = props;

		setQrCodeSvg(null);

		if (onExitedDialog) onExitedDialog();
	};

	return (
		<Dialog
      open={dialogOpen}
      TransitionProps={{
        onEnter: onEnterDialog,
        onExited: onExitedDialog
      }}
      onClose={onCloseDialog}
      maxWidth="sm"
    >
			<DialogTitle onClose={onCloseDialog} theme="noTheme">
				QR-код для приглашения участника
			</DialogTitle>
			<DialogContent>
				<div className={styles.qrContainer} dangerouslySetInnerHTML={{ __html: qrCodeSvg }} />
				<Typography className={styles.info} variant="caption" align="center" component="div">
					Попросите нового участника студии отсканировать этот QR-код через мобильное приложение Fillstuff
				</Typography>
			</DialogContent>
		</Dialog>
	);
}

MemberInvitation.propTypes = {
	dialogOpen: PropTypes.bool.isRequired,
	onCloseDialog: PropTypes.func.isRequired,
	onExitedDialog: PropTypes.func,
	currentStudio: PropTypes.object.isRequired,
	selectedMember: PropTypes.object,
};

export default compose(withCurrentUser)(MemberInvitation);
