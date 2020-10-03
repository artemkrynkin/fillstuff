import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DialogContent from '@material-ui/core/DialogContent';

import { DialogSticky, DialogTitle } from 'src/components/Dialog';
import { LoadingComponent } from 'src/components/Loading';

import { getStoreNotification } from 'src/actions/storeNotifications';

import Header from './Header';
import Content from './Content';

class DialogPositionEnded extends Component {
	static propTypes = {
		dialogOpen: PropTypes.bool.isRequired,
		onCloseDialog: PropTypes.func.isRequired,
		onExitedDialog: PropTypes.func,
		selectedStoreNotificationId: PropTypes.string,
		onOpenDialogByName: PropTypes.func,
	};

	initialState = {
		storeNotificationData: null,
	};

	state = this.initialState;

	onEnterDialog = () => {
		const { onCloseDialog, selectedStoreNotificationId: storeNotificationId } = this.props;

		this.props.getStoreNotification({ storeNotificationId }).then(response => {
			if (response.status === 'success') {
				setTimeout(() => this.setState({ storeNotificationData: response }), 500);
			} else {
				onCloseDialog();
			}
		});
	};

	onExitedDialog = () => {
		const { onExitedDialog } = this.props;

		this.setState(this.initialState, () => {
			if (onExitedDialog) onExitedDialog();
		});
	};

	render() {
		const { dialogOpen, onCloseDialog, selectedStoreNotificationId, onOpenDialogByName } = this.props;
		const { storeNotificationData } = this.state;

		if (!selectedStoreNotificationId) return null;

		return (
			<DialogSticky
				open={dialogOpen}
				onEnter={this.onEnterDialog}
				onClose={onCloseDialog}
				onExited={this.onExitedDialog}
				maxWidth="xl"
				scroll="body"
				stickyTitle
			>
				<DialogTitle onClose={onCloseDialog} theme="white">
					{storeNotificationData && storeNotificationData.data ? (
						<Header
							onCloseDialog={onCloseDialog}
							onOpenDialogByNameIndex={onOpenDialogByName}
							storeNotification={storeNotificationData.data}
						/>
					) : null}
				</DialogTitle>
				<DialogContent style={{ overflow: 'initial' }}>
					{storeNotificationData && storeNotificationData.data ? (
						<Content storeNotification={storeNotificationData.data} />
					) : (
						<LoadingComponent />
					)}
				</DialogContent>
			</DialogSticky>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getStoreNotification: params => dispatch(getStoreNotification({ params })),
	};
};

export default connect(null, mapDispatchToProps)(DialogPositionEnded);
