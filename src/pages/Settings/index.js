import React from 'react';
import { compose } from 'redux';

import generateMetaInfo from 'shared/generate-meta-info';

import Head from 'src/components/head';
import HeaderPage from 'src/components/HeaderPage';
import { withCurrentUser } from 'src/components/withCurrentUser';

import stylesPage from 'src/styles/page.module.css';
import styles from './index.module.css';

import Index from './containers/index';

const Settings = props => {
	const { currentUser, currentStudio } = props;

	const metaInfo = {
		pageName: 'settings',
		pageTitle: 'Настройки',
	};
	const { title, description } = generateMetaInfo({
		type: metaInfo.pageName,
		data: {
			title: metaInfo.pageTitle,
		},
	});

	return (
		<div className={stylesPage.page}>
			<Head title={title} description={description} />

			<HeaderPage pageName={metaInfo.pageName} pageTitle={metaInfo.pageTitle} />
			<div className={`${stylesPage.pageContent} ${styles.container}`}>
				<Index currentUser={currentUser} currentStudio={currentStudio} />
			</div>
		</div>
	);
};

export default compose(withCurrentUser)(Settings);
