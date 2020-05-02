import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import loadable from '@loadable/component';

import generateMetaInfo from 'shared/generate-meta-info';

import Head from 'src/components/head';
import HeaderPage from 'src/components/HeaderPage';
import { LoadingPage } from 'src/components/Loading';
import { withCurrentUser } from 'src/components/withCurrentUser';
import { checkQueryInFilter, deleteParamsCoincidence } from 'src/components/Pagination/utils';

import { getMembers } from 'src/actions/members';

import stylesPage from 'src/styles/page.module.css';
import styles from './index.module.css';

const Index = loadable(() => import('./containers/index' /* webpackChunkName: "Members_Index" */), {
	fallback: <LoadingPage />,
});

const Members = props => {
	const { members } = props;

	const metaInfo = {
		pageName: 'members',
		pageTitle: 'Команда',
	};
	const { title, description } = generateMetaInfo({
		type: metaInfo.pageName,
		data: {
			title: metaInfo.pageTitle,
		},
	});

	const filterOptions = {
		params: checkQueryInFilter({
			name: '',
			role: 'all',
		}),
		delete: {
			searchByName: ['page', 'limit'],
			searchByValue: [null, '', 'all'],
			serverQueryByValue: [null, '', 'all'],
		},
	};

	useEffect(() => {
		const { params: filterParams, delete: filterDeleteParams } = filterOptions;

		const query = deleteParamsCoincidence({ ...filterParams }, { type: 'server', ...filterDeleteParams });

		props.getMembers(query, { emptyData: true });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className={stylesPage.page}>
			<Head title={title} description={description} />

			<HeaderPage pageName={metaInfo.pageName} pageTitle={metaInfo.pageTitle} />
			<div className={`${stylesPage.pageContent} ${styles.container}`}>
				<Index members={members} filterOptions={filterOptions} />
			</div>
		</div>
	);
};

const mapStateToProps = state => {
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
		getMembers: (query, options) => dispatch(getMembers({ query, ...options })),
	};
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withCurrentUser)(Members);
