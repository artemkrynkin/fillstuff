import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import MemberCard from './MemberCard';
import MemberDetails from './MemberDetails';

const Index = props => {
	const { memberData, invoicesData, updateMember, getInvoices } = props;

	if (!memberData || !memberData.data) return <div children={<CircularProgress size={20} />} style={{ textAlign: 'center' }} />;

	const { data: member } = memberData;

	return (
		<Container maxWidth="md">
			<Grid container direction="row" justify="center" alignItems="flex-start" spacing={2}>
				<Grid item xs={12}>
					<MemberCard member={member} updateMember={updateMember} getInvoices={getInvoices} />
					<MemberDetails member={member} invoicesData={invoicesData} />
				</Grid>
			</Grid>
		</Container>
	);
};

export default Index;
