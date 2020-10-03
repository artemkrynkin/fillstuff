import React, { Fragment } from 'react';

import Typography from '@material-ui/core/Typography';

import { LoadingPage } from 'src/components/Loading';
import Empty from 'src/components/Empty';

import WriteOffs from './WriteOffs';

import styles from './View.module.css';

import writeOffsEmpty from 'public/img/stubs/write_offs_empty.svg';

const View = props => {
	const {
		currentStudio,
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
				classNames={{
					container: styles.empty,
				}}
				imageSrc={writeOffsEmpty}
				content={
					<Typography variant="h6" gutterBottom>
						У вас еще нет списаний
					</Typography>
				}
			/>
		);
	}

	if (writeOffs && writeOffs.paging.totalCount) {
		return (
			<Fragment>
				<WriteOffs
					filterOptions={filterOptions}
					paging={paging}
					currentStudio={currentStudio}
					onOpenDialogByName={onOpenDialogByName}
					writeOffs={props.writeOffs}
				/>
			</Fragment>
		);
	}

	return null;
};

export default View;
