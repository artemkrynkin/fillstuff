import React, { Fragment } from 'react';

import Typography from '@material-ui/core/Typography';

import Empty from 'src/components/Empty';

import styles from './Statistics.module.css';

import statisticsEmpty from 'public/img/stubs/statistics_empty.svg';

const Statistics = () => {
	return (
		<div className={styles.container}>
			<Typography variant="h5" gutterBottom>
				Статистика
			</Typography>
			<Empty
				classNames={{
					container: styles.empty,
				}}
				imageSrc={statisticsEmpty}
				content={
					<Fragment>
						<Typography variant="h6" gutterBottom>
							Недостаточно данных для показа статистики
						</Typography>
					</Fragment>
				}
			/>
		</div>
	);
};

export default Statistics;
