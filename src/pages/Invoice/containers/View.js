import React, { Fragment } from 'react';

import { LoadingPage } from 'src/components/Loading';

import Invoice from './Invoice';

const View = props => {
	const { invoiceData, onOpenDialogByName } = props;

	if (!invoiceData || !invoiceData.data) {
		return <LoadingPage />;
	}

	const { data: invoice } = invoiceData;

	return (
		<Fragment>
			<Invoice invoice={invoice} onOpenDialogInvoice={onOpenDialogByName} />
		</Fragment>
	);
};

export default View;
