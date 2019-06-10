import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import './index.styl';

const AuthLayout = props => {
	const { children } = props;

	return (
		<div className="page__layout">
			<div className="page__content auth-layout">
				<Link className="auth-layout__logo" to="/" />
				{children}
				<div className="auth-layout__code-of-conduct">
					Используя PosterDate, вы соглашаетесь с{' '}
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
		</div>
	);
};

AuthLayout.propTypes = {
	children: PropTypes.node,
};

export default AuthLayout;
