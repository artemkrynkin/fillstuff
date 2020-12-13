import React, { useState, lazy, Suspense } from 'react';

import { Button } from './styles';
import styles from './index.module.css';

const DialogMemberInvitation = lazy(() => import('src/views/Dialogs/MemberInvitation'));

function Members() {
	const [MemberInvitation, setDialogMemberInvitation] = useState(false);

	const onOpenDialogMemberInvitation = async () => {
		setDialogMemberInvitation(true);
	};

	const onCloseDialogMemberInvitation = () => setDialogMemberInvitation(false);

	return (
		<div className={styles.container}>
			<Button onClick={onOpenDialogMemberInvitation} variant="contained" color="primary">
				Пригласить участника
			</Button>

			<Suspense fallback={null}>
				<DialogMemberInvitation dialogOpen={MemberInvitation} onCloseDialog={onCloseDialogMemberInvitation} />
			</Suspense>
		</div>
	);
}

export default Members;
