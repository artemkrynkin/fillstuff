import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ClassNames from 'classnames';
import queryString from 'query-string';

import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import FormHelperText from '@material-ui/core/FormHelperText';
import Typography from '@material-ui/core/Typography';

import generateMetaInfo from 'shared/generate-meta-info';

import { history } from 'src/helpers/history';

import Head from 'src/components/head';
import Header from 'src/components/Header';

import { getSocialPagesFromNetwork, connectSocialPages } from 'src/actions/projects';

import './index.styl';

const SocialPageIdsSchema = Yup.object().shape({
	socialPageIds: Yup.array().min(1, 'Выберите хотя бы одну страницу для подключения'),
});

class ProjectSocialPages extends Component {
	state = {
		allSocialPages: [],
		isFetching: true,
		responseError: false,
	};

	componentDidMount = () => {
		const socialNetwork = queryString.parse(history.location.search).from;

		switch (socialNetwork) {
			case 'vk':
				return getSocialPagesFromNetwork(socialNetwork).then(response => {
					this.setState({
						allSocialPages: Array.isArray(response.data) ? response.data : [],
						isFetching: false,
						responseError: !Array.isArray(response.data),
					});
				});
			default:
				this.setState({ allSocialPages: [], isFetching: false, responseError: true });
				return;
		}
	};

	render() {
		const metaInfo = {
			pageName: 'project-social-pages',
			pageTitle: 'Выбор страниц',
		};
		const { title, description } = generateMetaInfo({
			type: metaInfo.pageName,
			data: {
				title: metaInfo.pageTitle,
			},
		});
		const { currentProject } = this.props;
		const {
			allSocialPages,
			availableSocialPages = allSocialPages.filter(socialPage => {
				return !currentProject.socialPages.some(connectedSocialPage => connectedSocialPage.pageId === socialPage.pageId);
			}),
			isFetching,
			responseError,
		} = this.state;

		const socialNetwork = queryString.parse(history.location.search).from;

		let pageClasses = (socialPage, socialPageIds) => {
			return ClassNames({
				'project-social-pages__page': true,
				'project-social-pages__page_selected': socialPageIds.some(
					selectedSocialPageId => selectedSocialPageId === socialPage.pageId
				),
			});
		};

		return (
			<div className="page__wrap">
				<Head title={title} description={description} />

				<Header pageName={metaInfo.pageName} pageTitle={metaInfo.pageTitle} theme="bg" positionStatic />
				<div className="page__content project-social-pages">
					<div className="page__inner-content">
						<Formik
							initialValues={{ socialPageIds: [] }}
							validationSchema={SocialPageIdsSchema}
							onSubmit={(values, actions) => {
								this.props.connectSocialPages(currentProject._id, socialNetwork, values.socialPageIds).then(() => {
									history.push({ pathname: `/projects/${currentProject._id}/settings` });
								});
							}}
							render={({ errors, touched, isSubmitting, values }) => (
								<Form>
									{!isFetching && availableSocialPages.length ? (
										<Typography variant="h6" align="center" gutterBottom>
											Выберите страницы которые нужно подключить к проекту <b>{currentProject.name}</b>
										</Typography>
									) : !isFetching && !availableSocialPages.length && !responseError ? (
										<Typography variant="h6" align="center" gutterBottom>
											Все социальные страницы из вашего аккаунта подключены к проекту <b>{currentProject.name}</b>
										</Typography>
									) : !isFetching && responseError ? (
										<Typography variant="h6" align="center" gutterBottom>
											Социальная сеть не поддерживается, не указана или произошла неизвестная ошибка
										</Typography>
									) : null}
									<div className="project-social-pages__page-list">
										{!isFetching ? (
											availableSocialPages.length ? (
												<FieldArray
													name="socialPageIds"
													render={arrayHelpers =>
														availableSocialPages.map((socialPage, index) => (
															<div
																key={index}
																className={pageClasses(socialPage, values.socialPageIds)}
																onClick={() => {
																	const socialPageId = values.socialPageIds.findIndex(
																		selectedSocialPageId => selectedSocialPageId === socialPage.pageId
																	);

																	if (!!~socialPageId) return arrayHelpers.remove(socialPageId);
																	else return arrayHelpers.push(socialPage.pageId);
																}}
															>
																<div className="project-social-pages__page-photo">
																	<img src={socialPage.photo} alt="" />
																</div>
																<div className="project-social-pages__page-name">{socialPage.name}</div>
																<div className="project-social-pages__page-checkbox">
																	<FontAwesomeIcon icon={['far', 'check']} />
																</div>
															</div>
														))
													}
												/>
											) : null
										) : (
											<div children={<CircularProgress size={20} />} style={{ textAlign: 'center' }} />
										)}
									</div>
									{errors && errors.socialPageIds ? (
										<FormHelperText error={true} style={{ textAlign: 'center' }}>
											{errors.socialPageIds}
										</FormHelperText>
									) : null}
									<Grid className="pd-rowGridFormSubmit" justify="space-between" container>
										<Button to={`/projects/${currentProject._id}/settings`} variant="outlined" component={Link}>
											Назад
										</Button>
										<Button
											type="submit"
											disabled={isSubmitting || isFetching || !availableSocialPages.length || responseError}
											variant="contained"
											color="primary"
										>
											{isSubmitting ? <CircularProgress size={20} style={{ position: 'absolute' }} /> : null}
											<span style={{ opacity: Number(!isSubmitting) }}>Подключить</span>
										</Button>
									</Grid>
								</Form>
							)}
						/>
					</div>
				</div>
			</div>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		connectSocialPages: (projectId, socialNetwork, socialPageIds) =>
			dispatch(connectSocialPages(projectId, socialNetwork, socialPageIds)),
	};
};

export default connect(
	null,
	mapDispatchToProps
)(ProjectSocialPages);
