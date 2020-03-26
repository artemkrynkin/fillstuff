import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import loadable from '@loadable/component';

import generateMetaInfo from 'shared/generate-meta-info';

import { history } from 'src/helpers/history';

import Head from 'src/components/head';
import HeaderPage from 'src/components/HeaderPage';
import { LoadingComponent } from 'src/components/Loading';
import { withCurrentUser } from 'src/components/withCurrentUser';

import { getCharacteristics } from 'src/actions/characteristics';
import { getPosition, archivePositionAfterEnded } from 'src/actions/positions';
import { getReceiptsPosition, changeReceiptPosition } from 'src/actions/receipts';

import stylesPage from 'src/styles/page.module.css';
import styles from './index.module.css';

const Index = loadable(() => import('./components/index' /* webpackChunkName: "Member_Index" */), {
	fallback: <LoadingComponent />,
});

class Position extends Component {
	state = {
		positionData: null,
		receiptsData: null,
	};

	getPosition = () => {
		this.props.getPosition().then(response => {
			if (response.status === 'success') {
				this.setState({
					positionData: response,
				});
			} else {
				history.push({
					pathname: '/availability',
				});
			}
		});
	};

	onCancelArchivePositionAfterEnded = positionId => {
		this.props.archivePositionAfterEnded(positionId, { archivedAfterEnded: false }).then(response => {
			this.setState({
				positionData: response,
			});
		});
	};

	getReceipts = () => {
		this.props.getReceiptsPosition().then(response => {
			this.setState({ receiptsData: response });
		});
	};

	changeSellingPriceReceipt = (receiptId, values, callback) => {
		this.props.changeReceiptPosition({ receiptId }, values).then(response => {
			const receiptEdited = response.data;

			const newReceiptsData = {
				status: 'success',
				data: this.state.receiptsData.data.slice().map(receipt => {
					if (receipt._id === receiptEdited._id) {
						return receiptEdited;
					} else {
						return receipt;
					}
				}),
			};

			this.setState({ receiptsData: newReceiptsData });

			callback();
		});
	};

	componentDidMount() {
		this.getPosition();

		this.props.getReceiptsPosition().then(response => {
			this.setState({ receiptsData: response });
		});
	}

	render() {
		const { currentStudio, getCharacteristics } = this.props;
		const { positionData, receiptsData } = this.state;

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
			backToPage: '/availability',
		};

		return (
			<div className={stylesPage.page}>
				<Head title={title} description={description} />

				<HeaderPage pageName={metaInfo.pageName} pageTitle="В наличии" pageParams={pageParams} />
				<div className={`${stylesPage.pageContent} ${styles.container}`}>
					<Index
						currentStudio={currentStudio}
						positionData={positionData}
						receiptsData={receiptsData}
						getCharacteristics={() => getCharacteristics(currentStudio._id)}
						getPosition={this.getPosition}
						onCancelArchivePositionAfterEnded={this.onCancelArchivePositionAfterEnded}
						changeSellingPriceReceipt={this.changeSellingPriceReceipt}
					/>
				</div>
			</div>
		);
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	const {
		match: {
			params: { positionId },
		},
	} = ownProps;

	return {
		getCharacteristics: currentStudioId => dispatch(getCharacteristics(currentStudioId)),
		getPosition: () => dispatch(getPosition({ params: { positionId } })),
		archivePositionAfterEnded: (positionId, data) => dispatch(archivePositionAfterEnded({ params: { positionId }, data })),
		getReceiptsPosition: () => dispatch(getReceiptsPosition({ params: { positionId } })),
		changeReceiptPosition: (params, data) => dispatch(changeReceiptPosition({ params, data })),
	};
};

export default compose(connect(null, mapDispatchToProps), withCurrentUser)(Position);
