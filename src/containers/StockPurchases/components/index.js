import React from 'react';

import Grid from '@material-ui/core/Grid';

import Toolbar from './Toolbar';

const Index = props => {
	const { currentUser, currentStock } = props;

	return (
		<Grid container direction="row" justify="center" alignItems="flex-start" spacing={2}>
			<Grid item xs={12}>
				<Toolbar currentUser={currentUser} currentStock={currentStock} />
			</Grid>
		</Grid>
	);
};

export default Index;
