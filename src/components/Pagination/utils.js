import moment from 'moment';
import queryString from 'query-string';

import { history } from 'src/helpers/history';

export const checkQueryInFilter = initialQuery => {
	const query = queryString.parse(history.location.search, { parseBooleans: true });

	if (query.dateStart && query.dateEnd) {
		const isValidDate = date => moment(date || new Date('')).isValid();

		query.dateStart = Number(query.dateStart);
		query.dateEnd = Number(query.dateEnd);

		if (!isNaN(query.dateStart) || !isNaN(query.dateEnd)) {
			if (!isValidDate(query.dateStart) || !isValidDate(query.dateEnd)) {
				const momentDate = moment();

				query.dateStart = momentDate.startOf('month').valueOf();
				query.dateEnd = momentDate.endOf('month').valueOf();
			} else if (isValidDate(query.dateStart) && isValidDate(query.dateEnd) && moment(query.dateStart).isAfter(query.dateEnd)) {
				const dateStart = query.dateStart;

				query.dateStart = query.dateEnd;
				query.dateEnd = dateStart;
			}
		} else {
			delete query.dateStart;
			delete query.dateEnd;
		}
	}

	return Object.assign(initialQuery, query);
};

export const deleteParamsCoincidence = (
	query,
	{ type = '', searchByName = [], searchByValue = [], serverQueryByName = [], serverQueryByValue = [] }
) => {
	const queryCopy = { ...query };

	Object.keys(queryCopy).forEach(key => {
		if (type === 'search') {
			return (searchByName.some(value => key === value) || searchByValue.some(value => queryCopy[key] === value)) && delete queryCopy[key];
		} else if (type === 'server') {
			return (
				(serverQueryByName.some(value => key === value) || serverQueryByValue.some(value => queryCopy[key] === value)) &&
				delete queryCopy[key]
			);
		}
	});

	return queryCopy;
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
