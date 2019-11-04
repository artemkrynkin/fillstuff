import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { history } from 'src/helpers/history';

import { ExpansionPanel, ExpansionPanelSummary } from './styles';

import styles from './index.module.css';

class Sidebar extends Component {
	state = {
		activePage: history.location.pathname.split('/')[3],
	};

	onChangeUrl = pageName => (event, newExpanded) => {
		history.push({
			pathname: `/stocks/${this.props.currentUser.activeStockId}/${pageName}`,
		});
	};

	componentDidMount = () => {
		history.listen((location, action) => {
			const pathnameArray = location.pathname.split('/');

			this.setState({ activePage: pathnameArray[3] });
		});
	};

	render() {
		const { currentUser, activeStockId = currentUser.activeStockId } = this.props;
		const { activePage } = this.state;

		return (
			<aside className={styles.container}>
				<div className={styles.wrapper}>
					<Link className={styles.logo} to={`/stocks/${activeStockId}/dashboard`} />
					<div className={styles.menu}>
						{activeStockId ? (
							<div>
								<div className={styles.menuItem}>
									<NavLink className={styles.menuLink} activeClassName={styles.menuLink_active} to={`/stocks/${activeStockId}/dashboard`}>
										<div className={styles.menuIcon}>
											<FontAwesomeIcon icon={['far', 'tachometer']} />
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
									onChange={this.onChangeUrl('availability')}
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
											<NavLink
												className={styles.menuLink}
												activeClassName={styles.menuLink_activeExpansion}
												to={`/stocks/${activeStockId}/availability`}
											>
												<div className={styles.menuIcon}>
													<FontAwesomeIcon icon={['far', 'inventory']} />
												</div>
												В наличии
											</NavLink>
										</div>

										<div className={styles.menuItem}>
											<NavLink
												className={styles.menuLink}
												activeClassName={styles.menuLink_activeExpansion}
												to={`/stocks/${activeStockId}/write-offs`}
											>
												<div className={styles.menuIcon}>
													<FontAwesomeIcon icon={['fal', 'clipboard-check']} />
												</div>
												Списания
											</NavLink>
										</div>
									</div>
								</ExpansionPanel>

								<div className={styles.menuItem}>
									<NavLink
										className={styles.menuLink}
										activeClassName={styles.menuLink_active}
										to={`/stocks/${activeStockId}/procurements`}
									>
										<div className={styles.menuIcon}>
											<FontAwesomeIcon icon={['fal', 'shipping-timed']} />
										</div>
										Закупки
									</NavLink>
								</div>

								<div className={styles.menuItem}>
									<NavLink className={styles.menuLink} activeClassName={styles.menuLink_active} to={`/stocks/${activeStockId}/statistics`}>
										<div className={styles.menuIcon}>
											<FontAwesomeIcon icon={['far', 'chart-bar']} />
										</div>
										Статистика
									</NavLink>
								</div>
							</div>
						) : null}
						{activeStockId ? (
							<div className={`${styles.menuItem} ${styles.menuItem_down}`}>
								<NavLink className={styles.menuLink} activeClassName={styles.menuLink_active} to={`/stocks/${activeStockId}/settings`}>
									<div className={styles.menuIcon}>
										<FontAwesomeIcon icon={['fal', 'cog']} />
									</div>
									Настройки
								</NavLink>
							</div>
						) : null}
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
			</aside>
		);
	}
}

const mapStateToProps = state => {
	return {
		currentUser: state.user.data,
	};
};

export default connect(mapStateToProps)(Sidebar);
