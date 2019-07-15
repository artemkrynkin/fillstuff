import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import CardPaper from 'src/components/CardPaper';

import './Members.styl';

class Members extends Component {
	render() {
		const { currentUser, currentStock, members = currentStock.members, selectedUserId } = this.props;

		const photoImgClasses = member =>
			ClassNames({
				'swo-members__member-photo': true,
				'swo-members__member-photo_null': member.isWaiting || !member.user.profilePhoto,
			});

		return (
			<CardPaper
				elevation={1}
				leftContent="Участники"
				rightContent={
					<NavLink
						className="swo-members__show-all-link"
						activeClassName="swo-members__show-all-link_active"
						to={`/stocks/${currentUser.activeStockId}/write-offs`}
						exact
						strict
					>
						{!selectedUserId ? 'Показаны все' : 'Показать всех'}
					</NavLink>
				}
				title
			>
				<div className="swo-members__list">
					{members.map((member, index) =>
						!member.isWaiting ? (
							<div className="swo-members__item" key={index}>
								<NavLink
									className="swo-members__link"
									activeClassName="swo-members__link_active"
									to={`/stocks/${currentUser.activeStockId}/write-offs/${member.user._id}`}
									exact
									strict
								>
									<div className={photoImgClasses(member)}>
										{member.user.profilePhoto ? (
											<img src={member.user.profilePhoto} alt="" />
										) : (
											<FontAwesomeIcon icon={['fas', 'user-alt']} />
										)}
									</div>
									<div className="swo-members__name">{member.user.name || member.user.email || 'Аноним'}</div>
								</NavLink>
							</div>
						) : null
					)}
				</div>
			</CardPaper>
		);
	}
}

export default Members;
