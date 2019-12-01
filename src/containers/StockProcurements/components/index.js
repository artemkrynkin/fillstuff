import React from 'react';
import queryString from 'query-string';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import { history } from 'src/helpers/history';

import Filter from './Filter';
import Procurements from './Procurements';

const Index = props => {
	const { currentUser, currentStock } = props;

	let queryInitialValues = queryString.parse(history.location.search);

	if (isNaN(queryInitialValues.amountFrom)) queryInitialValues.amountFrom = '';
	if (isNaN(queryInitialValues.amountTo)) queryInitialValues.amountTo = '';
	if (
		!isNaN(queryInitialValues.amountFrom) &&
		!isNaN(queryInitialValues.amountTo) &&
		queryInitialValues.amountFrom > queryInitialValues.amountTo
	) {
		const amountFrom = queryInitialValues.amountFrom;

		queryInitialValues.amountFrom = queryInitialValues.amountTo;
		queryInitialValues.amountTo = amountFrom;
	}

	let procurementsQueryParams = {
		number: queryInitialValues.number || '',
		amountFrom: queryInitialValues.amountFrom || '',
		amountTo: queryInitialValues.amountTo || '',
		amountFromView: queryInitialValues.amountFrom || '',
		amountToView: queryInitialValues.amountTo || '',
		position: queryInitialValues.position || 'all',
		role: queryInitialValues.role || 'all',
	};

	return (
		<Container maxWidth="md">
			<Grid container direction="row" justify="center" alignItems="flex-start" spacing={2}>
				<Grid item xs={12}>
					<Filter currentUser={currentUser} currentStock={currentStock} procurementsQueryParams={procurementsQueryParams} />
					<Procurements currentUser={currentUser} currentStock={currentStock} procurementsQueryParams={procurementsQueryParams} />
				</Grid>
			</Grid>
		</Container>
	);
};

export default Index;
