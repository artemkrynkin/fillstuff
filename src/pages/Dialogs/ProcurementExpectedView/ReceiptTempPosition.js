import React from 'react';

import Grid from '@material-ui/core/Grid';

import PositionNameInList from 'src/components/PositionNameInList';

import styles from './index.module.css';

const ReceiptTempPosition = props => {
	const { index, receiptTempPosition } = props;

	const name = receiptTempPosition.name ? receiptTempPosition.name : receiptTempPosition.position.name;
	const characteristics =
		receiptTempPosition.characteristics && receiptTempPosition.characteristics.length
			? receiptTempPosition.characteristics
			: receiptTempPosition.position.characteristics;

	return (
		<Grid className={styles.positionItem} wrap="nowrap" alignItems="baseline" container>
			<Grid className={styles.positionItemNumber} item>
				{index + 1}
			</Grid>
			<Grid className={styles.positionItemContent} style={{ flex: '1 1' }} zeroMinWidth item>
				<PositionNameInList name={name} characteristics={characteristics} size="md" />
			</Grid>
		</Grid>
	);
};

export default ReceiptTempPosition;
