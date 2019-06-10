import { Router } from 'express';
import i18n from 'i18n';

import { isAuthedResolver, hasPermissionsInProject } from 'api/utils/permissions';
import { vkApi } from 'api/utils/vk-api';

import Project from 'api/models/project';
import User from 'api/models/user';

const socialPagesRouter = Router();

const debug = require('debug')('api:projects-social-pages');

socialPagesRouter.get('/social-pages', isAuthedResolver, (req, res, next) => {
	const { socialNetwork } = req.query;

	if (!socialNetwork)
		return next({
			code: 6,
			message: i18n.__('Социальная сеть не указана'),
		});

	User.findById(req.user._id)
		.then(async user => {
			const socialPages = [];

			if (!user.vkProvider.accessToken)
				return next({
					code: 3,
				});

			switch (socialNetwork) {
				case 'vk': {
					await vkApi('users.get', user.vkProvider.accessToken, {
						fields: 'photo_200',
					})
						.then(body =>
							body.forEach(socialPage =>
								socialPages.push({
									pageId: socialPage.id,
									name: `${socialPage.first_name} ${socialPage.last_name}`,
									photo: socialPage.photo_200,
								})
							)
						)
						.catch(err =>
							next({
								code: 1,
								err,
							})
						);

					await vkApi('groups.get', user.vkProvider.accessToken, {
						extended: 1,
						filter: 'editor',
					})
						.then(body =>
							body.items.forEach(socialPage =>
								socialPages.push({
									pageId: -socialPage.id,
									name: socialPage.name,
									photo: socialPage.photo_200,
								})
							)
						)
						.catch(err =>
							next({
								code: 1,
								err,
							})
						);

					return setTimeout(() => res.json(socialPages), 250);
				}
				default: {
					return next({
						code: 6,
						message: i18n.__('Социальная сеть не поддерживается'),
					});
				}
			}
		})
		.catch(err => next(err));
});

socialPagesRouter.post(
	'/:projectId/social-pages',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInProject(req, res, next, ['project.control']),
	(req, res, next) => {
		const { socialNetwork, socialPageIds } = req.body;

		if (!socialPageIds.length)
			return next({
				code: 6,
				message: i18n.__('Список социальных страниц для подключения пуст'),
			});

		User.findById(req.user._id)
			.then(async user => {
				const socialPages = [];

				switch (socialNetwork) {
					case 'vk': {
						await vkApi('users.get', user.vkProvider.accessToken, {
							fields: 'photo_200',
						})
							.then(body =>
								body.forEach(socialPage => {
									if (socialPageIds.some(socialPageId => socialPageId === socialPage.id)) {
										socialPages.push({
											pageId: socialPage.id,
											url: `https://vk.com/id${socialPage.id}`,
											name: `${socialPage.first_name} ${socialPage.last_name}`,
											photo: socialPage.photo_200,
										});
									}
								})
							)
							.catch(err =>
								next({
									code: 1,
									err,
								})
							);

						await vkApi('groups.get', user.vkProvider.accessToken, {
							user_id: user.vkProvider.userId,
							extended: 1,
							filter: 'editor',
						})
							.then(body =>
								body.items.forEach(socialPage => {
									if (socialPageIds.some(socialPageId => socialPageId === -socialPage.id)) {
										socialPages.push({
											pageId: -socialPage.id,
											url: `https://vk.com/club${socialPage.id}`,
											name: socialPage.name,
											photo: socialPage.photo_200,
										});
									}
								})
							)
							.catch(err =>
								next({
									code: 1,
									err,
								})
							);
						break;
					}
					default: {
						return next({
							code: 6,
							message: i18n.__('Социальная сеть не поддерживается'),
						});
					}
				}

				const activeSocialPages = socialPages.map(socialPage => {
					return {
						owner: req.user._id,
						...socialPage,
						active: true,
						network: socialNetwork,
					};
				});

				return Project.findByIdAndUpdate(
					req.params.projectId,
					{ $addToSet: { socialPages: { $each: activeSocialPages } } },
					{ new: true, runValidators: true, fields: { 'members.invitationCode': false } }
				)
					.then(project => res.json(project.socialPages))
					.catch(err =>
						next({
							code: err.errors ? 5 : 2,
							err,
						})
					);
			})
			.catch(err => next(err));
	}
);

