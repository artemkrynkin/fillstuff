import React, { useState } from 'react';
import loadable from '@loadable/component';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import { memberRoleTransform } from 'shared/roles-access-rights';

import CardPaper from 'src/components/CardPaper';

import styles from './MemberCard.module.css';

const DialogMemberInvitationOrLogin = loadable(() =>
	import('src/pages/Dialogs/MemberInvitationOrLogin' /* webpackChunkName: "Dialog_MemberInvitationOrLogin" */)
);

const MemberCard = props => {
	const { currentStudio, member } = props;
	const [MemberInvitationOrLogin, setDialogMemberInvitationOrLogin] = useState(false);

	const onOpenDialogMemberInvitationOrLogin = async () => {
		// await props.getPositions();

		setDialogMemberInvitationOrLogin(true);
	};

	const onCloseDialogMemberInvitationOrLogin = () => setDialogMemberInvitationOrLogin(false);

	return (
		<CardPaper header={false}>
			<Grid className={styles.container} container>
				<Grid xs={6} item>
					<div className={styles.user}>
						<Avatar
							className={styles.userPhoto}
							src={member.user.avatar}
							alt={member.user.name}
							children={<div className={styles.userIcon} children={<FontAwesomeIcon icon={['fas', 'user-alt']} />} />}
						/>
						<Grid className={styles.userInfo} direction="column" container>
							<div className={styles.userTitle}>{member.user.name}</div>
							<div className={styles.userCaption}>{memberRoleTransform(member.roles).join(', ')}</div>
						</Grid>
					</div>
				</Grid>
				<Grid style={{ textAlign: 'right' }} xs={6} item>
					<Button onClick={onOpenDialogMemberInvitationOrLogin} style={{ marginRight: 8 }}>
						QR для входа
					</Button>
					<Button className={styles.deactivatedButton} variant="text">Отключить участника</Button>
				</Grid>
			</Grid>

			<DialogMemberInvitationOrLogin
				dialogOpen={MemberInvitationOrLogin}
				onCloseDialog={onCloseDialogMemberInvitationOrLogin}
				currentStudio={currentStudio}
				selectedMember={member}
			/>
		</CardPaper>
	);
};

export default MemberCard;
