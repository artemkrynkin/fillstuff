import React from 'react';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import { memberRoleTransform } from 'shared/roles-access-rights';

import CardPaper from 'src/components/CardPaper';
import UserSummary from 'src/components/UserSummary';

import { ButtonRed } from '../components/styles';

import styles from './MemberCard.module.css';

const MemberCard = props => {
	const { member, onOpenDialogByName } = props;

	return (
		<CardPaper header={false}>
			<Grid className={styles.container} container>
				<Grid xs={6} item>
					<UserSummary
						src={member.user.avatar}
						title={member.user.name}
						subtitle={memberRoleTransform(member.roles).join(', ')}
						size="xl"
					/>
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
