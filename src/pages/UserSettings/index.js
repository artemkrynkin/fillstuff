import React from 'react';
import loadable from '@loadable/component';

import generateMetaInfo from 'shared/generate-meta-info';

import Head from 'src/components/head';
import Header from 'src/components/Header';
import { LoadingComponent } from 'src/components/Loading';

import stylesPage from 'src/styles/page.module.css';
import styles from './index.module.css';

const Index = loadable(() => import('./components/index' /* webpackChunkName: "UserSettings_Index" */), {
	fallback: <LoadingComponent />,
});

const UserSettings = () => {
	const metaInfo = {
		pageName: 'user-settings',
		pageTitle: 'Настройки аккаунта',
	};
	const { title, description } = generateMetaInfo({
		type: metaInfo.pageName,
		data: {
			title: metaInfo.pageTitle,
		},
	});

	return (
		<div className={stylesPage.pageWrap}>
			<Head title={title} description={description} />

			<Header pageName={metaInfo.pageName} pageTitle={metaInfo.pageTitle} />
			<div className={`${stylesPage.pageContent} ${styles.container}`}>
				<div className={styles.wrapper}>
					<Index />
				</div>
			</div>
		</div>
	);
};

export default UserSettings;