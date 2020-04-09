import React from 'react';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import Indicators from './Indicators';
import Positions from './Positions';

const Index = props => {
	const { currentStudio } = props;

	return (
		<Container>
			<Grid direction="row" justify="center" alignItems="flex-start" spacing={2} container>
				<Grid xs={12} item>
					<Indicators currentStudio={currentStudio} />
					<Positions />
				</Grid>
			</Grid>
		</Container>
	);
};

export default Index;
