import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';

import './index.styl';

export const LoadingPage = () => (
	<div className="loading__page">
		<CircularProgress size={50} color="primary" thickness={3} />
	</div>
);

export const LoadingComponent = () => (
	<div className="loading__component">
		<CircularProgress size={25} color="primary" thickness={5} />
	</div>
);

export const DisplayLoadingComponent = props => {
	return props.pastDelay ? <LoadingComponent /> : null;
};
