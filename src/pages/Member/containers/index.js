import React, { useState, lazy, Suspense } from 'react';

import Container from '@material-ui/core/Container';

import View from './View';

const DialogMemberInvitationOrLogin = lazy(() => import('src/pages/Dialogs/MemberInvitationOrLogin'));
const DialogMemberDeactivated = lazy(() => import('src/pages/Dialogs/MemberDeactivated'));

const Index = props => {
	const { currentStudio, getMember } = props;
	const [dialogData, setDialogData] = useState({
		member: null,
	});
	const [dialogOpenedName, setDialogOpenedName] = useState('');
	const [dialogs, setDialogs] = useState({
		memberInvitationOrLogin: false,
		memberDeactivated: false,
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

			<Suspense fallback={null}>
				<DialogMemberInvitationOrLogin
					dialogOpen={dialogs.memberInvitationOrLogin}
					onCloseDialog={() => onCloseDialogByName('memberInvitationOrLogin')}
					onExitedDialog={() => onExitedDialogByName('member')}
					currentStudio={currentStudio}
					selectedMember={dialogOpenedName === 'memberInvitationOrLogin' ? dialogData.member : null}
				/>

				<DialogMemberDeactivated
					dialogOpen={dialogs.memberDeactivated}
					onCloseDialog={() => onCloseDialogByName('memberDeactivated')}
					onExitedDialog={() => onExitedDialogByName('member')}
					onCallback={getMember}
					selectedMember={dialogOpenedName === 'memberDeactivated' ? dialogData.member : null}
				/>
			</Suspense>
		</Container>
	);
};

export default Index;
