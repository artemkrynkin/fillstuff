import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import PositionSummary from 'mobile/src/components/PositionSummary';

import styles from './WriteOffStyles';

function WriteOff(props) {
	const { writeOff } = props;

	const sellingPrice = new Intl.NumberFormat('ru-RU').format(writeOff.sellingPrice);
	const unitSellingPrice = new Intl.NumberFormat('ru-RU').format(writeOff.unitSellingPrice);

	return (
		<View style={styles.container}>
			<PositionSummary name={writeOff.position.name} characteristics={writeOff.position.characteristics} avatar />
			<View style={styles.priceAndQuantity}>
				<View>
					<Text style={styles.price}>{sellingPrice} ₽</Text>
				</View>
				<View style={styles.quantityMultPrice}>
					<Text style={styles.quantity}>
						{writeOff.quantity} {writeOff.position.unitRelease === 'pce' ? 'шт.' : 'уп.'}
					</Text>
					<FontAwesomeIcon style={styles.multIcon} icon={['fal', 'times']} size={12} />
					<Text style={styles.unitPrice}>{unitSellingPrice} ₽</Text>
				</View>
			</View>
		</View>
	);
}

export default WriteOff;
