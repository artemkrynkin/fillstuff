import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';

import CircularProgress from '@material-ui/core/CircularProgress';

import { getProcurements, editProcurement } from 'src/actions/procurements';

import Procurement from './Procurement';

import styles from './Procurements.module.css';

const procurementDatesCalendarFormat = {
	sameDay: 'Сегодня',
	nextDay: 'Завтра',
	nextWeek: function(now) {
		return this.isSame(now, 'year') ? 'D MMMM' : 'D MMMM YYYY';
	},
	lastDay: 'Вчера',
	lastWeek: function(now) {
		return this.isSame(now, 'year') ? 'D MMMM' : 'D MMMM YYYY';
	},
	sameElse: function(now) {
		return this.isSame(now, 'year') ? 'D MMMM' : 'D MMMM YYYY';
	},
};

class Procurements extends Component {
	editProcurement = (procurementId, newValues, callback) => {
		this.props.editProcurement(procurementId, newValues).then(callback);
	};

	componentDidMount() {
		this.props.getProcurements();
	}

	render() {
		const {
			// currentStock,
			currentUser,
			procurementsDates: {
				data: procurementDatesData,
				isFetching: isLoadingProcurementsDates,
				// error: errorProcurementsDates
			},
		} = this.props;

		return (
			<div className={styles.procurements}>
				{!isLoadingProcurementsDates ? (
					procurementDatesData && procurementDatesData.data.length ? (
						<div>
							{procurementDatesData.data.map((procurementDates, index) => (
								<div className={styles.procurementDate} key={index}>
									<div className={styles.procurementDateTitle}>
										{moment(procurementDates.date).calendar(null, procurementDatesCalendarFormat)}
									</div>
									{procurementDates.procurements.map((procurement, index) => (
										<Procurement currentUser={currentUser} procurement={procurement} key={index} editProcurement={this.editProcurement} />
									))}
								</div>
							))}
						</div>
					) : procurementDatesData && procurementDatesData.paging.total ? (
						<div className={styles.procurementsNone}>
							Среди закупок совпадений не найдено.
							<br />
							Попробуйте изменить запрос.
						</div>
					) : (
						<div className={styles.procurementsNone}>Еще не создано ни одной закупки.</div>
					)
				) : (
					<div children={<CircularProgress size={20} />} style={{ textAlign: 'center' }} />
				)}
			</div>
		);
	}
}

const mapStateToProps = state => {
	const {
		procurements: {
			data: procurementsData,
			isFetching: isLoadingProcurements,
			// error: errorProcurements
		},
	} = state;

	const procurementDates = {
		data: null,
		isFetching: isLoadingProcurements,
	};

	if (!isLoadingProcurements && procurementsData) {
		procurementDates.data = {
			data: _.chain(procurementsData.data)
				.groupBy(procurement => {
					const momentDate = moment(procurement.createdAt).set({
						hour: 0,
						minute: 0,
						second: 0,
						millisecond: 0,
					});

					return momentDate.format(moment.HTML5_FMT.DATETIME_LOCAL_MS);
				})
				.map((value, key) => ({ date: key, procurements: value }))
				.value(),
			paging: procurementsData.paging,
		};
	}

	return {
		procurementsDates: procurementDates,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentStock, procurementsQueryParams } = ownProps;

	const params = Object.assign({}, procurementsQueryParams);

	Object.keys(params).forEach(key => params[key] === '' && delete params[key]);

	return {
		getProcurements: () => dispatch(getProcurements(currentStock._id, params)),
		editProcurement: (procurementId, newValues) => dispatch(editProcurement(currentStock._id, procurementId, newValues)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Procurements);
