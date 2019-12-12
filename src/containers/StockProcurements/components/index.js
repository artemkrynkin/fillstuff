import React, { useState } from 'react';
import queryString from 'query-string';
import moment from 'moment';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import { history } from 'src/helpers/history';

import Filter from './Filter';
import Procurements from './Procurements';

const Index = props => {
	const { currentUser, currentStock } = props;
	const [loadedDocs, setLoadedDocs] = useState(15);
	const perPage = 15;

	const onChangeLoadedDocs = resetLoadedDocs => {
		if (!resetLoadedDocs) setLoadedDocs(loadedDocs + perPage);
		else setLoadedDocs(perPage);
	};

	const queryInitialParams = queryString.parse(history.location.search);

	queryInitialParams.dateStart = Number(queryInitialParams.dateStart);
	queryInitialParams.dateEnd = Number(queryInitialParams.dateEnd);

	if (!isNaN(queryInitialParams.dateStart) || !isNaN(queryInitialParams.dateEnd)) {
		if (!moment(queryInitialParams.dateStart || new Date('')).isValid() || !moment(queryInitialParams.dateEnd || new Date('')).isValid()) {
			queryInitialParams.dateStart = moment()
				.startOf('month')
				.valueOf();
			queryInitialParams.dateEnd = moment()
				.endOf('month')
				.valueOf();
		} else if (
			moment(queryInitialParams.dateStart || new Date('')).isValid() &&
			moment(queryInitialParams.dateEnd || new Date('')).isValid() &&
			moment(queryInitialParams.dateStart).isAfter(queryInitialParams.dateEnd)
		) {
			const dateStart = queryInitialParams.dateStart;

			queryInitialParams.dateStart = queryInitialParams.dateEnd;
			queryInitialParams.dateEnd = dateStart;
		}
	} else {
		queryInitialParams.dateStart = moment()
			.startOf('month')
			.valueOf();
		queryInitialParams.dateEnd = moment()
			.endOf('month')
			.valueOf();
	}

	let queryParams = {
		number: queryInitialParams.number || '',
		dateStart: queryInitialParams.dateStart || '',
		dateEnd: queryInitialParams.dateEnd || '',
		dateStartView: queryInitialParams.dateStart || '',
		dateEndView: queryInitialParams.dateEnd || '',
		position: queryInitialParams.position || 'all',
		role: queryInitialParams.role || 'all',
	};

	return (
		<Container maxWidth="md">
			<Grid container direction="row" justify="center" alignItems="flex-start" spacing={2}>
				<Grid item xs={12}>
					<Filter
						currentUser={currentUser}
						currentStock={currentStock}
						queryParams={queryParams}
						paging={{
							loadedDocs,
							perPage,
							onChangeLoadedDocs,
						}}
					/>
					<Procurements
						currentUser={currentUser}
						currentStock={currentStock}
						queryParams={queryParams}
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
