import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';

import styles from './index.module.css';

export const LoadingPage = () => (
	<div className={styles.page}>
		<CircularProgress size={50} color="primary" thickness={3} />
	</div>
);

export const LoadingComponent = () => (
	<div className={styles.component}>
		<CircularProgress size={25} color="primary" thickness={5} />
	</div>
);
