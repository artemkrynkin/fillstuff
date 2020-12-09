import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import hoistNonReactStatics from 'hoist-non-react-statics';

import { getMyAccount } from 'src/actions/user';
import { getStudios } from 'src/actions/studios';

const CurrentUserComponent = props => {
	const {
		user: { data: currentUser, isFetching: isLoadingCurrentUser, error: errorCurrentUser },
		studios: { data: studios, isFetching: isLoadingStudios, error: errorStudios },
		children,
		render,
	} = props;

	if (!children && !render) return null;

	if (!currentUser && !isLoadingCurrentUser && !errorCurrentUser) {
		props.getMyAccount();
	}
	if (!studios && !isLoadingStudios && !errorStudios) {
		props.getStudios();
	}

	return children
		? children({ currentUser, isLoadingCurrentUser, studios, isLoadingStudios })
		: render({ currentUser, isLoadingCurrentUser, studios, isLoadingStudios });
};

const mapStateToProps = state => {
	return {
		user: state.user,
		studios: state.studios,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getMyAccount: () => dispatch(getMyAccount()),
		getStudios: () => dispatch(getStudios()),
	};
};

export const CurrentUser = compose(connect(mapStateToProps, mapDispatchToProps))(CurrentUserComponent);

export const withCurrentUser = Component => {
	const C = props => {
		const { wrappedComponentRef, ...remainingProps } = props;
		return (
			<CurrentUser>
				{({ currentUser, isLoadingCurrentUser, studios, isLoadingStudios }) => {
					return (
						<Component
							{...remainingProps}
							currentUser={currentUser || null}
							currentStudio={studios?.data.find(studio => studio._id === currentUser?.settings.studio) || null}
							isLoadingCurrentUser={isLoadingCurrentUser}
							isLoadingStudios={isLoadingStudios}
							ref={wrappedComponentRef}
						/>
					);
				}}
			</CurrentUser>
		);
	};

	C.WrappedComponent = Component;
	return hoistNonReactStatics(C, Component);
};
