import React, { useState } from 'react';
import { View, ScrollView, RefreshControl, Text } from 'react-native';

import Header from './Header';
import Stub from './Stub';
import WriteOffsPerDay from './WriteOffsPerDay';

import styles from './ContentStyles';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

function Content(props) {
	const {
		writeOffs: {
			data: writeOffs,
			// isFetching: isLoadingWriteOffs,
			// error: errorWriteOffs
		},
	} = props;
	const tabBarHeight = useBottomTabBarHeight();
	const [refreshing, setRefreshing] = useState(false);
	const [loading, setLoading] = useState(false);

	const onRefresh = async () => {
		setRefreshing(true);

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

			setRefreshing(false);
		} catch (error) {
			setRefreshing(false);
		}
	};

	const onScroll = async event => {
		if (event.nativeEvent.contentOffset.y > event.nativeEvent.contentSize.height - event.nativeEvent.layoutMeasurement.height * 2) {
			try {
				if (!loading && writeOffs.paging.hasNextPage) {
					setLoading(true);

					const query = {
						page: writeOffs.paging.nextPage,
						limit: 20,
						dateStart: null,
						dateEnd: null,
						position: 'all',
						role: 'all',
						onlyCanceled: false,
					};

					await props.getUserWriteOffs({ query, mergeData: true });

					setLoading(false);
				}
			} catch (error) {
				setLoading(false);
			}
		}
	};

	return (
		<SafeAreaInsetsContext.Consumer>
			{insets => (
				<ScrollView
					style={styles.scrollContainer}
					refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
					onScroll={onScroll}
					scrollEventThrottle={16}
					contentContainerStyle={{ paddingBottom: 30 }}
					contentInset={{ bottom: tabBarHeight - insets.bottom }}
				>
					<Header />
					{writeOffs ? (
						<>
							{!writeOffs.paging.totalCount && !writeOffs.paging.totalDocs ? (
								<Stub />
							) : writeOffs && writeOffs.paging.totalCount ? (
								<View style={styles.content}>
									{writeOffs.data.map((writeOffsDay, index) => (
										<WriteOffsPerDay key={index} writeOffsDay={writeOffsDay} />
									))}
								</View>
							) : null}
						</>
					) : null}
				</ScrollView>
			)}
		</SafeAreaInsetsContext.Consumer>
	);
}

export default Content;
