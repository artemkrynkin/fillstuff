import React, { Component } from 'react';
import ClassNames from 'classnames';
import moment from 'moment';
import momentTz from 'moment-timezone';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import { capitalizeFirstLetter } from 'src/helpers/utils';

import TitlePageOrLogo from './TitlePageOrLogo';

class CLProjectContentPlan extends Component {
	state = {
		currentDate: this.props.calendar.defaultDate,
		currentView: this.props.calendar.defaultView,
	};

	onCalendarChangeView = view => {
		const { calendar } = this.props;
		const calendarApi = calendar.ref.current.getApi();

		calendarApi.changeView(view);

		this.setState({ currentView: view });
	};

	onCalendarToday = () => {
		const {
			calendar: { ref, timeZone },
		} = this.props;
		const calendarApi = ref.current.getApi();

		calendarApi.today();

		const mCurrentDate = momentTz(calendarApi.getDate()).tz(timeZone);

		this.setState({ currentDate: mCurrentDate });
	};

	onCalendarPrev = () => {
		const {
			calendar: { ref, timeZone },
		} = this.props;
		const calendarApi = ref.current.getApi();

		calendarApi.prev();

		const mCurrentDate = momentTz(calendarApi.getDate()).tz(timeZone);

		this.setState({ currentDate: mCurrentDate });
	};

	onCalendarNext = () => {
		const {
			calendar: { ref, timeZone },
		} = this.props;
		const calendarApi = ref.current.getApi();

		calendarApi.next();

		const mCurrentDate = momentTz(calendarApi.getDate()).tz(timeZone);

		this.setState({ currentDate: mCurrentDate });
	};

	render() {
		const { theme } = this.props;
		const { currentDate, currentView } = this.state;

		const pageTitle = capitalizeFirstLetter(moment(currentDate).format('MMMM YYYY'));

		const buttonGridWeekClasses = ClassNames({
			'mui-btn-ct400': true,
			'mui-btn-cwt400': currentView === 'dayGridWeek',
		});
		const buttonGridMonthClasses = ClassNames({
			'mui-btn-ct400': true,
			'mui-btn-cwt400': currentView === 'dayGridMonth',
		});

		return (
			<div className="header__column_left">
				<div className="header__column-group_left">
					<Button className="mui-btn-ct400" variant="contained" color="primary" onClick={this.onCalendarToday}>
						Сегодня
					</Button>
				</div>
				<div className="header__column-group_left pcp-header__navs">
					<IconButton className="pcp-header__nav pcp-header__nav_prev" onClick={this.onCalendarPrev}>
						<FontAwesomeIcon icon={['fal', 'angle-left']} />
					</IconButton>
					<IconButton className="pcp-header__nav pcp-header__nav_next" onClick={this.onCalendarNext}>
						<FontAwesomeIcon icon={['fal', 'angle-right']} />
					</IconButton>
				</div>
				<div className="header__column-group_left">
					<Button
						className={buttonGridWeekClasses}
						variant="contained"
						color="primary"
						style={{ marginRight: 8 }}
						onClick={() => this.onCalendarChangeView('dayGridWeek')}
					>
						Неделя
					</Button>
					<Button
						className={buttonGridMonthClasses}
						variant="contained"
						color="primary"
						onClick={() => this.onCalendarChangeView('dayGridMonth')}
					>
						Месяц
					</Button>
				</div>
				<TitlePageOrLogo pageTitle={pageTitle} theme={theme} />
			</div>
		);
	}
}

export default CLProjectContentPlan;
