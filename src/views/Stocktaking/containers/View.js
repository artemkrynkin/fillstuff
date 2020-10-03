import React from 'react';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import Empty from 'src/components/Empty';

import styles from './View.module.css';

import stocktakingEmpty from 'public/img/stubs/stocktaking_empty.svg';

const View = () => (
	<Empty
		classNames={{
			container: styles.empty,
		}}
		imageSrc={stocktakingEmpty}
		content={
			<Typography variant="h6" gutterBottom>
				У вас еще нет инвентаризаций
			</Typography>
		}
		actions={
			<Button variant="contained" color="primary">
				Провести инвентаризацию
			</Button>
		}
	/>
);

export default View;
