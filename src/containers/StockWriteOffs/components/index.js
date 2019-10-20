import React from 'react';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import WriteOffs from './WriteOffs';
import Members from './Members';

import styles from '../index.module.css';

const Index = props => {
	const { currentUser, currentStock, selectedUserId } = props;

	return (
		<Container maxWidth="md">
			<Grid container direction="row" justify="center" alignItems="flex-start" spacing={2}>
				<Grid item xs={9}>
					<WriteOffs currentUser={currentUser} currentStock={currentStock} selectedUserId={selectedUserId} />
				</Grid>
				<Grid className={styles.memberContainer} item xs={3}>
					<Members currentUser={currentUser} currentStock={currentStock} selectedUserId={selectedUserId} />
				</Grid>
			</Grid>
		</Container>
	);
};

export default Index;
