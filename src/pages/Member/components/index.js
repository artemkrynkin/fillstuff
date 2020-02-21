import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import MemberCard from './MemberCard';
import MemberDetails from './MemberDetails';

const Index = props => {
	const { currentStudio, memberData, invoicesData, updateMember, getInvoices } = props;

	if (!memberData || !memberData.data) return <div children={<CircularProgress size={20} />} style={{ textAlign: 'center' }} />;

	const { data: member } = memberData;

	return (
		<Container maxWidth="lg">
			<Grid container direction="row" justify="center" alignItems="flex-start" spacing={2}>
				<Grid item xs={12}>
					<MemberCard currentStudio={currentStudio} member={member} />
					<MemberDetails member={member} invoicesData={invoicesData} updateMember={updateMember} getInvoices={getInvoices} />
				</Grid>
			</Grid>
		</Container>
	);
};

export default Index;
