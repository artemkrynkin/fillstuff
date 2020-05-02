import React from 'react';

import CardPaper from 'src/components/CardPaper';

import styles from './ProcurementExpected.module.css';

const ProcurementExpected = props => {
	const { procurement } = props;

	return (
		<div className={styles.container}>
			<CardPaper className={styles.card} header={false}>
				1
			</CardPaper>
		</div>
	);
};

export default ProcurementExpected;
