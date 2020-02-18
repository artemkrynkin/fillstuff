import React from 'react';
import moment from 'moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';

import { memberRoleTransform } from 'shared/roles-access-rights';

import NumberFormat, { currencyFormatProps } from 'src/components/NumberFormat';
import CardPaper from 'src/components/CardPaper';

import styles from './Member.module.css';

const momentDate = moment();

const Member = props => {
	const { member } = props;

	const accessExpiresIsCurrentYear = member.guest ? momentDate.isSame(member.accessExpires, 'year') : null;

	return (
		<CardPaper
			rightContent={
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
			}
			customRightColumn
		>
			<div>
				<div className={styles.debt}>
					<div className={styles.debtTitle}>Задолженность</div>
					<div className={styles.debtContent}>
						<NumberFormat
							value={member.billingDebt}
							renderText={value => value}
							displayType="text"
							onValueChange={() => {}}
							{...currencyFormatProps}
						/>
					</div>
				</div>
				{member.guest ? (
					<div className={styles.infoSmall}>
						Гостевой доступ до {moment(member.accessExpires).format(accessExpiresIsCurrentYear ? 'D MMMM' : 'D MMMM YYYY')}
					</div>
				) : null}
			</div>
		</CardPaper>
	);
};

export default Member;
