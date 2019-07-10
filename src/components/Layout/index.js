import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import './index.styl';

class Layout extends Component {
	render() {
		const { children, authed = false, theme = 'default' } = this.props;

		return (
			<div className="page__layout">
				{authed ? (
					theme === 'default' ? (
						children
					) : (
						<div className="page__content layout_bg">{children}</div>
					)
				) : (
					<div className="page__content layout_bg layout-auth">
						<Link className="layout-auth__logo" to="/" />
						{children}
						<div className="layout-auth__code-of-conduct">
							Используя Blikside, вы соглашаетесь с{' '}
							<a href="/manifest.json" target="_blank" rel="noreferrer noopener">
								Политикой конфиденциальности
							</a>
							{' и '}
							<a href="/manifest.json" target="_blank" rel="noreferrer noopener">
								Условиями использования
							</a>
							.
						</div>
					</div>
				)}
			</div>
		);
	}
}

Layout.propTypes = {
	children: PropTypes.node,
};

export default Layout;
