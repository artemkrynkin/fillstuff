import { Router } from 'express';
import { URL } from 'url';

import User from 'api/models/user';
import Project from 'api/models/project';

import { createSigninRoutes } from 'api/routes/auth/create-signin-routes';

import { vkApi } from 'api/utils/vk-api';
import { isAuthedResolver } from 'api/utils/permissions';

const vkSocialAuthRouter = Router();
const { main } = createSigninRoutes('vkontakte', {
	scope: ['friends', 'photos', 'video', 'stories', 'wall', 'offline', 'groups', 'stats'],
});

const IS_PROD = process.env.NODE_ENV === 'production';
const FALLBACK_URL = IS_PROD ? 'https://dev.posterdate.com/projects' : 'http://localhost:3000/projects';

vkSocialAuthRouter.get(
	'/',
	isAuthedResolver,
	(req, res, next) => {
		const { projectId } = req.query;

		return Project.findOne({ _id: projectId, 'members.user': req.user._id })
			.then(project => {
				if (!project) return res.redirect(IS_PROD ? '/projects' : 'http://localhost:3000/projects');

				let memberIndex = project.members.findIndex(member => String(member.user) === String(req.user._id));

				if (!/\bowner|admin\b/.test(project.members[memberIndex].role))
					return res.redirect(IS_PROD ? '/projects' : 'http://localhost:3000/projects');

				return User.findById(req.user._id)
					.then(user => {
						vkApi('secure.checkToken', 'e5678f37e5678f37e5678f37d7e50f1ce2ee567e5678f37b9395e65629d46c0389a64a9', {
							token: user.vkProvider.accessToken,
							client_secret: '9BrxK7mu9jT2VXUAZNNn',
						})
							.then(() => {
								const redirectUrl = new URL(`${FALLBACK_URL}/${projectId}/social-pages`);

								redirectUrl.searchParams.append('from', 'vk');

								return res.redirect(redirectUrl);
							})
							.catch(() => {
								req.session.connectSocialPages = {
									projectId: projectId,
									provider: 'vk',
								};

								next();
							});
					})
					.catch(err => next(err));
			})
			.catch(err => next(err));
	},
	main
);

export default vkSocialAuthRouter;
