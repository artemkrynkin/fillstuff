import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import _ from 'lodash';
import moment from 'moment';

import theme from 'mobile/src/constants/theme';

import FocusAwareStatusBar from 'mobile/src/components/FocusAwareStatusBar';

import { getUserWriteOffs } from 'mobile/src/actions/writeOffs';

import Content from './containers/Content';

function WriteOffs(props) {
	useEffect(() => {
		(async () => {
			try {
				const query = {
					page: 1,
					limit: 20,
					dateStart: null,
					dateEnd: null,
					position: 'all',
					role: 'all',
					onlyCanceled: false,
				};

				await props.getUserWriteOffs({ query });
			} catch (error) {}
		})();
	}, []);

	return (
		<>
			<FocusAwareStatusBar barStyle="dark-content" backgroundColor={theme.brightness['4']} />
			<SafeAreaInsetsContext.Consumer>
				{insets => (
					<View style={{ flex: 1, paddingTop: insets.top }}>
						<Content {...props} />
					</View>
				)}
			</SafeAreaInsetsContext.Consumer>
		</>
	);
}

const mapStateToProps = state => {
	const { user, studios } = state;

	let currentStudio = {
		data: studios.data && user.data ? studios.data.data.find(studio => studio._id === user.data.settings.studio) : null,
		isFetching: studios.isFetching,
	};

	let writeOffs = {
		...state.writeOffs,
	};

	if (writeOffs.data) {
		// Группируем списания по дням
		const writeOffsDays = _.chain(writeOffs.data.data)
			.groupBy(writeOff => {
				return moment(writeOff.createdAt)
					.set({
						hour: 0,
						minute: 0,
						second: 0,
						millisecond: 0,
					})
					.format(moment.HTML5_FMT.DATETIME_LOCAL_MS);
			})
			.map((writeOffs, date) => {
				return {
					date,
					writeOffs,
				};
			})
			.value();

		writeOffs.data = {
			data: writeOffsDays,
			paging: writeOffs.data.paging,
		};
	}

	return {
		currentStudio: currentStudio,
		currentUser: state.user,
		writeOffs: writeOffs,
	};
};

const mapDispatchToProps = {
	getUserWriteOffs,
};

export default connect(mapStateToProps, mapDispatchToProps)(WriteOffs);
