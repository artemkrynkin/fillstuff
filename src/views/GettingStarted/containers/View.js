import React from 'react';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import Empty from 'src/components/Empty';

import styles from './View.module.css';

import stocktakingEmpty from 'public/img/stubs/stocktaking_empty.svg';

const View = ({ onOpenDialogByName }) => (
	<>
		<Empty
			classNames={{
				container: styles.empty,
			}}
			imageSrc={stocktakingEmpty}
			header={
				<Typography align="center" variant="h5" style={{ marginBottom: '2rem' }} gutterBottom>
					Добро пожаловать!
				</Typography>
			}
			content={
				<Typography variant="h6" gutterBottom>
					Создайте свою первую студию
				</Typography>
			}
			actions={
				<>
					<Button onClick={() => onOpenDialogByName('dialogStudioCreate')} variant="contained" color="primary">
						Создать студию
					</Button>
					<Typography variant="caption" component="div" style={{ marginTop: 15 }}>
						или отсканируйте QR-код приглашения студии
						<br />
						через&nbsp;мобильное приложение
					</Typography>
				</>
			}
		/>
	</>
);

export default View;
