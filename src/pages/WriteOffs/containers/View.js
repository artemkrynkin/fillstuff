import React, { Fragment } from 'react';

import Typography from '@material-ui/core/Typography';

import { LoadingPage } from 'src/components/Loading';
import Empty from 'src/components/Empty';

import WriteOffs from './WriteOffs';

import styles from './View.module.css';

import emptyImage from 'public/img/stubs/procurements.svg';

const View = props => {
	const {
		onOpenDialogByName,
		filterOptions,
		paging,
		writeOffs: { data: writeOffs },
	} = props;

	if (!writeOffs) {
		return <LoadingPage />;
	}

	if (!writeOffs.paging.totalCount && !writeOffs.paging.totalDocs) {
		return (
			<Empty
				className={styles.empty}
				imageSrc={emptyImage}
				content={
					<Typography variant="h6" gutterBottom>
						Похоже, у вас еще нет списаний
					</Typography>
				}
			/>
		);
	}

	if (writeOffs && writeOffs.paging.totalCount) {
		return (
			<Fragment>
				<WriteOffs filterOptions={filterOptions} paging={paging} onOpenDialogByName={onOpenDialogByName} writeOffs={props.writeOffs} />
			</Fragment>
		);
	}

	return null;
};

export default View;
