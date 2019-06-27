import React from 'react';

import CLStockProducts from './CLStockProducts';
import TitlePageOrLogo from './TitlePageOrLogo';

const ColumnLeft = props => {
	const { pageName } = props;

	switch (pageName) {
		case 'stock':
			return <CLStockProducts {...props} />;
		default:
			return (
				<div className="header__column_left">
					<TitlePageOrLogo {...props} />
				</div>
			);
	}
};

export default ColumnLeft;
