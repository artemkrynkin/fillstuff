import React, { useState } from 'react';
import loadable from '@loadable/component';

// import Button from '@material-ui/core/Button';

import { Button } from './styles';
import styles from './index.module.css';

const DialogMemberInvitationOrLogin = loadable(() =>
	import('src/pages/Dialogs/MemberInvitationOrLogin' /* webpackChunkName: "Dialog_MemberInvitationOrLogin" */)
);

const Members = props => {
	const { currentStudio } = props;
	const [MemberInvitationOrLogin, setDialogMemberInvitationOrLogin] = useState(false);

	const onOpenDialogMemberInvitationOrLogin = async () => {
		setDialogMemberInvitationOrLogin(true);
	};

	const onCloseDialogMemberInvitationOrLogin = () => setDialogMemberInvitationOrLogin(false);

	return (
		<div className={styles.container}>
			<Button onClick={onOpenDialogMemberInvitationOrLogin} variant="contained" color="primary">
				Добавить участника
			</Button>

			<DialogMemberInvitationOrLogin
				dialogOpen={MemberInvitationOrLogin}
				onCloseDialog={onCloseDialogMemberInvitationOrLogin}
				currentStudio={currentStudio}
			/>
		</div>
	);
};

export default Members;
