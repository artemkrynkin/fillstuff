import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import hoistNonReactStatics from 'hoist-non-react-statics';

import { getStocks } from 'src/actions/stocks';
import { getUser } from 'src/actions/user';

const CurrentUserComponent = props => {
	const {
		user: { data: currentUser, isFetching: isLoadingCurrentUser, error: errorCurrentUser },
		stocks: { data: stocks, isFetching: isLoadingStocks, error: errorStocks },
		children,
		render,
	} = props;

	if (!children && !render) return null;

	if (!window.__DATA__) {
		if (!currentUser && !stocks && !isLoadingCurrentUser && !isLoadingStocks && !errorCurrentUser && !errorStocks) {
			props.getUser();
			props.getStocks();
		}
	}

	return children
		? children({ currentUser, isLoadingCurrentUser, stocks, isLoadingStocks })
		: render({ currentUser, isLoadingCurrentUser, stocks, isLoadingStocks });
};

const mapStateToProps = state => {
	return {
		user: state.user,
		stocks: state.stocks,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getUser: () => dispatch(getUser()),
		getStocks: () => dispatch(getStocks()),
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
				{({ currentUser, isLoadingCurrentUser, stocks, isLoadingStocks }) => {
					if (!currentUser || !stocks) {
						return (
							<Component
								{...remainingProps}
								currentUser={null}
								isLoadingCurrentUser={isLoadingCurrentUser}
								stocks={null}
								isLoadingStocks={isLoadingStocks}
								ref={wrappedComponentRef}
							/>
						);
					}

					return (
						<Component
							{...remainingProps}
							currentUser={currentUser}
							isLoadingCurrentUser={isLoadingCurrentUser}
							stocks={stocks}
							isLoadingStocks={isLoadingStocks}
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
