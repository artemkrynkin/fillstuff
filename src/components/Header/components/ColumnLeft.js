import React from 'react';

import CLProjectPublications from './CLProjectPublications';
import CLProjectContentPlan from './CLProjectContentPlan';
import TitlePageOrLogo from './TitlePageOrLogo';

const ColumnLeft = props => {
	const { pageName, pageTitle, theme, calendar } = props;

	switch (pageName) {
		case 'project-publications':
			return <CLProjectPublications pageTitle={pageTitle} theme={theme} />;
		case 'project-content-plan':
			return <CLProjectContentPlan calendar={calendar} theme={theme} />;
		default:
			return (
				<div className="header__column_left">
					<TitlePageOrLogo pageTitle={pageTitle} theme={theme} />
				</div>
			);
	}
};

export default ColumnLeft;
