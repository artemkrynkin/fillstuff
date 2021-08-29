import React from 'react';
import moment from 'moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Header = ({ date, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
  <>
    <button
      type="button"
      onClick={decreaseMonth}
      className="react-datepicker__navigation react-datepicker__navigation--previous"
      disabled={prevMonthButtonDisabled}
    >
      <FontAwesomeIcon icon={['far', 'angle-left']} fixedWidth />
    </button>

    <button
      type="button"
      onClick={increaseMonth}
      className="react-datepicker__navigation react-datepicker__navigation--next"
      disabled={nextMonthButtonDisabled}
    >
      <FontAwesomeIcon icon={['far', 'angle-right']} fixedWidth />
    </button>

    <div className="react-datepicker__current-month">{moment(date).format('MMMM YYYY')}</div>
  </>
);

export default Header;
