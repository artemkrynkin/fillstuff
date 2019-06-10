import React from 'react';

import Grid from '@material-ui/core/Grid';

import NotificationPreferences from './NotificationPreferences';
import ProfileSettings from './ProfileSettings';
import SocialNetworkAccounts from './SocialNetworkAccounts';

const Index = () => {
	return (
		<Grid container direction="row" justify="center" alignItems="flex-start" spacing={16}>
			<Grid className="user-settings__container" item xs={12} lg={7}>
				<ProfileSettings />
				<SocialNetworkAccounts />
			</Grid>
			<NotificationPreferences />
		</Grid>
	);
};

export default Index;
