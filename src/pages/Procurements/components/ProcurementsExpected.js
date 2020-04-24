import React from 'react';

import SliderScroller from 'src/components/SliderScroller';
import { LoadingComponent } from 'src/components/Loading';

import ProcurementExpected from './ProcurementExpected';

import styles from './ProcurementsExpected.module.css';

const ProcurementsExpected = props => {
	const {
		procurementsExpected: {
			data: procurementsExpected,
			// isFetching: isLoadingProcurementsExpected,
			// error: errorProcurementsExpected
		},
	} = props;

	if (!procurementsExpected) return <LoadingComponent className={styles.container} />;

	if (procurementsExpected.paging.totalCount) {
		return (
			<div className={styles.container}>
				<SliderScroller
					classNames={{
						wrapOverflow: styles.wrapOverflow,
						wrapScroll: styles.sliderWrapScroll,
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
	}

	return null;
};

export default ProcurementsExpected;
