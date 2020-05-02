import React from 'react';

import SliderScroller from 'src/components/SliderScroller';

import ProcurementExpected from './ProcurementExpected';

import styles from './ProcurementsExpected.module.css';

const ProcurementsExpected = props => {
	const { procurementsExpected } = props;

	return (
		<div className={styles.container}>
			<SliderScroller
				classNames={{
					wrapOverflow: styles.wrapOverflow,
					wrapContent: styles.sliderWrapContent,
				}}
			>
				{procurementsExpected.data.map(procurement => (
					<ProcurementExpected key={procurement._id} procurement={procurement} />
				))}
				{procurementsExpected.data.map(procurement => (
					<ProcurementExpected key={procurement._id} procurement={procurement} />
				))}
				{procurementsExpected.data.map(procurement => (
					<ProcurementExpected key={procurement._id} procurement={procurement} />
				))}
				{procurementsExpected.data.map(procurement => (
					<ProcurementExpected key={procurement._id} procurement={procurement} />
				))}
				{procurementsExpected.data.map(procurement => (
					<ProcurementExpected key={procurement._id} procurement={procurement} />
				))}
				{procurementsExpected.data.map(procurement => (
					<ProcurementExpected key={procurement._id} procurement={procurement} />
				))}
				{procurementsExpected.data.map(procurement => (
					<ProcurementExpected key={procurement._id} procurement={procurement} />
				))}
			</SliderScroller>
		</div>
	);
};

export default ProcurementsExpected;
