import React from 'react';

import { memberRoleTransform } from 'shared/roles-access-rights';

import CardPaper from 'src/components/CardPaper';
import UserSummary from 'src/components/UserSummary';

const Member = props => {
	const { member } = props;

	return (
		<CardPaper header={false}>
			<UserSummary src={member.user.avatar} title={member.user.name} subtitle={memberRoleTransform(member.roles).join(', ')} size="lg" />
		</CardPaper>
	);
};

export default Member;
