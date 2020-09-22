import React, { useState, lazy, Suspense } from 'react';

import { Button } from './styles';
import styles from './index.module.css';

const DialogMemberInvitationOrLogin = lazy(() => import('src/pages/Dialogs/MemberInvitationOrLogin'));

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

			<Suspense fallback={null}>
				<DialogMemberInvitationOrLogin
					dialogOpen={MemberInvitationOrLogin}
					onCloseDialog={onCloseDialogMemberInvitationOrLogin}
					currentStudio={currentStudio}
				/>
			</Suspense>
		</div>
	);
};

export default Members;
