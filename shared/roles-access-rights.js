/**
 * (studio.control) (256) добавление и удаление аккаунтов соцсетей; приглашение участников в команду; изменение ролей и удаление участников команды
 * (studio.full_control) (512) полный контроль доступа к проекту (имеет только владелец)
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
				case 'studio.control':
					return 256;
				case 'studio.full_control':
					return 512;

				case 'products.control':
					return 4;
				case 'products.scanning':
					return 8;

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
				? 'Владелец'
				: accessRightInBitmask(['studio.control', 'studio.full_control', 'products.control', 'products.scanning']);
		case 'admin':
			return !bitmask ? 'Администратор' : accessRightInBitmask(['studio.control', 'products.control', 'products.scanning']);
		case 'user':
			return !bitmask ? 'Сотрудник' : accessRightInBitmask(['products.scanning']);
		default:
			return console.error(`Роль ${role} указана с ошибкой или не существует`);
	}
};

export const checkPermissions = (role, accessRightList) => memberRoleTransform(role, true) & accessRightInBitmask(accessRightList);
