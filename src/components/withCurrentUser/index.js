import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import hoistNonReactStatics from 'hoist-non-react-statics';

import { getProjects } from 'src/actions/projects';
import { getUser } from 'src/actions/user';

const CurrentUserComponent = props => {
	const {
		user: { data: currentUser, isFetching: isLoadingCurrentUser, error: errorCurrentUser },
		projects: { data: projects, isFetching: isLoadingProjects, error: errorProjects },
		getUser,
		getProjects,
		children,
		render,
	} = props;

	if (!children && !render) return null;

	if (!window.__DATA__) {
		if (!currentUser && !projects && !isLoadingCurrentUser && !isLoadingProjects && !errorCurrentUser && !errorProjects) {
			getUser();
			getProjects();
		}
	}

	return children
		? children({ currentUser, isLoadingCurrentUser, projects, isLoadingProjects })
		: render({ currentUser, isLoadingCurrentUser, projects, isLoadingProjects });
};

const mapStateToProps = state => {
	return {
		user: state.user,
		projects: state.projects,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getUser: () => dispatch(getUser()),
		getProjects: () => dispatch(getProjects()),
	};
};

export const CurrentUser = compose(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)
)(CurrentUserComponent);

export const withCurrentUser = Component => {
	const C = props => {
		const { wrappedComponentRef, ...remainingProps } = props;
		return (
			<CurrentUser>
				{({ currentUser, isLoadingCurrentUser, projects, isLoadingProjects }) => {
					if (!currentUser || !projects) {
						return (
							<Component
								{...remainingProps}
								currentUser={null}
								isLoadingCurrentUser={isLoadingCurrentUser}
								projects={null}
								isLoadingProjects={isLoadingProjects}
								ref={wrappedComponentRef}
							/>
						);
					}

					return (
						<Component
							{...remainingProps}
							currentUser={currentUser}
							isLoadingCurrentUser={isLoadingCurrentUser}
							projects={projects}
							isLoadingProjects={isLoadingProjects}
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
