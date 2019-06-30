import React from 'react';

import Typography from '@material-ui/core/Typography';

import generateMetaInfo from 'shared/generate-meta-info';

import Head from 'src/components/head';
import Header from 'src/components/Header';

import './index.styl';

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
		<div className="page__wrap">
			<Head title={title} description={description} />

			<Header pageName={metaInfo.pageName} pageTitle={metaInfo.pageTitle} />
			<div className="page__content stock-notfound">
				<div className="page__inner-content">
					{currentStock ? (
						<div className="stock-notfound__notfound-stock">
							<Typography variant="h5" gutterBottom>
								Такого склада нет или у&nbsp;вас нет к&nbsp;нему доступа.
							</Typography>
							<Typography variant="body1">
								Возможно, вы&nbsp;опечатались, когда вводили ссылку склада в&nbsp;адресной строке.
							</Typography>
						</div>
					) : (
						<div className="stock-notfound__create-stock-or-select">
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
