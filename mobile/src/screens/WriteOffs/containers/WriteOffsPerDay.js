import React from 'react';
import { View, Text } from 'react-native';
import moment from 'moment';

import WriteOff from './WriteOff';

import styles from './WriteOffsPerDayStyles';

const calendarFormat = {
	sameDay: 'Сегодня',
	nextDay: 'Завтра',
	lastDay: 'Вчера',
	sameElse: 'D MMMM, dddd',
	nextWeek: 'D MMMM, dddd',
	lastWeek: 'D MMMM, dddd',
};

function WriteOffsPerDay(props) {
	const {
		writeOffsDay: { date, writeOffs },
	} = props;

	return (
		<View style={styles.container}>
			<Text style={styles.title}>{moment(date).calendar(null, calendarFormat)}</Text>
			<View>
				{writeOffs.map(writeOff => (
					<WriteOff key={writeOff._id} writeOff={writeOff} />
				))}
			</View>
		</View>
	);
}

export default WriteOffsPerDay;
