import React from 'react';
import { compose } from 'redux';

import AuthViewHandler from 'src/components/authViewHandler';
import { withCurrentUser } from 'src/components/withCurrentUser';

const Switch = props => {
	const { Component, FallbackComponent, ...rest } = props;

	return (
		<AuthViewHandler user={props.currentUser} loading={props.isLoadingCurrentUser || props.isLoadingProjects}>
			{authed => {
				if (!authed) {
					return <FallbackComponent {...rest} />;
				} else {
					return <Component {...rest} />;
				}
			}}
		</AuthViewHandler>
	);
};

// Connect that component to the Redux state
const ConnectedSwitch = compose(withCurrentUser)(Switch);

const signedOutFallback = (Component, FallbackComponent) => {
	return props => {
		return <ConnectedSwitch {...props} FallbackComponent={FallbackComponent} Component={Component} />;
	};
};

export default signedOutFallback;
