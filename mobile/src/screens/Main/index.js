import React from 'react';
import { connect } from 'react-redux';

import Index from './containers/index';

// import styles from './styles';

function Main(props) {
	return <Index {...props} />;
}

const mapStateToProps = state => {
	const { user, studios } = state;

	let currentStudio = {
		data: studios.data && user.data ? studios.data.data.find(studio => studio._id === user.data.settings.studio) : null,
		isFetching: studios.isFetching,
	};

	return {
		studios: state.studios,
		currentStudio: currentStudio,
		currentUser: state.user,
	};
};

const mapDispatchToProps = dispatch => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
