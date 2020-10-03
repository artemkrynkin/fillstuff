import React, { useState, useEffect } from 'react';

import history from 'src/helpers/history';

import { LoadingPage } from 'src/components/Loading';

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
		history.push({
			pathname: tabName === '' ? '/members' : `/members/${tabName}`,
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
