import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import stylesPage from 'src/styles/page.module.css';
import styles from './index.module.css';

class Layout extends Component {
	render() {
		const { authed, theme, children } = this.props;

		return (
			<div className={stylesPage.pageWrapperContent}>
				{authed ? (
					theme === 'default' ? (
						children
					) : (
						<div className={`${stylesPage.page} ${styles.layout_bg}`}>{children}</div>
					)
				) : (
					<div className={`${stylesPage.page} ${styles.layout_bg} ${styles.container}`}>
						<Link className={styles.logo} to="/" />
						{children}
						<div className={styles.codeOfConduct}>
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

Layout.defaultProps = {
	authed: false,
	theme: 'default',
};

Layout.propTypes = {
	authed: PropTypes.bool.isRequired,
	theme: PropTypes.string.isRequired,
	children: PropTypes.node,
};

export default Layout;
