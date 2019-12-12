import React from 'react';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import { paginationCalendarFormat, getFollowingDates } from './utils';

const LoadMoreButton = props => {
	const { loaded, count, dateStart, dateEnd, onLoadMore, onLoadOtherDates } = props;
	const followingDates = getFollowingDates(dateStart, dateEnd);

	return (
		<Grid style={{ marginTop: 20 }} container>
			{loaded < count ? (
				<Button variant="outlined" color="primary" onClick={onLoadMore} fullWidth>
					Показать ещё
				</Button>
			) : (
				<Button variant="outlined" color="primary" onClick={onLoadOtherDates} fullWidth>
					Показать закупки за{' '}
					{followingDates.range === 'month'
						? followingDates.dateStart.calendar(null, paginationCalendarFormat(true))
						: followingDates.dateStart.isSame(followingDates.dateEnd, 'day')
						? followingDates.dateStart.calendar(null, paginationCalendarFormat())
						: followingDates.dateStart.calendar(null, paginationCalendarFormat()) +
						  ' - ' +
						  followingDates.dateEnd.calendar(null, paginationCalendarFormat())}
				</Button>
			)}
		</Grid>
	);
};

export default LoadMoreButton;
