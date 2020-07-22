import React from 'react';

import ShopItem from './ShopItem';

import styles from './ShopsList.module.css';

const ShopsList = props => {
	const {
		formikProps: { values },
		arrayHelpers,
	} = props;

	return (
		<div className={styles.container}>
			{values.shops.map((shop, index) => (
				<ShopItem key={index} index={index} shop={shop} formikProps={props.formikProps} arrayHelpers={arrayHelpers} />
			))}
		</div>
	);
};

export default ShopsList;