socialPagesRouter.get(
	'/:projectId/social-pages/:socialPageId/update',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInProject(req, res, next, ['project.control']),
	(req, res, next) => {
		Project.findById(req.params.projectId, {
			socialPages: true,
		})
			.populate('socialPages.owner')
			.then(project => {
				const socialPageIndex = project.socialPages.findIndex(
					socialPage => socialPage.pageId === Number(req.params.socialPageId)
				);

				return User.findById(req.user._id)
					.then(async user => {
						switch (project.socialPages[socialPageIndex].network) {
							case 'vk': {
								const methodVkApi = project.socialPages[socialPageIndex].pageId > 0 ? 'users.get' : 'groups.getById';
								const optionsVkApi =
									project.socialPages[socialPageIndex].pageId > 0
										? { user_ids: project.socialPages[socialPageIndex].pageId, fields: 'photo_200' }
										: { group_id: Math.abs(project.socialPages[socialPageIndex].pageId) };
								let accessTokenForUpdate = '';

								await vkApi('secure.checkToken', 'e5678f37e5678f37e5678f37d7e50f1ce2ee567e5678f37b9395e65629d46c0389a64a9', {
									token: user.vkProvider.accessToken,
									client_secret: '9BrxK7mu9jT2VXUAZNNn',
								})
									.then(() => (accessTokenForUpdate = user.vkProvider.accessToken))
									.catch(async err => {
										if (err.error_code !== 15)
											return next({
												code: 1,
												err,
											});

										await vkApi('secure.checkToken', 'e5678f37e5678f37e5678f37d7e50f1ce2ee567e5678f37b9395e65629d46c0389a64a9', {
											token: project.socialPages[socialPageIndex].owner.vkProvider.accessToken,
											client_secret: '9BrxK7mu9jT2VXUAZNNn',
										})
											.then(() => (accessTokenForUpdate = project.socialPages[socialPageIndex].owner.vkProvider.accessToken))
											.catch(err =>
												next({
													code: err.error_code === 15 ? 6 : 1,
													message: i18n.__(
														'Отсутствует доступ к аккаунту ВКонтакте, предоставьте доступ, чтобы обновить данные страницы'
													),
													err,
												})
											);
									});

								if (!accessTokenForUpdate) return;

								await vkApi(methodVkApi, accessTokenForUpdate, optionsVkApi)
									.then(body =>
										body.forEach(socialPage => {
											project.socialPages[socialPageIndex].name =
												project.socialPages[socialPageIndex].pageId > 0
													? `${socialPage.first_name} ${socialPage.last_name}`
													: socialPage.name;
											project.socialPages[socialPageIndex].photo = socialPage.photo_200;
										})
									)
									.catch(err =>
										next({
											code: 1,
											err,
										})
									);
								break;
							}
							default: {
								return next({
									code: 6,
									message: i18n.__('Социальная сеть не поддерживается'),
								});
							}
						}

						return Project.findByIdAndUpdate(req.params.projectId, { $set: { socialPages: project.socialPages } }, { new: true })
							.then(project => setTimeout(() => res.json(project.socialPages[socialPageIndex]), 500))
							.catch(err =>
								next({
									code: 2,
									err,
								})
							);
					})
					.catch(err => next(err));
			})
			.catch(err => next(err));
	}
);

socialPagesRouter.delete(
	'/:projectId/social-pages/:socialPageId',
	isAuthedResolver,
	(req, res, next) => hasPermissionsInProject(req, res, next, ['project.control']),
	(req, res, next) => {
		Project.findByIdAndUpdate(req.params.projectId, { $pull: { socialPages: { pageId: req.params.socialPageId } } })
			.then(() => res.json('success'))
			.catch(err =>
				next({
					code: 2,
					err,
				})
			);
	}
);

export default socialPagesRouter;
