import React, { useState } from 'react';
import moment from 'moment';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import { checkQueryInFilter } from 'src/components/Pagination/utils';

import Filter from './Filter';
import WriteOffs from './WriteOffs';

const momentDate = moment();
const dateStart = momentDate.startOf('month').valueOf();
const dateEnd = momentDate.endOf('month').valueOf();

const Index = () => {
	const [loadedDocs, setLoadedDocs] = useState(10);
	const perPage = 10;

	const onChangeLoadedDocs = resetLoadedDocs => {
		if (!resetLoadedDocs) setLoadedDocs(loadedDocs + perPage);
		else setLoadedDocs(perPage);
	};

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
							loadedDocs,
							perPage,
							onChangeLoadedDocs,
						}}
					/>
					<WriteOffs
						filterOptions={filterOptions}
						paging={{
							loadedDocs,
							perPage,
							onChangeLoadedDocs,
						}}
					/>
				</Grid>
			</Grid>
		</Container>
	);
};

export default Index;
