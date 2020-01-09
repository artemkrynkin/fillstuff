import React from 'react';

import Typography from '@material-ui/core/Typography';

import generateMetaInfo from 'shared/generate-meta-info';

import Head from 'src/components/head';
import Header from 'src/components/Header';

import stylesPage from 'src/styles/page.module.css';
import styles from './index.module.css';

const StockNotFound = props => {
	const { stocks, currentStock } = props;

	const metaInfo = {
		pageName: 'stock-notfound',
		pageTitle: currentStock ? 'Склад не найден' : 'У вас нет складов',
	};
	const { title, description } = generateMetaInfo({
		type: metaInfo.pageName,
		data: {
			title: metaInfo.pageTitle,
		},
	});

	return (
		<div className={stylesPage.pageWrap}>
			<Head title={title} description={description} />

			<Header pageName={metaInfo.pageName} pageTitle={metaInfo.pageTitle} />
			<div className={`${stylesPage.pageContent} ${styles.container}`}>
				<div className={styles.wrapper}>
					{currentStock ? (
						<div className={styles.notfoundStock}>
							<Typography variant="h5" gutterBottom>
								Такого склада нет или у&nbsp;вас нет к&nbsp;нему доступа.
							</Typography>
							<Typography variant="body1">Возможно, вы&nbsp;опечатались, когда вводили ссылку склада в&nbsp;адресной строке.</Typography>
						</div>
					) : (
						<div className={styles.createStockOrSelect}>
							{stocks && stocks.length ? (
								<Typography variant="h5" gutterBottom>
									Создайте новый склад, чтобы начать или выберите из&nbsp;списка
								</Typography>
							) : (
								<Typography variant="h5" gutterBottom>
									Создайте новый склад, чтобы начать
								</Typography>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default StockNotFound;
