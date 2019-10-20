import React from 'react';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import PurchaseCreateForm from './PurchaseCreateForm';

const Index = props => {
	const { currentUser, currentStock } = props;

	return (
		<Container maxWidth="md">
			<Grid container direction="row" justify="center" alignItems="flex-start" spacing={2}>
				<Grid item xs={12}>
					<PurchaseCreateForm currentUser={currentUser} currentStock={currentStock} />
				</Grid>
			</Grid>
		</Container>
	);
};

export default Index;
