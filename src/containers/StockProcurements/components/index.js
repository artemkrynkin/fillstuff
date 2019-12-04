import React from 'react';
import queryString from 'query-string';
import moment from 'moment';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import { history } from 'src/helpers/history';

import Filter from './Filter';
import Procurements from './Procurements';

const Index = props => {
	const { currentUser, currentStock } = props;

	let queryInitialValues = queryString.parse(history.location.search);

	if (
		(queryInitialValues.dateStart || queryInitialValues.dateEnd) &&
		(!moment(queryInitialValues.dateStart).isValid() || !moment(queryInitialValues.dateEnd).isValid())
	) {
		queryInitialValues.dateStart = '';
		queryInitialValues.dateEnd = '';
	}
	if (
		queryInitialValues.dateStart &&
		queryInitialValues.dateEnd &&
		moment(queryInitialValues.dateStart).isValid() && moment(queryInitialValues.dateEnd).isValid() &&
		moment(queryInitialValues.dateStart).isAfter(queryInitialValues.dateEnd)
	) {
		const dateStart = queryInitialValues.dateStart;

		queryInitialValues.dateStart = queryInitialValues.dateEnd;
		queryInitialValues.dateEnd = dateStart;
	}
	if (isNaN(queryInitialValues.amountFrom) || isNaN(queryInitialValues.amountTo)) {
		queryInitialValues.amountFrom = '';
		queryInitialValues.amountTo = '';
	}
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
		dateStart: queryInitialValues.dateStart || '',
		dateEnd: queryInitialValues.dateEnd || '',
		dateStartView: queryInitialValues.dateStart || '',
		dateEndView: queryInitialValues.dateEnd || '',
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
