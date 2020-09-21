import React from 'react';

import Grid from '@material-ui/core/Grid';

import PositionSummary from 'src/components/PositionSummary';

import styles from './index.module.css';

const OrderedReceiptPosition = props => {
	const { index, orderedReceiptPosition } = props;

	const name = orderedReceiptPosition.name ? orderedReceiptPosition.name : orderedReceiptPosition.position.name;
	const characteristics =
		orderedReceiptPosition.characteristics && orderedReceiptPosition.characteristics.length
			? orderedReceiptPosition.characteristics
			: orderedReceiptPosition.position.characteristics;

	return (
		<Grid className={styles.positionItem} wrap="nowrap" alignItems="baseline" container>
			<Grid className={styles.positionItemNumber} item>
				{index + 1}
			</Grid>
			<Grid className={styles.positionItemContent} style={{ flex: '1 1' }} zeroMinWidth item>
				<PositionSummary name={name} characteristics={characteristics} size="md" />
			</Grid>
		</Grid>
	);
};

export default OrderedReceiptPosition;
