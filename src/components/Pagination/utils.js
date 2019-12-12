import moment from 'moment';

export const weekActive = (dateStart, dateEnd, currentWeek = true) =>
	moment(currentWeek ? new Date() : dateStart)
		.startOf('isoWeek')
		.isSame(dateStart, 'day') &&
	moment(currentWeek ? new Date() : dateStart)
		.endOf('isoWeek')
		.isSame(dateEnd, 'day');
export const monthActive = (dateStart, dateEnd, currentMonth = true) =>
	moment(currentMonth ? new Date() : dateStart)
		.startOf('month')
		.isSame(dateStart, 'day') &&
	moment(currentMonth ? new Date() : dateStart)
		.endOf('month')
		.isSame(dateEnd, 'day');

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
