/**
 * (project.control) (256) добавление и удаление аккаунтов соцсетей; приглашение участников в команду; изменение ролей и удаление участников команды
 * (project.full_control) (512) полный контроль доступа к проекту (имеет только создатель проекта)
 *
 * (publications.view) (4) просмотр публикаций
 * (publications.control) (128) создание, редактирование и удаление публикаций
 *
 * (events.view) (2) просмотр событий в контент-плане
 * (events.control) (64) создание, редактирование и удаление событий
 *
 * (drafts.view) (1) просмотр черновиков
 * (drafts.commenting) (8) комментирование черновиков
 * (drafts.own_control) (16) создание черновиков; редактирование и удаление только своих черновиков
 * (drafts.control) (32) создание черновиков; редактирование и удаление всех черновиков
 *
 * INFO: перевод черновиков в публикации - возможность появляется при наличии права доступа к созданию публикаций и к редактированию черновиков
 */
export const accessRightInBitmask = accessRightList => {
	return accessRightList
		.map(accessRight => {
			switch (accessRight) {
				case 'project.control':
					return 256;
				case 'project.full_control':
					return 512;

				case 'publications.view':
					return 4;
				case 'publications.control':
					return 128;

				case 'events.view':
					return 2;
				case 'events.control':
					return 64;

				case 'drafts.view':
					return 1;
				case 'drafts.commenting':
					return 8;
				case 'drafts.own_control':
					return 16;
				case 'drafts.control':
					return 32;

				default:
					return console.error(`Право доступа ${accessRight} указано с ошибкой или не существует`);
			}
		})
		.reduce((sumBitmasks, currentBitmask) => sumBitmasks + currentBitmask);
};

export const memberRoleTransform = (role, bitmask = false) => {
	switch (role) {
		case 'owner':
			return !bitmask
				? 'Создатель проекта'
				: accessRightInBitmask([
						'project.control',
						'project.full_control',
						'publications.view',
						'publications.control',
						'events.view',
						'events.control',
						'drafts.view',
						'drafts.commenting',
						'drafts.own_control',
						'drafts.control',
				  ]);
		case 'admin':
			return !bitmask
				? 'Администратор'
				: accessRightInBitmask([
						'project.control',
						'publications.view',
						'publications.control',
						'events.view',
						'events.control',
						'drafts.view',
						'drafts.commenting',
						'drafts.own_control',
						'drafts.control',
				  ]);
		case 'editor':
			return !bitmask
				? 'Редактор'
				: accessRightInBitmask([
						'publications.view',
						'publications.control',
						'events.view',
						'events.control',
						'drafts.view',
						'drafts.commenting',
						'drafts.own_control',
						'drafts.control',
				  ]);
		case 'author':
			return !bitmask
				? 'Автор'
				: accessRightInBitmask(['publications.view', 'events.view', 'drafts.view', 'drafts.commenting', 'drafts.own_control']);
		case 'viewer':
			return !bitmask
				? 'Наблюдатель'
				: accessRightInBitmask(['publications.view', 'events.view', 'drafts.view', 'drafts.commenting']);
		default:
			return console.error(`Роль ${role} указана с ошибкой или не существует`);
	}
};

export const checkPermissions = (role, accessRightList) =>
	memberRoleTransform(role, true) & accessRightInBitmask(accessRightList);

export const findMemberInProject = (userId, project) => {
	userId = String(userId);

	return project.members[project.members.findIndex(member => member.user && String(member.user._id) === userId)];
};
