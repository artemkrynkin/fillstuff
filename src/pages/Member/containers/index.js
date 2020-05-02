import React, { useState } from 'react';
import loadable from '@loadable/component';

import Container from '@material-ui/core/Container';

import View from './View';

const DialogMemberInvitationOrLogin = loadable(() =>
	import('src/pages/Dialogs/MemberInvitationOrLogin' /* webpackChunkName: "Dialog_MemberInvitationOrLogin" */)
);

const Index = props => {
	const { currentStudio } = props;
	const [dialogData, setDialogData] = useState({
		member: null,
	});
	const [dialogOpenedName, setDialogOpenedName] = useState('');
	const [dialogs, setDialogs] = useState({
		memberInvitationOrLogin: false,
	});

	const onOpenDialogByName = (dialogName, dataType, data) => {
		setDialogOpenedName(dialogName);

		setDialogs({
			...dialogs,
			[dialogName]: true,
		});

		if (dataType && data) {
			setDialogData({
				...dialogData,
				[dataType]: data,
			});
		}
	};

	const onCloseDialogByName = dialogName => {
		setDialogs({
			...dialogs,
			[dialogName]: false,
		});
	};

	const onExitedDialogByName = dataType => {
		setDialogOpenedName('');

		if (dataType) {
			setDialogData({
				...dialogData,
				[dataType]: null,
			});
		}
	};

	return (
		<Container>
			<View onOpenDialogByName={onOpenDialogByName} {...props} />

			<DialogMemberInvitationOrLogin
				dialogOpen={dialogs.memberInvitationOrLogin}
				onCloseDialog={() => onCloseDialogByName('memberInvitationOrLogin')}
				onExitedDialog={() => onExitedDialogByName('member')}
				currentStudio={currentStudio}
				selectedMember={dialogOpenedName === 'memberInvitationOrLogin' ? dialogData.member : null}
			/>
		</Container>
	);
};

export default Index;
