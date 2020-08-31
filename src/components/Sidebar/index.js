import React from 'react';
import { NavLink } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './index.module.css';

const routes = [
	{
		path: '/dashboard',
		name: 'Монитор',
		icon: <FontAwesomeIcon icon={['fal', 'tachometer']} fixedWidth />,
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

const Sidebar = () => {
	return (
		<div className={styles.container}>
			<div className={styles.wrapper}>
				<div className={styles.logo} />
				<div className={styles.menu}>
					{routes.length &&
						routes.map((route, index) => (
							<NavLink key={index} className={styles.menuLink} activeClassName={styles.menuLink_active} to={route.path}>
								{route.icon}
								<span className={styles.menuText}>{route.name}</span>
							</NavLink>
						))}
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
