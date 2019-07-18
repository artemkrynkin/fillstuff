import React from 'react';

import Grid from '@material-ui/core/Grid';

import GeneralSettings from './generalSettings';
import Team from './team';

const Index = props => {
	const { currentUser, currentStock } = props;

	return (
		<Grid direction="row" justify="center" alignItems="flex-start" spacing={2} container>
			<Grid xs={7} item>
				<GeneralSettings currentUser={currentUser} currentStock={currentStock} />
			</Grid>
			<Grid xs={5} item>
				<Team currentUser={currentUser} currentStock={currentStock} />
			</Grid>
		</Grid>
	);
};

export default Index;
