import React from 'react';
import { Helmet } from 'react-helmet-async';

export default ({ title, description, image, type, children }) => {
	return (
		<Helmet>
			<title>{title}</title>
			<meta name="description" content={description} />
			<meta name="twitter:title" content={title} />
			<meta name="twitter:description" content={description} />
			<meta name="twitter:image" content={image ? image : '/img/apple-icon-144x144-precomposed.png'} />
			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			<meta property="og:type" content={type || 'website'} />
			<meta property="og:image" content={image ? image : '/img/apple-icon-144x144-precomposed.png'} />
			{children}
		</Helmet>
	);
};
