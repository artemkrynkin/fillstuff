import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import loadable from '@loadable/component';

import generateMetaInfo from 'shared/generate-meta-info';

import history from 'src/helpers/history';

import Head from 'src/components/head';
import HeaderPage from 'src/components/HeaderPage';
import { LoadingPage } from 'src/components/Loading';
import { withCurrentUser } from 'src/components/withCurrentUser';

import { getPosition, archivePositionAfterEnded } from 'src/actions/positions';
import { getReceiptsPosition, changeReceipt } from 'src/actions/receipts';
import { enqueueSnackbar } from 'src/actions/snackbars';

import stylesPage from 'src/styles/page.module.css';
import styles from './index.module.css';

const Index = loadable(() => import('./containers/index' /* webpackChunkName: "Position_Index" */), {
	fallback: <LoadingPage />,
});

const Position = props => {
	const { currentStudio } = props;
	const [positionData, setPositionData] = useState(null);
	const [receiptsData, setReceiptsData] = useState(null);

	const metaInfo = {
		pageName: 'position',
		pageTitle: 'Детали позиции',
	};

	if (positionData && positionData.data && positionData.data.name) {
		metaInfo.pageTitle = positionData.data.name;
	}

	const { title, description } = generateMetaInfo({
		type: metaInfo.pageName,
		data: {
			title: metaInfo.pageTitle,
		},
	});

	const pageParams = {
		backToPage: '/stock',
	};

	const getPosition = callback => {
		props.getPosition().then(response => {
			if (response.status === 'success') {
				setPositionData(response);

				if (callback !== undefined) callback(response);
			} else {
				history.push({
					pathname: '/stock',
				});
			}
		});
	};

	const onArchivedAfterEnded = () => {
		props.archivePositionAfterEnded({ archivedAfterEnded: false }).then(response => {
			setPositionData(response);
		});
	};

	const getReceipts = () => {
		props.getReceiptsPosition().then(response => {
			setReceiptsData(response);
		});
	};

	const onReceiptCreate = response => {
		if (response.status === 'success') {
			const { data: newReceipt } = response;

			const newReceiptsData = {
				status: 'success',
				data: receiptsData.data.slice(),
			};

			newReceiptsData.data.unshift(newReceipt);

			setReceiptsData(newReceiptsData);
		}
	};

	const onChangeSellingPriceReceipt = (receiptId, values, callback) => {
		props.changeReceipt({ receiptId }, values).then(response => {
			callback();

			if (response.status === 'success') {
				const { data: receiptEdited } = response;

				const newReceiptsData = {
					status: 'success',
					data: receiptsData.data.slice().map(receipt => {
						if (receipt._id === receiptEdited._id) {
							return receiptEdited;
						} else {
							return receipt;
						}
					}),
				};

				setReceiptsData(newReceiptsData);
			}

			if (response.status === 'error') {
				props.enqueueSnackbar({
					message: response.message || 'Неизвестная ошибка.',
					options: {
						variant: 'error',
					},
				});
			}
		});
	};

	useEffect(() => {
		getPosition();
		getReceipts();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.match.params.positionId]);

	return (
		<div className={stylesPage.page}>
			<Head title={title} description={description} />

			<HeaderPage pageName={metaInfo.pageName} pageTitle="Склад" pageParams={pageParams} />
			<div className={`${stylesPage.pageContent} ${styles.container}`}>
				<Index
					currentStudio={currentStudio}
					positionData={positionData}
					receiptsData={receiptsData}
					getPosition={getPosition}
					getReceipts={getReceipts}
					onArchivedAfterEnded={onArchivedAfterEnded}
					onReceiptCreate={onReceiptCreate}
					onChangeSellingPriceReceipt={onChangeSellingPriceReceipt}
				/>
			</div>
		</div>
	);
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const {
		match: {
			params: { positionId },
		},
	} = ownProps;

	return {
		getPosition: () => dispatch(getPosition({ params: { positionId } })),
		archivePositionAfterEnded: data => dispatch(archivePositionAfterEnded({ params: { positionId }, data })),
		getReceiptsPosition: () => dispatch(getReceiptsPosition({ params: { positionId } })),
		changeReceipt: (params, data) => dispatch(changeReceipt({ params, data })),
		enqueueSnackbar: (...args) => dispatch(enqueueSnackbar(...args)),
	};
};

export default compose(connect(null, mapDispatchToProps), withCurrentUser)(Position);
