import React from 'react';

import Typography from '@material-ui/core/Typography';

import { LoadingPage } from 'src/components/Loading';
import Empty from 'src/components/Empty';

import Invoices from './Invoices';

import styles from './View.module.css';

import invoicesEmpty from 'public/img/stubs/invoices_empty.svg';

const View = props => {
	const {
		currentStudio,
		onOpenDialogByName,
		filterOptions,
		paging,
		invoices: { data: invoices },
	} = props;

	if (!invoices) {
		return <LoadingPage />;
	}

	if (!invoices.paging.totalCount && !invoices.paging.totalDocs) {
		return (
			<Empty
				classNames={{
					container: styles.empty,
				}}
				imageSrc={invoicesEmpty}
				content={
					<Typography variant="h6" gutterBottom>
						У вас еще нет выставленных счетов
					</Typography>
				}
			/>
		);
	}

	if (invoices && invoices.paging.totalCount) {
		return (
			<Invoices
				filterOptions={filterOptions}
				paging={paging}
				currentStudio={currentStudio}
				onOpenDialogByName={onOpenDialogByName}
				invoices={props.invoices}
			/>
		);
	}

	return null;
};

export default View;
