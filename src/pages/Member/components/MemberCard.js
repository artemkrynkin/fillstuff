import React from 'react';
import { connect } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import { memberRoleTransform } from 'shared/roles-access-rights';

import CardPaper from 'src/components/CardPaper';

import { createInvoice } from 'src/actions/invoices';

import styles from './MemberCard.module.css';

const MemberCard = props => {
	const { member, updateMember, getInvoices } = props;

	const createInvoice = () => {
		props.createInvoice().then(response => {
			if (response.status === 'success') {
				updateMember(response);
				getInvoices();
			}
		});
	};

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
					<Button style={{ marginRight: 8 }}>Отвязать участника</Button>
					<Button onClick={createInvoice} variant="outlined" color="primary">
						Выставить счет
					</Button>
				</Grid>
			</Grid>
		</CardPaper>
	);
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const { member } = ownProps;

	return {
		createInvoice: () => dispatch(createInvoice({ params: { memberId: member._id } })),
	};
};

export default connect(null, mapDispatchToProps)(MemberCard);
