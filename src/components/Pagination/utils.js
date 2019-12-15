import moment from 'moment';
import queryString from 'query-string';

import { history } from 'src/helpers/history';

export const checkQueryParamsInFilter = initialQueryParams => {
	const queryParams = queryString.parse(history.location.search);

	if (queryParams.dateStart && queryParams.dateEnd) {
		const isValidDate = date => moment(date || new Date('')).isValid();

		queryParams.dateStart = Number(queryParams.dateStart);
		queryParams.dateEnd = Number(queryParams.dateEnd);

		if (!isNaN(queryParams.dateStart) || !isNaN(queryParams.dateEnd)) {
			if (!isValidDate(queryParams.dateStart) || !isValidDate(queryParams.dateEnd)) {
				const momentDate = moment();

				queryParams.dateStart = momentDate.startOf('month').valueOf();
				queryParams.dateEnd = momentDate.endOf('month').valueOf();
			} else if (
				isValidDate(queryParams.dateStart) &&
				isValidDate(queryParams.dateEnd) &&
				moment(queryParams.dateStart).isAfter(queryParams.dateEnd)
			) {
				const dateStart = queryParams.dateStart;

				queryParams.dateStart = queryParams.dateEnd;
				queryParams.dateEnd = dateStart;
			}
		} else {
			delete queryParams.dateStart;
			delete queryParams.dateEnd;
		}
	}

	return Object.assign(initialQueryParams, queryParams);
};

export const weekActive = (dateStart, dateEnd, currentWeek = true) =>
	moment(currentWeek ? new Date() : dateStart)
		.startOf('isoWeek')
		.isSame(dateStart, 'day') &&
	moment(currentWeek ? new Date() : dateStart)
		.endOf('isoWeek')
		.isSame(dateEnd, 'day');
export const monthActive = (dateStart, dateEnd, currentMonth = true) => {
	return (
		moment(currentMonth ? new Date() : dateStart)
			.startOf('month')
			.isSame(dateStart, 'day') &&
		moment(currentMonth ? new Date() : dateStart)
			.endOf('month')
			.isSame(dateEnd, 'day')
	);
};

export const paginationCalendarFormat = isMonth => {
	const formatSameYear = (self, now) => {
		return self.isSame(now, 'year') ? (isMonth ? 'MMMM' : 'D MMMM') : isMonth ? 'MMMM YYYY' : 'D MMMM YYYY';
	};

	return {
		sameDay: 'D MMMM',
		nextDay: 'D MMMM',
		nextWeek: function(now) {
			return formatSameYear(this, now);
		},
		lastDay: 'D MMMM',
		lastWeek: function(now) {
			return formatSameYear(this, now);
		},
		sameElse: function(now) {
			return formatSameYear(this, now);
		},
	};
};

export const getFollowingDates = (dateStart, dateEnd) => {
	if (monthActive(dateStart, dateEnd, false)) {
		return {
			dateStart: moment(dateStart)
				.subtract(1, 'months')
				.startOf('month'),
			dateEnd: moment(dateEnd)
				.subtract(1, 'months')
				.endOf('month'),
			range: 'month',
		};
	} else {
		const diff = moment(dateEnd).diff(dateStart, 'days', true);

		return {
			dateStart: moment(dateStart).subtract({ day: diff }),
			dateEnd: moment(dateEnd).subtract({ day: diff }),
			range: diff,
		};
	}
};
