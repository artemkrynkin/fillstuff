import React, { Fragment } from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { LoadingPage } from 'src/components/Loading';
import Empty from 'src/components/Empty';

import ProcurementsExpected from './expected/ProcurementsExpected';
import ProcurementsReceived from './received/ProcurementsReceived';

import styles from './View.module.css';

import Filter from './Filter';

import procurementsEmpty from 'public/img/stubs/procurements_empty.svg';

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
				classNames={{
					container: styles.empty,
				}}
				imageSrc={procurementsEmpty}
				content={
					<Typography variant="h6" gutterBottom>
						У вас еще нет заказов или закупок
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
				<ProcurementsExpected onOpenDialogByName={onOpenDialogByName} procurementsExpected={procurementsExpected} />
				<Empty
					classNames={{
						container: styles.empty2,
					}}
					imageSrc={procurementsEmpty}
					imageSize="sm"
					content={
						<Typography variant="h6" gutterBottom>
							У вас еще нет закупок
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
		return (
			<Fragment>
				<Filter filterOptions={filterOptions} paging={paging} />
				<ProcurementsReceived filterOptions={filterOptions} paging={paging} procurementsReceived={props.procurementsReceived} />
			</Fragment>
		);
	}

	if (procurementsExpected && procurementsReceived && procurementsExpected.paging.totalCount && procurementsReceived.paging.totalCount) {
		return (
			<Fragment>
				<Filter filterOptions={filterOptions} paging={paging} />
				<ProcurementsExpected onOpenDialogByName={onOpenDialogByName} procurementsExpected={procurementsExpected} />
				<ProcurementsReceived filterOptions={filterOptions} paging={paging} procurementsReceived={props.procurementsReceived} />
			</Fragment>
		);
	}

	return null;
};

export default View;
