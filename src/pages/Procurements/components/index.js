import React, { useState } from 'react';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import { checkQueryInFilter } from 'src/components/Pagination/utils';

import Filter from './Filter';
import Procurements from './Procurements';

const Index = () => {
	const [page, setPage] = useState(1);

	const filterOptions = {
		params: checkQueryInFilter({
			page,
			limit: 2,
			dateStart: null,
			dateEnd: null,
			invoiceNumber: '',
			position: 'all',
			member: 'all',
		}),
		delete: {
			searchByName: ['page', 'limit'],
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
							page,
							setPage,
						}}
					/>
					<Procurements
						filterOptions={filterOptions}
						paging={{
							page,
							setPage,
						}}
					/>
				</Grid>
			</Grid>
		</Container>
	);
};

export default Index;
