import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import ClassNames from 'classnames';

import generateMetaInfo from 'shared/generate-meta-info';

import Head from 'src/components/head';
import HelpPanel from 'src/components/HelpPanel';
import Sidebar from 'src/components/Sidebar';
import { withCurrentUser } from 'src/components/withCurrentUser';

import stylesPage from 'src/styles/page.module.css';

const Layout = props => {
	const { children, metaInfo, currentUser, currentStudio, studios } = props;
	const { title: pageTitle, description: pageDescription } = generateMetaInfo({
		type: metaInfo.pageName,
		data: {
			title: metaInfo.pageTitle,
		},
	});

	return (
		<div className={stylesPage.pageWrapper}>
			<Head title={pageTitle} description={pageDescription} />
			<HelpPanel currentUser={currentUser} />
			<Sidebar currentUser={currentUser} currentStudio={currentStudio} studios={studios} />
			<div className={ClassNames(stylesPage.page)}>{children}</div>
		</div>
	);
};

Layout.propTypes = {
	children: PropTypes.node,
	metaInfo: PropTypes.shape({
		pageName: PropTypes.string,
		pageTitle: PropTypes.string,
	}),
};

const mapStateToProps = state => {
	return {
		studios: state.studios,
	};
};

export default compose(withCurrentUser, connect(mapStateToProps, null))(Layout);
