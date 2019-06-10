import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './index.styl';

class Sidebar extends Component {
	render() {
		const { currentUser, currentProjectId, activeProjectId = currentProjectId || currentUser.activeProjectId } = this.props;

		return (
			<aside className="sidebar">
				<div className="sidebar__wrap">
					<Link className="sidebar__logo" to={`/projects/${activeProjectId}/feed`} />
					<div className="sidebar__menu">
						{activeProjectId ? (
							<div>
								<div className="sidebar__menu-item">
									<NavLink
										className="sidebar__menu-link"
										activeClassName="sidebar__menu-link_active"
										to={`/projects/${activeProjectId}/feed`}
									>
										<div className="sidebar__menu-icon">
											<FontAwesomeIcon icon={['far', 'calendar']} />
										</div>
										Публикации
									</NavLink>
								</div>
								<div className="sidebar__menu-item">
									<NavLink
										className="sidebar__menu-link"
										activeClassName="sidebar__menu-link_active"
										to={`/projects/${activeProjectId}/content-plan`}
									>
										<div className="sidebar__menu-icon">
											<FontAwesomeIcon icon={['far', 'clipboard']} />
										</div>
										Контент-план
									</NavLink>
								</div>
								<div className="sidebar__menu-item">
									<NavLink
										className="sidebar__menu-link"
										activeClassName="sidebar__menu-link_active"
										to={`/projects/${activeProjectId}/statistics`}
									>
										<div className="sidebar__menu-icon">
											<FontAwesomeIcon icon={['far', 'chart-bar']} />
										</div>
										Статистика
									</NavLink>
								</div>
								<div className="sidebar__menu-item">
									<NavLink
										className="sidebar__menu-link"
										activeClassName="sidebar__menu-link_active"
										to={`/projects/${activeProjectId}/settings`}
									>
										<div className="sidebar__menu-icon">
											<FontAwesomeIcon icon={['fal', 'cog']} />
										</div>
										Настройки
									</NavLink>
								</div>
							</div>
						) : null}
						<div className="sidebar__menu-item sidebar__menu-item_down">
							<NavLink className="sidebar__menu-link" activeClassName="sidebar__menu-link_active" to="/support">
								<div className="sidebar__menu-icon">
									<FontAwesomeIcon icon={['fal', 'question-circle']} />
								</div>
								Помощь
							</NavLink>
						</div>
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
