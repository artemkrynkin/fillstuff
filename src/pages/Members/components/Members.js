import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

import { getMembers } from 'src/actions/members';

import Member from './Member';

import styles from './Members.module.css';

class Members extends Component {
	componentDidMount() {
		const { filterParams } = this.props;

		const query = { ...filterParams };

		Object.keys(query).forEach(key => (query[key] === '' || query[key] === 'all') && delete query[key]);

		this.props.getMembers(query);
	}

	render() {
		const {
			tabName,
			members: {
				data: members,
				isFetching: isLoadingMembers,
				// error: errorMembers
			},
		} = this.props;

		const arrayName = tabName !== 'guests' ? 'regular' : 'guests';

		return (
			<div className={styles.container}>
				{!isLoadingMembers && members ? (
					members[arrayName].activated.length || members[arrayName].deactivated.length ? (
						<div>
							{members[arrayName].activated.length ? (
								<Grid spacing={2} container>
									{members[arrayName].activated.map(member => (
										<Grid key={member._id} xs={4} item>
											<Link to={`/members/${member._id}`}>
												<Member member={member} />
											</Link>
										</Grid>
									))}
								</Grid>
							) : null}
							{members[arrayName].deactivated.length ? (
								<div style={{ marginTop: 40 }}>
									<div className={styles.title}>Отключённые участники</div>
									<Grid spacing={2} container>
										{members[arrayName].deactivated.map(member => (
											<Grid key={member._id} xs={4} item>
												<Link to={`/members/${member._id}`}>
													<Member member={member} />
												</Link>
											</Grid>
										))}
									</Grid>
								</div>
							) : null}
						</div>
					) : (
						<div className={styles.none}>Ничего не найдено</div>
					)
				) : (
					<div children={<CircularProgress size={20} />} style={{ textAlign: 'center' }} />
				)}
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	const {
		members: {
			data: membersData,
			isFetching: isLoadingMembers,
			// error: errorMembers
		},
	} = state;

	const members = {
		data: {
			regular: {
				activated: [],
				deactivated: [],
			},
			guests: {
				activated: [],
				deactivated: [],
			},
		},
		isFetching: isLoadingMembers,
	};

	if (!isLoadingMembers && membersData) {
		membersData.forEach(member => {
			if (!member.guest) {
				if (!member.deactivated) {
					members.data.regular.activated.push(member);
				} else {
					members.data.regular.deactivated.push(member);
				}
			} else {
				if (!member.deactivated) {
					members.data.guests.activated.push(member);
				} else {
					members.data.guests.deactivated.push(member);
				}
			}
		});
	}

	return {
		members: members,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getMembers: query => dispatch(getMembers({ query })),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Members);
