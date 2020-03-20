import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { history } from 'src/helpers/history';

import { ExpansionPanel, ExpansionPanelSummary } from './styles';

import styles from './index.module.css';

class Sidebar extends Component {
	state = {
		activePage: history.location.pathname.split('/')[1],
	};

	onChangeUrl = pageName => {
		history.push({
			pathname: `/${pageName}`,
		});
	};

	componentDidMount = () => {
		history.listen((location, action) => {
			const pathnameArray = location.pathname.split('/')[1];

			this.setState({ activePage: pathnameArray });
		});
	};

	render() {
		const { activePage } = this.state;

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

						<ExpansionPanel
							TransitionProps={{
								timeout: 300,
							}}
							className={styles.menuExpansion}
							expanded={activePage === 'availability' || activePage === 'write-offs'}
							onChange={() => this.onChangeUrl('availability')}
						>
							<ExpansionPanelSummary className={styles.menuExpansionSummary}>
								<div className={styles.menuExpansionTitle}>
									<div className={styles.menuExpansionTitleIcon}>
										<FontAwesomeIcon icon={['fal', 'warehouse']} />
									</div>
									Склад
								</div>
							</ExpansionPanelSummary>
							<div className={styles.menuExpansionDetails}>
								<div className={styles.menuItem}>
									<NavLink className={styles.menuLink} activeClassName={styles.menuLink_activeExpansion} to="/availability">
										<div className={styles.menuIcon}>
											<FontAwesomeIcon icon={['fal', 'inventory']} />
										</div>
										В наличии
									</NavLink>
								</div>

								<div className={styles.menuItem}>
									<NavLink className={styles.menuLink} activeClassName={styles.menuLink_activeExpansion} to="/write-offs">
										<div className={styles.menuIcon}>
											<FontAwesomeIcon icon={['fal', 'clipboard-check']} />
										</div>
										Списания
									</NavLink>
								</div>
							</div>
						</ExpansionPanel>

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
							<NavLink className={styles.menuLink} activeClassName={styles.menuLink_active} to="/statistics">
								<div className={styles.menuIcon}>
									<FontAwesomeIcon icon={['fal', 'analytics']} />
								</div>
								Статистика
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
	}
}

export default Sidebar;
