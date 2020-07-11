import React, { Fragment } from 'react';

import Typography from '@material-ui/core/Typography';

import Empty from 'src/components/Empty';

import styles from './Statistics.module.css';

import statisticsEmpty from 'public/img/stubs/statistics_empty.svg';

const Statistics = () => {
	return (
		<div className={styles.container}>
			<Empty
				classNames={{
					container: styles.empty,
				}}
				imageSrc={statisticsEmpty}
				content={
					<Fragment>
						<Typography variant="h6" gutterBottom>
							Недостаточно данных для вывода показателей эффективности
						</Typography>
						<Typography variant="body1">
							Делайте больше списаний, выставляйте счета, закупайте позиции и тогда мы сможем показать Вам эти метрики.
						</Typography>
					</Fragment>
				}
			/>
		</div>
	);
};

export default Statistics;
