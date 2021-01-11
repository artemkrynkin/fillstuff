import React from 'react';

import FocusAwareStatusBar from 'mobile/src/components/FocusAwareStatusBar';

import Header from './Header';
import Stub from './Stub';
import PositionScan from './PositionScan';

function View(props) {
	const {
		modals,
		onVisibleModalByName,
		currentStudio: {
			data: currentStudio,
			// isFetching: isLoadingCurrentUser,
			// error: errorCurrentUser
		},
		currentUser: {
			data: currentUser,
			// isFetching: isLoadingCurrentUser,
			// error: errorCurrentUser
		},
	} = props;

	return (
		<>
			<FocusAwareStatusBar
				barStyle={
					(currentStudio && currentUser.settings.studio && currentUser.settings.member) || modals.modalUserMenu
						? 'light-content'
						: 'dark-content'
				}
			/>
			<Header currentUser={currentUser} onVisibleModalByName={onVisibleModalByName} />
			{currentStudio ? <PositionScan {...props} /> : <Stub {...props} />}
		</>
	);
}

export default View;
