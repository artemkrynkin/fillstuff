import React from 'react';
import Loadable from 'react-loadable';

import generateMetaInfo from 'shared/generate-meta-info';

import Head from 'src/components/head';
import Header from 'src/components/Header';
import { DisplayLoadingComponent } from 'src/components/Loading';

import './index.styl';

const Index = Loadable({
	loader: () => import('./components/index' /* webpackChunkName: "UserSettings_Index" */),
	loading: DisplayLoadingComponent,
	delay: 200,
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
		<div className="page__wrap">
			<Head title={title} description={description} />

			<Header pageName={metaInfo.pageName} pageTitle={metaInfo.pageTitle} />
			<div className="page__content user-settings">
				<div className="page__inner-content">
					<Index />
				</div>
			</div>
		</div>
	);
};

export default UserSettings;
