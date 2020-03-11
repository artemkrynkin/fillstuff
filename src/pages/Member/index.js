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

import { getMember } from 'src/actions/members';
import { getInvoicesMember } from 'src/actions/invoices';

import stylesPage from 'src/styles/page.module.css';
import styles from './index.module.css';

const Index = loadable(() => import('./components/index' /* webpackChunkName: "Member_Index" */), {
	fallback: <LoadingComponent />,
});

class Members extends Component {
	state = {
		memberData: null,
		invoicesData: null,
	};

	updateMember = memberData => {
		this.setState({ memberData });
	};

	getInvoices = () => {
		this.props.getInvoicesMember().then(response => {
			this.setState({ invoicesData: response });
		});
	};

	componentDidMount() {
		this.props.getMember().then(response => {
			if (response.status === 'success') {
				this.setState({
					memberData: response,
				});
			} else {
				history.push({
					pathname: '/members',
				});
			}
		});

		this.props.getInvoicesMember().then(response => {
			this.setState({ invoicesData: response });
		});
	}

	render() {
		const { currentStudio } = this.props;
		const { memberData, invoicesData } = this.state;

		const metaInfo = {
			pageName: 'member',
			pageTitle: 'Данные пользователя',
		};

		if (memberData && memberData.data && memberData.data.user.name) {
			metaInfo.pageTitle = memberData.data.user.name;
		}

		const { title, description } = generateMetaInfo({
			type: metaInfo.pageName,
			data: {
				title: metaInfo.pageTitle,
			},
		});

		const pageParams = {
			backToPage: memberData && memberData.data && memberData.data.guest ? '/members/guests' : '/members',
		};

		return (
			<div className={stylesPage.pageWrap}>
				<Head title={title} description={description} />

				<Header pageName={metaInfo.pageName} pageTitle="Команда" pageParams={pageParams} />
				<div className={`${stylesPage.pageContent} ${styles.container}`}>
					<div className={styles.wrapper}>
						<Index
							currentStudio={currentStudio}
							memberData={memberData}
							invoicesData={invoicesData}
							updateMember={this.updateMember}
							getInvoices={this.getInvoices}
						/>
					</div>
				</div>
			</div>
		);
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	const {
		match: {
			params: { memberId },
		},
	} = ownProps;

	return {
		getMember: () => dispatch(getMember({ params: { memberId } })),
		getInvoicesMember: () => dispatch(getInvoicesMember({ params: { memberId } })),
	};
};

export default compose(connect(null, mapDispatchToProps), withCurrentUser)(Members);
