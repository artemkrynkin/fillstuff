import React from 'react';

import Typography from '@material-ui/core/Typography';

import Empty from 'src/components/Empty';

import styles from './Tasks.module.css';

import statisticsEmpty from 'public/img/stubs/statistics_empty.svg';

const Tasks = () => {
	return (
		<div className={styles.container}>
			<Typography variant="h5" gutterBottom>
				Задачи
			</Typography>
			<Empty
				classNames={{
					container: styles.empty,
				}}
				imageSrc={statisticsEmpty}
				content={
					<>
						<Typography variant="h6" gutterBottom>
							У вас еще нет задач
						</Typography>
					</>
				}
			/>
		</div>
	);
};

export default Tasks;
