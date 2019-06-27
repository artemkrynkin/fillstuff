import React from 'react';
import { Link } from 'react-router-dom';

const TitlePageOrLogo = props => {
	const { pageTitle, theme } = props;

	return (
		<div className="header__column-group_left">
			{theme !== 'bg' ? <div className="header__title-page">{pageTitle}</div> : <Link className="header__logo" to="/stocks" />}
		</div>
	);
};

export default TitlePageOrLogo;
