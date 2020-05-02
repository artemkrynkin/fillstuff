import React, { Fragment } from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { LoadingPage } from 'src/components/Loading';
import Empty from 'src/components/Empty';

import ProcurementsExpected from './ProcurementsExpected';
import ProcurementsReceived from './ProcurementsReceived';

import styles from './View.module.css';

import emptyImage from 'public/img/stubs/procurements.svg';

const View = props => {
	const {
		onOpenDialogByName,
		filterOptions,
		paging,
		procurementsExpected: { data: procurementsExpected },
		procurementsReceived: { data: procurementsReceived },
	} = props;

	if (!procurementsExpected || !procurementsReceived) {
		return <LoadingPage />;
	}

	if (procurementsExpected && procurementsReceived && !procurementsExpected.paging.totalCount && !procurementsReceived.paging.totalCount) {
		return (
			<Empty
				className={styles.empty}
				imageSrc={emptyImage}
				content={
					<Typography variant="h6" gutterBottom>
						Похоже, у вас еще нет заказов или закупок
					</Typography>
				}
				actions={
					<Grid justify="center" alignItems="center" container>
						<Button onClick={() => onOpenDialogByName('dialogProcurementExpectedCreate')} variant="contained" color="primary">
							Создать заказ
						</Button>
						<Typography variant="caption" style={{ marginLeft: 16 }}>
							или
						</Typography>
						<Button onClick={() => onOpenDialogByName('dialogProcurementReceivedCreate')} variant="contained" color="primary">
							Оформить закупку
						</Button>
					</Grid>
				}
			/>
		);
	}

	if (procurementsExpected && procurementsReceived && procurementsExpected.paging.totalCount && !procurementsReceived.paging.totalCount) {
		return (
			<Fragment>
				<ProcurementsExpected procurementsExpected={procurementsExpected} />
				<Empty
					className={styles.empty2}
					imageSrc={emptyImage}
					imageSize="sm"
					content={
						<Typography variant="h6" gutterBottom>
							Похоже, у вас еще нет закупок
						</Typography>
					}
					actions={
						<Button onClick={() => onOpenDialogByName('dialogProcurementReceivedCreate')} variant="contained" color="primary">
							Оформить закупку
						</Button>
					}
				/>
			</Fragment>
		);
	}

	if (procurementsExpected && procurementsReceived && !procurementsExpected.paging.totalCount && procurementsReceived.paging.totalCount) {
		return <ProcurementsReceived filterOptions={filterOptions} paging={paging} procurementsReceived={props.procurementsReceived} />;
	}

	if (procurementsExpected && procurementsReceived && procurementsExpected.paging.totalCount && procurementsReceived.paging.totalCount) {
		return (
			<Fragment>
				<ProcurementsExpected procurementsExpected={procurementsExpected} />
				<ProcurementsReceived filterOptions={filterOptions} paging={paging} procurementsReceived={props.procurementsReceived} />
			</Fragment>
		);
	}

	return null;
};

export default View;
