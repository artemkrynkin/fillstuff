import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { LoadingPage } from 'src/components/Loading';

const AuthViewHandler = props => {
	const { children, user, loading, history } = props;

	useEffect(() => {
		if (loading) return;

		if (!user.settings.studio && !user.settings.member) {
			history.replace('/');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user, loading]);

	if (user) return children(true);
	if (loading) return <LoadingPage style={{ minHeight: '100vh' }} />;
	return children(false);
};

export default compose(connect(), withRouter)(AuthViewHandler);
