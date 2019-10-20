import React from 'react';
import queryString from 'query-string';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import { history } from 'src/helpers/history';

import Filter from './Filter';

const Index = props => {
	const { currentUser, currentStock } = props;

	let queryInitialValues = queryString.parse(history.location.search);

	if (isNaN(queryInitialValues.amountFrom)) queryInitialValues.amountFrom = '';
	if (isNaN(queryInitialValues.amountTo)) queryInitialValues.amountTo = '';

	let initialValues = {
		number: queryInitialValues.number || '',
		amountFrom: queryInitialValues.amountFrom || '',
		amountTo: queryInitialValues.amountTo || '',
		amountFromView: queryInitialValues.amountFrom || '',
		amountToView: queryInitialValues.amountTo || '',
		// dateFrom: '',
		// dateTo: '',
		shopName: queryInitialValues.shopName || '',
		shopNameView: queryInitialValues.shopName || '',
		role: queryInitialValues.role || 'all',
	};

	return (
		<Container maxWidth="md">
			<Grid container direction="row" justify="center" alignItems="flex-start" spacing={2}>
				<Grid item xs={12}>
					<Filter currentUser={currentUser} currentStock={currentStock} initialValues={initialValues} />
				</Grid>
			</Grid>
		</Container>
	);
};

export default Index;
