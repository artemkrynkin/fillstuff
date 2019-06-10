import React, { Component } from 'react';
import Loadable from 'react-loadable';

import generateMetaInfo from 'shared/generate-meta-info';

import Head from 'src/components/head';
import Header from 'src/components/Header';
import { DisplayLoadingComponent } from 'src/components/Loading';

import './index.styl';

const Index = Loadable({
	loader: () => import('./components/index' /* webpackChunkName: "ProjectContentPlan_Index" */),
	loading: DisplayLoadingComponent,
	delay: 200,
});

class ProjectContentPlan extends Component {
	calendarRef = React.createRef();

	render() {
		const { currentProject } = this.props;

		const calendar = {
			ref: this.calendarRef,
			defaultDate: new Date(),
			defaultView: 'dayGridMonth',
			timeZone: currentProject.timezone,
		};

		const metaInfo = {
			pageName: 'project-content-plan',
			pageTitle: 'Контент-план',
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

				<Header pageName={metaInfo.pageName} pageTitle={metaInfo.pageTitle} calendar={calendar} sadasdas={this.sadasdas} />
				<div className="page__content project-content-plan">
					<div className="page__inner-content">
						<Index currentProject={currentProject} calendar={calendar} />
					</div>
				</div>
			</div>
		);
	}
}

export default ProjectContentPlan;
