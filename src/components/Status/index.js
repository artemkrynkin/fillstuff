import { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { withCurrentUser } from 'src/components/withCurrentUser';

import { logoutListener } from 'src/actions/authentication';
import { joinStudio } from 'src/actions/studio';
import { getStoreNotifications, storeNotificationEvents } from 'src/actions/storeNotifications';

class Status extends Component {
	componentDidMount() {
		this.props.logoutListener();

		if (/owner|admin/.test(this.props.currentMember.roles)) {
			this.props.joinStudio();
			this.props.getStoreNotifications().then(() => {
				this.props.storeNotificationEvents();
			});
		}
	}

	render() {
		return null;
	}
}

const mapDispatchToProps = dispatch => {
	return {
		logoutListener: () => dispatch(logoutListener()),
		joinStudio: () => dispatch(joinStudio()),
		getStoreNotifications: () => dispatch(getStoreNotifications()),
		storeNotificationEvents: () => dispatch(storeNotificationEvents()),
	};
};

export default compose(connect(null, mapDispatchToProps), withCurrentUser)(Status);