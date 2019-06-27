import React, { Component } from 'react';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import './index.styl';

class HeaderAppBar extends Component {
	state = {
		activeTab: this.props.initialTab,
	};

	onChangeTab = (event, value) => {
		this.setState({ activeTab: value });
	};

	render() {
		const { tabs = [] } = this.props;
		const { activeTab } = this.state;

		return (
			<AppBar className="header-app-bar" position="static">
				{tabs.length ? (
					<Tabs value={activeTab} onChange={this.onChangeTab}>
						{tabs.map((tab, index) => (
							<Tab key={index} value={tab.value} label={tab.label} />
						))}
					</Tabs>
				) : null}
			</AppBar>
		);
	}
}

export default HeaderAppBar;
