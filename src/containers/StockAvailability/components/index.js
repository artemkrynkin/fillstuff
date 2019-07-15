import React from 'react';

import Grid from '@material-ui/core/Grid';

import StockStatus from './StockStatus';
import Products from './Products';

const Index = props => {
	const { currentUser, currentStock } = props;

	return (
		<Grid container direction="row" justify="center" alignItems="flex-start" spacing={2}>
			<Grid item xs={12}>
				<StockStatus currentUser={currentUser} currentStock={currentStock} />
				<Products currentUser={currentUser} currentStock={currentStock} />
			</Grid>
		</Grid>
	);
};

export default Index;
