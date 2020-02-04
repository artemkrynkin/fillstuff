import React, { useState } from 'react';
import { connect } from 'react-redux';
import loadable from '@loadable/component';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@material-ui/core/Button';

// import { getPositions } from 'src/actions/positions';

import TitlePageOrLogo from './TitlePageOrLogo';

import styles from 'src/components/Header/index.module.css';

const DialogMemberInvitationOrLogin = loadable(() =>
	import('src/pages/Dialogs/MemberInvitationOrLogin' /* webpackChunkName: "Dialog_MemberInvitationOrLogin" */)
);

const Members = props => {
	const { pageTitle, theme, currentStudio } = props;
	const [MemberInvitationOrLogin, setDialogMemberInvitationOrLogin] = useState(false);

	const onOpenDialogMemberInvitationOrLogin = async () => {
		// await props.getPositions();

		setDialogMemberInvitationOrLogin(true);
	};

	const onCloseDialogMemberInvitationOrLogin = () => setDialogMemberInvitationOrLogin(false);

	return (
		<div className={styles.column_left}>
			<TitlePageOrLogo pageTitle={pageTitle} theme={theme} />
			<div className={styles.columnGroup_left}>
				<Button
					className={styles.buttonColorTeal400}
					variant="contained"
					color="primary"
					style={{ marginRight: 8 }}
					onClick={onOpenDialogMemberInvitationOrLogin}
					startIcon={<FontAwesomeIcon icon={['far', 'plus']} fixedWidth />}
				>
					Добавить участника
				</Button>
			</div>

			<DialogMemberInvitationOrLogin
				dialogOpen={MemberInvitationOrLogin}
				onCloseDialog={onCloseDialogMemberInvitationOrLogin}
				currentStudio={currentStudio}
			/>
		</div>
	);
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		// getPositions: () => dispatch(getPositions({ showRequest: false })),
	};
};

export default connect(null, mapDispatchToProps)(Members);
