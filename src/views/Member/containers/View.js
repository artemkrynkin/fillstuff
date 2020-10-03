import React, { Fragment } from 'react';

import { LoadingPage } from 'src/components/Loading';

import MemberCard from './MemberCard';
import MemberDetails from './MemberDetails';

const View = props => {
	const { memberData, invoicesData, onOpenDialogByName, updateMember, getInvoices } = props;

	if (!memberData || !memberData.data) return <LoadingPage />;

	const { data: member } = memberData;

	return (
		<Fragment>
			<MemberCard member={member} onOpenDialogByName={onOpenDialogByName} />
			<MemberDetails member={member} invoicesData={invoicesData} updateMember={updateMember} getInvoices={getInvoices} />
		</Fragment>
	);
};

export default View;
