import React from 'react';

import Grid from '@material-ui/core/Grid';

import ProfileSettings from './ProfileSettings';

import styles from '../index.module.css';

const Index = () => {
	return (
		<Grid container direction="row" justify="center" alignItems="flex-start" spacing={2}>
			<Grid className={styles.content} item xs={10} lg={10}>
				<ProfileSettings />
			</Grid>
		</Grid>
	);
};

export default Index;
