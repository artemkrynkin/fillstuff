import React from 'react';

import Button from '@material-ui/core/Button';

import TitlePageOrLogo from './TitlePageOrLogo';

const CLProjectPublications = props => {
	const { pageTitle, theme } = props;

	return (
		<div className="header__column_left">
			<TitlePageOrLogo pageTitle={pageTitle} theme={theme} />
			<div className="header__column-group_left">
				<Button className="mui-btn-ct400" variant="contained" color="primary">
					Сегодня
				</Button>
			</div>
		</div>
	);
};

export default CLProjectPublications;
