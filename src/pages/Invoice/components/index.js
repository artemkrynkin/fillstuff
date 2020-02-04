import React from 'react';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import Invoice from './Invoice';

const Index = props => {
	const { invoiceId } = props;

	return (
		<Container maxWidth="md">
			<Grid container direction="row" justify="center" alignItems="flex-start" spacing={2}>
				<Grid item xs={12}>
					<Invoice invoiceId={invoiceId} />
				</Grid>
			</Grid>
		</Container>
	);
};

export default Index;
