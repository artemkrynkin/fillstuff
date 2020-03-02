import React, { useState } from 'react';
import moment from 'moment';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import { checkQueryInFilter } from 'src/components/Pagination/utils';

import Filter from './Filter';
import WriteOffs from './WriteOffs';

const dateStart = moment()
	.subtract(2, 'days')
	.startOf('day')
	.valueOf();
const dateEnd = moment()
	.endOf('day')
	.valueOf();

const Index = () => {
	const [dateIntervalAllTime, setDateIntervalAllTime] = useState({
		dateStart,
		dateEnd,
	});

	const filterOptions = {
		params: checkQueryInFilter({
			dateStart: dateStart,
			dateEnd: dateEnd,
			position: 'all',
			role: 'all',
			onlyCanceled: false,
		}),
		delete: {
			searchByName: [],
			searchByValue: [null, '', 'all'],
			serverQueryByValue: [null, '', 'all'],
		},
	};

	return (
		<Container maxWidth="lg">
			<Grid container direction="row" justify="center" alignItems="flex-start" spacing={2}>
				<Grid item xs={12}>
					<Filter
						filterOptions={filterOptions}
						paging={{
							dateIntervalAllTime,
							setDateIntervalAllTime,
						}}
					/>
					<WriteOffs
						filterOptions={filterOptions}
						paging={{
							dateIntervalAllTime,
							setDateIntervalAllTime,
						}}
					/>
				</Grid>
			</Grid>
		</Container>
	);
};

export default Index;
