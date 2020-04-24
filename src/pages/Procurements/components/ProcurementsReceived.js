import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import LoadMoreButton from 'src/components/Pagination/LoadMoreButton';

import Empty from 'src/components/Empty';
import { LoadingComponent } from 'src/components/Loading';

import ProcurementReceived from './ProcurementReceived';

import styles from './ProcurementsReceived.module.css';

import emptyImage from 'public/img/stubs/procurements.svg';

const calendarFormat = {
	sameDay: 'Сегодня',
	nextDay: 'Завтра',
	lastDay: 'Вчера',
	sameElse: function(now) {
		return this.isSame(now, 'year') ? 'D MMMM, dddd' : 'D MMMM YYYY';
	},
	nextWeek: function(now) {
		return this.isSame(now, 'year') ? 'D MMMM, dddd' : 'D MMMM YYYY';
	},
	lastWeek: function(now) {
		return this.isSame(now, 'year') ? 'D MMMM, dddd' : 'D MMMM YYYY';
	},
};

const byMonth = data => {
	const procurements = data.slice();

	return _.chain(procurements)
		.groupBy(procurement => {
			return moment(procurement.createdAt)
				.set({
					hour: 0,
					minute: 0,
					second: 0,
					millisecond: 0,
				})
				.format(moment.HTML5_FMT.DATETIME_LOCAL_MS);
		})
		.map((procurements, date) => ({ date, procurements }))
		.value();
};

const ProcurementsReceived = props => {
	const {
		filterOptions: { params: filterParams },
		paging,
		procurementsReceived: {
			data: procurementsReceived,
			isFetching: isLoadingProcurementsReceived,
			// error: errorProcurementsReceived
		},
		onLoadMore,
	} = props;

	if (!procurementsReceived) return <LoadingComponent className={styles.container} />;

	if (!procurementsReceived.paging.totalCount && !procurementsReceived.paging.totalDocs) {
		return (
			<Empty
				className={styles.empty}
				imageSrc={emptyImage}
				imageSize="sm"
				content={
					<Typography variant="h6" gutterBottom>
						Похоже, у вас еще нет заказов
					</Typography>
				}
				actions={
					<Button variant="contained" color="primary">
						Создать заказ
					</Button>
				}
			/>
		);
	}

	if (procurementsReceived.paging.totalCount && !procurementsReceived.paging.totalDocs) {
		return (
			<Empty
				content={
					<Typography variant="h6" gutterBottom>
						Ничего не найдено
					</Typography>
				}
				style={{ marginTop: 16 }}
			/>
		);
	}

	if (procurementsReceived.paging.totalCount && procurementsReceived.paging.totalDocs) {
		return (
			<div className={styles.container}>
				{byMonth(procurementsReceived.data).map(month => (
					<div className={styles.date} key={month.date}>
						<div className={styles.dateTitle}>{moment(month.date).calendar(null, calendarFormat)}</div>
						{month.procurements.map(procurement => (
							<ProcurementReceived key={procurement._id} procurement={procurement} filterParams={filterParams} />
						))}
					</div>
				))}
				{procurementsReceived.paging.hasNextPage ? (
					<LoadMoreButton page={paging.page} setPage={paging.setPage} onLoadMore={onLoadMore} loading={isLoadingProcurementsReceived} />
				) : null}
			</div>
		);
	}

	return null;
};

ProcurementsReceived.propTypes = {
	filterOptions: PropTypes.object.isRequired,
	paging: PropTypes.object.isRequired,
};

export default ProcurementsReceived;
