import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Grid from '@material-ui/core/Grid';

import CardPaper from 'src/components/CardPaper';

import styles from './Members.module.css';

class Members extends Component {
	render() {
		const { currentUser, currentStock, members = currentStock.members, selectedUserId } = this.props;

		const photoImgClasses = member =>
			ClassNames({
				[styles.photo]: true,
				[styles.photo_null]: member.isWaiting || !member.user.profilePhoto,
			});

		return (
			<Grid className={styles.container} item xs={3}>
				<CardPaper
					elevation={1}
					leftContent="Участники"
					rightContent={
						<NavLink
							className={styles.linkShowAll}
							activeClassName={styles.linkShowAll_active}
							to={`/stocks/${currentUser.activeStockId}/write-offs`}
							exact
							strict
						>
							{!selectedUserId ? 'Показаны все' : 'Показать всех'}
						</NavLink>
					}
					title
				>
					<div className={styles.list}>
						{members.map((member, index) =>
							!member.isWaiting ? (
								<div className={styles.item} key={index}>
									<NavLink
										className={styles.link}
										activeClassName={styles.link_active}
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
										<div className={styles.name}>{member.user.name || member.user.email || 'Аноним'}</div>
									</NavLink>
								</div>
							) : null
						)}
					</div>
				</CardPaper>
			</Grid>
		);
	}
}

export default Members;
