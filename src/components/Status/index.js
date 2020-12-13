import { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { withCurrentUser } from 'src/components/withCurrentUser';

import { joinStudio } from 'src/actions/studios';
import { getStoreNotifications, storeNotificationEvents } from 'src/actions/storeNotifications';

function Status(props) {
	const { currentUser } = props;

	useEffect(() => {
		if (/owner|admin/.test(currentUser.settings.member.roles)) {
			props.joinStudio();
			props.getStoreNotifications().then(() => {
				props.storeNotificationEvents();
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentUser]);

	return null;
}

const mapDispatchToProps = dispatch => {
	return {
		joinStudio: () => dispatch(joinStudio()),
		getStoreNotifications: () => dispatch(getStoreNotifications()),
		storeNotificationEvents: () => dispatch(storeNotificationEvents()),
	};
};

export default compose(connect(null, mapDispatchToProps), withCurrentUser)(Status);
