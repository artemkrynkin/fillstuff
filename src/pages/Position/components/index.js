import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import PositionDetails from './PositionDetails';
import Receipts from './Receipts';

const Index = props => {
	const { positionData, receiptsData, changeSellingPriceReceipt } = props;

	if (!positionData || !positionData.data) return <div children={<CircularProgress size={20} />} style={{ textAlign: 'center' }} />;

	const { data: position } = positionData;

	return (
		<Container maxWidth="lg">
			<Grid container direction="row" justify="center" alignItems="flex-start" spacing={2}>
				<Grid item xs={12}>
					<PositionDetails position={position} />
					<Receipts position={position} receiptsData={receiptsData} changeSellingPriceReceipt={changeSellingPriceReceipt} />
				</Grid>
			</Grid>
		</Container>
	);
};

export default Index;
