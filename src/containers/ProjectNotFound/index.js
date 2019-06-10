import React from 'react';

import Typography from '@material-ui/core/Typography';

import generateMetaInfo from 'shared/generate-meta-info';

import Head from 'src/components/head';
import Header from 'src/components/Header';

import './index.styl';

const ProjectNotFound = props => {
	const { projects, currentProject } = props;

	const metaInfo = {
		pageName: 'project-notfound',
		pageTitle: currentProject ? 'Проект не найден' : 'У вас нет проектов',
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
			<div className="page__content project-notfound">
				<div className="page__inner-content">
					{currentProject ? (
						<div className="project-notfound__notfound-project">
							<Typography variant="h5" gutterBottom>
								Такого проекта нет или у&nbsp;вас нет к&nbsp;нему доступа.
							</Typography>
							<Typography variant="body1">
								Возможно, вы&nbsp;опечатались, когда вводили ссылку проекта в&nbsp;адресной строке.
							</Typography>
						</div>
					) : (
						<div className="project-notfound__create-project-or-select">
							{projects.length ? (
								<Typography variant="h5" gutterBottom>
									Создайте новый проект, чтобы начать или выберите проект из&nbsp;списка
								</Typography>
							) : (
								<Typography variant="h5" gutterBottom>
									Создайте новый проект, чтобы начать
								</Typography>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ProjectNotFound;
