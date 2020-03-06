import React, { useState } from 'react';
import loadable from '@loadable/component';

import TitlePageOrLogo from './TitlePageOrLogo';

import { Button } from './styles';
import styles from 'src/components/Header/index.module.css';

const DialogMemberInvitationOrLogin = loadable(() =>
	import('src/pages/Dialogs/MemberInvitationOrLogin' /* webpackChunkName: "Dialog_MemberInvitationOrLogin" */)
);

const Members = props => {
	const { pageTitle, theme, currentStudio } = props;
	const [MemberInvitationOrLogin, setDialogMemberInvitationOrLogin] = useState(false);

	const onOpenDialogMemberInvitationOrLogin = async () => {
		setDialogMemberInvitationOrLogin(true);
	};

	const onCloseDialogMemberInvitationOrLogin = () => setDialogMemberInvitationOrLogin(false);

	return (
		<div className={styles.column_left}>
			<TitlePageOrLogo pageTitle={pageTitle} theme={theme} />
			<div className={styles.columnGroup_left}>
				<Button onClick={onOpenDialogMemberInvitationOrLogin} variant="contained" color="primary" style={{ marginRight: 8 }}>
					Добавить участника
				</Button>
			</div>

			<DialogMemberInvitationOrLogin
				dialogOpen={MemberInvitationOrLogin}
				onCloseDialog={onCloseDialogMemberInvitationOrLogin}
				currentStudio={currentStudio}
			/>
		</div>
	);
};

export default Members;
