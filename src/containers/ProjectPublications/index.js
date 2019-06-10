import React from 'react';
import Loadable from 'react-loadable';

import generateMetaInfo from 'shared/generate-meta-info';

import Head from 'src/components/head';
import Header from 'src/components/Header';
import { DisplayLoadingComponent } from 'src/components/Loading';

import './index.styl';

const Filter = Loadable({
	loader: () => import('./components/Filter' /* webpackChunkName: "ProjectPublications_Filter" */),
	loading: () => null,
	delay: 200,
});

const Plan = Loadable({
	loader: () => import('./components/Plan' /* webpackChunkName: "ProjectPublications_Plan" */),
	loading: DisplayLoadingComponent,
	delay: 200,
});

const ProjectPublications = () => {
	const metaInfo = {
		pageName: 'project-publications',
		pageTitle: 'Публикации',
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
			<div className="page__content project-publications">
				<Filter />
				<div className="page__inner-content">
					<Plan />
				</div>
			</div>
		</div>
	);
};

export default ProjectPublications;
