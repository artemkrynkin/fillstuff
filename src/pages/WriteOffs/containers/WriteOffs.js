import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';

import Typography from '@material-ui/core/Typography';

import { deleteParamsCoincidence } from 'src/components/Pagination/utils';
import LoadMoreButton from 'src/components/Pagination/LoadMoreButton';
import Empty from 'src/components/Empty';
import { FilteredComponent } from 'src/components/Loading';

import { getWriteOffs } from 'src/actions/writeOffs';

import Filter from './Filter';
import WriteOffsDay from './WriteOffsDay';

import styles from './WriteOffs.module.css';

const momentDate = moment();

const MonthDateTitle = ({ date }) => {
	const isCurrentYear = momentDate.isSame(date, 'year');
	const dateFormat = moment(date).format(isCurrentYear ? 'MMMM' : 'MMMM YYYY');

	return <div className={styles.dateTitle}>{dateFormat}</div>;
};

const WriteOffs = props => {
	const {
		filterOptions,
		paging,
		onOpenDialogByName,
		writeOffs: { data: writeOffs, isFetching: isLoadingWriteOffs },
	} = props;
	const [moreDataLoading, setMoreDataLoading] = useState(false);

	const onLoadMore = nextPage => {
		const {
			filterOptions: { params: filterParams, delete: filterDeleteParams },
		} = props;

		const query = deleteParamsCoincidence({ ...filterParams, page: nextPage }, { type: 'server', ...filterDeleteParams });

		if (!query.onlyCanceled) delete query.onlyCanceled;

		setMoreDataLoading(true);

		props.getWriteOffs(query, { showRequest: false, mergeData: true }).then(() => {
			setMoreDataLoading(false);
		});
	};

	if (!writeOffs.data.length || !writeOffs.paging.totalDocs) {
		return (
			<Fragment>
				<Filter filterOptions={filterOptions} paging={paging} />
				<FilteredComponent loading={isLoadingWriteOffs}>
					<Empty
						content={
							<div>
								<Typography variant="h6" gutterBottom>
									Ничего не нашлось
								</Typography>
								<Typography variant="body1" gutterBottom>
									Попробуйте изменить параметры поиска
								</Typography>
							</div>
						}
					/>
				</FilteredComponent>
			</Fragment>
		);
	}

	return (
		<Fragment>
			<Filter filterOptions={filterOptions} paging={paging} />
			<FilteredComponent loading={isLoadingWriteOffs}>
				{writeOffs.data.map(writeOffsMonth => (
					<div className={styles.date} key={writeOffsMonth.date}>
						<MonthDateTitle date={writeOffsMonth.date} />
						{writeOffsMonth.days.map(writeOffDay => (
							<WriteOffsDay
								key={writeOffDay.date}
								writeOffDay={writeOffDay}
								filterOptions={filterOptions}
								onOpenDialogByName={onOpenDialogByName}
							/>
						))}
					</div>
				))}
				{writeOffs.paging.hasNextPage ? (
					<LoadMoreButton page={paging.page} setPage={paging.setPage} onLoadMore={onLoadMore} loading={moreDataLoading} />
				) : null}
			</FilteredComponent>
		</Fragment>
	);
};

WriteOffs.propTypes = {
	filterOptions: PropTypes.object.isRequired,
	paging: PropTypes.object.isRequired,
};

const mapDispatchToProps = dispatch => {
	return {
		getWriteOffs: (query, options) => dispatch(getWriteOffs({ query, ...options })),
	};
};

export default connect(null, mapDispatchToProps)(WriteOffs);
