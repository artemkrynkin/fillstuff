import React, { Component } from 'react';
import { compose } from 'redux';
import { Route, Switch, Redirect } from 'react-router';

import { MuiThemeProvider } from '@material-ui/core/styles';

import generateMetaInfo from 'shared/generate-meta-info';

import { CLIENT_URL } from './api/constants';

import { PosterDateTheme } from 'src/helpers/posterdateMuiTheme';
import signedOutFallback from 'src/helpers/signed-out-fallback';

import AuthLayout from 'src/components/AuthLayout';
import AuthViewHandler from 'src/components/authViewHandler';
import Head from 'src/components/head';
import { LoadingPage } from 'src/components/Loading';
import PrivateLayout from 'src/components/PrivateLayout';
import PrivateLayoutBG from 'src/components/PrivateLayoutBG';
import { withCurrentUser } from 'src/components/withCurrentUser';

import Login from 'src/containers/Login';
import PageNotFound from 'src/containers/PageNotFound';
import PasswordRecovery from 'src/containers/PasswordRecovery';
import ProjectContentPlan from 'src/containers/ProjectContentPlan';
import ProjectNotFound from 'src/containers/ProjectNotFound';
import ProjectPublications from 'src/containers/ProjectPublications';
import ProjectSettings from 'src/containers/ProjectSettings';
import ProjectSocialPages from 'src/containers/ProjectSocialPages';
import ProjectStatistics from 'src/containers/ProjectStatistics';
import Registration from 'src/containers/Registration';
import Support from 'src/containers/Support';
import UserSettings from 'src/containers/UserSettings';

const LoginFallback = signedOutFallback(() => <Redirect to="/projects" />, () => <AuthLayout children={<Login />} />);

const RegistrationFallback = signedOutFallback(
	() => <Redirect to="/projects" />,
	() => <AuthLayout children={<Registration />} />
);

const PasswordRecoveryFallback = signedOutFallback(
	() => <Redirect to="/projects" />,
	() => <AuthLayout children={<PasswordRecovery />} />
);

const ProjectPublicationsFallback = signedOutFallback(
	({ currentProject }) => (
		<PrivateLayout children={<ProjectPublications currentProject={currentProject} />} currentProject={currentProject} />
	),
	({ match }) => <AuthLayout children={<Login redirectPath={`${CLIENT_URL}/projects/${match.params.projectId}/feed`} />} />
);

const ProjectContentPlanFallback = signedOutFallback(
	({ currentProject }) => (
		<PrivateLayout children={<ProjectContentPlan currentProject={currentProject} />} currentProject={currentProject} />
	),
	({ match }) => (
		<AuthLayout children={<Login redirectPath={`${CLIENT_URL}/projects/${match.params.projectId}/content-plan`} />} />
	)
);

const ProjectStatisticsFallback = signedOutFallback(
	({ currentProject }) => (
		<PrivateLayout children={<ProjectStatistics currentProject={currentProject} />} currentProject={currentProject} />
	),
	({ match }) => <AuthLayout children={<Login redirectPath={`${CLIENT_URL}/projects/${match.params.projectId}/statistics`} />} />
);

const ProjectSettingsFallback = signedOutFallback(
	({ currentProject }) => (
		<PrivateLayout children={<ProjectSettings currentProject={currentProject} />} currentProject={currentProject} />
	),
	({ match }) => <AuthLayout children={<Login redirectPath={`${CLIENT_URL}/projects/${match.params.projectId}/settings`} />} />
);

const ProjectSocialPagesFallback = signedOutFallback(
	({ currentProject }) => <PrivateLayoutBG children={<ProjectSocialPages currentProject={currentProject} />} />,
	({ match }) => <AuthLayout children={<Login redirectPath={`${CLIENT_URL}/projects/${match.params.projectId}/settings`} />} />
);

const ProjectNotFoundFallback = signedOutFallback(
	({ projects, currentProject }) => (
		<PrivateLayout
			children={<ProjectNotFound projects={projects} currentProject={currentProject} />}
			currentProject={currentProject}
		/>
	),
	() => <AuthLayout children={<Login redirectPath={`${CLIENT_URL}/projects`} />} />
);

