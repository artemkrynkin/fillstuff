import React from 'react';

import Grid from '@material-ui/core/Grid';

import ProfileSettings from './ProfileSettings';

const Index = () => {
	return (
		<Grid container direction="row" justify="center" alignItems="flex-start" spacing={2}>
			<Grid className="user-settings__container" item xs={10} lg={10}>
				<ProfileSettings />
			</Grid>
		</Grid>
	);
};

export default Index;
