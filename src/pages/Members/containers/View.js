import React, { useState, useEffect } from 'react';
import queryString from 'query-string';

import { history } from 'src/helpers/history';

import { LoadingPage } from 'src/components/Loading';
import { deleteParamsCoincidence } from 'src/components/Pagination/utils';

import Members from './Members';

const View = props => {
	const {
		filterOptions,
		members: { data: members },
	} = props;
	const locationTabName = history.location.pathname.split('/')[2] || '';
	const [tabName, setTabName] = useState(locationTabName);

	useEffect(() => {
		setTabName(locationTabName);
	}, [locationTabName]);

	const onChangeTab = (event, tabName) => {
		const {
			filterOptions: { params: filterParams, delete: filterDeleteParams },
		} = props;

		const query = deleteParamsCoincidence(filterParams, { type: 'search', ...filterDeleteParams });

		history.push({
			pathname: tabName === '' ? '/members' : `/members/${tabName}`,
			search: queryString.stringify(query),
		});
	};

	if (!members) {
		return <LoadingPage />;
	}

	if (members) {
		return <Members tabName={tabName} onChangeTab={onChangeTab} filterOptions={filterOptions} members={props.members} />;
	}

	return null;
};

export default View;