const UserSettingsFallback = signedOutFallback(
	() => <PrivateLayout children={<UserSettings />} />,
	() => <AuthLayout children={<Login redirectPath={`${CLIENT_URL}/settings`} />} />
);

const SupportFallback = signedOutFallback(
	() => <PrivateLayout children={<Support />} />,
	() => <AuthLayout children={<Login redirectPath={`${CLIENT_URL}/support`} />} />
);

class Routes extends Component {
	render() {
		const { currentUser, projects, isLoadingCurrentUser, isLoadingProjects } = this.props;
		const { title, description } = generateMetaInfo();

		return (
			<MuiThemeProvider theme={PosterDateTheme}>
				{/* Метатеги по умолчанию, переопределяемые чем-нибудь вниз по дереву */}
				<Head title={title} description={description} />

				{/*
				 AuthViewHandler often returns null, but is responsible for triggering
				 things like the 'set username' prompt when a user auths and doesn't
				 have a username set.
				 */}
				<AuthViewHandler>{() => null}</AuthViewHandler>

				{/*
				 Switch отображает только первое совпадение. Внутренняя маршрутизация происходит вниз по течению
				 https://reacttraining.com/react-router/web/api/Switch
				 */}
				<Switch>
					{/* Публичные бизнес страницы */}
					{/* Страницы приложения */}
					<Route path="/login" component={LoginFallback} exact strict sensitive />
					<Route path="/registration" component={RegistrationFallback} exact strict sensitive />
					<Route path="/password-recovery" component={PasswordRecoveryFallback} exact strict sensitive />

					<Route
						path={['/projects', '/projects/:projectId', '/projects/:projectId/:projectPage']}
						render={props => {
							const { match } = props;

							const ProjectPageFallback = ProjectPageFallback => {
								if (Array.isArray(projects) && !projects.some(project => project._id === match.params.projectId)) {
									if (!currentProject && (match.params.projectId || match.params.projectPage)) return <Redirect to="/projects" />;

									return <ProjectNotFoundFallback projects={projects} currentProject={currentProject} {...props} />;
								}

								return <ProjectPageFallback currentProject={currentProject} {...props} />;
							};

							let currentProject = null;

							if (!currentUser || !projects) {
								if (isLoadingCurrentUser || isLoadingProjects) return <LoadingPage />;

								return <LoadingPage />;
							}

							if (Array.isArray(projects) && projects.length) {
								currentProject = projects[projects.findIndex(project => match.params.projectId === project._id)];

								currentProject = currentProject
									? currentProject
									: projects[projects.findIndex(project => currentUser.activeProjectId === project._id)];
							}

							switch (match.params.projectPage) {
								case 'feed':
									return ProjectPageFallback(ProjectPublicationsFallback);
								case 'content-plan':
									return ProjectPageFallback(ProjectContentPlanFallback);
								case 'statistics':
									return ProjectPageFallback(ProjectStatisticsFallback);
								case 'settings':
									return ProjectPageFallback(ProjectSettingsFallback);
								case 'social-pages':
									return ProjectPageFallback(ProjectSocialPagesFallback);
								default: {
									if (match.params.projectPage) {
										return <PageNotFound />;
									} else if (match.params.projectId || currentUser.activeProjectId) {
										return <Redirect to={`/projects/${match.params.projectId || currentUser.activeProjectId}/feed`} />;
									} else {
										return ProjectPageFallback(ProjectNotFoundFallback);
									}
								}
							}
						}}
						exact
						strict
						sensitive
					/>

					<Route path="/settings" component={UserSettingsFallback} exact strict sensitive />

					<Route path="/support" component={SupportFallback} exact strict sensitive />
					<Route path="*" component={PageNotFound} />
				</Switch>
			</MuiThemeProvider>
		);
	}
}

export default compose(withCurrentUser)(Routes);
