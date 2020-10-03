import React, { useState, useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import generateMetaInfo from 'shared/generate-meta-info';

import history from 'src/helpers/history';

import Head from 'src/components/head';
import HeaderPage from 'src/components/HeaderPage';
import { withCurrentUser } from 'src/components/withCurrentUser';

import { getInvoice } from 'src/actions/invoices';

import stylesPage from 'src/styles/page.module.css';
import styles from './index.module.css';

import Index from './containers/index';

const Invoice = props => {
	const [invoiceData, setInvoiceData] = useState(null);

	const metaInfo = {
		pageName: 'invoice',
		pageTitle: 'Детали счета',
	};
	const { title, description } = generateMetaInfo({
		type: metaInfo.pageName,
		data: {
			title: metaInfo.pageTitle,
		},
	});

	const pageParams = {
		backToPage: '/invoices',
	};

	const getInvoice = () => {
		props.getInvoice().then(response => {
			if (response.status === 'success') {
				const { data: invoice, ...remainingData } = response;

				invoice.positions.sort((a, b) => a.position.name.localeCompare(b.position.name) || +b.sellingPrice - +a.sellingPrice);
				if (invoice.payments.length) invoice.payments.reverse();

				setInvoiceData({
					data: invoice,
					...remainingData,
				});
			} else {
				history.push({
					pathname: '/invoices',
				});
			}
		});
	};

	useEffect(() => {
		getInvoice();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className={stylesPage.page}>
			<Head title={title} description={description} />

			<HeaderPage pageName={metaInfo.pageName} pageTitle="Счета" pageParams={pageParams} />
			<div className={`${stylesPage.pageContent} ${styles.container}`}>
				<Index invoiceData={invoiceData} getInvoice={getInvoice} />
			</div>
		</div>
	);
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const {
		match: {
			params: { invoiceId },
		},
	} = ownProps;

	return {
		getInvoice: () => dispatch(getInvoice({ params: { invoiceId } })),
	};
};

export default compose(connect(null, mapDispatchToProps), withCurrentUser)(Invoice);
