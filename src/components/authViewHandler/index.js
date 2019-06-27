import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { LoadingPage } from 'src/components/Loading';

const AuthViewHandler = props => {
	const { children, user, stocks, loading } = props;

	if (user && user._id && stocks) return children(true);
	if (loading) return <LoadingPage />;
	return children(false);
};

export default compose(
	connect(),
	withRouter
)(AuthViewHandler);
