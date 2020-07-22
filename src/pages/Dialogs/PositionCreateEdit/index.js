import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

import { Dialog, DialogTitle } from 'src/components/Dialog';

import PositionForm from './PositionForm';

import styles from './index.module.css';

class DialogPositionCreateEdit extends Component {
	static propTypes = {
		type: PropTypes.oneOf(['create', 'edit']).isRequired,
		dialogOpen: PropTypes.bool.isRequired,
		onCloseDialog: PropTypes.func.isRequired,
		onExitedDialog: PropTypes.func,
		onCallback: PropTypes.func,
		selectedPosition: PropTypes.object,
	};

	initialState = {
		tabName: 'position',
	};

	state = this.initialState;

	onChangeTab = (event, tabName) => this.setState({ tabName });

	onExitedDialog = () => {
		const { onExitedDialog } = this.props;

		this.setState(this.initialState, () => {
			if (onExitedDialog) onExitedDialog();
		});
	};

	render() {
		const { type, dialogOpen, onCloseDialog, selectedPosition } = this.props;
		const { tabName } = this.state;

		if (type === 'edit' && !selectedPosition) return null;

		return (
			<Dialog open={dialogOpen} onEnter={this.onEnterDialog} onClose={onCloseDialog} onExited={this.onExitedDialog} maxWidth="lg">
				<DialogTitle onClose={onCloseDialog} theme="noTheme">
					{type === 'create' ? 'Создание позиции' : 'Редактирование позиции'}
				</DialogTitle>
				<Tabs className={styles.tabs} value={tabName} onChange={this.onChangeTab}>
					<Tab value="position" label="Позиция" id="position" />
					<Tab value="shops" label="Магазины" id="shops" />
				</Tabs>
				<PositionForm {...this.props} tabName={tabName} />
			</Dialog>
		);
	}
}

export default DialogPositionCreateEdit;
