import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { LoadingPage } from 'src/components/Loading';

const AuthViewHandler = props => {
	const { children, user, studio, member, loading } = props;

	if (user && user._id && studio && studio._id && member && member._id) return children(true);
	if (loading) return <LoadingPage />;
	return children(false);
};

export default compose(connect(), withRouter)(AuthViewHandler);
