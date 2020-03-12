import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import loadable from '@loadable/component';

import generateMetaInfo from 'shared/generate-meta-info';

import { history } from 'src/helpers/history';

import Head from 'src/components/head';
import Header from 'src/components/Header';
import { LoadingComponent } from 'src/components/Loading';
import { withCurrentUser } from 'src/components/withCurrentUser';

import { getPosition } from 'src/actions/positions';
import { getReceiptsPosition } from 'src/actions/receipts';

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

	getReceipts = () => {
		this.props.getReceiptsPosition().then(response => {
			this.setState({ receiptsData: response });
		});
	};

	componentDidMount() {
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

		this.props.getReceiptsPosition().then(response => {
			this.setState({ receiptsData: response });
		});
	}

	render() {
		const { currentStudio } = this.props;
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
			<div className={stylesPage.pageWrap}>
				<Head title={title} description={description} />

				<Header pageName={metaInfo.pageName} pageTitle="В наличии" pageParams={pageParams} />
				<div className={`${stylesPage.pageContent} ${styles.container}`}>
					<div className={styles.wrapper}>
						<Index currentStudio={currentStudio} positionData={positionData} receiptsData={receiptsData} getReceipts={this.getReceipts} />
					</div>
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
		getPosition: () => dispatch(getPosition({ params: { positionId } })),
		getReceiptsPosition: () => dispatch(getReceiptsPosition({ params: { positionId } })),
	};
};

export default compose(connect(null, mapDispatchToProps), withCurrentUser)(Position);
