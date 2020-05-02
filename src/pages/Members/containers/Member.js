import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';

import { memberRoleTransform } from 'shared/roles-access-rights';

import CardPaper from 'src/components/CardPaper';

import styles from './Member.module.css';

const Member = props => {
	const { member } = props;

	return (
		<CardPaper header={false}>
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
		</CardPaper>
	);
};

export default Member;
