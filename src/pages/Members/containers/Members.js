import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { FilteredComponent, LoadingPage } from 'src/components/Loading';
import Empty from 'src/components/Empty';

import Member from './Member';
import Filter from './Filter';

import styles from './Members.module.css';

import membersGuestsEmpty from 'public/img/stubs/members_guests_empty.svg';
import searchNotFound from 'public/img/stubs/search_not_found.svg';

const Members = props => {
	const {
		tabName,
		onChangeTab,
		filterOptions,
		members: {
			data: members,
			isFetching: isLoadingMembers,
			// error: errorMembers
		},
	} = props;

	const arrayName = tabName !== 'guests' ? 'regular' : 'guests';

	if (!members) return <LoadingPage className={styles.loadingPage} />;

	const currentMembers = members.data[arrayName];

	if (!currentMembers.activated.length && !currentMembers.deactivated.length) {
		return (
			<Fragment>
				<Filter tabName={tabName} onChangeTab={onChangeTab} filterOptions={filterOptions} />
				<FilteredComponent loading={isLoadingMembers}>
					<Empty
						imageSrc={searchNotFound}
						content={
							<div>
								<Typography variant="h6" gutterBottom>
									Ничего не нашлось
								</Typography>
								<Typography variant="body1" gutterBottom>
									Попробуйте изменить параметры поиска
								</Typography>
							</div>
						}
					/>
				</FilteredComponent>
			</Fragment>
		);
	}

	if (tabName === 'guests' && !members.paging.totalGuests) {
		return (
			<Fragment>
				<Filter tabName={tabName} onChangeTab={onChangeTab} filterOptions={filterOptions} />
				<FilteredComponent loading={isLoadingMembers}>
					<Empty
						classNames={{
							container: styles.empty,
						}}
						imageSrc={membersGuestsEmpty}
						content={
							<Typography variant="h6" gutterBottom>
								У вас еще нет гостевых мастеров
							</Typography>
						}
						actions={
							<Button variant="contained" color="primary">
								Добавить мастера
							</Button>
						}
					/>
				</FilteredComponent>
			</Fragment>
		);
	}

	if (currentMembers.activated.length || currentMembers.deactivated.length) {
		return (
			<Fragment>
				<Filter tabName={tabName} onChangeTab={onChangeTab} filterOptions={filterOptions} />
				<FilteredComponent loading={isLoadingMembers}>
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
				</FilteredComponent>
			</Fragment>
		);
	}

	return null;
};

export default Members;
