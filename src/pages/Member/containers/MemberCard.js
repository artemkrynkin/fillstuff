import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import { memberRoleTransform } from 'shared/roles-access-rights';

import CardPaper from 'src/components/CardPaper';

import { ButtonRed } from './styles';

import styles from './MemberCard.module.css';

const MemberCard = props => {
	const { member, onOpenDialogByName } = props;

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
				{!member.deactivated ? (
					<Grid style={{ textAlign: 'right' }} xs={6} item>
						<Button onClick={() => onOpenDialogByName('memberInvitationOrLogin', 'member', member)} style={{ marginRight: 8 }}>
							QR для входа
						</Button>
						<ButtonRed onClick={() => onOpenDialogByName('memberDeactivated', 'member', member)} variant="text">
							Отключить участника
						</ButtonRed>
					</Grid>
				) : null}
			</Grid>
		</CardPaper>
	);
};

export default MemberCard;
