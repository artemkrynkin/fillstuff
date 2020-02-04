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
			members: {
				data: members,
				isFetching: isLoadingMembers,
				// error: errorMembers
			},
		} = this.props;

		return (
			<div className={styles.container}>
				{!isLoadingMembers && members ? (
					members.activated.length || members.deactivated.length ? (
						<div>
							{members.activated.length ? (
								<Grid spacing={2} container>
									{members.activated.map(member => (
										<Grid key={member._id} xs={4} item>
											<Link to={`/members/${member._id}`}>
												<Member member={member} />
											</Link>
										</Grid>
									))}
								</Grid>
							) : null}
							{members.deactivated.length ? (
								<div style={{ marginTop: 40 }}>
									<div className={styles.title}>Отключённые участники</div>
									<Grid spacing={2} container>
										{members.deactivated.map(member => (
											<Grid key={member._id} xs={4} item>
												<Member member={member} />
											</Grid>
										))}
									</Grid>
								</div>
							) : null}
						</div>
					) : (
						<div className={styles.none}>Участников соотвествующих критериям поиска не найдено</div>
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
	const { tabName } = ownProps;

	const members = {
		data: null,
		isFetching: isLoadingMembers,
	};

	if (!isLoadingMembers && membersData) {
		const allMembers = membersData.filter(member => member.guest === (tabName === 'guests'));

		members.data = {
			activated: allMembers.filter(member => !member.deactivated),
			deactivated: allMembers.filter(member => member.deactivated),
		};
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
