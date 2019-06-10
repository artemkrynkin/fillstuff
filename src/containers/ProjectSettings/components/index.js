import React from 'react';

import Grid from '@material-ui/core/Grid';

import ContentTopics from './contentTopics';
import GeneralSettings from './generalSettings';
import SocialPages from './socialPages';
import Team from './team';

const Index = props => {
	const { currentUser, currentProject } = props;

	return (
		<Grid container direction="row" justify="center" alignItems="flex-start" spacing={16}>
			<Grid className="project-settings__container" item xs={12} lg={7}>
				<GeneralSettings currentUser={currentUser} currentProject={currentProject} />
				<SocialPages currentUser={currentUser} currentProject={currentProject} />
			</Grid>
			<Grid className="project-settings__container" item xs={12} lg={5}>
				<Team currentUser={currentUser} currentProject={currentProject} />
				<ContentTopics currentUser={currentUser} currentProject={currentProject} />
			</Grid>
		</Grid>
	);
};

export default Index;
