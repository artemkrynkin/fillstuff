import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import { paginationCalendarFormat, getFollowingDates } from './utils';

const LoadMoreButton = props => {
	const { loaded, count, textButton, showDates, dateStart, dateEnd, onLoadMore, onLoadOtherDates } = props;
	const followingDates = showDates && dateStart && dateEnd ? getFollowingDates(dateStart, dateEnd) : null;

	return (
		<Grid style={{ marginTop: 20 }} container>
			{loaded < count ? (
				<Button variant="outlined" color="primary" onClick={() => onLoadMore()} fullWidth>
					Показать ещё
				</Button>
			) : (
				<Button variant="outlined" color="primary" onClick={onLoadOtherDates} fullWidth>
					{textButton ? textButton : showDates ? 'Показать ещё за' : 'Показать ещё'}
					{showDates ? ' ' : ''}
					{showDates && dateStart && dateEnd
						? followingDates.range === 'month'
							? followingDates.dateStart.calendar(null, paginationCalendarFormat(true))
							: followingDates.dateStart.isSame(followingDates.dateEnd, 'day')
							? followingDates.dateStart.calendar(null, paginationCalendarFormat())
							: followingDates.dateStart.calendar(null, paginationCalendarFormat()) +
							  ' - ' +
							  followingDates.dateEnd.calendar(null, paginationCalendarFormat())
						: null}
				</Button>
			)}
		</Grid>
	);
};

LoadMoreButton.propTypes = {
	loaded: PropTypes.number.isRequired,
	count: PropTypes.number.isRequired,
	textButton: PropTypes.string,
	showDates: PropTypes.bool.isRequired,
	dateStart: PropTypes.oneOfType([PropTypes.number, PropTypes.object]).isRequired,
	dateEnd: PropTypes.oneOfType([PropTypes.number, PropTypes.object]).isRequired,
	onLoadMore: PropTypes.func.isRequired,
	onLoadOtherDates: PropTypes.func.isRequired,
};

export default LoadMoreButton;
