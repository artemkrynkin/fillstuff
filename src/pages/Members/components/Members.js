import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { LoadingComponent } from 'src/components/Loading';
import Empty from 'src/components/Empty';

import { getMembers } from 'src/actions/members';

import Member from './Member';

import styles from './Members.module.css';
import emptyImage from 'public/img/stubs/procurements.svg';

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
				// isFetching: isLoadingMembers,
				// error: errorMembers
			},
		} = this.props;

		const arrayName = tabName !== 'guests' ? 'regular' : 'guests';

		if (!members) return <LoadingComponent className={styles.container} />;

		const currentMembers = members.data[arrayName];

		if (tabName === 'guests' && !members.paging.totalGuests) {
			return (
				<Empty
					className={styles.empty}
					imageSrc={emptyImage}
					content={
						<Typography variant="h6" gutterBottom>
							Похоже, у вас еще нет гостевых участников
						</Typography>
					}
					actions={
						<Button variant="contained" color="primary">
							Добавить участника
						</Button>
					}
				/>
			);
		}

		if (!currentMembers.activated.length && !currentMembers.deactivated.length) {
			return (
				<Empty
					content={
						<Typography variant="h6" gutterBottom>
							Ничего не найдено
						</Typography>
					}
					style={{ marginTop: 16 }}
				/>
			);
		}

		return (
			<div className={styles.container}>
				{currentMembers.activated.length ? (
					<Grid spacing={2} container>
						{currentMembers.activated.map(member => (
							<Grid key={member._id} xs={4} item>
								<Link to={`/members/${member._id}`}>
									<Member member={member} />
								</Link>
							</Grid>
						))}
					</Grid>
				) : null}
				{currentMembers.deactivated.length ? (
					<div style={{ marginTop: 40 }}>
						<div className={styles.title}>Отключённые участники</div>
						<Grid spacing={2} container>
							{currentMembers.deactivated.map(member => (
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
		data: null,
		isFetching: isLoadingMembers,
	};

	if (membersData) {
		const newMembersData = {
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
			paging: {},
		};

		membersData.data.forEach(member => {
			if (!member.guest) {
				if (!member.deactivated) {
					newMembersData.data.regular.activated.push(member);
				} else {
					newMembersData.data.regular.deactivated.push(member);
				}
			} else {
				if (!member.deactivated) {
					newMembersData.data.guests.activated.push(member);
				} else {
					newMembersData.data.guests.deactivated.push(member);
				}
			}
		});

		newMembersData.paging = membersData.paging;
		members.data = newMembersData;
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
