import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { forEach, some, cloneDeep } from 'lodash';
import moment from 'moment';
import momentTz from 'moment-timezone';
import dragula from 'dragula';

import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import resourceDayGridPlugin from '@fullcalendar/resource-daygrid';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
import ruLocale from '@fullcalendar/core/locales/ru';

import './Calendar.styl';

class Calendar extends Component {
	static propTypes = {
		currentProject: PropTypes.object.isRequired,
		offsetTop: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number), PropTypes.arrayOf(PropTypes.string)]),
		offsetBottom: PropTypes.oneOfType([
			PropTypes.number,
			PropTypes.arrayOf(PropTypes.number),
			PropTypes.arrayOf(PropTypes.string),
		]),
	};

	static defaultProps = {
		fullCalendar: {
			schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
			plugins: [interactionPlugin, resourceDayGridPlugin, resourceTimeGridPlugin, momentTimezonePlugin],
			locale: ruLocale,
			header: false,
			fixedWeekCount: false,
			defaultTimedEventDuration: '00:00',
			eventTimeFormat: {
				hour: '2-digit',
				minute: '2-digit',
				meridiem: false,
			},
			eventLimit: true,
			eventLimitText: eventNumber => `Ещё ${eventNumber}`,
		},
		offsetTop: 0,
		offsetBottom: 0,
	};

	state = {
		events: [
			{ start: '2019-06-02T08:05:00.000Z', title: 'тема 0' },
			{ start: '2019-06-02T08:05:00.000Z', title: 'тема 1' },
			{ start: '2019-06-02T18:05:00.000Z', title: 'тема 2' },
			{ start: '2019-06-03T18:05:00.000Z', title: 'тема 3' },
			{ start: '2019-06-04T18:05:00.000Z', title: 'тема 4' },
			{ start: '2019-06-05T18:05:00.000Z', title: 'тема 5' },
			{ start: '2019-06-06T18:05:00.000Z', title: 'тема 6' },
			{ start: '2019-06-30T18:05:00.000Z', title: 'тема 30' },
			{ start: '2019-06-03T18:05:00.000Z', title: 'тема 3' },
			{ start: '2019-06-04T18:05:00.000Z', title: 'тема 4' },
			{ start: '2019-06-05T18:05:00.000Z', title: 'тема 5' },
			{ start: '2019-06-06T18:05:00.000Z', title: 'тема 6' },
			{ start: '2019-06-07T18:05:00.000Z', title: 'тема 7' },
			{ start: '2019-06-08T18:05:00.000Z', title: 'тема 8' },
			{ start: '2019-06-09T18:05:00.000Z', title: 'тема 9' },
			{ start: '2019-06-10T18:05:00.000Z', title: 'тема 10' },
			{ start: '2019-06-11T18:05:00.000Z', title: 'тема 11' },
			{ start: '2019-06-29T08:05:00.000Z', title: 'тема' },
		],
	};

	mTz = date => momentTz(date).tz(this.props.currentProject.timezone);

	elClassListToNum = prop => {
		return Array.isArray(prop)
			? prop.map(elClass => document.querySelector(elClass).offsetHeight).reduce((sum, current) => sum + current, 0)
			: prop;
	};

	heightCalc = (offsetTop, offsetBottom) => {
		return window.innerHeight - (this.elClassListToNum(offsetTop) + this.elClassListToNum(offsetBottom));
	};

	columnHeaderHtml = (date, view) => {
		const {
			calendar: { ref, defaultDate },
		} = this.props;

		const mDefaultDate = this.mTz(defaultDate);
		const mCurrentDate = ref.current ? this.mTz(ref.current.getApi().getDate()) : mDefaultDate;
		const mDate = this.mTz(date);
		const mDateFormat = moment(mDate).format('dd');

		switch (view) {
			case 'dayGridMonth':
				return mCurrentDate.month() === mDefaultDate.month() && mDate.weekday() === mDefaultDate.weekday()
					? `<span class="fc-current-weekday">${mDateFormat}</span>`
					: mDateFormat;
			default:
				return false;
		}
	};

	dayRender = info => {
		const {
			calendar: { ref, defaultView },
		} = this.props;
		const { events } = this.state;

		const currentView = ref.current ? ref.current.getApi().view.type : defaultView;

		if (currentView === 'dayGridMonth') {
			const mDate = moment(this.mTz(info.date));
			const mDateFormat = mDate.format('YYYY-MM-DD');
			const getDate = new Date(mDateFormat).getDate();
			const thereEvents = some(events, event => moment(this.mTz(event.start)).format('YYYY-MM-DD') === mDateFormat);

			if (!thereEvents) {
				info.el.innerHTML = `<span class="fc-day-big-number">${getDate}</span>`;
			} else {
				info.el
					.closest('.fc-row.fc-week')
					.querySelector(`.fc-day-top[data-date="${mDateFormat}"]`)
					.classList.add('fc-there-events');
			}
		}
	};

	dateClick = info => {
		const {
			calendar: { ref },
			contentPlanEditing,
			selectedTopics,
		} = this.props;

		const calendarApi = ref.current.getApi();

		if (!contentPlanEditing || selectedTopics.length === 0) return;

		console.log(info);

		let events = cloneDeep(this.state.events);

		forEach(selectedTopics, selectedTopic => {
			// calendarApi.addEvent({
			// 	start: momentTz(info.dateStr).tz('UTC').format(),
			// 	name: selectedTopic.name,
			// 	color: selectedTopic.color
			// });

			events.push({
				start: momentTz(info.dateStr)
					.tz('UTC')
					.format(),
				name: selectedTopic.name,
				color: selectedTopic.color,
			});
		});

		this.setState({
			events: events,
		});

		// calendarApi.render();
	};

	render() {
		const { fullCalendar, offsetTop, offsetBottom, calendar } = this.props;

		const views = {
			dayGridMonth: {
				fixedWeekCount: false,
				columnHeaderHtml: date => this.columnHeaderHtml(date, 'dayGridMonth'),
			},
		};

		dragula([], {
			revertOnSpill: true
		});

		return (
			<div className="pcp-calendar">
				<FullCalendar
					{...fullCalendar}
					{...calendar}
					height={() => this.heightCalc(offsetTop, offsetBottom)}
					views={views}
					dayRender={info => this.dayRender(info)}
					events={this.state.events}
					dateClick={info => this.dateClick(info)}
					eventOverlap={true}
				/>
			</div>
		);
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	// const { currentProject } = ownProps;

	return {};
};

export default connect(
	null,
	mapDispatchToProps
)(Calendar);
