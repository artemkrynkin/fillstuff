import React from 'react';
import { compose } from 'redux';
import Loadable from 'react-loadable';

import generateMetaInfo from 'shared/generate-meta-info';

import Head from 'src/components/head';
import Header from 'src/components/Header';
import { DisplayLoadingComponent } from 'src/components/Loading';
import { withCurrentUser } from 'src/components/withCurrentUser';

import './index.styl';

const Index = Loadable({
	loader: () => import('./components/index' /* webpackChunkName: "ProjectSettings_Index" */),
	loading: DisplayLoadingComponent,
	delay: 200,
});

const ProjectSettings = props => {
	const metaInfo = {
		pageName: 'project-settings',
		pageTitle: 'Настройки проекта',
	};
	const { title, description } = generateMetaInfo({
		type: metaInfo.pageName,
		data: {
			title: metaInfo.pageTitle,
		},
	});

	const { currentUser, currentProject } = props;

	return (
		<div className="page__wrap">
			<Head title={title} description={description} />

			<Header pageName={metaInfo.pageName} pageTitle={metaInfo.pageTitle} />
			<div className="page__content project-settings">
				<div className="page__inner-content">
					<Index currentUser={currentUser} currentProject={currentProject} />
				</div>
			</div>
		</div>
	);
};

export default compose(withCurrentUser)(ProjectSettings);
