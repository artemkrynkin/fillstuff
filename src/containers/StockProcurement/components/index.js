import React from 'react';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import Procurement from './Procurement';

const Index = props => {
	const { currentUser, currentStock, procurementId } = props;

	return (
		<Container maxWidth="md">
			<Grid container direction="row" justify="center" alignItems="flex-start" spacing={2}>
				<Grid item xs={12}>
					<Procurement currentUser={currentUser} currentStock={currentStock} procurementId={procurementId} />
				</Grid>
			</Grid>
		</Container>
	);
};

export default Index;
