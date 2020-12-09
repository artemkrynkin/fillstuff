import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const routes = [
	{
		path: '/',
		name: 'Монитор',
		icon: <FontAwesomeIcon icon={['fal', 'tachometer']} fixedWidth />,
		exact: true,
		strict: true,
	},
	{
		path: '/stock',
		name: 'Склад',
		icon: <FontAwesomeIcon icon={['fal', 'inventory']} fixedWidth />,
	},
	{
		path: '/write-offs',
		name: 'Списания',
		icon: <FontAwesomeIcon icon={['fal', 'scanner']} fixedWidth />,
	},
	{
		path: '/stocktaking',
		name: 'Инвентаризации',
		icon: <FontAwesomeIcon icon={['fal', 'file-edit']} fixedWidth />,
	},
	{
		path: '/procurements',
		name: 'Закупки',
		icon: <FontAwesomeIcon icon={['fal', 'shopping-basket']} fixedWidth />,
	},
	{
		path: '/invoices',
		name: 'Счета',
		icon: <FontAwesomeIcon icon={['fal', 'receipt']} fixedWidth />,
	},
	{
		path: '/members',
		name: 'Команда',
		icon: <FontAwesomeIcon icon={['fal', 'users']} fixedWidth />,
	},
	{
		path: '/settings',
		name: 'Настройки',
		icon: <FontAwesomeIcon icon={['fal', 'cog']} fixedWidth />,
	},
];
