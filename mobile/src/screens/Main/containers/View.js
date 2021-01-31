import React from 'react';

import theme from 'mobile/src/constants/theme';

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

	const cameraIsShow = (currentStudio && currentUser.settings.studio && currentUser.settings.member) || modals.modalUserMenu;

	return (
		<>
			<FocusAwareStatusBar
				barStyle={cameraIsShow ? 'light-content' : 'dark-content'}
				backgroundColor={cameraIsShow ? 'black' : theme.brightness['4']}
			/>
			<Header currentUser={currentUser} onVisibleModalByName={onVisibleModalByName} />
			{currentStudio ? <PositionScan {...props} /> : <Stub {...props} />}
		</>
	);
}

export default View;
