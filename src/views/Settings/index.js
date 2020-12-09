import React from 'react';
import { compose } from 'redux';

import Layout from 'src/components/Layout';
import HeaderPage from 'src/components/HeaderPage';
import { withCurrentUser } from 'src/components/withCurrentUser';

import stylesPage from 'src/styles/page.module.css';
import styles from './index.module.css';

import Index from './containers/index';

const Settings = props => {
	const { currentUser, currentStudio } = props;

	const layoutMetaInfo = {
		pageName: 'dashboard',
		pageTitle: 'Монитор',
	};

	return (
		<Layout metaInfo={layoutMetaInfo}>
			<HeaderPage pageName={layoutMetaInfo.pageName} pageTitle={layoutMetaInfo.pageTitle} />
			<div className={`${stylesPage.pageContent} ${styles.container}`}>
				<Index currentUser={currentUser} currentStudio={currentStudio} />
			</div>
		</Layout>
	);
};

export default compose(withCurrentUser)(Settings);
