import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import hoistNonReactStatics from 'hoist-non-react-statics';

import { getMyAccount, getMyAccountMember } from 'src/actions/user';
import { getStudio } from 'src/actions/studio';

const CurrentUserComponent = props => {
	const {
		user: { data: currentUser, isFetching: isLoadingCurrentUser, error: errorCurrentUser },
		studio: { data: currentStudio, isFetching: isLoadingCurrentStudio, error: errorCurrentStudio },
		member: { data: currentMember, isFetching: isLoadingCurrentMember, error: errorCurrentMember },
		children,
		render,
	} = props;

	if (!children && !render) return null;

	if (!window.__DATA__) {
		if (!currentUser && !isLoadingCurrentUser && !errorCurrentUser) {
			props.getMyAccount();
		}

		if (currentUser && currentUser._id && currentUser.activeStudio) {
			if (!currentStudio && !isLoadingCurrentStudio && !errorCurrentStudio) {
				props.getStudio(currentUser._id, currentUser.activeStudio);
			}
			if (!currentMember && !isLoadingCurrentMember && !errorCurrentMember) {
				props.getMyAccountMember(currentUser._id, currentUser.activeMember);
			}
		}
	}

	return children
		? children({ currentUser, isLoadingCurrentUser, currentStudio, isLoadingCurrentStudio, currentMember, isLoadingCurrentMember })
		: render({ currentUser, isLoadingCurrentUser, currentStudio, isLoadingCurrentStudio, currentMember, isLoadingCurrentMember });
};

const mapStateToProps = state => {
	return {
		user: state.user,
		studio: state.studio,
		member: state.member,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getMyAccount: () => dispatch(getMyAccount()),
		getStudio: (userId, studioId) => dispatch(getStudio(userId, studioId)),
		getMyAccountMember: (userId, memberId) => dispatch(getMyAccountMember(userId, memberId)),
	};
};

export const CurrentUser = compose(connect(mapStateToProps, mapDispatchToProps))(CurrentUserComponent);

export const withCurrentUser = Component => {
	const C = props => {
		const { wrappedComponentRef, ...remainingProps } = props;
		return (
			<CurrentUser>
				{({ currentUser, isLoadingCurrentUser, currentStudio, isLoadingCurrentStudio, currentMember, isLoadingCurrentMember }) => {
					return (
						<Component
							{...remainingProps}
							currentUser={currentUser ? currentUser : null}
							isLoadingCurrentUser={isLoadingCurrentUser}
							currentStudio={currentStudio ? currentStudio : null}
							isLoadingCurrentStudio={isLoadingCurrentStudio}
							currentMember={currentMember ? currentMember : null}
							isLoadingCurrentMember={isLoadingCurrentMember}
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
