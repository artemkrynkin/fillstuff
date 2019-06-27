import React from 'react';

import Grid from '@material-ui/core/Grid';

// import ContentCategories from './contentCategories';
import GeneralSettings from './generalSettings';
import Team from './team';

const Index = props => {
	const { currentUser, currentStock } = props;

	return (
		<Grid container direction="row" justify="center" alignItems="flex-start" spacing={2}>
			<Grid className="stock-settings__container" item xs={12} lg={7}>
				<GeneralSettings currentUser={currentUser} currentStock={currentStock} />
			</Grid>
			<Grid className="stock-settings__container" item xs={12} lg={5}>
				<Team currentUser={currentUser} currentStock={currentStock} />
				{/*<ContentCategories currentUser={currentUser} currentStock={currentStock} />*/}
			</Grid>
		</Grid>
	);
};

export default Index;
