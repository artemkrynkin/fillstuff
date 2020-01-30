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

const Index = props => {
	const { currentStudio } = props;
	const [loadedDocs, setLoadedDocs] = useState(10);
	const perPage = 10;

	const onChangeLoadedDocs = resetLoadedDocs => {
		if (!resetLoadedDocs) setLoadedDocs(loadedDocs + perPage);
		else setLoadedDocs(perPage);
	};

	const filterParams = checkQueryInFilter({
		dateStart: dateStart,
		dateEnd: dateEnd,
		position: 'all',
		role: 'all',
	});

	return (
		<Container maxWidth="md">
			<Grid container direction="row" justify="center" alignItems="flex-start" spacing={2}>
				<Grid item xs={12}>
					<Filter
						currentStudio={currentStudio}
						filterParams={filterParams}
						paging={{
							loadedDocs,
							perPage,
							onChangeLoadedDocs,
						}}
					/>
					<WriteOffs
						currentStudioId={currentStudio._id}
						filterParams={filterParams}
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
