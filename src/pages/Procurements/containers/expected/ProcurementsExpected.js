import React from 'react';

import Typography from '@material-ui/core/Typography';

import SliderScroller from 'src/components/SliderScroller';

import ProcurementExpected from './ProcurementExpected';

import styles from './ProcurementsExpected.module.css';

const ProcurementsExpected = props => {
	const { onOpenDialogByName, procurementsExpected } = props;

	return (
		<div className={styles.container}>
			<Typography variant="h5" gutterBottom>
				Ожидается доставка
			</Typography>
			<SliderScroller
				classNames={{
					container: styles.sliderContainer,
					wrapOverflow: styles.wrapOverflow,
					wrapScroll: styles.sliderWrapScroll,
					wrapContent: styles.sliderWrapContent,
					arrowLeft: styles.sliderArrowLeft,
					arrowRight: styles.sliderArrowRight,
					arrowShadowLeft: styles.sliderArrowShadowLeft,
					arrowShadowRight: styles.sliderArrowShadowRight,
				}}
				offsetRight={1}
				shadows
			>
				{procurementsExpected.data.map(procurement => (
					<ProcurementExpected key={procurement._id} procurement={procurement} onOpenDialogProcurement={onOpenDialogByName} />
				))}
			</SliderScroller>
		</div>
	);
};

export default ProcurementsExpected;
