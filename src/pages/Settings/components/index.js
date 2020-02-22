import React from 'react';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import GeneralSettings from './generalSettings';
// import Team from './team';

const Index = props => {
	const { currentUser, currentStudio } = props;

	return (
		<Container maxWidth="lg">
			<Grid direction="row" justify="center" alignItems="flex-start" spacing={2} container>
				<Grid xs={12} item>
					<GeneralSettings currentUser={currentUser} currentStudio={currentStudio} />
				</Grid>
				{/*<Grid xs={5} item>*/}
				{/*	<Team currentUser={currentUser} currentStudio={currentStudio} />*/}
				{/*</Grid>*/}
			</Grid>
		</Container>
	);
};

export default Index;
