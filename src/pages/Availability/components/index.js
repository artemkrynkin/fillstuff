import React from 'react';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import Indicators from './Indicators';
import Positions from './Positions';

const Index = props => {
	const { currentStudio } = props;

	return (
		<Container maxWidth="md">
			<Grid container direction="row" justify="center" alignItems="flex-start" spacing={2}>
				<Grid item xs={12}>
					<Indicators currentStudio={currentStudio} />
					<Positions currentStudio={currentStudio} />
				</Grid>
			</Grid>
		</Container>
	);
};

export default Index;
