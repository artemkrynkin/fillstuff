import React from 'react';

import Typography from '@material-ui/core/Typography';

import { LoadingPage } from 'src/components/Loading';
import Empty from 'src/components/Empty';

import Invoices from './Invoices';

import styles from './View.module.css';

import emptyImage from 'public/img/stubs/procurements.svg';

const View = props => {
	const {
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
				className={styles.empty}
				imageSrc={emptyImage}
				content={
					<Typography variant="h6" gutterBottom>
						Похоже, у вас еще нет выставленных счетов
					</Typography>
				}
			/>
		);
	}

	if (invoices && invoices.paging.totalCount) {
		return <Invoices filterOptions={filterOptions} paging={paging} onOpenDialogByName={onOpenDialogByName} invoices={props.invoices} />;
	}

	return null;
};

export default View;
