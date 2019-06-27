import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Sidebar from 'src/components/Sidebar';

class PrivateLayout extends Component {
	render() {
		const { children, currentStock } = this.props;

		return (
			<div className="page__layout">
				<Sidebar currentStockId={currentStock ? currentStock._id : null} />
				{children}
			</div>
		);
	}
}

PrivateLayout.propTypes = {
	children: PropTypes.node,
};

export default PrivateLayout;
