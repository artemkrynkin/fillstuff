import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';

import colorPalette from 'shared/colorPalette';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import { withStyles } from '@material-ui/core/styles';

import { history } from 'src/helpers/history';

import './index.styl';

const ExpansionPanel = withStyles({
	root: {
		border: 'none',
		boxShadow: 'none',
		'&:before': {
			display: 'none',
		},
		'&$expanded': {
			backgroundColor: colorPalette.slateGrey.cSg5,
			borderRadius: 0,
			margin: 0,
			paddingBottom: 10,
			opacity: 1,
			'&:hover': {
				backgroundColor: colorPalette.slateGrey.cSg5,
			},
		},
	},
	expanded: {},
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
	root: {
		minHeight: 42,
		'&$expanded': {
			minHeight: 42,
		},
		'&$focused': {
			backgroundColor: 'transparent',
		},
	},
	content: {
		'&$expanded': {
			margin: '12px 0',
		},
	},
	focused: {},
	expanded: {},
})(MuiExpansionPanelSummary);

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
			<aside className="sidebar">
				<div className="sidebar__wrap">
					<Link className="sidebar__logo" to={`/stocks/${activeStockId}/dashboard`} />
					<div className="sidebar__menu">
						{activeStockId ? (
							<div>
								<div className="sidebar__menu-item">
									<NavLink
										className="sidebar__menu-link"
										activeClassName="sidebar__menu-link_active"
										to={`/stocks/${activeStockId}/dashboard`}
									>
										<div className="sidebar__menu-icon">
											<FontAwesomeIcon icon={['far', 'tachometer']} />
										</div>
										Монитор
									</NavLink>
								</div>

								<ExpansionPanel
									className="sidebar__menu-expansion"
									expanded={activePage === 'availability' || activePage === 'write-offs'}
									onChange={this.onChangeUrl('availability')}
								>
									<ExpansionPanelSummary className="sidebar__menu-expansion-summary">
										<div className="sidebar__menu-expansion-title">
											<div className="sidebar__menu-expansion-title-icon">
												<FontAwesomeIcon icon={['fal', 'warehouse']} />
											</div>
											Склад
										</div>
									</ExpansionPanelSummary>
									<div className="sidebar__menu-expansion-details">
										<div className="sidebar__menu-item">
											<NavLink
												className="sidebar__menu-link"
												activeClassName="sidebar__menu-link_active-expansion"
												to={`/stocks/${activeStockId}/availability`}
											>
												<div className="sidebar__menu-icon">
													<FontAwesomeIcon icon={['far', 'inventory']} />
												</div>
												Наличие
											</NavLink>
										</div>

										<div className="sidebar__menu-item">
											<NavLink
												className="sidebar__menu-link"
												activeClassName="sidebar__menu-link_active-expansion"
												to={`/stocks/${activeStockId}/write-offs`}
											>
												<div className="sidebar__menu-icon">
													<FontAwesomeIcon icon={['fal', 'clipboard-check']} />
												</div>
												Списания
											</NavLink>
										</div>
									</div>
								</ExpansionPanel>

								<ExpansionPanel
									className="sidebar__menu-expansion"
									expanded={activePage === 'orders' || activePage === 'purchases'}
									onChange={this.onChangeUrl('orders')}
								>
									<ExpansionPanelSummary className="sidebar__menu-expansion-summary">
										<div className="sidebar__menu-expansion-title">
											<div className="sidebar__menu-expansion-title-icon">
												<FontAwesomeIcon icon={['fal', 'shipping-timed']} />
											</div>
											Поступления
										</div>
									</ExpansionPanelSummary>
									<div className="sidebar__menu-expansion-details">
										<div className="sidebar__menu-item">
											<NavLink
												className="sidebar__menu-link"
												activeClassName="sidebar__menu-link_active-expansion"
												to={`/stocks/${activeStockId}/orders`}
											>
												<div className="sidebar__menu-icon">
													<FontAwesomeIcon icon={['fal', 'shopping-cart']} />
												</div>
												Заказы
											</NavLink>
										</div>

										<div className="sidebar__menu-item">
											<NavLink
												className="sidebar__menu-link"
												activeClassName="sidebar__menu-link_active-expansion"
												to={`/stocks/${activeStockId}/purchases`}
											>
												<div className="sidebar__menu-icon">
													<FontAwesomeIcon icon={['fal', 'bags-shopping']} />
												</div>
												Покупки
											</NavLink>
										</div>
									</div>
								</ExpansionPanel>

								<div className="sidebar__menu-item">
									<NavLink
										className="sidebar__menu-link"
										activeClassName="sidebar__menu-link_active"
										to={`/stocks/${activeStockId}/statistics`}
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
										to={`/stocks/${activeStockId}/settings`}
									>
										<div className="sidebar__menu-icon">
											<FontAwesomeIcon icon={['fal', 'cog']} />
										</div>
										Настройки
									</NavLink>
								</div>
							</div>
						) : null}
						{/*<div className="sidebar__menu-item sidebar__menu-item_down">*/}
						{/*	<NavLink className="sidebar__menu-link" activeClassName="sidebar__menu-link_active" to="/support">*/}
						{/*		<div className="sidebar__menu-icon">*/}
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
