/**
 * (studio.control) (256) функции администратора
 * (studio.full_control) (512) функции владельца
 *
 */
export const accessRightListToBitmask = accessRightList => {
	if (!accessRightList.length) return 0;

	return accessRightList.reduce((sumBitmasks, accessRight) => {
		const accessRightToBitmask = () => {
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
					console.error(`Право доступа ${accessRight} указано с ошибкой или не существует`);

					return 0;
			}
		};

		return sumBitmasks + accessRightToBitmask();
	}, 0);
};

export const memberRoleTransform = (roles, bitmask = false) => {
	const accessRights = [];
	const rolesTransform = [];

	roles.forEach(role => {
		switch (role) {
			case 'owner':
				return bitmask
					? accessRights.push('studio.full_control', 'studio.control', 'products.control', 'products.scanning')
					: rolesTransform.push('Владелец');
			case 'admin':
				return bitmask
					? accessRights.push('studio.control', 'products.control', 'products.scanning')
					: rolesTransform.push('Администратор');
			case 'artist':
				return bitmask ? accessRights.push('products.scanning') : rolesTransform.push('Мастер');
			case '':
				return;
			default:
				return console.error(`Роль ${role} указана с ошибкой или не существует`);
		}
	});

	return bitmask ? accessRightListToBitmask(Array.from(new Set(accessRights))) : rolesTransform;
};

export const checkPermissions = (roles, accessRightList) => memberRoleTransform(roles, true) & accessRightListToBitmask(accessRightList);
