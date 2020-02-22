import React, { useState } from 'react';
import queryString from 'query-string';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import { history } from 'src/helpers/history';

import { checkQueryInFilter } from 'src/components/Pagination/utils';

import Filter from './Filter';
import Members from './Members';

const Index = () => {
	const [tabName, setTabName] = useState(history.location.pathname.split('/')[2] || '');
	const filterParams = checkQueryInFilter({
		role: 'all',
	});

	const onChangeTab = (event, tabName) => {
		const query = { ...filterParams };

		Object.keys(query).forEach(key => (query[key] === '' || query[key] === 'all') && delete query[key]);

		setTabName(tabName);

		history.push({
			pathname: tabName === '' ? '/members' : `/members/${tabName}`,
			search: queryString.stringify(query),
		});
	};

	return (
		<Container maxWidth="lg">
			<Grid container direction="row" justify="center" alignItems="flex-start" spacing={2}>
				<Grid item xs={12}>
					<Filter tabName={tabName} onChangeTab={onChangeTab} filterParams={filterParams} />
					<Members tabName={tabName} filterParams={filterParams} />
				</Grid>
			</Grid>
		</Container>
	);
};

export default Index;
