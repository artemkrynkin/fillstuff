import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Typography from '@material-ui/core/Typography';

import CardPaper from 'src/components/CardPaper';

import './Users.styl';

class Users extends Component {
	render() {
		const { currentUser, currentStock, members = currentStock.members } = this.props;

		const photoImgClasses = member =>
			ClassNames({
				'swo-users__member-photo': true,
				'swo-users__member-photo_null': member.isWaiting || !member.user.profilePhoto,
			});

		return (
			<CardPaper elevation={1} leftContent="Сотрудники" title>
				{members.length ? (
					<div className="swo-users__list">
						{members.map((member, index) =>
							!member.isWaiting ? (
								<div className="swo-users__item" key={member._id}>
									<NavLink
										className="swo-users__link"
										activeClassName="swo-users__link_active"
										to={`/stocks/${currentUser.activeStockId}/write-offs/${member.user._id}`}
									>
										<div className={photoImgClasses(member)}>
											{member.user.profilePhoto ? (
												<img src={member.user.profilePhoto} alt="" />
											) : (
												<FontAwesomeIcon icon={['fas', 'user-alt']} />
											)}
										</div>
										<div className="swo-users__name">{member.user.name || member.user.email || 'Аноним'}</div>
									</NavLink>
								</div>
							) : null
						)}
					</div>
				) : (
					<Typography variant="caption" align="center" component="div">
						Еще не создано ни одной категории
					</Typography>
				)}
			</CardPaper>
		);
	}
}

export default Users;
