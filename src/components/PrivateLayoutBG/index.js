import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './index.styl';

class PrivateLayoutBG extends Component {
	render() {
		const { children } = this.props;

		return (
			<div className="page__layout">
				<div className="page__content private-layout-bg">{children}</div>
			</div>
		);
	}
}

PrivateLayoutBG.propTypes = {
	children: PropTypes.node,
};

export default PrivateLayoutBG;
