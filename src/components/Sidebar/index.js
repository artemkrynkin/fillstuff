import React from 'react';
import { NavLink } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './index.module.css';

const Sidebar = () => {
	return (
		<div className={styles.container}>
			<div className={styles.wrapper}>
				<div className={styles.logo} />
				<div className={styles.menu}>
					<div className={styles.menuItem}>
						<NavLink className={styles.menuLink} activeClassName={styles.menuLink_active} to="/dashboard">
							<div className={styles.menuIcon}>
								<FontAwesomeIcon icon={['fal', 'tachometer']} />
							</div>
							Монитор
						</NavLink>
					</div>

					<div className={styles.menuItem}>
						<NavLink className={styles.menuLink} activeClassName={styles.menuLink_active} to="/stock">
							<div className={styles.menuIcon}>
								<FontAwesomeIcon icon={['fal', 'inventory']} />
							</div>
							Склад
						</NavLink>
					</div>

					<div className={styles.menuItem}>
						<NavLink className={styles.menuLink} activeClassName={styles.menuLink_active} to="/write-offs">
							<div className={styles.menuIcon}>
								<FontAwesomeIcon icon={['fal', 'scanner']} />
							</div>
							Списания
						</NavLink>
					</div>

					<div className={styles.menuItem}>
						<NavLink className={styles.menuLink} activeClassName={styles.menuLink_active} to="/stocktaking">
							<div className={styles.menuIcon}>
								<FontAwesomeIcon icon={['fal', 'file-edit']} />
							</div>
							Инвентаризации
						</NavLink>
					</div>

					<div className={styles.menuItem}>
						<NavLink className={styles.menuLink} activeClassName={styles.menuLink_active} to="/procurements">
							<div className={styles.menuIcon}>
								<FontAwesomeIcon icon={['fal', 'shopping-basket']} />
							</div>
							Закупки
						</NavLink>
					</div>

					<div className={styles.menuItem}>
						<NavLink className={styles.menuLink} activeClassName={styles.menuLink_active} to="/invoices">
							<div className={styles.menuIcon}>
								<FontAwesomeIcon icon={['fal', 'receipt']} />
							</div>
							Счета
						</NavLink>
					</div>

					<div className={styles.menuItem}>
						<NavLink className={styles.menuLink} activeClassName={styles.menuLink_active} to="/members">
							<div className={styles.menuIcon}>
								<FontAwesomeIcon icon={['fal', 'users']} />
							</div>
							Команда
						</NavLink>
					</div>

					<div className={styles.menuItem}>
						<NavLink className={styles.menuLink} activeClassName={styles.menuLink_active} to="/settings">
							<div className={styles.menuIcon}>
								<FontAwesomeIcon icon={['fal', 'cog']} />
							</div>
							Настройки
						</NavLink>
					</div>
					{/*<div className={`${styles.menuItem} ${styles.menuItem_down}`}>*/}
					{/*	<NavLink*/}
					{/*    className={styles.menuLink}*/}
					{/*    activeClassName={styles.menuLink_active}*/}
					{/*    to="/support"*/}
					{/*  >*/}
					{/*    <div className={styles.menuIcon}>*/}
					{/*			<FontAwesomeIcon icon={['fal', 'question-circle']} />*/}
					{/*		</div>*/}
					{/*		Помощь*/}
					{/*	</NavLink>*/}
					{/*</div>*/}
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
