import React from 'react';

import Grid from '@material-ui/core/Grid';

import WriteOffs from './WriteOffs';
import Members from './Members';

const Index = props => {
	const { currentUser, currentStock, selectedUserId } = props;

	return (
		<Grid container direction="row" justify="center" alignItems="flex-start" spacing={2}>
			<WriteOffs currentUser={currentUser} currentStock={currentStock} selectedUserId={selectedUserId} />
			<Members currentUser={currentUser} currentStock={currentStock} selectedUserId={selectedUserId} />
		</Grid>
	);
};

export default Index;
